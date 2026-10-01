import { beforeEach, describe, expect, it, vi } from "vitest";
import anecdoteService from "../services/anecdotes";
import { renderHook, act } from "@testing-library/react";
import { useAnecdoteStore, useAnecdotes } from "./store";

vi.mock("../services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
  },
}));

describe("anecdote store initialization", () => {
  const backendAnecdotes = [{ id: "1", content: "Backend anecdote", votes: 3 }];

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
    vi.mocked(anecdoteService.getAll).mockResolvedValue(backendAnecdotes);
  });

  it("initializes state with the anecdotes returned by the backend", async () => {
    const anecdotes = await anecdoteService.getAll();

    useAnecdoteStore.getState().actions.initialize(anecdotes);

    expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes);
  });
});

describe("anecdote sorting", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "Anecdote 1", votes: 5 },
        { id: "2", content: "Anecdote 2", votes: 10 },
        { id: "3", content: "Anecdote 3", votes: 7 },
      ],
      filter: "",
    });
  });

  it("returns anecdotes sorted by votes in descending order", () => {
    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toHaveLength(3);

    expect(result.current[0].content).toBe("Anecdote 2");
    expect(result.current[1].content).toBe("Anecdote 3");
    expect(result.current[2].content).toBe("Anecdote 1");
  });
});

describe("anecdote filtering", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "Anecdote 1", votes: 5 },
        { id: "2", content: "Anecdote 2", votes: 10 },
        { id: "3", content: "Anecdote 3", votes: 7 },
      ],
      filter: "2",
    });
  });

  it("returns anecdotes filtered by the filter string", () => {
    const { result } = renderHook(() => useAnecdotes());
    expect(result.current).toHaveLength(1);
    expect(result.current[0].content).toBe("Anecdote 2");
  });
});

describe("anecdote voting", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "Anecdote 1", votes: 5 },
        { id: "2", content: "Anecdote 2", votes: 10 },
        { id: "3", content: "Anecdote 3", votes: 7 },
      ],
      filter: "",
    });
  });

  it("increments the votes of the specified anecdote", async () => {
    const expectedAnecdote = { id: "1", content: "Anecdote 1", votes: 6 };
    vi.mocked(anecdoteService.update).mockResolvedValue(expectedAnecdote);

    const { result } = renderHook(() => useAnecdoteStore());

    await act(async () => {
      await result.current.actions.vote("1");
    });

    const updatedAnecdote = result.current.anecdotes.find((a) => a.id === "1");
    expect(updatedAnecdote.votes).toBe(6);
  });
});
