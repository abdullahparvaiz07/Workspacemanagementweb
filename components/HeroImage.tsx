'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export function HeroImage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 25, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className="w-full flex justify-center items-center mt-2 lg:mt-4 relative group"
    >
      <Image
        src="/assets/heromockupimg.png"
        alt="Workroom Workspace Mockup"
        width={900}
        height={600}
        priority
        className="w-full max-w-md sm:max-w-lg lg:max-w-xl h-auto object-contain transform group-hover:scale-[1.015] transition-transform duration-500 ease-out mx-auto"
      />
    </motion.div>
  );
}
