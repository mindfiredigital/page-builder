import { motion } from 'framer-motion';
import { Code, FileText } from 'lucide-react';

export const ExportOptionsSection = () => {
  const exportOptions = [
    {
      icon: Code,
      title: 'HTML & CSS Export',
      description:
        'Generate clean, semantic HTML with optimized CSS. Get production-ready code that follows modern web standards and best practices.',
      color: 'from-red-700 via-red-500 to-red-700',
      features: ['Semantic markup', 'Responsive design', 'Clean CSS'],
    },
    {
      icon: FileText,
      title: 'PDF Export',
      description:
        'Export your designs as high-quality PDF documents. Perfect for client presentations, documentation, or archiving your work.',
      color: 'from-orange-700 via-orange-500 to-orange-700',
      features: ['High quality', 'Print ready', 'Shareable'],
    },
  ];

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm text-red-500 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            Export & Share
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Export Your Designs{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-700 via-red-500 to-red-600">
              Instantly
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Take your creations beyond the builder with flexible export options
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {exportOptions.map((item, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-background/50 backdrop-blur-sm border border-red-500/30 rounded-2xl hover:shadow-2xl hover:border-red-500/50 transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-xl bg-linear-to-br ${item.color} p-4 flex items-center justify-center text-white shadow-lg mb-6`}
                  >
                    <item.icon className="h-8 w-8" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-red-500 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Feature highlights */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {item.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 to-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};