import { create } from "zustand";

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0,
});

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
    add: (content) =>
      set((state) => {
        const newAnecdote = { content, id: getId(), votes: 0 };
        return { anecdotes: state.anecdotes.concat(newAnecdote) };
      }),
    setFilter: (value) => set(() => ({ filter: value })),
    initialize: anecdotes => set(() => ({anecdotes}))
  },
}));

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes);
  const filter = useAnecdoteStore((state) => state.filter);

  if (filter === "") {
    return anecdotes;
  }
  return anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );
};
export const useAnecdoteActions = () =>
  useAnecdoteStore((state) => state.actions);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
