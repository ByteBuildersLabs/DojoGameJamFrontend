// Main component for the Tamagotchi dashboard
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Pizza, Coffee, Gamepad2, Bath, Sun, Gamepad } from 'lucide-react';
import PlatformGame from './mini-game';

interface TamagotchiDashboardProps {
  openMiniGame: () => void;
}

interface Stats {
  hunger: number;
  energy: number;
  happiness: number;
  hygiene: number;
}

const TamagotchiDashboard: React.FC<TamagotchiDashboardProps> = ({ openMiniGame }) => {
  const [stats, setStats] = useState<Stats>({
    hunger: 100,
    energy: 100,
    happiness: 100,
    hygiene: 100,
  });

  const [isAlive, setIsAlive] = useState(true);
  const [age, setAge] = useState(0);
  const [currentImage, setCurrentImage] = useState('/babybeast_happy.gif');

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAlive) {
        setStats(prevStats => ({
          hunger: Math.max(0, prevStats.hunger - 2),
          energy: Math.max(0, prevStats.energy - 1.5),
          happiness: Math.max(0, prevStats.happiness - 1),
          hygiene: Math.max(0, prevStats.hygiene - 1),
        }));
        setAge(prevAge => prevAge + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isAlive]);

  useEffect(() => {
    if (Object.values(stats).some(stat => stat === 0)) {
      setIsAlive(false);
    }
  }, [stats]);

  const feed = () => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30),
      energy: Math.min(100, prev.energy + 10),
    }));
    setCurrentImage('/babybeast_eat.gif');
    setTimeout(() => setCurrentImage('/babybeast_happy.gif'), 3000);
  };

  const sleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      happiness: Math.min(100, prev.happiness + 10),
    }));
    setCurrentImage('/babybeast_sleep.gif');
  };

  const play = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 20),
      hunger: Math.max(0, prev.hunger - 10),
    }));
    setCurrentImage('/babybeast_play.gif');
    setTimeout(() => setCurrentImage('/babybeast_happy.gif'), 3000);
  };

  const clean = () => {
    setStats(prev => ({
      ...prev,
      hygiene: Math.min(100, prev.hygiene + 40),
      happiness: Math.min(100, prev.happiness + 10),
    }));
    setCurrentImage('/babybeast_shower.gif');
    setTimeout(() => setCurrentImage('/babybeast_happy.gif'), 3000);
  };

  const wakeUp = () => {
    setCurrentImage('/babybeast_happy.gif');
  };

  const restart = () => {
    setStats({
      hunger: 100,
      energy: 100,
      happiness: 100,
      hygiene: 100,
    });
    setIsAlive(true);
    setAge(0);
    setCurrentImage('/babybeast_happy.gif');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white">
            {isAlive ? (
              <>
                <span className="text-[#e4a101]">BABYBEAST</span>: {Math.floor(age / 20)} days
              </>
            ) : (
              '☠️ GAME OVER'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Centered Tamagotchi Image */}
            <div className="flex justify-center mb-4">
              <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button 
                onClick={feed} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded"
              >
                <Pizza className="w-4 h-4" /> Feed
              </button>
              <button 
                onClick={sleep} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded"
              >
                <Coffee className="w-4 h-4" /> Sleep
              </button>
              <button 
                onClick={play} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded"
              >
                <Gamepad2 className="w-4 h-4" /> Play
              </button>
              <button 
                onClick={clean} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded"
              >
                <Bath className="w-4 h-4" /> Clean
              </button>
  
              <button 
                onClick={wakeUp} 
                disabled={!isAlive} 
                className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded"
              >
                <Sun className="w-4 h-4" /> Wake Up
              </button>
  
              <button onClick={openMiniGame} className="flex items-center gap-2 bg-[#370001] border border-[#e4a101] text-white hover:bg-[#5b0003] py-2 px-4 rounded" disabled={!isAlive}>
                <Gamepad className="w-4 h-4" /> Mini Game
              </button>
            </div>
  
            {!isAlive && (
              <button 
                onClick={restart}
                className="w-full mt-4 bg-[#e4a101] border border-[#370001] text-[#370001] hover:bg-[#f5b51a] py-2 px-4 rounded"
              >
                Restart Game
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TamagotchiDashboard;
