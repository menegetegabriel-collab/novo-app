'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkoutProgress, completeDay } from '@/lib/storage';
import { workoutPlans } from '@/lib/workoutData';
import { Exercise } from '@/lib/types';
import { Play, Pause, SkipForward, Check, X } from 'lucide-react';

export default function WorkoutPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(getWorkoutProgress());
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentPlan = workoutPlans.find(p => p.id === progress?.planId);
  const currentDayWorkout = currentPlan?.days.find(d => d.day === progress?.currentDay);
  const exercises = currentDayWorkout?.exercises || [];
  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    if (!progress || !currentPlan) {
      router.push('/');
      return;
    }

    if (currentExercise && !isPlaying) {
      setTimeRemaining(currentExercise.duration);
    }
  }, [progress, currentPlan, currentExercise, isPlaying, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining]);

  const handleExerciseComplete = () => {
    setIsPlaying(false);

    if (currentSet < (currentExercise.sets || 1)) {
      // Próxima série - tempo de descanso
      setIsResting(true);
      setTimeRemaining(currentExercise.restTime);
      setCurrentSet(currentSet + 1);
      setTimeout(() => {
        setIsResting(false);
        setTimeRemaining(currentExercise.duration);
      }, currentExercise.restTime * 1000);
    } else {
      // Próximo exercício
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSet(1);
        setShowInstructions(true);
      } else {
        handleWorkoutComplete();
      }
    }
  };

  const handleWorkoutComplete = () => {
    if (!progress || !currentDayWorkout) return;

    const totalCalories = currentDayWorkout.totalCalories;
    const totalMinutes = Math.round(currentDayWorkout.totalDuration / 60);

    completeDay(progress.currentDay, totalCalories, totalMinutes);
    router.push('/progress?completed=true');
  };

  const handleSkip = () => {
    setIsPlaying(false);
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setShowInstructions(true);
    } else {
      handleWorkoutComplete();
    }
  };

  const handleQuit = () => {
    if (confirm('Tem certeza que deseja sair do treino?')) {
      router.push('/');
    }
  };

  const startExercise = () => {
    setShowInstructions(false);
    setIsPlaying(true);
  };

  if (!currentExercise) {
    return null;
  }

  const progressPercentage = ((currentExerciseIndex + 1) / exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Dia {progress?.currentDay}</h1>
              <p className="text-blue-200 text-sm">
                Exercício {currentExerciseIndex + 1} de {exercises.length}
              </p>
            </div>
            <button
              onClick={handleQuit}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-6">
        {showInstructions ? (
          // Instructions Screen
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
            <div className="text-6xl mb-4">{currentPlan?.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
            <p className="text-blue-200 mb-6">{currentExercise.description}</p>

            <div className="bg-white/10 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-3xl font-bold text-orange-400">{currentExercise.duration}s</div>
                  <div className="text-sm text-gray-300">Duração</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">{currentExercise.sets}</div>
                  <div className="text-sm text-gray-300">Séries</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-400">{currentExercise.calories}</div>
                  <div className="text-sm text-gray-300">Calorias</div>
                </div>
              </div>

              <div className="text-left space-y-3">
                <h3 className="font-bold text-lg mb-3">Como fazer:</h3>
                {currentExercise.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-200">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={startExercise}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg"
            >
              <Play className="w-6 h-6" fill="white" />
              Começar Exercício
            </button>
          </div>
        ) : (
          // Exercise Timer Screen
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center">
            {isResting ? (
              <>
                <div className="text-2xl font-bold mb-4 text-blue-300">Descanso</div>
                <div className="text-8xl font-bold mb-4 text-blue-400">{timeRemaining}s</div>
                <p className="text-gray-300">Prepare-se para a próxima série</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-2">{currentExercise.name}</h2>
                <p className="text-blue-200 mb-6">
                  Série {currentSet} de {currentExercise.sets}
                </p>

                {/* Timer Circle */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="128"
                      cy="128"
                      r="120"
                      stroke="url(#gradient)"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 120}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 120 * (1 - timeRemaining / currentExercise.duration)
                      }`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold">{timeRemaining}s</div>
                  </div>
                </div>

                {currentExercise.reps && (
                  <div className="bg-white/10 rounded-2xl p-4 mb-6">
                    <p className="text-lg">
                      <span className="font-bold text-orange-400">{currentExercise.reps}</span> repetições
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Controls */}
            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={isResting}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" fill="white" />
                )}
              </button>

              <button
                onClick={handleSkip}
                className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <SkipForward className="w-8 h-8" />
              </button>

              {currentExerciseIndex === exercises.length - 1 && currentSet === currentExercise.sets && (
                <button
                  onClick={handleWorkoutComplete}
                  className="px-6 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all font-bold"
                >
                  <Check className="w-6 h-6" />
                  Finalizar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
