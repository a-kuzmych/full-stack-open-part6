import { beforeEach, describe, expect, it, vi } from "vitest";
import anecdoteService from "../services/anecdotes";
import { useAnecdoteStore } from "./store";

vi.mock("../services/anecdotes", () => ({
	default: {
		getAll: vi.fn(),
	},
}));

describe("anecdote store initialization", () => {
	const backendAnecdotes = [
		{ id: "1", content: "Backend anecdote", votes: 3 },
	];

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
