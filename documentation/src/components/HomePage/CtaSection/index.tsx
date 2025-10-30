// CTASection.tsx
import { ArrowRight, Rocket, Github, BookOpen } from 'lucide-react';
import { Button } from '../../UI/Button';
import { motion } from 'framer-motion';

export const CTASection = () => {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="relative p-12 md:p-16 bg-background/50 backdrop-blur-sm border border-red-500/30 rounded-3xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 bg-linear-to-br from-red-500/10 via-transparent to-red-600/10" />
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(800px_400px_at_50%_0%,rgba(220,38,38,0.15),transparent)]" />

          {/* Animated circles */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Rocket className="h-16 w-16 text-red-500 mx-auto mb-6" />
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Start Building{' '}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-red-600">
                Today
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
              Create stunning web pages with our intuitive drag-and-drop interface
            </p>

            <p className="text-base text-muted-foreground mb-10 max-w-2xl mx-auto">
              Free and open-source. Start building beautiful, responsive pages in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-6 rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 text-lg font-semibold"
                >
                  Get Started <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="xl"
                  variant="outline"
                  className="border-2 border-red-500/50 hover:border-red-500 text-foreground px-10 py-6 rounded-2xl transition-all duration-300 text-lg font-semibold"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Documentation
                </Button>
              </motion.div>
            </div>

            {/* Quick links */}
            <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-muted-foreground">
              <a href="#" className="flex items-center gap-2 hover:text-red-500 transition-colors">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
              <span className="text-red-500/50">•</span>
              <a href="#" className="hover:text-red-500 transition-colors">
                NPM Package
              </a>
              <span className="text-red-500/50">•</span>
              <a href="#" className="hover:text-red-500 transition-colors">
                Live Demo
              </a>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap gap-8 justify-center items-center opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-red-500 to-red-600 rounded-lg" />
              <span className="text-sm font-medium">Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-red-500 to-red-600 rounded-lg" />
              <span className="text-sm font-medium">TypeScript</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-br from-red-500 to-red-600 rounded-lg" />
              <span className="text-sm font-medium">React Support</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};