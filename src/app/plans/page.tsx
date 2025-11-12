'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { workoutPlans } from '@/lib/workoutData';
import { getUserProfile, initializeWorkoutProgress } from '@/lib/storage';
import { WorkoutPlan } from '@/lib/types';
import { ArrowRight, Lock, Check } from 'lucide-react';

export default function PlansPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile?.onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [userProfile, router]);

  const handleSelectPlan = (planId: string) => {
    if (!userProfile) return;
    
    const plan = workoutPlans.find(p => p.id === planId);
    if (plan?.isPremium) {
      alert('Este plano está disponível apenas na versão Premium! 🔒');
      return;
    }

    initializeWorkoutProgress(userProfile.id, planId);
    router.push('/');
  };

  const getRecommendedPlans = () => {
    if (!userProfile) return workoutPlans;
    
    return workoutPlans.filter(plan => 
      plan.goal.includes(userProfile.goal) && 
      plan.level === userProfile.level
    );
  };

  const recommendedPlans = getRecommendedPlans();
  const otherPlans = workoutPlans.filter(p => !recommendedPlans.includes(p));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Escolha Seu Desafio</h1>
          <p className="text-blue-100">Selecione um plano de 30 dias para começar</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 -mt-8">
        {/* Recommended Plans */}
        {recommendedPlans.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Recomendado para Você</h2>
              </div>
              <p className="text-gray-600 text-sm">
                Baseado no seu perfil: {userProfile?.level === 'beginner' ? 'Iniciante' : userProfile?.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {recommendedPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                  onStart={() => handleSelectPlan(plan.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Plans */}
        {otherPlans.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Outros Planos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {otherPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                  onStart={() => handleSelectPlan(plan.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanCard({
  plan,
  isSelected,
  onSelect,
  onStart
}: {
  plan: WorkoutPlan;
  isSelected: boolean;
  onSelect: () => void;
  onStart: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
        isSelected ? 'ring-4 ring-blue-500' : ''
      }`}
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${plan.color} p-6 text-white`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-4xl">{plan.icon}</span>
          {plan.isPremium && (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              <span className="text-xs font-semibold">Premium</span>
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
        <p className="text-sm text-white/90">{plan.description}</p>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">📅 Duração:</span>
            <span>{plan.duration} dias</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">💪 Nível:</span>
            <span className="capitalize">
              {plan.level === 'beginner' ? 'Iniciante' : plan.level === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold">🎯 Foco:</span>
            <span>{plan.muscleGroups.join(', ')}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          disabled={plan.isPremium}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            plan.isPremium
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
          }`}
        >
          {plan.isPremium ? (
            <>
              <Lock className="w-5 h-5" />
              Assinar Premium
            </>
          ) : (
            <>
              Começar Agora
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
