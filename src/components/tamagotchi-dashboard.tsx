import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Heart, Pizza, Coffee, Bath, Gamepad2, Sun } from 'lucide-react';

// Define the structure of stats with an interface
interface Stats {
  hunger: number;
  energy: number;
  happiness: number;
  hygiene: number;
}

// Main component for the Tamagotchi dashboard
const TamagotchiDashboard = () => {
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

  const showAnimationWithoutTimer = (gifPath: string) => {
    setCurrentImage(gifPath);
  };

  const showAnimation = (gifPath: string) => {
    setCurrentImage(gifPath);
    setTimeout(() => {
      setCurrentImage('/babybeast_happy.gif');
    }, 3000);
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
                <span style={{ color: '#e4a101' }}>BABYBEAST</span>: {Math.floor(age / 20)} days
              </>
            ) : (
              '☠️ GAME OVER'
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-center mb-4">
              <img src={currentImage} alt="Tamagotchi" className="w-40 h-40" />
            </div>

            {/* Progress bars (no changes) */}
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-500" />
              <Progress value={stats.hunger} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.hunger)}%</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Coffee className="text-yellow-600" />
              <Progress value={stats.energy} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.energy)}%</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="text-green-500" />
              <Progress value={stats.happiness} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.happiness)}%</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Bath className="text-blue-500" />
              <Progress value={stats.hygiene} />
              <span className="w-12 text-right font-medium text-white">{Math.round(stats.hygiene)}%</span>
            </div>

            {/* Action buttons with enhanced styles */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {['Feed', 'Sleep', 'Play', 'Clean', 'Wake Up'].map((action, index) => (
                <Button
                  key={action}
                  onClick={() => {
                    if (action === 'Feed') feed();
                    else if (action === 'Sleep') sleep();
                    else if (action === 'Play') play();
                    else if (action === 'Clean') clean();
                    else if (action === 'Wake Up') wakeUp();
                  }}
                  disabled={!isAlive}
                  className={`bg-[#370001] border-2 border-[#e4a101] text-white font-semibold 
                              rounded-full py-3 px-6 hover:bg-[#5a0002] 
                              focus:outline-none focus:ring-2 focus:ring-[#e4a101] 
                              disabled:opacity-50 transition-transform transform hover:scale-105`}
                >
                  {action === 'Feed' && <Pizza className="w-4 h-4 mr-2" />}
                  {action === 'Sleep' && <Coffee className="w-4 h-4 mr-2" />}
                  {action === 'Play' && <Gamepad2 className="w-4 h-4 mr-2" />}
                  {action === 'Clean' && <Bath className="w-4 h-4 mr-2" />}
                  {action === 'Wake Up' && <Sun className="w-4 h-4 mr-2" />} 
                  {action}
                </Button>
              ))}
            </div>

            {!isAlive && (
              <Button 
                onClick={restart}
                className="w-full mt-4 bg-[#e4a101] border-2 border-[#370001] text-[#370001] py-2 rounded-lg hover:bg-[#e4a101]/90 focus:outline-none focus:ring-2 focus:ring-[#370001] transition"
              >
                Restart Game
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TamagotchiDashboard;
