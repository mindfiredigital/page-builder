import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  MousePointer,
  Download,
  Eye,
} from 'lucide-react';
import { Button } from '../../UI/Button';

const cn = (...classes) => classes.filter(Boolean).join(' ');
const getTheme = (): string => {
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
};
export const AppShowcase = () => {
  const [activeView, setActiveView] = useState(0);
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(getTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const appViews = [
    {
      id: 'page-builder',
      title: 'Drag & Drop Page Builder',
      description:
        'Build dynamic pages with our visual editor. Drag components from the sidebar, customize with attribute seeding, and integrate custom React components through JSON configuration.',
      image: 'img/app-img-3.png',
      category: 'Page Builder',
      features: [
        'Visual Drag & Drop Editor',
        'Component Sidebar',
        'Attribute Seeding System',
        'Undo/Redo Operations',
      ],
    },

    {
      id: 'export-system',
      title: 'Multi-Format Export Engine',
      description:
        'Generate production-ready HTML/CSS files and PDF documents from your designs. Preview your creations and export them for deployment or documentation.',
      image: 'img/app-img-5.png',
      category: 'Export & Preview',
      features: [
        'Live Preview Mode',
        'HTML/CSS Generation',
        'PDF Export',
        'Clean Code Output',
      ],
    },
    {
      id: 'preview-system',
      title: 'Live Preview ',
      description:
        'Preview how your design will look as a web page and PDF document in real-time. Generate production-ready HTML/CSS files and PDF exports with pixel-perfect accuracy.',
      image: 'img/app-img-2.png',
      category: 'Preview & Export',
      features: [
        'Real-time Web Preview',
        'PDF Preview Mode',
        'HTML/CSS Generation',
        'One-Click Export',
      ],
    },
    {
      id: 'component-builder',
      title: 'Component Customization Studio',
      description:
        'Seed components with dynamic data, formulas, and table values. Configure input types that trigger functions to calculate and display real-time results in your components.',
      image: 'img/app-img-1.png',
      category: 'Component System',
      features: [
        'Dynamic Attribute Seeding',
        'Formula-Based Calculations',
        'Table Data Integration',
        'Real-time Value Updates',
      ],
    },
  ];

  const categories = [
    { id: 'page-builder', name: 'Page Builder', icon: MousePointer },
    { id: 'export-system', name: 'Export & Preview', icon: Download },
    { id: 'preview', name: 'Preview', icon: Eye },

    { id: 'component-builder', name: 'Component System', icon: Settings },
  ];

  const nextView = () => {
    setActiveView(prev => (prev + 1) % appViews.length);
  };

  const prevView = () => {
    setActiveView(prev => (prev - 1 + appViews.length) % appViews.length);
  };

  return (
    <section className="relative py-20 px-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {/* <motion.div
          className="text-center mb-16 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <AuroraText>
            Available as React wrapper and Web Component. Pass custom components
            via JSON configuration for seamless integration.
          </AuroraText>
        </motion.div> */}

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className={`flex ${theme === 'dark' ? 'bg-gray-900/50' : ' bg-gray-900/70'} backdrop-blur-sm border border-red-500/20 rounded-xl p-1 shadow-lg shadow-red-500/10`}>
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveView(index)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium',
                  activeView === index
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/25'
                    : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-100'} hover:text-white hover:bg-red-900/30`
                )}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Showcase */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* App Preview */}
          <div className="lg:col-span-3">
            <motion.div
              className="relative"
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Device Frame */}
              <div className="relative bg-gray-950 border border-red-500/30 rounded-2xl p-2 shadow-2xl shadow-red-500/20">
                {/* Browser Header */}
                <div className="flex items-center gap-2 bg-gray-900 border-b border-red-500/20 rounded-t-xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-800 border border-red-500/20 rounded-md px-3 py-1 text-xs text-gray-400">
                      https://page-builder.app/{appViews[activeView].id}
                    </div>
                  </div>
                </div>

                {/* Screenshot Area */}
                <div className="bg-white rounded-b-xl overflow-hidden">
                  <img
                    src={appViews[activeView].image}
                    alt={appViews[activeView].title}
                    className="w-full h-96 object-cover object-top"
                  />
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevView}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm border border-red-500/30 p-2 rounded-full shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextView}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm border border-red-500/30 p-2 rounded-full shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </motion.div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-2">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Title & Description */}
              <div>
                <h3 className="text-2xl font-bold  mb-3">
                  {appViews[activeView].title}
                </h3>
                <p className=" leading-relaxed">
                  {appViews[activeView].description}
                </p>
              </div>

              {/* Features List */}
              <div>
                <h4 className="font-semibold  mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {appViews[activeView].features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-2 "
                    >
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Integration Info */}
              {/* <div
                className={`${theme === 'dark' ? 'bg-gray-900/30' : 'bg-gray-800/20'} border border-red-500/20 rounded-lg p-4`}
              >
                <h4 className="font-semibold text-red-400 mb-2">
                  Integration Ready
                </h4>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}
                >
                  Available as React wrapper and Web Component. Pass custom
                  components via JSON configuration for seamless integration.
                </p>
              </div> */}

              {/* CTA Button */}
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Try Page Builder
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center mt-8 gap-2">
          {appViews.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveView(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                activeView === index
                  ? 'bg-red-500 w-8 shadow-lg shadow-red-500/50'
                  : 'bg-gray-600 w-2 hover:bg-gray-500'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
