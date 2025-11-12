'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, getWorkoutProgress, calculateProgress } from '@/lib/storage';
import { workoutPlans, motivationalQuotes } from '@/lib/workoutData';
import { WorkoutProgress } from '@/lib/types';
import { Play, TrendingUp, Calendar, Award, Settings, Flame } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [progress, setProgress] = useState<WorkoutProgress | null>(null);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (!userProfile?.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    const workoutProgress = getWorkoutProgress();
    if (!workoutProgress) {
      router.push('/plans');
      return;
    }

    setProgress(workoutProgress);
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, [userProfile, router]);

  if (!progress || !userProfile) {
    return null;
  }

  const currentPlan = workoutPlans.find(p => p.id === progress.planId);
  const progressPercentage = calculateProgress(progress.completedDays.length, 30);
  const currentDayWorkout = currentPlan?.days.find(d => d.day === progress.currentDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 sm:p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                Olá, {userProfile.name}! 👋
              </h1>
              <p className="text-blue-100">Pronto para treinar hoje?</p>
            </div>
            <Link
              href="/profile"
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Settings className="w-6 h-6" />
            </Link>
          </div>

          {/* Motivational Quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <p className="text-white text-center font-medium">{quote}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 -mt-8">
        {/* Current Plan Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{currentPlan?.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">{currentPlan?.name}</h2>
              </div>
              <p className="text-gray-600">Dia {progress.currentDay} de 30</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{progressPercentage}%</div>
              <p className="text-sm text-gray-600">Completo</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Today's Workout Button */}
          {currentDayWorkout && !currentDayWorkout.restDay ? (
            <Link
              href="/workout"
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Play className="w-6 h-6" fill="white" />
              Começar Treino de Hoje
            </Link>
          ) : (
            <div className="w-full bg-green-100 text-green-800 py-4 px-6 rounded-2xl font-bold text-lg text-center">
              🎉 Dia de Descanso - Você merece!
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            value={progress.streak}
            label="Dias Seguidos"
            color="orange"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-blue-500" />}
            value={progress.completedDays.length}
            label="Dias Completos"
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
            value={progress.totalCaloriesBurned}
            label="Calorias"
            color="green"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-purple-500" />}
            value={progress.achievements.length}
            label="Conquistas"
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/progress"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Ver Progresso</h3>
                <p className="text-sm text-gray-600">Estatísticas e calendário</p>
              </div>
            </div>
          </Link>

          <Link
            href="/plans"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Mudar Plano</h3>
                <p className="text-sm text-gray-600">Escolher novo desafio</p>
              </div>
            </div>
          </Link>
        </div>
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
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center mb-2`}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}
