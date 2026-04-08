
import React from 'react';
import { Zap, MapPin, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export function TrustIndicators() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col sm:flex-row gap-5 sm:gap-8 py-8 border-y border-gray-100 my-8">
      
      <motion.div variants={item} className="flex items-center text-gray-700">
        <div className="bg-emerald-50 p-2.5 rounded-lg mr-3">
          <Zap className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="font-medium text-sm md:text-base">Get matched faster</span>
      </motion.div>
      <motion.div variants={item} className="flex items-center text-gray-700">
        <div className="bg-emerald-50 p-2.5 rounded-lg mr-3">
          <MapPin className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="font-medium text-sm md:text-base">Near your campus</span>
      </motion.div>
      <motion.div variants={item} className="flex items-center text-gray-700">
        <div className="bg-emerald-50 p-2.5 rounded-lg mr-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="font-medium text-sm md:text-base">Verified listings</span>
      </motion.div>
    </motion.div>);

}