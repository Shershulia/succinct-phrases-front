'use client';

import { useEffect, useRef, useState } from 'react';

export default function BirdsBackground({ children }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  useEffect(() => {
    const threeScript = document.createElement("script");
    threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    threeScript.async = true;

    const birdsScript = document.createElement("script");
    birdsScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js";
    birdsScript.async = true;

    document.head.appendChild(threeScript);
    document.head.appendChild(birdsScript);

    birdsScript.onload = () => {
      const checkReady = setInterval(() => {
        if (window.VANTA && window.THREE && vantaRef.current) {
          clearInterval(checkReady);
          if (!vantaEffect) {
            setVantaEffect(
              window.VANTA.BIRDS({
                el: vantaRef.current,
                THREE: window.THREE,
                backgroundColor: 0x0f0c29,
                color1: 0xff66cc,
                color2: 0x14b679,
                quantity: 3.0,
              })
            );
          }
        }
      }, 100);
    };

    return () => {
      if (vantaEffect) vantaEffect.destroy();
      document.head.removeChild(threeScript);
      document.head.removeChild(birdsScript);
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="fixed top-0 left-0 w-full h-full -z-10">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
