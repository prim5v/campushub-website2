
import React from 'react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const scrollToForm = () => {
    document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-8 lg:pt-16 pb-8">
      
      <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6 border border-emerald-100">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
        Now in Early Access
      </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
        Find Student Housing <span className="text-emerald-600">Faster</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
        Skip the endless searching. Get matched to listings that fit your budget and location.
      </p>
      <button
        onClick={scrollToForm}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center text-lg w-full sm:w-auto active:scale-[0.98]">
        
        Get Priority Access
        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </motion.div>);

}