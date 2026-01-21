import { defineStore } from 'pinia';

export interface Goal {
  id: number;
  title: string;
  description: string;
  category: 'Study' | 'Health' | 'Business' | 'Personal';
  done: boolean;
  createdAt: string;
  dueDate: string; // ✅ YANGI
}

export type GoalStatus = 'completed' | 'in_progress' | 'overdue';

export const useGoalsStore = defineStore('goals', {
  state: () => ({
    goals: [] as Goal[],
  }),

  getters: {
    total: (s): number => s.goals.length,

    doneCount: (s): number => s.goals.filter((g) => g.done).length,

    // ✅ STATUS’NI AVTO HISOBLAYDI
    getStatus:
      () =>
      (goal: Goal): GoalStatus => {
        if (goal.done) return 'completed';
        if (new Date(goal.dueDate) < new Date()) return 'overdue';
        return 'in_progress';
      },
  },

  actions: {
    load(): void {
      const data = localStorage.getItem('goals');
      this.goals = data ? (JSON.parse(data) as Goal[]) : [];
    },

    save(): void {
      localStorage.setItem('goals', JSON.stringify(this.goals));
    },

    add(goal: Omit<Goal, 'id' | 'createdAt'>): void {
      this.goals.unshift({
        ...goal,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
      this.save();
    },

    update(goal: Goal): void {
      const i = this.goals.findIndex((g) => g.id === goal.id);
      if (i !== -1) {
        this.goals[i] = goal;
        this.save();
      }
    },

    remove(id: number): void {
      this.goals = this.goals.filter((g) => g.id !== id);
      this.save();
    },

    toggle(id: number): void {
      const g = this.goals.find((g) => g.id === id);
      if (g) {
        g.done = !g.done;
        this.save();
      }
    },
  },
});
