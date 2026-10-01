import { create } from "zustand";
import anecdoteService from "../services/anecdotes";

export const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    vote: async (id) => {
      const anecdote = get().anecdotes.find((item) => item.id === id);
      if (!anecdote) return;

      const updatedAnecdote = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });

      set((state) => ({
        anecdotes: state.anecdotes.map((item) =>
          item.id === id ? updatedAnecdote : item,
        ),
      }));
    },
    remove: async (id) => {
      await anecdoteService.remove(id);
      set((state) => ({
        anecdotes: state.anecdotes.filter((item) => item.id !== id),
      }));
    },
    add: (newAnecdote) =>
      set((state) => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
      })),
    setFilter: (value) => set(() => ({ filter: value })),
    initialize: (anecdotes) => set(() => ({ anecdotes })),
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);

  if (filter === "") {
    return anecdotes;
  }
  return anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );
};
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
