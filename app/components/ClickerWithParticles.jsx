'use client';

import { useEffect, useRef, useState } from "react";
import party from "party-js";

export default function ClickerWithParticles({ onBalanceChange, initial = 0 }) {
  const [balance, setBalance] = useState(initial);
  const [eggStage, setEggStage] = useState(1);
  const eggRef = useRef(null);

  useEffect(() => {
    onBalanceChange?.(balance);
  }, [balance]);

  const handleClick = () => {
    setBalance(prev => Math.min(prev + 1));
    
    const newBalance = balance + 1;
    const stage = Math.floor((newBalance - 1) / 7) % 9 + 1;
    setEggStage(stage);
    
  };
  useEffect(() => {
    fireParticles();
  }, [eggStage]);

  const fireParticles = () => {
    if (!eggRef.current) return;

    party.confetti(eggRef.current, {
      count: party.variation.range(15, 25),
      spread: 60,
      speed: party.variation.range(200, 400),
      size: party.variation.range(1, 2),
      angle: party.variation.range(250, 290),
    });
  };

  return (
    <div className="relative flex flex-col items-center gap-4 right-14">
      <div
        ref={eggRef}
        onClick={handleClick}
        className="w-[600px] h-[420px] bg-cover bg-center bg-no-repeat cursor-pointer select-none active:scale-95 transition-transform duration-75 relative z-20"
        style={{
          backgroundImage: `url('/${eggStage}.PNG')`
        }}
      />
    </div>
  );
}
