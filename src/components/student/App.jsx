import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from './HeroSection';
import { TrustIndicators } from './TrustIndicators';
import { HowItWorks } from './HowItWorks';
import { SignupForm } from './SignupForm';
import { Footer } from './Footer';

const images = [
  "https://i.pinimg.com/1200x/43/4c/fd/434cfda880dbde73a7aa842af1ba7245.jpg",
  "https://i.pinimg.com/736x/de/fb/cf/defbcfaaa638263a7f234be5d73e36de.jpg",
  "https://i.pinimg.com/736x/59/12/16/5912169018b2a9f99c73fe924cb2a081.jpg"
];
// https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80
export function StudentApp() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000); // every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Mobile Carousel */}
      <div className="lg:hidden w-full h-[280px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Modern student apartment"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10"></div>
      </div>

      {/* Left Side - Content */}
      <div className="w-full lg:w-[55%] flex flex-col relative z-20 bg-white">
        <div className="flex-1 px-6 md:px-12 lg:px-16 xl:px-24 max-w-3xl mx-auto w-full">
          <HeroSection />
          <TrustIndicators />
          <HowItWorks />
          <div id="signup-form" className="scroll-mt-12">
            <SignupForm />
          </div>
          <Footer />
        </div>
      </div>

      {/* Desktop Carousel */}
      <div className="hidden lg:block lg:w-[45%] lg:h-screen lg:sticky lg:top-0 relative overflow-hidden bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={images[current]}
            alt="Modern student apartment"
            className="w-full h-full object-cover"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-white via-white/80 to-transparent z-10"></div>
      </div>
    </div>
  );
}