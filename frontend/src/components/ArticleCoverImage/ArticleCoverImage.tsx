import React, { useState } from 'react';
import { ImageIcon } from '../Icons/Icons';
import './ArticleCoverImage.css';

interface ArticleCoverImageProps {
  imageUrl?: string | null;
  base64Image?: string | null;
  mimeType?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const ArticleCoverImage: React.FC<ArticleCoverImageProps> = ({
  imageUrl,
  base64Image,
  mimeType,
  alt,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  let src: string | null = null;
  if (!hasError) {
    if (imageUrl) {
      src = imageUrl.startsWith('http') ? imageUrl : `http://localhost:4000${imageUrl}`;
    } else if (base64Image && mimeType) {
      src = `data:${mimeType};base64,${base64Image}`;
    }
  }

  if (!src || hasError) {
    return (
      <div className={`article-image-placeholder ${className}`}>
        <ImageIcon size={36} color="#94a3b8" />
        <span className="placeholder-text">Sem imagem</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`article-cover-img ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};
