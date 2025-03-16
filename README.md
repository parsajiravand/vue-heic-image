# Vue HEIC Image

A Vue 3 component and composable for displaying and converting HEIC images in the browser. This package provides an easy way to preview HEIC images and convert them to other formats like PNG, JPEG, or GIF. It intelligently handles both HEIC and standard image formats.

## Features

- 🖼️ Display HEIC images directly in the browser
- 🔄 Convert HEIC to PNG, JPEG, or GIF
- ✨ Smart detection of HEIC files (no conversion for standard images)
- 📱 Perfect for iOS photos and HEIC image handling
- 🎨 Quality control for JPEG output
- 🎬 Support for animated HEIC files
- 💪 TypeScript support
- 🎁 Flexible usage: Component or Composable function

## Installation

```bash
npm install vue-heic-image
# or
yarn add vue-heic-image
# or
pnpm add vue-heic-image
```

## Usage

### Basic Component Usage

```vue
<template>
  <HeicImage src="path/to/image.heic" alt="My Image" />
</template>

<script setup>
import { HeicImage } from 'vue-heic-image';
</script>
```

### Advanced Component Usage

```vue
<template>
  <HeicImage
    :src="imageFile"
    alt="My HEIC Image"
    :toType="'image/jpeg'"
    :quality="0.8"
    :multiple="true"
    class="my-image"
  >
    <!-- Custom loading state with HEIC detection -->
    <template #loading="{ isHeic }">
      <div class="loading">
        {{ isHeic ? 'Converting HEIC...' : 'Loading image...' }}
      </div>
    </template>

    <!-- Custom error handling -->
    <template #error="{ error }">
      <div class="error">
        Failed to load: {{ error.message }}
      </div>
    </template>
  </HeicImage>
</template>
```

### File Input Example

```vue
<template>
  <div>
    <!-- Accept both HEIC and standard images -->
    <input 
      type="file"
      accept="image/*,.heic"
      @change="handleFileSelect"
    />
    
    <div v-if="selectedFile">
      <HeicImage
        :src="selectedFile"
        :toType="outputFormat"
        :quality="quality"
        class="preview-image"
      >
        <template #loading="{ isHeic }">
          <div class="status">
            {{ isHeic ? 'Converting HEIC...' : 'Loading...' }}
          </div>
        </template>
      </HeicImage>

      <!-- Format controls -->
      <div class="controls">
        <select v-model="outputFormat">
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
          <option value="image/gif">GIF</option>
        </select>

        <input 
          v-if="outputFormat === 'image/jpeg'"
          type="range"
          v-model="quality"
          min="0"
          max="1"
          step="0.1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { HeicImage } from 'vue-heic-image';
import type { HeicOutputType } from 'vue-heic-image';

const selectedFile = ref<File | null>(null);
const outputFormat = ref<HeicOutputType>('image/png');
const quality = ref(0.92);

const handleFileSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) selectedFile.value = file;
};
</script>
```

### Using the Composable

```typescript
import { useHeicImage } from 'vue-heic-image';

// Basic usage
const { convertHeicToImage, isLoading, error, isHeic } = useHeicImage();

// With options
const imageHandler = useHeicImage({
  toType: 'image/png',
  quality: 0.92,
  multiple: false,
  gifInterval: 0.4,
});

// Handle file conversion
const handleFile = async (file: File) => {
  try {
    const result = await convertHeicToImage(file);
    
    // Check if the processed image was HEIC
    if (isHeic.value) {
      console.log('HEIC image was converted');
    } else {
      console.log('Standard image was processed directly');
    }

    // Handle the result
    const url = URL.createObjectURL(
      Array.isArray(result) ? result[0] : result
    );
    
    // Clean up when done
    return () => URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Processing failed:', e);
  }
};
```

## Props & Options

### Component Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| src | `File \| Blob \| string` | - | Source image (HEIC or standard formats) |
| alt | `string` | - | Alternative text for the image |
| toType | `'image/png' \| 'image/gif' \| 'image/jpeg'` | `'image/png'` | Output format for HEIC conversion |
| quality | `number` | `0.92` | JPEG quality (0-1), only for `'image/jpeg'` |
| multiple | `boolean` | `false` | Output multiple images for multi-frame HEIC |
| gifInterval | `number` | `0.4` | Frame interval for GIF output (seconds) |
| width | `number \| string` | - | Image width |
| height | `number \| string` | - | Image height |
| class | `string` | - | CSS class names |

### Slot Props

#### Loading Slot
```vue
<template #loading="{ isHeic }">
  <!-- isHeic: boolean - true if processing HEIC, false for standard images -->
</template>
```

#### Error Slot
```vue
<template #error="{ error }">
  <!-- error: Error - contains error details -->
</template>
```

## Smart Detection

The package automatically handles different image types:
- Detects HEIC images through:
  - MIME type checking
  - File signature analysis
- Standard images (PNG, JPEG, etc.) are displayed directly
- No unnecessary conversions for non-HEIC images

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires `FileReader` and `URL.createObjectURL` support
- iOS Safari: 13.4+
- Chrome/Edge: 89+
- Firefox: 86+

## License

MIT 