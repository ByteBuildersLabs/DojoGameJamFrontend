import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import PlatformGame from './mini-game';
import { Heart, Pizza, Coffee, Bath, Gamepad2, Sun, Gamepad} from 'lucide-react';

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
  const [isPlatformGameOpen, setIsPlatformGameOpen] = useState(false);

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
      showDeathAnimation();
    }
  }, [stats]);

  const handleOpenPlatformGame = () => {
    setIsPlatformGameOpen(true);
  };

  const handleClosePlatformGame = () => {
    setIsPlatformGameOpen(false); 
  };

  const showAnimationWithoutTimer = (gifPath: string) => {
    setCurrentImage(gifPath);
  };

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath); 
    setTimeout(() => {
      setCurrentImage('/babybeast_happy.gif'); 
    }, 3000);
  };

  const showDeathAnimation = () => {
    setCurrentImage('/dead.gif');
  };

  const feed = () => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + 30), 
      energy: Math.min(100, prev.energy + 10), 
    }));
    showAnimation('/babybeast_eat.gif');
  };

  const sleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40), 
      happiness: Math.min(100, prev.happiness + 10), 
    }));
    showAnimationWithoutTimer('/babybeast_sleep.gif'); 
  };

  const play = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30), 
      energy: Math.max(0, prev.energy - 20), 
      hunger: Math.max(0, prev.hunger - 10), 
    }));
    showAnimation('/babybeast_play.gif');
  };

  const clean = () => {
    setStats(prev => ({
      ...prev,
      hygiene: Math.min(100, prev.hygiene + 40), 
      happiness: Math.min(100, prev.happiness + 10), 
    }));
    showAnimation('/babybeast_shower.gif'); 
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
    setAge(0); // Resets age
    setCurrentImage('/babybeast_happy.gif'); 
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white">
            {isAlive ? (
              <>
                <span style={{ color: '#e4a101' }}>BABYBEAST</span>: {Math.floor(age / 20)} days
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
            
            {/* Hunger Bar */}
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-500" />
              <Progress value={stats.hunger} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.hunger)}%</span>
            </div>
  
            {/* Energy Bar */}
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="text-yellow-600" />
              <Progress value={stats.energy} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.energy)}%</span>
            </div>
  
            {/* Happiness Bar */}
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="text-green-500" />
              <Progress value={stats.happiness} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.happiness)}%</span>
            </div>
  
            {/* Hygiene Bar */}
            <div className="flex items-center gap-2 mb-2">
              <Bath className="text-blue-500" />
              <Progress value={stats.hygiene} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.hygiene)}%</span>
            </div>
  
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={feed} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Pizza className="w-4 h-4" /> Feed
              </Button>
              <Button 
                onClick={sleep} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Coffee className="w-4 h-4" /> Sleep
              </Button>
              <Button 
                onClick={play} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Gamepad2 className="w-4 h-4" /> Play
              </Button>
              <Button 
                onClick={clean} 
                disabled={!isAlive}
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Bath className="w-4 h-4" /> Clean
              </Button>

              <Button 
                onClick={wakeUp} 
                disabled={!isAlive} 
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Sun className="w-4 h-4" /> Wake Up
              </Button>

              {/* New Button to Open Platform Game */}
              <Button 
                onClick={openMiniGame} 
                className="flex items-center gap-2 bg-[#370001] text-white border-[#e4a101] border-2 hover:bg-[#4a0001]" 
                disabled={!isAlive}
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                <Gamepad className="w-4 h-4" /> Mini Game
              </Button>
            </div>

            {/* Restart Button, appears when Tamagotchi is dead */}
            {!isAlive && (
              <Button 
                onClick={restart}
                className="w-full mt-4 bg-[#370001] text-[#e4a101] border-[#e4a101] border-2 hover:bg-[#4a0001] font-bold"
                style={{
                  backgroundColor: "#370001",
                  borderColor: "#e4a101",
                  borderWidth: "2px"
                }}
              >
                Restart Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
  
      {/* Modal for Platform Game */}
      {isPlatformGameOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg max-w-xl w-full relative">
            <PlatformGame isOpen={isPlatformGameOpen} onClose={handleClosePlatformGame} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TamagotchiDashboard;