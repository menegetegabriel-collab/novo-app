// Tipos do aplicativo Fit 30

export type Gender = 'male' | 'female' | 'other';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'lose_weight' | 'tone' | 'gain_muscle';

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  weight: number;
  height: number;
  level: FitnessLevel;
  goal: Goal;
  createdAt: string;
  onboardingCompleted: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number; // em segundos
  reps?: number;
  sets?: number;
  restTime: number; // em segundos
  calories: number;
  muscleGroup: string;
  difficulty: FitnessLevel;
  instructions: string[];
  videoUrl?: string;
}

export interface DayWorkout {
  day: number;
  exercises: Exercise[];
  totalDuration: number;
  totalCalories: number;
  restDay: boolean;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number; // dias
  level: FitnessLevel;
  goal: Goal[];
  muscleGroups: string[];
  days: DayWorkout[];
  isPremium: boolean;
  color: string;
  icon: string;
}

export interface WorkoutProgress {
  userId: string;
  planId: string;
  currentDay: number;
  completedDays: number[];
  startDate: string;
  lastWorkoutDate?: string;
  streak: number;
  totalCaloriesBurned: number;
  totalMinutesTrained: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface DailyReminder {
  enabled: boolean;
  time: string; // formato HH:mm
  message: string;
}
