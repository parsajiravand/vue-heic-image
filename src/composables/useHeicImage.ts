import { ref, watch } from 'vue';
import heic2any from 'heic2any';
import type { HeicOptions } from '../types';
import { isHeicImage, getFileType } from '../utils/fileUtils';

export function useHeicImage(options: HeicOptions = {}) {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const isHeic = ref(false);

  const convertHeicToImage = async (
    source: File | Blob | string,
    conversionOptions: HeicOptions = {}
  ): Promise<Blob | Blob[]> => {
    try {
      isLoading.value = true;
      error.value = null;

      let blob: Blob;
      if (typeof source === 'string') {
        const response = await fetch(source);
        blob = await response.blob();
      } else {
        blob = source;
      }

      // Check if it's a HEIC image
      const fileType = await getFileType(blob);
      isHeic.value = isHeicImage(blob) || fileType === 'image/heic';

      // If not HEIC, return the original blob
      if (!isHeic.value) {
        return blob;
      }

      const mergedOptions = {
        ...options,
        ...conversionOptions,
        toType: conversionOptions.toType || options.toType || 'image/png',
        quality: conversionOptions.quality || options.quality || 0.92,
        multiple: conversionOptions.multiple || options.multiple || false,
        gifInterval: conversionOptions.gifInterval || options.gifInterval || 0.4,
      };

      const result = await heic2any({
        blob,
        toType: mergedOptions.toType,
        quality: mergedOptions.quality,
        multiple: mergedOptions.multiple,
        ...(mergedOptions.toType === 'image/gif' ? { gifInterval: mergedOptions.gifInterval } : {}),
      });

      return result;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Failed to convert HEIC image');
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    convertHeicToImage,
    isLoading,
    error,
    isHeic,
  };
} 