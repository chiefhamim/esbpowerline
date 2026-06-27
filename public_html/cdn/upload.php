<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(500);
    echo json_encode(['error' => 'File upload error code: ' . $file['error']]);
    exit;
}

// Get file extension and validate it
$origName = $file['name'];
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

// Blacklist of dangerous extensions to prevent remote code execution or script execution
$blockedExtensions = [
    'php', 'php3', 'php4', 'php5', 'php7', 'phtml', 'phps', 'phar',
    'asp', 'aspx', 'jsp', 'jspx', 'cgi', 'pl', 'py', 'sh', 'bash',
    'exe', 'bat', 'cmd', 'msi', 'com', 'vbs', 'vbe', 'js', 'jse',
    'wsf', 'wsh', 'scr', 'htaccess', 'htpasswd', 'svg', 'html', 'htm'
];

if (empty($ext) || in_array($ext, $blockedExtensions, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'File type or extension not allowed for security reasons.']);
    exit;
}

// Check mime type with fileinfo to prevent SVG / XSS / PHP masquerading
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

$blockedMimes = [
    'image/svg+xml', 'image/svg', 'text/svg', 'text/xml', 'application/xml',
    'text/html', 'text/javascript', 'application/javascript',
    'application/x-httpd-php', 'application/x-php', 'text/x-php'
];

if (in_array($mimeType, $blockedMimes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Unsupported or blocked file content type.']);
    exit;
}

// Check folder parameter (defaults to library)
$folder = isset($_POST['folder']) && $_POST['folder'] === 'categories' ? 'categories' : 'library';

// Since upload.php is uploaded to the root of CDN mapping (/public_html/), store files in the relative directory: uploads/library/ or uploads/categories/
$uploadDir = __DIR__ . '/' . $folder;

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate a safe unique name
$nameWithoutExt = pathinfo($origName, PATHINFO_FILENAME);
$safeName = time() . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $nameWithoutExt) . '.' . $ext;

$destPath = $uploadDir . '/' . $safeName;

if (move_uploaded_file($file['tmp_name'], $destPath)) {
    // Generate public CDN URL based on current host
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $url = $protocol . '://' . $host . '/' . $folder . '/' . $safeName;

    echo json_encode([
        'url' => $url,
        'success' => true
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file on server']);
}
?>
