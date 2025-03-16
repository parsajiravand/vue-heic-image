<template>
  <div class="vue-heic-image" :class="{ 'is-loading': isLoading }">
    <img
      v-if="imageUrl"
      :src="imageUrl"
      :alt="alt"
      :class="class"
      :width="width"
      :height="height"
      @load="handleImageLoad"
      @error="handleImageError"
    />
    <div v-if="isLoading" class="vue-heic-image__loading">
      <slot name="loading">Loading...</slot>
    </div>
    <div v-if="error" class="vue-heic-image__error">
      <slot name="error" :error="error">{{ error.message }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { HeicImageProps } from '../types';
import { useHeicImage } from '../composables/useHeicImage';

const props = withDefaults(defineProps<HeicImageProps>(), {
  toType: 'image/png',
  quality: 0.92,
  multiple: false,
  gifInterval: 0.4,
});

const imageUrl = ref<string | null>(null);
const { convertHeicToImage, isLoading, error } = useHeicImage({
  toType: props.toType,
  quality: props.quality,
  multiple: props.multiple,
  gifInterval: props.gifInterval,
});

const convertImage = async () => {
  try {
    const result = await convertHeicToImage(props.src);
    const blob = Array.isArray(result) ? result[0] : result;
    imageUrl.value = URL.createObjectURL(blob);
  } catch (e) {
    // Error is handled by the composable
  }
};

const handleImageLoad = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
};

const handleImageError = () => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
    imageUrl.value = null;
  }
};

watch(() => props.src, () => {
  convertImage();
});

onMounted(() => {
  convertImage();
});
</script>

<style>
.vue-heic-image {
  position: relative;
  display: inline-block;
}

.vue-heic-image__loading,
.vue-heic-image__error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.vue-heic-image__error {
  color: #dc3545;
}
</style> 