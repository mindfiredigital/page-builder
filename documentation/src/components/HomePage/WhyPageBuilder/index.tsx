
import { motion } from 'framer-motion';
import {
  MousePointer,
  Layers,
  Palette,
  Smartphone,
  Zap,
  Code2
} from 'lucide-react';

export const WhyPageBuilderSection = () => {
  const features = [
    {
      icon: MousePointer,
      title: 'Intuitive Drag & Drop',
      description:
        'Visually compose your layouts by dragging components from the sidebar directly onto the canvas. Rearrange, nest, and organize with pixel-perfect precision.',
      benefits: ['No coding required', 'Real-time positioning', 'Smart guides'],
      gradient: 'from-red-700 via-red-500 to-red-700',
    },
    {
      icon: Layers,
      title: 'Component Library',
      description:
        'Access a rich collection of pre-built components: buttons, headers, text blocks, tables, images, and custom elements. Extend with your own React components.',
      benefits: ['50+ Built-in components', 'Custom components', 'Reusable blocks'],
      gradient: 'from-orange-700 via-orange-500 to-orange-700',
    },
    {
      icon: Palette,
      title: 'Visual Customization',
      description:
        'Fine-tune every detail through the intuitive settings panel. Adjust colors, typography, spacing, borders, shadows, and more—all with live preview.',
      benefits: ['Live preview', 'CSS properties', 'Design tokens'],
      gradient: 'from-rose-700 via-rose-500 to-rose-700',
    },
    {
      icon: Smartphone,
      title: 'Device Preview',
      description:
        'Preview your designs in different viewport sizes. Switch between desktop, tablet, and mobile views to see how your layout appears on various devices.',
      benefits: ['Multiple viewports', 'Preview modes', 'Visual testing'],
      gradient: 'from-pink-700 via-pink-500 to-pink-700',
    },
    {
      icon: Zap,
      title: 'Dynamic Attributes',
      description:
        'Create data-driven components with input fields, formulas, and calculations. Build interactive forms, calculators, and dynamic content that responds to user input.',
      benefits: ['Live calculations', 'Formula support', 'Data binding'],
      gradient: 'from-red-700 via-red-500 to-red-700',
    },
    {
      icon: Code2,
      title: 'Clean Code Output',
      description:
        'Generate semantic HTML and CSS that follows modern web standards. Export clean, well-structured code ready for your projects.',
      benefits: ['Semantic HTML', 'Clean CSS', 'Standards compliant'],
      gradient: 'from-orange-700 via-orange-500 to-orange-700',
    },
  ];

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 flex justify-center items-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm text-red-500 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Everything You Need to Build{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-700 via-red-500 to-red-600">
              Beautiful Pages
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A complete visual page builder with intuitive tools for creating stunning web layouts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-background/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-3 bg-linear-to-br ${feature.gradient} rounded-xl text-white mb-6 shadow-lg`}>
                  <feature.icon className="h-7 w-7" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-red-500 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom accent bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: 'Drag', label: '& Drop Interface' },
            { value: 'Visual', label: 'Builder' },
            { value: 'Free', label: 'Open Source' },
            { value: 'Easy', label: 'To Use' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-red-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};

