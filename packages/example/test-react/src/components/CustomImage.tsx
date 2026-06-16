import React, { forwardRef, Ref, useRef, useLayoutEffect } from 'react';
import { useImageStore, IMAGE_DEFAULTS } from '../store/ImageStore';

interface CustomImageProps {
  componentId?: string;
}

const CustomImage = forwardRef(
  (props: CustomImageProps, ref: Ref<HTMLDivElement>) => {
    const id = (props as any).componentId || 'default';
    const hasSettings = useImageStore(state => id in state.settings);
    const s = useImageStore(state => state.settings[id] ?? IMAGE_DEFAULTS);
    const set = useImageStore(state => state.set);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useLayoutEffect(() => {
      if (!hasSettings) {
        const el = document.getElementById(id);
        if (el instanceof HTMLElement) {
          const saved = el.getAttribute('data-pb-settings');
          if (saved) {
            try {
              set(id, JSON.parse(saved));
            } catch {}
          }
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useLayoutEffect(() => {
      const el = document.getElementById(id);
      if (el instanceof HTMLElement) {
        el.setAttribute('data-pb-settings', JSON.stringify(s));
      }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => set(id, { src: reader.result as string });
      reader.readAsDataURL(file);
    };

    const filterCss =
      [
        s.brightness !== 100 ? `brightness(${s.brightness}%)` : '',
        s.contrast !== 100 ? `contrast(${s.contrast}%)` : '',
        s.grayscale > 0 ? `grayscale(${s.grayscale}%)` : '',
        s.blur > 0 ? `blur(${s.blur}px)` : '',
        s.sepia > 0 ? `sepia(${s.sepia}%)` : '',
        s.saturate !== 100 ? `saturate(${s.saturate}%)` : '',
      ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <div
        ref={ref}
        style={{
          width: `${s.widthValue}${s.widthUnit}`,
          height: `${s.heightValue}${s.heightUnit}`,
          paddingTop: s.paddingTop ? `${s.paddingTop}px` : undefined,
          paddingRight: s.paddingRight ? `${s.paddingRight}px` : undefined,
          paddingBottom: s.paddingBottom ? `${s.paddingBottom}px` : undefined,
          paddingLeft: s.paddingLeft ? `${s.paddingLeft}px` : undefined,
          backgroundColor: s.src ? undefined : '#f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: `${s.borderRadius}px`,
          overflow: 'hidden',
          border: s.src ? 'none' : '2px dashed #cbd5e1',
          position: 'relative',
          boxSizing: 'border-box',
          opacity: s.opacity,
          boxShadow: s.boxShadow === 'none' ? undefined : s.boxShadow,
        }}
      >
        {s.src ? (
          <>
            <img
              src={s.src}
              alt={s.altText}
              style={{
                width: '100%',
                height: '100%',
                objectFit: s.objectFit as React.CSSProperties['objectFit'],
                display: 'block',
                filter: filterCss,
              }}
            />
            {s.caption && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '4px 8px',
                  fontSize: '11px',
                  color: '#64748b',
                  backgroundColor: 'rgba(255,255,255,0.85)',
                  textAlign: 'center',
                }}
              >
                {s.caption}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                padding: '2px 6px',
                fontSize: '11px',
                cursor: 'pointer',
                color: '#334155',
              }}
            >
              Change
            </button>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '20px',
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
            <span
              style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}
            >
              Click to upload image
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              or paste a URL in settings
            </span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    );
  }
);

CustomImage.displayName = 'CustomImage';
export default CustomImage;
