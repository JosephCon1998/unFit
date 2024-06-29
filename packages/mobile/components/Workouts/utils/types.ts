export interface Workout {
  name: string;
  exercises: string[]; // id references to Exercises
  icon: string;
  id: string;
  dateCreated: string;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  workoutId: string;
}

export interface Exercise {
  name: string;
  description: string;
  steps: string[];
  muscleGroups: string[];
  id: string;
  entries: Set[];
  dateAdded?: string;
}

export interface Set {
  id: string;
  dateCreated: string;
  note: string;
  reps: string;
  weight: string;
  time: string;
  distance: string;
}
