import { motion } from 'framer-motion';
import { Code, Download, FileText } from 'lucide-react';

// Export Options Section
export const ExportOptionsSection = () => {
  const exportOptions = [
    {
      icon: Code,
      title: 'Clean HTML/CSS',
      description:
        "Production-ready code that's clean, semantic, and optimized for performance.",
      color: 'from-red-700 via-red-500 to-red-700',
    },
    {
      icon: FileText,
      title: 'PDF Design',
      description:
        'High-quality PDF exports perfect for client presentations and documentation.',
      color: 'from-red-700 via-red-500 to-red-700',
    },
  ];

  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Export Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500  to-red-600">
              Creations
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Download your designs in multiple formats for any workflow or use
            case
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {exportOptions.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-background/50 backdrop-blur-sm border border-red-500/30 rounded-xl hover:shadow-lg hover:border-red-500/50 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} p-3 mx-auto mb-4 text-white`}
              >
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2 text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
