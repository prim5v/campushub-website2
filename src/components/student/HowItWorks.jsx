
import React from 'react';
import { motion } from 'framer-motion';

export function HowItWorks() {
  const steps = [
  { num: 1, text: "Tell us what you need" },
  { num: 2, text: "We match you with listings" },
  { num: 3, text: "You choose and move in" }];


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mb-14">
      
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">How It Works</h3>
      <div className="flex flex-col md:flex-row gap-6 md:gap-4">
        {steps.map((step, idx) =>
        <div key={idx} className="flex items-start md:flex-col md:items-start flex-1 group">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mr-4 md:mr-0 md:mb-4 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
              {step.num}
            </div>
            <p className="text-gray-800 font-medium pt-1 md:pt-0">{step.text}</p>
          </div>
        )}
      </div>
    </motion.div>);

}