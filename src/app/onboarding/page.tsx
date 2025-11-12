'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, saveUserProfile } from '@/lib/storage';
import { UserProfile, Gender, FitnessLevel, Goal } from '@/lib/types';
import { ArrowRight, User, Target, Activity } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as Gender,
    age: 25,
    weight: 70,
    height: 170,
    level: 'beginner' as FitnessLevel,
    goal: 'lose_weight' as Goal
  });

  useEffect(() => {
    const profile = getUserProfile();
    if (profile?.onboardingCompleted) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      onboardingCompleted: true
    };
    saveUserProfile(profile);
    router.push('/plans');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Fit 30</h1>
          <p className="text-blue-100 text-lg">30 dias para transformar seu corpo</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded-full mx-1 transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white text-center text-sm">Passo {step} de 3</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Step 1: Informações Básicas */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Sobre Você</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qual é o seu nome?
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Digite seu nome"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'male', label: 'Masculino', icon: '👨' },
                    { value: 'female', label: 'Feminino', icon: '👩' },
                    { value: 'other', label: 'Outro', icon: '🧑' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: option.value as Gender })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.gender === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.icon}</div>
                      <div className="text-xs font-medium text-gray-700">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Nível de Condicionamento */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Seu Nível</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: 'beginner',
                    label: 'Iniciante',
                    desc: 'Pouca ou nenhuma experiência com exercícios',
                    icon: '🌱'
                  },
                  {
                    value: 'intermediate',
                    label: 'Intermediário',
                    desc: 'Treino regular, 2-3 vezes por semana',
                    icon: '🔥'
                  },
                  {
                    value: 'advanced',
                    label: 'Avançado',
                    desc: 'Treino intenso, 4+ vezes por semana',
                    icon: '⚡'
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, level: option.value as FitnessLevel })}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      formData.level === option.value
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Objetivo */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Seu Objetivo</h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: 'lose_weight',
                    label: 'Emagrecer',
                    desc: 'Perder peso e queimar gordura',
                    icon: '🔥'
                  },
                  {
                    value: 'tone',
                    label: 'Definir',
                    desc: 'Tonificar músculos e definir o corpo',
                    icon: '💎'
                  },
                  {
                    value: 'gain_muscle',
                    label: 'Ganhar Massa',
                    desc: 'Aumentar massa muscular',
                    icon: '💪'
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: option.value as Goal })}
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      formData.goal === option.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{option.icon}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800 mb-1">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={step === 1 && !formData.name}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {step === 3 ? 'Começar' : 'Continuar'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
