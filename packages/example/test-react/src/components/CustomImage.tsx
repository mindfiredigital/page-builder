import * as React from 'react';
import { useImageStore } from '../store/ImageStore';

interface CustomImageProps {
  componentId?: string;
}

const CustomImage = React.forwardRef<HTMLDivElement, CustomImageProps>(
  ({ componentId }, ref) => {
    const id = componentId || 'default';
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const objectFit = useImageStore(state => state.getObjectFit(id));
    const altText = useImageStore(state => state.getAltText(id));
    const caption = useImageStore(state => state.getCaption(id));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result as string);
      reader.readAsDataURL(file);
    };

    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          overflow: 'hidden',
          border: '2px dashed #cbd5e1',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {imageSrc ? (
          <>
            {/*
              Keep width/height 100% fixed so object-fit has a defined box to
              work within. object-fit controls how the image *content* is scaled
              inside that box — not the box dimensions itself.
                contain  → scale down/up to fit, letterboxed
                cover    → scale to fill, crops edges
                fill     → stretch to fill (no aspect ratio)
                none     → natural size, centered (crops if larger than box)
                scale-down → smaller of contain vs none
            */}
            <img
              src={imageSrc}
              alt={altText}
              style={{
                width: '100%',
                height: '100%',
                objectFit: objectFit as React.CSSProperties['objectFit'],
                display: 'block',
              }}
            />
            {caption && (
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
                {caption}
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
            <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
              Click to upload image
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              PNG, JPG, WebP supported
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

export default CustomImage;
