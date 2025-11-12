'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getWorkoutProgress, getUserProfile } from '@/lib/storage';
import { workoutPlans } from '@/lib/workoutData';
import { WorkoutProgress } from '@/lib/types';
import { TrendingUp, Calendar, Flame, Award, ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const workoutProgress = getWorkoutProgress();
    const userProfile = getUserProfile();

    if (!userProfile?.onboardingCompleted || !workoutProgress) {
      router.push('/');
      return;
    }

    setProgress(workoutProgress);

    if (searchParams.get('completed') === 'true') {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [router, searchParams]);

  if (!progress) return null;

  const currentPlan = workoutPlans.find(p => p.id === progress.planId);
  const completionRate = Math.round((progress.completedDays.length / 30) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-md animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Parabéns!</h2>
            <p className="text-gray-600 text-lg">Você completou mais um dia de treino!</p>
            <div className="mt-6 flex gap-4 justify-center">
              <div className="bg-orange-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-orange-600">+{currentPlan?.days[progress.currentDay - 2]?.totalCalories || 0}</div>
                <div className="text-xs text-gray-600">Calorias</div>
              </div>
              <div className="bg-blue-100 rounded-2xl p-4">
                <div className="text-2xl font-bold text-blue-600">{progress.streak}</div>
                <div className="text-xs text-gray-600">Dias Seguidos</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 sm:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Seu Progresso</h1>
              <p className="text-blue-100">{currentPlan?.name}</p>
            </div>
          </div>

          {/* Completion Circle */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-between">
            <div className="flex-1">
              <div className="text-5xl font-bold mb-2">{completionRate}%</div>
              <p className="text-blue-100">
                {progress.completedDays.length} de 30 dias completos
              </p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Flame className="w-6 h-6" />}
            value={progress.streak}
            label="Sequência"
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6" />}
            value={progress.completedDays.length}
            label="Dias Completos"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            value={progress.totalCaloriesBurned}
            label="Calorias"
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={<Award className="w-6 h-6" />}
            value={Math.round(progress.totalMinutesTrained)}
            label="Minutos"
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Calendário de 30 Dias
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isCompleted = progress.completedDays.includes(day);
              const isCurrent = day === progress.currentDay;
              const isRestDay = currentPlan?.days.find(d => d.day === day)?.restDay;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                      : isCurrent
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg ring-4 ring-blue-200'
                      : isRestDay
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : day}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded" />
              <span className="text-gray-600">Completo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded" />
              <span className="text-gray-600">Atual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded" />
              <span className="text-gray-600">Pendente</span>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {progress.achievements.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-600" />
              Conquistas
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {progress.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="text-4xl">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
