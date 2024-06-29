import { atom } from "jotai";
import { Exercise } from "./types";

export const selectedExerciseAtom = atom<Exercise | null>(null);
