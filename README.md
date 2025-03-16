# Vue HEIC Image

A Vue 3 component and composable for displaying and converting HEIC images in the browser. This package provides an easy way to preview HEIC images and convert them to other formats like PNG, JPEG, or GIF.

## Installation

```bash
npm install vue-heic-image
# or
yarn add vue-heic-image
```

## Usage

### As a Component

```vue
<template>
  <HeicImage
    src="path/to/image.heic"
    alt="My HEIC Image"
    :toType="'image/png'"
    :quality="0.92"
    :multiple="false"
    :gifInterval="0.4"
  >
    <!-- Optional loading slot -->
    <template #loading>
      Loading image...
    </template>
    
    <!-- Optional error slot -->
    <template #error="{ error }">
      Failed to load image: {{ error.message }}
    </template>
  </HeicImage>
</template>

<script setup>
import { HeicImage } from 'vue-heic-image';
</script>
```

### As a Composable

```typescript
import { useHeicImage } from 'vue-heic-image';

const { convertHeicToImage, isLoading, error } = useHeicImage({
  toType: 'image/png',
  quality: 0.92,
  multiple: false,
  gifInterval: 0.4,
});

// Convert a HEIC file
const handleFileSelect = async (file: File) => {
  try {
    const result = await convertHeicToImage(file);
    // result will be a Blob or Blob[] depending on the multiple option
    const url = URL.createObjectURL(Array.isArray(result) ? result[0] : result);
    // Use the URL as needed
  } catch (e) {
    console.error('Failed to convert image:', e);
  }
};
```

## Props & Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| src | `File \| Blob \| string` | - | The source HEIC image. Can be a File object, Blob, or URL string |
| alt | `string` | - | Alternative text for the image |
| toType | `'image/png' \| 'image/gif' \| 'image/jpeg'` | `'image/png'` | Output format |
| quality | `number` | `0.92` | JPEG quality (0-1), only used when `toType` is `'image/jpeg'` |
| multiple | `boolean` | `false` | Whether to output multiple images if the HEIC contains multiple frames |
| gifInterval | `number` | `0.4` | Frame interval for GIF output in seconds |
| width | `number \| string` | - | Image width |
| height | `number \| string` | - | Image height |
| class | `string` | - | CSS class names |

## License

MIT 