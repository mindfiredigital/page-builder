import { useEffect, useRef, useState } from 'react';
import { Button } from '../../UI/Button';
import { ArrowRight, Github, Sparkles, Zap } from 'lucide-react';
import { TypeText } from '../../UI/Text/TypeText';
import { CopyButton } from '../../UI/CopyButton';
import { motion } from 'framer-motion';
import Particles from '../../UI/Background/Particles';
import { AnimatedShinyText } from '../../UI/Text/AnimatedShinyText';
import { AuroraText } from '../../UI/Text/AuroraText';

// Hero Section Component
export const HeroSection = () => {
  const spotlightRef = useRef(null);
  const DEMO_SELECTION_PAGE_URL = 'demo/';

  useEffect(() => {
    const handleMouseMove = e => {
      if (!spotlightRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      spotlightRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className={`relative py-20 px-6 overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute top-10 inset-0  overflow-hidden" >
        <Particles moveParticlesOnHover={true} particleHoverFactor={2.0} />


        {/* Spotlight effect */}
        {/* <div
          ref={spotlightRef}
          className="fixed inset-0  transition-transform duration-300 ease-out opacity-30"
          style={{
            background:
              'radial-gradient(600px circle at 50% 50%,  rgba(207, 67, 31, 0.8), transparent 40%)',
          }}
        /> */}
      </div>
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Brand Badge */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              Visual Page Builder
            </span>
          </div>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          className="mb-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-8xl md:text-7xl font-bold leading-tight mb-6 text-foreground">
            <span className="block text-5xl">
              {/* Create{' '}
              <TypeText
                texts={['Dynamic', 'Interactive', 'Professional', 'Custom']}
                typingSpeed={80}
                pauseDuration={1500}
                className="inline-block"
              />{' '}
              Designs ,
              <span className="block text-5xl">
                with Drag & Drop Simplicity
              </span> */}
              <AuroraText>
                Embed a Powerful Page Builder
              </AuroraText>
              <span className="block text-5xl">
                {/* <AuroraText> */}
                Into Your Application
                {/* </AuroraText> */}
              </span>
            </span>
          </h1>
          <p className="text-xl  md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {/* Transform your application with an embeddable visual builder. Let your users create custom templates, forms, and layouts— */}
            {/* <span className="text-red-500 font-semibold "> */}
            Empower users to build {' '}<TypeText
              texts={["Templates",
                "Forms",
                "Pages",
                "Reports",
                "Layouts"]}
              typingSpeed={80}
              pauseDuration={1500}
              className="inline-block"
            />
            {' '} quickly and efficiently.
            {/* no developer intervention needed. */}
            {/* </span> */}
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            size="xl"
            className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Start Building <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <a
            href={DEMO_SELECTION_PAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="xl"
              className="border-red-500/50 backdrop-blur-sm hover:bg-red-100/50 text-red-600 px-8 py-4 rounded-2xl border-2"

            >
              <Github className="mr-2 h-5 w-5" />
              View Demo
            </Button>
          </a>
        </motion.div>

        {/* Installation & Features */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-center gap-3 px-6 py-2 bg-background/50 backdrop-blur-sm border border-border rounded-full">
            <CopyButton text="npx create-page-builder my-app" />
            {/* <code className="text-sm text-muted-foreground font-mono">
              npm i @mindfiredigital/page-builder
            </code> */}
            <AnimatedShinyText>
              {' '}
              npm i @mindfiredigital/page-builder
            </AnimatedShinyText>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm border border-border rounded-full">
            <Zap className="h-4 w-4 text-red-500" />
            <span className="text-sm text-muted-foreground">
              Ready in 30 seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
