'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export function HeroImage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="w-full flex justify-center items-center mt-4 lg:mt-10"
    >
      <Image
        src="/assets/heromockupimg.png"
        alt="Workroom Workspace Mockup"
        width={1200}
        height={800}
        priority
        className="w-full h-auto object-contain"
      />
    </motion.div>
  );
}
