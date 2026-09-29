import { useAnecdoteActions } from "../store"
import { useNotificationActions } from "../notificationStore";
import anecdoteService from "../../services/anecdotes";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { showNotification } = useNotificationActions();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value
    const newAnecdote = await anecdoteService.createNew(content)
    add(newAnecdote)
    showNotification(`you created '${newAnecdote.content}'`)
    e.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
