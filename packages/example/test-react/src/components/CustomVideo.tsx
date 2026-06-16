import React, {
  forwardRef,
  Ref,
  useRef,
  useEffect,
  useLayoutEffect,
} from 'react';
import { useVideoStore, VIDEO_DEFAULTS } from '../store/VideoStore';

interface CustomVideoProps {
  componentId?: string;
}

const CustomVideo = forwardRef(
  (props: CustomVideoProps, ref: Ref<HTMLDivElement>) => {
    const id = (props as any).componentId || 'default';
    const hasSettings = useVideoStore(state => id in state.settings);
    const s = useVideoStore(state => state.settings[id] ?? VIDEO_DEFAULTS);
    const set = useVideoStore(state => state.set);
    const videoRef = useRef<HTMLVideoElement>(null);
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

    useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      el.playbackRate = s.playbackRate;
    }, [s.playbackRate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('video/')) return;
      const reader = new FileReader();
      reader.onload = () => set(id, { src: reader.result as string });
      reader.readAsDataURL(file);
    };

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
          backgroundColor: s.src ? undefined : '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: `${s.borderRadius}px`,
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
          opacity: s.opacity,
          boxShadow: s.boxShadow === 'none' ? undefined : s.boxShadow,
        }}
      >
        {s.src ? (
          <video
            ref={videoRef}
            src={s.src}
            poster={s.posterUrl || undefined}
            controls={s.controls}
            autoPlay={s.autoplay}
            muted={s.muted}
            loop={s.loop}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
              objectFit: s.objectFit as React.CSSProperties['objectFit'],
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              color: '#94a3b8',
              cursor: 'pointer',
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
                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              Click to upload video
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              or paste a URL in settings
            </span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    );
  }
);

CustomVideo.displayName = 'CustomVideo';
export default CustomVideo;
