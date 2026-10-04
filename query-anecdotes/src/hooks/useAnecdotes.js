import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
} from "../services/anecdotes";
import { useNotification } from "./useNotify";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();
  const { notify } = useNotification();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
  });

  const createAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      notify(`created "${newAnecdote.content}"`);
    },
    onError: () => notify("too short anecdote, must have length 5 or more"),
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify("vote registered");
    },
    onError: () => notify("voting failed"),
  });

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) =>
      createAnecdoteMutation.mutate({ content, votes: 0 }),
    handleVote: (anecdote) => {
      const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
      updateAnecdoteMutation.mutate(updatedAnecdote);
    },
  };
};
