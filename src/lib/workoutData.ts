import { WorkoutPlan, Exercise, DayWorkout } from './types';

// Exercícios base
const exercises: Record<string, Exercise> = {
  // Corpo Inteiro
  jumping_jacks: {
    id: 'jumping_jacks',
    name: 'Polichinelos',
    description: 'Exercício cardiovascular completo',
    duration: 30,
    reps: 30,
    sets: 3,
    restTime: 15,
    calories: 8,
    muscleGroup: 'Corpo Inteiro',
    difficulty: 'beginner',
    instructions: [
      'Fique em pé com os pés juntos',
      'Pule abrindo as pernas e levantando os braços',
      'Retorne à posição inicial',
      'Mantenha o ritmo constante'
    ]
  },
  burpees: {
    id: 'burpees',
    name: 'Burpees',
    description: 'Exercício de alta intensidade',
    duration: 45,
    reps: 15,
    sets: 3,
    restTime: 30,
    calories: 15,
    muscleGroup: 'Corpo Inteiro',
    difficulty: 'intermediate',
    instructions: [
      'Comece em pé',
      'Agache e apoie as mãos no chão',
      'Estenda as pernas para trás',
      'Faça uma flexão',
      'Volte à posição de agachamento',
      'Pule para cima com os braços estendidos'
    ]
  },
  mountain_climbers: {
    id: 'mountain_climbers',
    name: 'Escalador',
    description: 'Fortalece core e cardio',
    duration: 30,
    reps: 40,
    sets: 3,
    restTime: 20,
    calories: 10,
    muscleGroup: 'Corpo Inteiro',
    difficulty: 'intermediate',
    instructions: [
      'Posição de prancha alta',
      'Traga um joelho em direção ao peito',
      'Alterne as pernas rapidamente',
      'Mantenha o core contraído'
    ]
  },
  
  // Abdômen
  crunches: {
    id: 'crunches',
    name: 'Abdominais',
    description: 'Fortalece abdômen superior',
    duration: 30,
    reps: 20,
    sets: 3,
    restTime: 15,
    calories: 5,
    muscleGroup: 'Abdômen',
    difficulty: 'beginner',
    instructions: [
      'Deite de costas com joelhos dobrados',
      'Mãos atrás da cabeça',
      'Levante o tronco em direção aos joelhos',
      'Desça controladamente'
    ]
  },
  plank: {
    id: 'plank',
    name: 'Prancha',
    description: 'Fortalece core completo',
    duration: 60,
    sets: 3,
    restTime: 30,
    calories: 8,
    muscleGroup: 'Abdômen',
    difficulty: 'beginner',
    instructions: [
      'Apoie antebraços e pontas dos pés',
      'Corpo em linha reta',
      'Contraia abdômen e glúteos',
      'Mantenha a posição'
    ]
  },
  bicycle_crunches: {
    id: 'bicycle_crunches',
    name: 'Bicicleta',
    description: 'Trabalha oblíquos',
    duration: 45,
    reps: 30,
    sets: 3,
    restTime: 20,
    calories: 7,
    muscleGroup: 'Abdômen',
    difficulty: 'intermediate',
    instructions: [
      'Deite de costas, mãos atrás da cabeça',
      'Levante as pernas',
      'Leve cotovelo direito ao joelho esquerdo',
      'Alterne os lados em movimento de pedalada'
    ]
  },
  
  // Pernas e Glúteos
  squats: {
    id: 'squats',
    name: 'Agachamento',
    description: 'Fortalece pernas e glúteos',
    duration: 45,
    reps: 20,
    sets: 3,
    restTime: 20,
    calories: 10,
    muscleGroup: 'Pernas',
    difficulty: 'beginner',
    instructions: [
      'Pés na largura dos ombros',
      'Desça como se fosse sentar',
      'Joelhos não ultrapassam os pés',
      'Suba contraindo glúteos'
    ]
  },
  lunges: {
    id: 'lunges',
    name: 'Afundo',
    description: 'Trabalha pernas e equilíbrio',
    duration: 45,
    reps: 15,
    sets: 3,
    restTime: 20,
    calories: 9,
    muscleGroup: 'Pernas',
    difficulty: 'beginner',
    instructions: [
      'Dê um passo à frente',
      'Desça até joelho traseiro quase tocar o chão',
      'Joelho da frente a 90 graus',
      'Volte e alterne as pernas'
    ]
  },
  glute_bridge: {
    id: 'glute_bridge',
    name: 'Elevação de Quadril',
    description: 'Fortalece glúteos',
    duration: 45,
    reps: 20,
    sets: 3,
    restTime: 15,
    calories: 7,
    muscleGroup: 'Glúteos',
    difficulty: 'beginner',
    instructions: [
      'Deite de costas, joelhos dobrados',
      'Pés apoiados no chão',
      'Levante o quadril contraindo glúteos',
      'Desça controladamente'
    ]
  },
  
  // Braços e Peito
  push_ups: {
    id: 'push_ups',
    name: 'Flexões',
    description: 'Fortalece peito e braços',
    duration: 45,
    reps: 15,
    sets: 3,
    restTime: 30,
    calories: 10,
    muscleGroup: 'Peito',
    difficulty: 'intermediate',
    instructions: [
      'Posição de prancha alta',
      'Mãos na largura dos ombros',
      'Desça o corpo até quase tocar o chão',
      'Empurre para cima'
    ]
  },
  tricep_dips: {
    id: 'tricep_dips',
    name: 'Mergulho de Tríceps',
    description: 'Fortalece tríceps',
    duration: 45,
    reps: 15,
    sets: 3,
    restTime: 20,
    calories: 8,
    muscleGroup: 'Braços',
    difficulty: 'intermediate',
    instructions: [
      'Use uma cadeira ou banco',
      'Mãos apoiadas atrás de você',
      'Desça o corpo dobrando os cotovelos',
      'Empurre para cima'
    ]
  },
  arm_circles: {
    id: 'arm_circles',
    name: 'Círculos com Braços',
    description: 'Aquece e fortalece ombros',
    duration: 30,
    sets: 3,
    restTime: 10,
    calories: 5,
    muscleGroup: 'Braços',
    difficulty: 'beginner',
    instructions: [
      'Braços estendidos lateralmente',
      'Faça círculos pequenos',
      'Depois círculos maiores',
      'Inverta a direção'
    ]
  },
  
  // Cardio
  high_knees: {
    id: 'high_knees',
    name: 'Joelhos Altos',
    description: 'Cardio intenso',
    duration: 30,
    reps: 40,
    sets: 3,
    restTime: 15,
    calories: 10,
    muscleGroup: 'Cardio',
    difficulty: 'intermediate',
    instructions: [
      'Corra no lugar',
      'Levante os joelhos até a altura do quadril',
      'Mantenha ritmo acelerado',
      'Balance os braços'
    ]
  },
  butt_kicks: {
    id: 'butt_kicks',
    name: 'Chute nos Glúteos',
    description: 'Aquece pernas',
    duration: 30,
    reps: 40,
    sets: 3,
    restTime: 15,
    calories: 8,
    muscleGroup: 'Cardio',
    difficulty: 'beginner',
    instructions: [
      'Corra no lugar',
      'Leve os calcanhares até os glúteos',
      'Mantenha o ritmo',
      'Core contraído'
    ]
  }
};

