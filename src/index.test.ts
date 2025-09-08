import { describe, expect, test } from "bun:test";
import FetchMock from "fetch-mock";
import { timedFetch } from "@/index";

describe("timedFetch", () => {
	test("returns a `TimedResponse`", async () => {
		const mock = FetchMock.mockGlobal();

		try {
			mock.getOnce("https://api.acme.co/v1/health", {
				body: {
					data: null,
					error: null,
				},
			});

			const res = await timedFetch("https://api.acme.co/v1/health");

			// Expect `res.timing` to be defined.
			expect(res.timing).toBeDefined();

			// Expect `res.timing` to match the expected format.
			expect(res.timing).toEqual({
				total: expect.any(Number),
				network: null,
				server: null,
			});
		} finally {
			mock.hardReset();
		}
	});
});
