'use client';

import { useState, useEffect } from 'react';
import { getBanners } from '@/lib/local-store';

interface Props {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: Props) {
  const [bannerImg, setBannerImg] = useState('');

  useEffect(() => {
    getBanners().then(imgs => {
      const first = imgs.find(Boolean);
      if (first) setBannerImg(first);
    });
  }, []);

  return (
    <div
      className="section-header"
      style={bannerImg ? {
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      } : undefined}
    >
      {/* 배너 이미지 있을 때 오버레이 */}
      {bannerImg && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(20, 10, 50, 0.45)',
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