// Função para gerar treinos progressivos
function generateProgressiveDays(
  baseExercises: Exercise[],
  totalDays: number,
  startLevel: 'beginner' | 'intermediate' | 'advanced'
): DayWorkout[] {
  const days: DayWorkout[] = [];
  
  for (let day = 1; day <= totalDays; day++) {
    // Dia de descanso a cada 7 dias
    if (day % 7 === 0) {
      days.push({
        day,
        exercises: [],
        totalDuration: 0,
        totalCalories: 0,
        restDay: true
      });
      continue;
    }
    
    // Aumenta intensidade progressivamente
    const progressMultiplier = 1 + (day / totalDays) * 0.5;
    const dayExercises = baseExercises.map(ex => ({
      ...ex,
      duration: Math.round(ex.duration * progressMultiplier),
      reps: ex.reps ? Math.round(ex.reps * progressMultiplier) : undefined,
      calories: Math.round(ex.calories * progressMultiplier)
    }));
    
    const totalDuration = dayExercises.reduce((sum, ex) => 
      sum + ex.duration + ex.restTime * (ex.sets || 1), 0
    );
    const totalCalories = dayExercises.reduce((sum, ex) => 
      sum + ex.calories * (ex.sets || 1), 0
    );
    
    days.push({
      day,
      exercises: dayExercises,
      totalDuration,
      totalCalories,
      restDay: false
    });
  }
  
  return days;
}

