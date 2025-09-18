import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react';
import { Button } from '../../UI/Button';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export const AppShowcase = () => {
  const [activeView, setActiveView] = useState(0);

  // App screenshots/features data
  const appViews = [
    {
      id: 'html-builder',
      title: 'HTML/Website Builder',
      description:
        'Create stunning websites with our intuitive drag-and-drop interface. Build responsive layouts without writing a single line of code.',
      image: 'img/app-img-3.png', // Replace with your actual screenshot path
      category: 'Website Builder',
      features: [
        'Drag & Drop Interface',
        'Responsive Design',
        'Real-time Preview',
        'Custom Components',
      ],
    },
    {
      id: 'newsletter-builder',
      title: 'Newsletter Builder',
      description:
        'Design beautiful newsletters with professional templates. Customize layouts, add images, and manage your email campaigns effortlessly.',
      image: 'img/app-img-1.png', // Replace with your actual screenshot path
      category: 'Email Marketing',
      features: [
        'Email Templates',
        'Campaign Management',
        'Analytics Dashboard',
        'A/B Testing',
      ],
    },
    {
      id: 'document-builder',
      title: 'Document Builder',
      description:
        'Generate professional documents, invoices, and reports with dynamic data. Perfect for business documentation and automated workflows.',
      image: 'img/app-img-2.png', // Replace with your actual screenshot path
      category: 'Document Generation',
      features: [
        'Dynamic Templates',
        'PDF Export',
        'Data Integration',
        'Custom Branding',
      ],
    },
  ];

  const categories = [
    { id: 'html-builder', name: 'Website Builder', icon: Code2 },
    { id: 'newsletter-builder', name: 'Email Marketing', icon: Mail },
    { id: 'document-builder', name: 'Document Generation', icon: FileText },
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
        <motion.div
          className="text-center mb-16 flex flex-col justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 ">
            Powerful{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r   from-red-700 via-red-500  to-red-600">
              Builder Tools
            </span>
          </h2>
          <p className="text-xl max-w-3xl mx-auto">
            Experience our comprehensive suite of no-code builders designed to
            streamline your workflow and boost productivity.
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-900/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-1 shadow-lg shadow-red-500/10">
            {categories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => setActiveView(index)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium',
                  activeView === index
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-red-900/30'
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
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-800 border border-red-500/20 rounded-md px-3 py-1 text-xs text-gray-400">
                      https://your-app.com/{appViews[activeView].id}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Monitor className="h-4 w-4 text-gray-500" />
                    <Tablet className="h-4 w-4 text-gray-600" />
                    <Smartphone className="h-4 w-4 text-gray-600" />
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

              {/* CTA Button */}
              <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Try {appViews[activeView].title}
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
