import React from 'react';
import './Skeleton.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
}) => {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      }}
    />
  );
};

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="article-card-skeleton">
      <Skeleton height="180px" borderRadius="12px 12px 0 0" />
      <div className="skeleton-content">
        <Skeleton height="22px" width="80%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="60%" />
        <div className="skeleton-meta">
          <Skeleton height="14px" width="40%" />
          <Skeleton height="14px" width="30%" />
        </div>
      </div>
    </div>
  );
};
