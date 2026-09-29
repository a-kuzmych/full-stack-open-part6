import { useAnecdotes, useAnecdoteActions } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const handleVote = async (anecdote) => {
    await vote(anecdote.id);
    showNotification(`you voted '${anecdote.content}'`);
  };

  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes);

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
