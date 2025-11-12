import { UserProfile, WorkoutProgress, DailyReminder } from './types';

// Chaves do localStorage
const KEYS = {
  USER_PROFILE: 'fit30_user_profile',
  WORKOUT_PROGRESS: 'fit30_workout_progress',
  DAILY_REMINDER: 'fit30_daily_reminder',
  THEME: 'fit30_theme'
};

// User Profile
export function saveUserProfile(profile: UserProfile): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  }
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
}

export function clearUserProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(KEYS.USER_PROFILE);
  }
}

// Workout Progress
export function saveWorkoutProgress(progress: WorkoutProgress): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.WORKOUT_PROGRESS, JSON.stringify(progress));
  }
}

export function getWorkoutProgress(): WorkoutProgress | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.WORKOUT_PROGRESS);
  return data ? JSON.parse(data) : null;
}

export function updateWorkoutProgress(updates: Partial<WorkoutProgress>): void {
  const current = getWorkoutProgress();
  if (current) {
    saveWorkoutProgress({ ...current, ...updates });
  }
}

export function completeDay(day: number, caloriesBurned: number, minutesTrained: number): void {
  const progress = getWorkoutProgress();
  if (!progress) return;

  const completedDays = [...new Set([...progress.completedDays, day])].sort((a, b) => a - b);
  const today = new Date().toISOString().split('T')[0];
  const lastWorkout = progress.lastWorkoutDate;
  
  // Calcular streak
  let newStreak = progress.streak;
  if (lastWorkout) {
    const lastDate = new Date(lastWorkout);
    const currentDate = new Date(today);
    const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  saveWorkoutProgress({
    ...progress,
    currentDay: day + 1,
    completedDays,
    lastWorkoutDate: today,
    streak: newStreak,
    totalCaloriesBurned: progress.totalCaloriesBurned + caloriesBurned,
    totalMinutesTrained: progress.totalMinutesTrained + minutesTrained
  });
}

export function initializeWorkoutProgress(userId: string, planId: string): void {
  const progress: WorkoutProgress = {
    userId,
    planId,
    currentDay: 1,
    completedDays: [],
    startDate: new Date().toISOString(),
    streak: 0,
    totalCaloriesBurned: 0,
    totalMinutesTrained: 0,
    achievements: []
  };
  saveWorkoutProgress(progress);
}

// Daily Reminder
export function saveDailyReminder(reminder: DailyReminder): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.DAILY_REMINDER, JSON.stringify(reminder));
  }
}

export function getDailyReminder(): DailyReminder {
  if (typeof window === 'undefined') {
    return { enabled: true, time: '18:00', message: 'Hora do seu treino! 💪' };
  }
  const data = localStorage.getItem(KEYS.DAILY_REMINDER);
  return data ? JSON.parse(data) : { enabled: true, time: '18:00', message: 'Hora do seu treino! 💪' };
}

// Theme
export function saveTheme(theme: 'light' | 'dark'): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(KEYS.THEME, theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
}

export function getTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const theme = localStorage.getItem(KEYS.THEME) as 'light' | 'dark' | null;
  return theme || 'light';
}

// Utility functions
export function calculateProgress(completedDays: number, totalDays: number): number {
  return Math.round((completedDays / totalDays) * 100);
}

export function isOnboardingComplete(): boolean {
  const profile = getUserProfile();
  return profile?.onboardingCompleted || false;
}

export function hasActiveWorkout(): boolean {
  return getWorkoutProgress() !== null;
}

export function clearAllData(): void {
  if (typeof window !== 'undefined') {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
  }
}
