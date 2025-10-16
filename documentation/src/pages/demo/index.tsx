import { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const AnimatedLoader = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 z-50">
      {/* Animated Logo/Icon */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-red-primary to-red-600 rounded-lg blur-lg animate-pulse" />
        <div className="relative bg-gray-950 px-6 py-4 rounded-lg border border-red-primary/30">
          <svg className="w-12 h-12 text-red-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>



      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0%;
          }
          100% {
            background-position: 100% 0%;
          }
        }
      `}</style>
    </div>
  );
};

const DemoSelectionContent = () => {
  const [selectedDemo, setSelectedDemo] = useState('react');
  const [isLoading, setIsLoading] = useState(true);

  const demoConfigs = {
    react: {
      name: 'React',
      stackblitzUrl: 'https://stackblitz.com/edit/vitejs-vite-24hnvyle?embed=1&file=README.md',
    },
    angular: {
      name: 'Angular',
      stackblitzUrl: 'https://stackblitz.com/edit/stackblitz-starters-iqewbuka?file=package.json',
    },
    core: {
      name: 'Core',
      stackblitzUrl: 'https://stackblitz.com/edit/stackblitz-starters-iqewbuka?file=package.json',
    },
  };

  const currentConfig = demoConfigs[selectedDemo];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedDemo]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      {/* Minimal Package Selector */}
      <div className="flex justify-between items-center gap-2 p-3 bg-gray-900 backdrop-blur border-b border-gray-800 ">
        <div className='flex gap-2 justify-center items-center '>
          <img src={require("/static/img/logo.png").default} alt="Your Logo" className='h-8 w-4 ' />
          <span className='text-white hover:text-red-primary font-bold'>Page Builder</span>
        </div>
        <div className='flex justify-between gap-2'>
          {Object.entries(demoConfigs).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSelectedDemo(key)}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors cursor-pointer ${selectedDemo === key
                ? 'bg-red-primary text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
            >
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full Screen Stackblitz */}
      <div className="flex-1 overflow-hidden relative bg-gray-950">
        {/* Loader - shows only when loading */}
        <AnimatedLoader isVisible={isLoading} />

        {/* Iframe */}
        <iframe
          key={selectedDemo}
          src={currentConfig.stackblitzUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          title={`${currentConfig.name} Demo`}
          allow="geolocation; microphone; camera; midi; vr; magnetometer; gyroscope; payment; usb"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default function DemoPage() {
  const { siteConfig } = useDocusaurusContext();
  return <DemoSelectionContent />;
}