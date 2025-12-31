'use client';

import { useEffect, useState } from 'react';
import { getAllSwipeData } from '@/lib/get-swipe-data';
import { ConfigScreen } from '@/components/config-screen';
import { SwipeInterface } from '@/components/swipe-interface';
import { WelcomeScreen } from '@/components/welcome-screen';

export default function SwipePadApp() {
  const [step, setStep] = useState<'welcome' | 'config' | 'swipe'>('welcome');
  const [cards, setCards] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    getAllSwipeData().then(data => {
      // Shuffle logic
      if (data.cards && data.cards.length > 0) {
        setCards(data.cards.sort(() => 0.5 - Math.random()));
      }
    });
  }, []);

  const handleConfig = (cfg: any) => {
    setConfig(cfg);
    setStep('swipe');
  };

  if (step === 'welcome') return <WelcomeScreen onEnter={() => setStep('config')} />;
  if (step === 'config') return <ConfigScreen onConfigComplete={handleConfig} />;
  
  return <SwipeInterface cards={cards} config={config} />;
}
