import { create } from "zustand";

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: "",
  actions: {
    vote: (id) =>
      set((state) => {
        const updatedAnecdotes = state.anecdotes.map((anecdote) =>
          anecdote.id === id
            ? { ...anecdote, votes: anecdote.votes + 1 }
            : anecdote,
        );
        return { anecdotes: updatedAnecdotes };
      }),
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
