<template>
  <div class="app">
    <h1>Vue HEIC Image Demo</h1>
    
    <div class="demo-section">
      <h2>Component Usage</h2>
      <input type="file" accept=".heic" @change="handleFileSelect" />
      
      <div v-if="selectedFile" class="image-preview">
        <HeicImage
          :src="selectedFile"
          alt="HEIC Preview"
          :toType="outputFormat"
          :quality="quality"
          :multiple="false"
          class="preview-image"
        >
          <template #loading>
            <div class="loading-spinner">Converting...</div>
          </template>
        </HeicImage>
      </div>
      
      <div class="controls">
        <label>
          Output Format:
          <select v-model="outputFormat">
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPEG</option>
            <option value="image/gif">GIF</option>
          </select>
        </label>
        
        <label v-if="outputFormat === 'image/jpeg'">
          Quality:
          <input type="range" v-model="quality" min="0" max="1" step="0.1" />
          {{ quality }}
        </label>
      </div>
    </div>
    
    <div class="demo-section">
      <h2>Composable Usage</h2>
      <input type="file" accept=".heic" @change="handleComposableFileSelect" />
      
      <div v-if="composableImageUrl" class="image-preview">
        <img :src="composableImageUrl" alt="Converted Image" class="preview-image" />
      </div>
      
      <div v-if="isLoading" class="loading-spinner">Converting...</div>
      <div v-if="error" class="error">{{ error.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeicImage, useHeicImage } from '../src';
import type { HeicOutputType } from '../src';

const selectedFile = ref<File | null>(null);
const outputFormat = ref<HeicOutputType>('image/png');
const quality = ref(0.92);

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    selectedFile.value = file;
  }
};

// Composable demo
const composableImageUrl = ref<string | null>(null);
const { convertHeicToImage, isLoading, error } = useHeicImage();

const handleComposableFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  try {
    const result = await convertHeicToImage(file);
    const blob = Array.isArray(result) ? result[0] : result;
    composableImageUrl.value = URL.createObjectURL(blob);
  } catch (e) {
    // Error handled by composable
  }
};
</script>

<style>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
}

.image-preview {
  margin: 20px 0;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 4px;
}

.preview-image {
  max-width: 100%;
  height: auto;
}

.controls {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.loading-spinner {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error {
  color: #dc3545;
  margin-top: 10px;
}
</style> 