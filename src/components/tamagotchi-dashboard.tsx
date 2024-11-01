import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Heart, Pizza, Coffee, Bath, Gamepad2 } from 'lucide-react';

interface Stats {
  hunger: number;
  energy: number;
  happiness: number;
  hygiene: number;
}

const TamagotchiDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    hunger: 100,
    energy: 100,
    happiness: 100,
    hygiene: 100,
  });

  const [isAlive, setIsAlive] = useState(true);
  const [age, setAge] = useState(0);

  // Disminuye las estadísticas con el tiempo
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

  // Verifica si el Tamagotchi muere
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
  };

  const sleep = () => {
    setStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 40),
      happiness: Math.min(100, prev.happiness + 10),
    }));
  };

  const play = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 30),
      energy: Math.max(0, prev.energy - 20),
      hunger: Math.max(0, prev.hunger - 10),
    }));
  };

  const clean = () => {
    setStats(prev => ({
      ...prev,
      hygiene: Math.min(100, prev.hygiene + 40),
      happiness: Math.min(100, prev.happiness + 10),
    }));
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
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {isAlive ? 'Mi Tamagotchi' : '☠️ Game Over'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center mb-4 text-lg font-medium">
              Edad: {Math.floor(age / 20)} días
            </div>
            
            {/* Barra de Hambre */}
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-500" />
              <Progress value={stats.hunger} />
              <span className="w-12 text-right font-medium">{Math.round(stats.hunger)}%</span>
            </div>

            {/* Barra de Energía */}
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="text-yellow-600" />
              <Progress value={stats.energy} />
              <span className="w-12 text-right font-medium">{Math.round(stats.energy)}%</span>
            </div>

            {/* Barra de Felicidad */}
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="text-green-500" />
              <Progress value={stats.happiness} />
              <span className="w-12 text-right font-medium">{Math.round(stats.happiness)}%</span>
            </div>

            {/* Barra de Higiene */}
            <div className="flex items-center gap-2 mb-2">
              <Bath className="text-blue-500" />
              <Progress value={stats.hygiene} />
              <span className="w-12 text-right font-medium">{Math.round(stats.hygiene)}%</span>
            </div>

            {/* Botones de Acción */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                onClick={feed} 
                disabled={!isAlive}
                className="flex items-center gap-2"
              >
                <Pizza className="w-4 h-4" /> Alimentar
              </Button>
              <Button 
                onClick={sleep} 
                disabled={!isAlive}
                className="flex items-center gap-2"
              >
                <Coffee className="w-4 h-4" /> Dormir
              </Button>
              <Button 
                onClick={play} 
                disabled={!isAlive}
                className="flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" /> Jugar
              </Button>
              <Button 
                onClick={clean} 
                disabled={!isAlive}
                className="flex items-center gap-2"
              >
                <Bath className="w-4 h-4" /> Limpiar
              </Button>
            </div>

            {/* Botón de Reinicio */}
            {!isAlive && (
              <Button 
                onClick={restart}
                className="w-full mt-4"
              >
                Reiniciar Juego
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TamagotchiDashboard;