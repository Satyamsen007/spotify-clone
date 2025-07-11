'use client';

import { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

export const useDominantColor = (imageUrl) => {
  const [color, setColor] = useState('#5038a0');

  useEffect(() => {
    if (!imageUrl) return;

    // Initialize ColorThief once
    if (typeof window !== 'undefined' && !window.ColorThief) {
      window.ColorThief = new ColorThief();
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + 'crossorigin=anonymous';

    img.onload = function() {
      try {
        const [r, g, b] = window.ColorThief.getColor(img);
        const color = `rgb(${r}, ${g}, ${b})`;
        console.log('Extracted color:', color);
        setColor(color);
      } catch (error) {
        console.error('Error extracting color:', error);
        setColor('#5038a0');
      }
    };

    img.onerror = () => {
      console.error('Error loading image for color extraction');
      setColor('#5038a0');
    };
  }, [imageUrl]);

  return color;
};