// Planos de treino
export const workoutPlans: WorkoutPlan[] = [
  {
    id: 'full_body',
    name: 'Corpo Inteiro',
    description: 'Treino completo para todo o corpo em 30 dias',
    duration: 30,
    level: 'beginner',
    goal: ['lose_weight', 'tone'],
    muscleGroups: ['Corpo Inteiro', 'Cardio'],
    isPremium: false,
    color: 'from-blue-500 to-cyan-500',
    icon: '💪',
    days: generateProgressiveDays([
      exercises.jumping_jacks,
      exercises.squats,
      exercises.push_ups,
      exercises.plank,
      exercises.lunges,
      exercises.mountain_climbers
    ], 30, 'beginner')
  },
  {
    id: 'abs_blast',
    name: 'Abdômen Definido',
    description: 'Foco total em abdômen e core',
    duration: 30,
    level: 'beginner',
    goal: ['tone', 'lose_weight'],
    muscleGroups: ['Abdômen', 'Core'],
    isPremium: false,
    color: 'from-orange-500 to-red-500',
    icon: '🔥',
    days: generateProgressiveDays([
      exercises.crunches,
      exercises.plank,
      exercises.bicycle_crunches,
      exercises.mountain_climbers,
      exercises.jumping_jacks
    ], 30, 'beginner')
  },
  {
    id: 'legs_glutes',
    name: 'Pernas e Glúteos',
    description: 'Fortaleça e defina pernas e glúteos',
    duration: 30,
    level: 'intermediate',
    goal: ['tone', 'gain_muscle'],
    muscleGroups: ['Pernas', 'Glúteos'],
    isPremium: true,
    color: 'from-purple-500 to-pink-500',
    icon: '🍑',
    days: generateProgressiveDays([
      exercises.squats,
      exercises.lunges,
      exercises.glute_bridge,
      exercises.jumping_jacks,
      exercises.high_knees
    ], 30, 'intermediate')
  },
  {
    id: 'arms_chest',
    name: 'Braços e Peito',
    description: 'Desenvolva força na parte superior',
    duration: 30,
    level: 'intermediate',
    goal: ['gain_muscle', 'tone'],
    muscleGroups: ['Braços', 'Peito', 'Ombros'],
    isPremium: true,
    color: 'from-green-500 to-teal-500',
    icon: '💪',
    days: generateProgressiveDays([
      exercises.push_ups,
      exercises.tricep_dips,
      exercises.arm_circles,
      exercises.plank,
      exercises.mountain_climbers
    ], 30, 'intermediate')
  },
  {
    id: 'cardio_burn',
    name: 'Cardio Intenso',
    description: 'Queime calorias com treinos de alta intensidade',
    duration: 30,
    level: 'advanced',
    goal: ['lose_weight'],
    muscleGroups: ['Cardio', 'Corpo Inteiro'],
    isPremium: true,
    color: 'from-red-500 to-orange-500',
    icon: '⚡',
    days: generateProgressiveDays([
      exercises.burpees,
      exercises.high_knees,
      exercises.mountain_climbers,
      exercises.jumping_jacks,
      exercises.butt_kicks
    ], 30, 'advanced')
  }
];

// Mensagens motivacionais
export const motivationalQuotes = [
  "Você é mais forte do que pensa! 💪",
  "Cada dia é uma nova oportunidade! 🌟",
  "O único treino ruim é aquele que não aconteceu! 🔥",
  "Seu corpo pode fazer, é sua mente que você precisa convencer! 🧠",
  "A dor que você sente hoje será a força que você sentirá amanhã! ⚡",
  "Não desista! Você está mais perto do que imagina! 🎯",
  "Transformação leva tempo. Seja paciente consigo mesmo! 🌱",
  "Você não precisa ser perfeito, apenas começar! 🚀",
  "Acredite em você! Você consegue! ✨",
  "Cada repetição te aproxima do seu objetivo! 🎖️"
];

// Conquistas
export const achievements = [
  {
    id: 'first_workout',
    title: 'Primeiro Passo',
    description: 'Complete seu primeiro treino',
    icon: '🎯',
    requirement: 1
  },
  {
    id: 'week_warrior',
    title: 'Guerreiro de Uma Semana',
    description: 'Complete 7 dias consecutivos',
    icon: '🔥',
    requirement: 7
  },
  {
    id: 'two_weeks',
    title: 'Duas Semanas Forte',
    description: 'Complete 14 dias consecutivos',
    icon: '💎',
    requirement: 14
  },
  {
    id: 'challenge_complete',
    title: 'Desafio Completo',
    description: 'Complete os 30 dias',
    icon: '🏆',
    requirement: 30
  },
  {
    id: 'calorie_burner',
    title: 'Queimador de Calorias',
    description: 'Queime 1000 calorias no total',
    icon: '🔥',
    requirement: 1000
  }
];
