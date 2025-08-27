// utils/cloudinary.js

// 이미지 리사이즈 함수
const resizeImage = (file, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Cloudinary에 이미지 업로드하는 함수
export const uploadToCloudinary = async (file) => {
  try {
    // 파일 크기 체크 (5MB 제한)
    const maxSize = 5 * 1024 * 1024; // 5MB
    let fileToUpload = file;
    
    if (file.size > maxSize) {
      console.log('파일이 너무 큽니다. 리사이즈 중...');
      fileToUpload = await resizeImage(file, 1200, 0.7);
    }
    
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', process.env.REACT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'blog');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Cloudinary 업로드 실패');
    }

    const data = await response.json();
    
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 이미지 URL 변환 함수 (선택사항)
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
    return originalUrl;
  }
  
  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  
  if (transformations.length === 0) return originalUrl;
  
  const transformString = transformations.join(',');
  return originalUrl.replace('/upload/', `/upload/${transformString}/`);
};

// 사용 예시:
// const thumbnailUrl = getOptimizedImageUrl(originalUrl, { width: 300, height: 200 });
// const mobileUrl = getOptimizedImageUrl(originalUrl, { width: 800, quality: 'auto' });