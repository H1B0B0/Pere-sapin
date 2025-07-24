export async function uploadToS3(file: File, type: 'image' | 'video' | 'auto' = 'auto') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      secure_url: data.url,
      width: data.width || 800,
      height: data.height || 600,
      format: data.format || file.type.split('/')[1],
      name: data.name || file.name,
      bytes: data.size || file.size,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
}