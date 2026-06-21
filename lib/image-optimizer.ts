/**
 * Reusable client-side image optimizer utility.
 * Converts selected images (except SVG) to WebP format, downsizes them if they exceed
 * maximum dimensions (e.g. 1920px width/height) to save bandwidth/storage, and
 * compresses them to standard web quality (0.80) to achieve minimal size.
 */
export async function optimizeImageToWebP(
  file: File,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<File> {
  const { quality = 0.8, maxWidth = 1920, maxHeight = 1920 } = options;

  // Only optimize files that are actually images and not SVG
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        // Fallback to original file if canvas context creation fails
        resolve(file);
        return;
      }

      // Draw and scale the image onto the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to WebP blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }

          // Create a new File from the blob with .webp extension
          const originalName = file.name;
          const lastDot = originalName.lastIndexOf('.');
          const nameWithoutExtension = lastDot !== -1 ? originalName.substring(0, lastDot) : originalName;
          const newName = `${nameWithoutExtension}.webp`;

          const optimizedFile = new File([blob], newName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          // Return the optimized file if it's smaller, otherwise keep the original
          if (optimizedFile.size < file.size) {
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      // Fallback to original file on load error
      resolve(file);
    };

    img.src = URL.createObjectURL(file);
  });
}
