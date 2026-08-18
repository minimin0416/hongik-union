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
    <div className="section-header" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 배너 이미지 */}
      {bannerImg && (
        <>
          <img
            src={bannerImg}
            alt=""
            aria-hidden
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
            }}
          />
          {/* 어두운 오버레이 — 글씨 가독성 */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(15, 8, 40, 0.48)',
          }} />
        </>
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
