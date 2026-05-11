import * as React from 'react';
import { useVideoStore } from '../store/VideoStore';

interface CustomVideoProps {
  componentId?: string;
}

const CustomVideo = React.forwardRef<HTMLDivElement, CustomVideoProps>(
  ({ componentId }, ref) => {
    const id = componentId || 'default';
    const [videoSrc, setVideoSrc] = React.useState<string | null>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const playbackRate = useVideoStore(state => state.getPlaybackRate(id));
    const autoplay = useVideoStore(state => state.getAutoplay(id));
    const muted = useVideoStore(state => state.getMuted(id));
    const loop = useVideoStore(state => state.getLoop(id));

    /* Apply store settings to the live <video> element whenever they change */
    React.useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      el.playbackRate = playbackRate;
      el.autoplay = autoplay;
      el.muted = muted;
      el.loop = loop;
    }, [playbackRate, autoplay, muted, loop]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith('video/')) return;
      const reader = new FileReader();
      reader.onload = () => setVideoSrc(reader.result as string);
      reader.readAsDataURL(file);
    };

    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          overflow: 'hidden',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {videoSrc ? (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            style={{ width: '100%', height: '100%', display: 'block' }}
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
              MP4, WebM, OGG supported
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    );
  }
);

export default CustomVideo;
