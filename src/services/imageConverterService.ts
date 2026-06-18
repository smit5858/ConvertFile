const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image file. The file may be corrupted.'));
    img.src = url;
  });
};

/**
 * Converts a PNG, JPG, or JPEG file to lossless (highest-quality) WebP in the browser.
 */
export async function convertToWebp(
  file: File,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  if (onProgress) onProgress(10);
  
  const objectUrl = URL.createObjectURL(file);
  
  try {
    if (onProgress) onProgress(35);
    const img = await loadImage(objectUrl);
    
    if (onProgress) onProgress(60);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to retrieve 2D context from canvas.');
    }
    
    // Draw the image without any downscaling or lossy filters
    ctx.drawImage(img, 0, 0);
    
    if (onProgress) onProgress(85);
    
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Browser failed to generate a WebP image.'));
          }
        },
        'image/webp',
        1.0 // Maximum quality setting for browser WebP export
      );
    });
  } catch (error) {
    console.error('Image conversion error:', error);
    throw error;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
