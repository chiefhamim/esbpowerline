/** Resize a PNG/image file to a square icon (contain fit) for category use. */
export async function resizeCategoryIconFile(file: File, size = 128): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload a PNG or image file');
  }

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image');

  ctx.clearRect(0, 0, size, size);
  const scale = Math.min(size / bitmap.width, size / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  const x = (size - width) / 2;
  const y = (size - height) / 2;
  ctx.drawImage(bitmap, x, y, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png', 0.92);
  });
  if (!blob) throw new Error('Could not encode PNG');
  return blob;
}