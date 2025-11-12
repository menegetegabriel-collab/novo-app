'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserProfile, clearAllData, saveTheme, getTheme, getDailyReminder, saveDailyReminder } from '@/lib/storage';
import { UserProfile, DailyReminder } from '@/lib/types';
import { ArrowLeft, User, Bell, Moon, Sun, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [reminder, setReminder] = useState<DailyReminder>({
    enabled: true,
    time: '18:00',
    message: 'Hora do seu treino! 💪'
  });

  useEffect(() => {
    const userProfile = getUserProfile();
    if (!userProfile?.onboardingCompleted) {
      router.push('/onboarding');
      return;
    }

    setProfile(userProfile);
    setThemeState(getTheme());
    setReminder(getDailyReminder());
  }, [router]);

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    saveTheme(newTheme);
  };

  const handleReminderToggle = () => {
    const newReminder = { ...reminder, enabled: !reminder.enabled };
    setReminder(newReminder);
    saveDailyReminder(newReminder);
  };

  const handleReminderTimeChange = (time: string) => {
    const newReminder = { ...reminder, time };
    setReminder(newReminder);
    saveDailyReminder(newReminder);
  };

  const handleResetData = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      clearAllData();
      router.push('/onboarding');
    }
  };

  if (!profile) return null;

  const bmi = (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-20">
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
            <h1 className="text-3xl font-bold">Perfil</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl">
                {profile.gender === 'male' ? '👨' : profile.gender === 'female' ? '👩' : '🧑'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-blue-100">{profile.age} anos</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{profile.weight}kg</div>
                <div className="text-xs text-blue-100">Peso</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{profile.height}cm</div>
                <div className="text-xs text-blue-100">Altura</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{bmi}</div>
                <div className="text-xs text-blue-100">IMC</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 -mt-8">
        {/* User Info */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Informações
          </h2>
          <div className="space-y-3">
            <InfoRow label="Nível" value={
              profile.level === 'beginner' ? 'Iniciante' :
              profile.level === 'intermediate' ? 'Intermediário' : 'Avançado'
            } />
            <InfoRow label="Objetivo" value={
              profile.goal === 'lose_weight' ? 'Emagrecer' :
              profile.goal === 'tone' ? 'Definir' : 'Ganhar Massa'
            } />
            <InfoRow label="Gênero" value={
              profile.gender === 'male' ? 'Masculino' :
              profile.gender === 'female' ? 'Feminino' : 'Outro'
            } />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-orange-600" />
            Lembretes
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-800">Notificações Diárias</div>
                <div className="text-sm text-gray-600">Receba lembretes para treinar</div>
              </div>
              <button
                onClick={handleReminderToggle}
                className={`w-14 h-8 rounded-full transition-colors ${
                  reminder.enabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                    reminder.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {reminder.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário do Lembrete
                </label>
                <input
                  type="time"
                  value={reminder.time}
                  onChange={(e) => handleReminderTimeChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Aparência</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-800">Tema Escuro</div>
              <div className="text-sm text-gray-600">Ativar modo escuro</div>
            </div>
            <button
              onClick={handleThemeToggle}
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <Trash2 className="w-6 h-6" />
            Zona de Perigo
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/onboarding')}
              className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Refazer Onboarding
            </button>
            <button
              onClick={handleResetData}
              className="w-full py-3 px-6 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Resetar Todos os Dados
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Fit 30 - Versão 1.0.0</p>
          <p className="mt-1">30 dias para transformar seu corpo e sua mente 💪</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
