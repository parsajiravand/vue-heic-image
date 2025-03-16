export type HeicOutputType = 'image/png' | 'image/gif' | 'image/jpeg';

export interface HeicOptions {
  /**
   * Sometimes the heic file contains multiple files, so when outputting image/jpeg or image/png
   * you will get only the primary image (if found) or the first image.
   * Setting this option to true will output multiple images in form of array of blob files.
   */
  multiple?: boolean;

  /**
   * The output image format.
   * - image/png: Maximum quality & still image
   * - image/jpeg: Configurable quality with the quality option
   * - image/gif: For animated HEIC files
   */
  toType?: HeicOutputType;

  /**
   * The quality parameter for JPEG output (between 0 and 1).
   * Only considered when outputting image/jpeg.
   */
  quality?: number;

  /**
   * How many seconds for the gif image to move from one frame to another.
   * Only considered when using image/gif.
   */
  gifInterval?: number;
}

export interface HeicImageProps extends HeicOptions {
  /**
   * The source of the HEIC image.
   * Can be a File object, Blob, or URL string.
   */
  src: File | Blob | string;

  /**
   * Alternative text for the image
   */
  alt?: string;

  /**
   * CSS class names to apply to the image
   */
  class?: string;

  /**
   * Width of the image in pixels
   */
  width?: number | string;

  /**
   * Height of the image in pixels
   */
  height?: number | string;
} 