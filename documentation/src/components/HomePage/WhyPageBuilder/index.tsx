import { motion } from 'framer-motion';
import { Eye, MousePointer, Settings } from 'lucide-react';

export const WhyPageBuilderSection = () => {
  const features = [
    {
      icon: MousePointer,
      title: 'Intuitive Drag & Drop',
      description:
        'Build pages visually with our intuitive drag-and-drop interface. No coding knowledge required - just drag, drop, and customize.',
    },
    {
      icon: Settings,
      title: 'Powerful Customization',
      description:
        'Fine-tune every aspect of your design with our comprehensive customization options. Colors, fonts, spacing, and more.',
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description:
        'See your changes instantly with live preview. What you see is exactly what your visitors will get.',
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16 flex justify-center items-center flex-col"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm text-red-500 rounded-full text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Why choose our page builder
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500  to-red-600">
              Everyone
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a designer, developer, or business owner, our page
            builder makes creating beautiful websites effortless.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="relative p-8 bg-background/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-500 via-red-400 to-red-500 rounded-xl text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-b-2xl" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
