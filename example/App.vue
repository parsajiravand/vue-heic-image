<template>
  <div class="app">
    <h1>Vue HEIC Image Demo</h1>
    
    <div class="github-links">
      <a href="https://github.com/parsajiravand/vue-heic-image" target="_blank" class="github-link">
        📦 GitHub Repository
      </a>
      <a href="https://github.com/parsajiravand/vue-heic-image/blob/master/example/App.vue" target="_blank" class="github-link">
        📝 Example Source Code
      </a>
      <!-- npm package -->
      <a href="https://www.npmjs.com/package/vue-heic-image" target="_blank" class="github-link">
        📦 NPM Package
      </a>
    </div>

    <div class="sample-images">
      <h3>Sample HEIC Images</h3>
      <div class="sample-links">
        <a href="https://github.com/parsajiravand/vue-heic-image/raw/main/example/assets/sample1.heic" download class="sample-link">
          Download Sample HEIC 1
        </a>
        <a href="https://github.com/parsajiravand/vue-heic-image/raw/main/example/assets/sample2.heic" download class="sample-link">
          Download Sample HEIC 2
        </a>
      </div>
    </div>
    
    <div class="demo-section">
      <h2>Component Usage</h2>
      <input 
        type="file" 
        accept="image/*,.heic" 
        @change="handleFileSelect" 
      />
      
      <div v-if="selectedFile" class="image-preview">
        <HeicImage
          :src="selectedFile"
          alt="Image Preview"
          :toType="outputFormat"
          :quality="quality"
          :multiple="false"
          class="preview-image"
        >
          <template #loading="{ isHeic: isHeicImage }">
            <div class="loading-spinner">
              {{ isHeicImage ? 'Converting HEIC...' : 'Loading image...' }}
            </div>
          </template>
        </HeicImage>
      </div>
      
      <div class="controls" v-if="selectedFile">
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
      <input 
        type="file" 
        accept="image/*,.heic" 
        @change="handleComposableFileSelect" 
      />
      
      <div v-if="composableImageUrl" class="image-preview">
        <img :src="composableImageUrl" alt="Converted Image" class="preview-image" />
      </div>
      
      <div v-if="isLoading" class="loading-spinner">
        {{ isHeic ? 'Converting HEIC...' : 'Loading image...' }}
      </div>
      <div v-if="error" class="error">{{ error.message }}</div>
      
      <div v-if="selectedComposableFile" class="file-info">
        <p>File type: {{ selectedComposableFile.type || 'Unknown' }}</p>
        <p>Is HEIC: {{ isHeic ? 'Yes' : 'No' }}</p>
      </div>
    </div>

    <footer class="footer">
      <p>Created by <a href="https://github.com/parsajiravand" target="_blank">Parsa Jiravand</a></p>
      <p>
        <a href="https://www.npmjs.com/package/vue-heic-image" target="_blank">NPM Package</a>
        |
        <a href="https://github.com/parsajiravand/vue-heic-image/blob/main/LICENSE" target="_blank">MIT License</a>
      </p>
    </footer>
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
const selectedComposableFile = ref<File | null>(null);
const { convertHeicToImage, isLoading, error, isHeic } = useHeicImage();

const handleComposableFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  selectedComposableFile.value = file;
  
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

.github-links {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 20px 0;
}

.github-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  background: #24292e;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.github-link:hover {
  background: #2c3238;
}

.sample-images {
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.sample-links {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.sample-link {
  display: inline-block;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sample-link:hover {
  background: #0056b3;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
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
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
}

.error {
  color: #dc3545;
  margin-top: 10px;
  padding: 10px;
  background: #ffe6e6;
  border-radius: 4px;
}

.file-info {
  margin-top: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.file-info p {
  margin: 5px 0;
}

.footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}

.footer a {
  color: #007bff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style> 