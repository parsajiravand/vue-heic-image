/**
 * Check if a file or blob is a HEIC image
 */
export const isHeicImage = (file: File | Blob): boolean => {
  const heicTypes = [
    'image/heic',
    'image/heif',
    'image/heif-sequence',
    'image/heic-sequence',
  ];
  return heicTypes.includes(file.type.toLowerCase());
};

/**
 * Get file type from file or blob
 * If type is not available from the file object, try to determine from the first bytes
 */
export async function getFileType(file: File | Blob): Promise<string> {
  // If the type is already set and not empty, return it
  if (file.type) {
    return file.type.toLowerCase();
  }

  // Read the first bytes of the file to determine type
  const arr = new Uint8Array(await file.slice(0, 4).arrayBuffer());
  const header = Array.from(arr)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');

  // Check for HEIC signature
  if (header.startsWith('0000')) {
    const extendedArr = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const brand = new TextDecoder().decode(extendedArr.slice(8, 12));
    if (['heic', 'heix', 'hevc', 'hevx'].includes(brand.toLowerCase())) {
      return 'image/heic';
    }
  }

  // Return empty string if type cannot be determined
  return '';
} 