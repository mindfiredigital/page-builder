import { ArrowRight, Target } from 'lucide-react';
import { Button } from '../../UI/Button';
import { motion } from 'framer-motion';

export const CTASection = () => {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative p-12 bg-background/50 backdrop-blur-sm border border-red-500/30 rounded-3xl overflow-hidden text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-600/10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(600px_300px_at_50%_0%,_rgba(220,38,38,0.1),_transparent)]" />

          <div className="relative">
            <Target className="h-12 w-12 text-red-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Ready to Build Something{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                Amazing?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are building beautiful web
              experiences with our intuitive page builder.
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="xl"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Get Started Free <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
