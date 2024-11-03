import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Gamepad } from "lucide-react";

interface PlatformGameProps {
    isOpen: boolean;
    onClose: () => void;
  }

interface Platform {
  x: number;
  y: number;
  width: number;
}

interface GameState {
  playerX: number;
  playerY: number;
  velocityY: number;
  platforms: Platform[];
  score: number;
  gameOver: boolean;
}

const PlatformGame: React.FC<PlatformGameProps> = ({ isOpen, onClose }) => {
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShowInstructions(true);
      reset();
    }
  }, [isOpen]);

  const startGame = () => {
    setShowInstructions(false);
    reset();
  };

  const [gameState, setGameState] = useState<GameState>({
    playerX: 50,
    playerY: 300,
    velocityY: 0,
    platforms: [
      // Plataforma inicial más ancha
      { x: 0, y: 350, width: 200 },
      // Plataformas más cercanas entre sí
      { x: 250, y: 300, width: 100 },
      { x: 400, y: 250, width: 100 },
      { x: 550, y: 300, width: 100 },
    ],
    score: 0,
    gameOver: false
  });

  const GRAVITY = 0.5;
  const JUMP_FORCE = -10;
  const MOVE_SPEED = 5;
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const PLAYER_SIZE = 40;
  
  // Configuración de generación de plataformas
  const PLATFORM_MIN_DISTANCE = 120; // Distancia mínima entre plataformas
  const PLATFORM_MAX_DISTANCE = 180; // Distancia máxima entre plataformas
  const PLATFORM_MIN_HEIGHT = 200; // Altura mínima de las plataformas
  const PLATFORM_MAX_HEIGHT = 320; // Altura máxima de las plataformas

  const reset = () => {
    setGameState({
      playerX: 50,
      playerY: 300,
      velocityY: 0,
      platforms: [
        // Plataforma inicial más ancha
        { x: 0, y: 350, width: 200 },
        // Plataformas más cercanas entre sí
        { x: 250, y: 300, width: 100 },
        { x: 400, y: 250, width: 100 },
        { x: 550, y: 300, width: 100 },
      ],
      score: 0,
      gameOver: false
    });
  };

  const checkCollision = useCallback((x: number, y: number, platform: Platform) => {
    return (
      x < platform.x + platform.width &&
      x + PLAYER_SIZE > platform.x &&
      y + PLAYER_SIZE > platform.y &&
      y + PLAYER_SIZE < platform.y + 20
    );
  }, []);

  const generateNewPlatform = (lastPlatformX: number): Platform => {
    // Calcula una distancia aleatoria dentro del rango definido
    const distance = Math.random() * (PLATFORM_MAX_DISTANCE - PLATFORM_MIN_DISTANCE) + PLATFORM_MIN_DISTANCE;
    // Calcula una altura aleatoria dentro del rango definido
    const height = Math.random() * (PLATFORM_MAX_HEIGHT - PLATFORM_MIN_HEIGHT) + PLATFORM_MIN_HEIGHT;
    
    return {
      x: lastPlatformX + distance,
      y: height,
      width: 100
    };
  };

  const gameLoop = useCallback(() => {
    if (!isOpen || gameState.gameOver) return;

    setGameState(prev => {
      let newX = prev.playerX;
      let newY = prev.playerY;
      let newVelocityY = prev.velocityY;
      let onPlatform = false;

      // Apply gravity
      newVelocityY += GRAVITY;
      newY += newVelocityY;

      // Check platform collisions
      prev.platforms.forEach(platform => {
        if (checkCollision(newX, newY, platform)) {
          newY = platform.y - PLAYER_SIZE;
          newVelocityY = 0;
          onPlatform = true;
        }
      });

      // Check game over
      if (newY > GAME_HEIGHT) {
        return { ...prev, gameOver: true };
      }

      // Move platforms left and generate new ones
      const newPlatforms = prev.platforms
        .map(platform => ({ ...platform, x: platform.x - 2 }))
        .filter(platform => platform.x + platform.width > -50); // Permitimos que las plataformas salgan un poco más allá del borde

      // Genera nueva plataforma cuando sea necesario
      if (newPlatforms.length < 4) {
        const lastPlatform = newPlatforms[newPlatforms.length - 1];
        newPlatforms.push(generateNewPlatform(lastPlatform.x));
      }

      return {
        ...prev,
        playerY: newY,
        playerX: newX,
        velocityY: newVelocityY,
        platforms: newPlatforms,
        score: prev.score + 1
      };
    });
  }, [isOpen, gameState.gameOver, checkCollision]);

  useEffect(() => {
    const interval = setInterval(gameLoop, 1000 / 60);
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen || gameState.gameOver) return;

      setGameState(prev => {
        let newX = prev.playerX;
        let newVelocityY = prev.velocityY;

        switch (e.key) {
          case ' ':
          case 'ArrowUp':
            if (prev.velocityY === 0) {
              newVelocityY = JUMP_FORCE;
            }
            break;
          case 'ArrowLeft':
            newX = Math.max(0, prev.playerX - MOVE_SPEED);
            break;
          case 'ArrowRight':
            newX = Math.min(GAME_WIDTH - PLAYER_SIZE, prev.playerX + MOVE_SPEED);
            break;
        }

        return {
          ...prev,
          playerX: newX,
          velocityY: newVelocityY
        };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, gameState.gameOver]);

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
        className="sm:max-w-[700px]" 
        style={{
          borderRadius: "25px",
          borderWidth: "3px",
          borderColor: "#e4a101",
          backgroundColor: "#1b1b1b",
          color: "var(--main-bg-color)",
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-white"
          style={{ color: "#ffffff" }} // X color set to white
        >
          ✖
        </button>
          {showInstructions ? (
            <div className="text-white p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-bold mb-2" style={{ color: '#e4a101' }}>Instructions</h2>
              <p>- Use the left (←) and right (→) arrow keys to move horizontally.</p>
              <p>- Press the space bar (or the up arrow ↑) to jump.</p>
              <p>- Try to keep the character on the platforms to avoid falling.</p>
              <p>- As you progress, your score will increase automatically.</p>
              <p>- Avoid falling off the screen to prevent losing the game!</p>
              <Button onClick={startGame} className="mt-4">
                Start Game
              </Button>
            </div>
          ) : (
            <div className="relative w-[600px] h-[400px] bg-gray-900 overflow-hidden">
              {/* Score */}
              <div className="absolute top-4 right-4 text-white text-xl">
                Score: {gameState.score}
              </div>

              {/* Player */}
              <img
                src="/babybeast_happy.gif"
                alt="Player"
                className="absolute"
                style={{
                  width: `${PLAYER_SIZE}px`,
                  height: `${PLAYER_SIZE}px`,
                  left: `${gameState.playerX}px`,
                  top: `${gameState.playerY}px`,
                }}
              />

              {/* Platforms */}
              {gameState.platforms.map((platform, index) => (
                <div
                  key={index}
                  className="absolute bg-green-500 rounded"
                  style={{
                    left: `${platform.x}px`,
                    top: `${platform.y}px`,
                    width: `${platform.width}px`,
                    height: '10px',
                  }}
                />
              ))}

              {/* Game Over Screen */}
              {gameState.gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                  <h2 className="text-white text-2xl mb-4">☠️ GAME OVER!</h2>
                  <p className="text-white mb-4">Score: {gameState.score}</p>
                  <Button onClick={reset}>Play Again</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
};

export default PlatformGame;