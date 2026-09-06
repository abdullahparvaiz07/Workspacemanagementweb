'use client';

import React from 'react';

export function IllustrationGraphic() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10">
      <svg
        className="w-full h-full"
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Yellow Warm Backdrop Aura Shape */}
        <path
          d="M 420 100 C 650 80, 950 150, 950 380 C 950 560, 720 620, 500 600 C 350 580, 300 480, 380 320 Z"
          fill="#FDE68A"
          fillOpacity="0.65"
        />

        {/* Floor Line */}
        <path
          d="M 380 500 L 980 500"
          stroke="#18181B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* --- LEFT MONSTERA PLANT --- */}
        <g id="monstera-plant">
          {/* Pot */}
          <path
            d="M 420 440 L 430 495 C 430 498, 470 498, 470 495 L 480 440 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Pot Rim */}
          <ellipse cx="450" cy="440" rx="30" ry="6" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />

          {/* Stems & Leaves */}
          <path d="M 450 435 Q 430 380 390 350" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          {/* Leaf 1 (Big Left) */}
          <path
            d="M 390 350 C 360 330, 350 370, 375 410 C 390 430, 430 420, 420 380 C 410 360, 400 350, 390 350 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />
          {/* Leaf Cuts */}
          <path d="M 390 370 L 370 365 M 395 385 L 375 390" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />

          {/* Stem & Leaf 2 (Top Left) */}
          <path d="M 450 435 Q 440 340 420 300" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M 420 300 C 400 270, 430 250, 455 280 C 470 300, 460 340, 430 330 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />

          {/* Stem & Leaf 3 (Right) */}
          <path d="M 450 435 Q 480 370 515 360" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M 515 360 C 540 350, 545 390, 510 420 C 480 435, 480 390, 515 360 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />
        </g>

        {/* --- DESK AND LAPTOP --- */}
        <g id="desk-scene">
          {/* Desk Surface Line */}
          <path d="M 580 480 L 940 480" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
          
          {/* Coffee Mug */}
          <rect x="610" y="445" width="22" height="35" rx="3" fill="#18181B" stroke="#18181B" strokeWidth="2" />
          <path d="M 610 455 C 600 455, 600 470, 610 470" stroke="#18181B" strokeWidth="2.5" fill="none" />
          {/* Steam lines */}
          <path d="M 616 438 Q 618 430 616 422 M 623 438 Q 625 430 623 422" stroke="#18181B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Laptop open */}
          <path d="M 645 480 L 720 480 L 710 430 L 645 430 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          {/* Laptop base */}
          <path d="M 640 480 L 725 480" stroke="#18181B" strokeWidth="3" />
          {/* Laptop Lid Logo / Face */}
          <circle cx="680" cy="452" r="5" fill="none" stroke="#18181B" strokeWidth="2" />
          <path d="M 677 454 Q 680 457 683 454" stroke="#18181B" strokeWidth="1.5" fill="none" />
        </g>

        {/* --- PERSON SITTING --- */}
        <g id="person-drawing">
          {/* Pants/Legs (Dark fill) */}
          <path
            d="M 645 480 C 630 490, 610 520, 680 525 C 730 530, 800 500, 810 470 C 790 460, 720 470, 645 480 Z"
            fill="#18181B"
            stroke="#18181B"
            strokeWidth="2"
          />

          {/* Shoes */}
          <path
            d="M 590 535 C 585 520, 620 505, 630 530 C 625 538, 595 540, 590 535 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />
          <path d="M 600 528 L 615 524" stroke="#18181B" strokeWidth="2" />

          {/* Torso / Arm / Hand resting on cheek */}
          <path
            d="M 700 470 C 700 420, 720 380, 755 380 C 790 380, 810 420, 800 470 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />

          {/* Arm holding face */}
          <path d="M 720 430 Q 735 445 745 400" stroke="#18181B" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Head & Hair */}
          <circle cx="750" cy="360" r="22" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
          {/* Hair bun / hair style */}
          <path
            d="M 735 350 C 735 330, 770 330, 765 355 C 775 345, 770 325, 750 325 C 730 325, 730 345, 735 350 Z"
            fill="#18181B"
          />
          {/* Face profile features */}
          <circle cx="742" cy="358" r="2" fill="#18181B" /> {/* Eye */}
          <path d="M 738 366 Q 743 370 748 366" stroke="#18181B" strokeWidth="1.5" fill="none" /> {/* Smile */}
        </g>

        {/* --- SLEEPING CAT --- */}
        <g id="sleeping-cat">
          {/* Body */}
          <path
            d="M 740 520 C 730 495, 780 480, 810 500 C 825 510, 820 535, 780 535 C 750 535, 745 530, 740 520 Z"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="2.5"
          />
          {/* Tail */}
          <path d="M 810 515 C 830 520, 835 500, 820 495" stroke="#18181B" strokeWidth="2.5" fill="none" />
          {/* Ears & Sleeping Eyes */}
          <path d="M 750 500 L 755 490 L 762 498" stroke="#18181B" strokeWidth="2" fill="#18181B" />
          <path d="M 760 508 Q 764 512 768 508" stroke="#18181B" strokeWidth="1.5" fill="none" />
        </g>

        {/* --- RIGHT POTTED PLANT ON BOOKS --- */}
        <g id="right-plant-scene">
          {/* Books */}
          <rect x="830" y="470" width="50" height="12" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
          <rect x="825" y="482" width="60" height="14" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />

          {/* Plant Pot */}
          <path d="M 840 435 L 845 470 L 865 470 L 870 435 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
          
          {/* Plant Leaves */}
          <path d="M 855 435 Q 830 410 820 425 Q 845 435 855 435 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
          <path d="M 855 435 Q 880 405 890 420 Q 865 435 855 435 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
          <path d="M 855 435 Q 855 390 850 385 Q 860 410 855 435 Z" fill="#FFFFFF" stroke="#18181B" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
