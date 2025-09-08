/**
 * Timing information about the request.
 */
export interface Timing {
	/**
	 * Total time taken for the request.
	 */
	total: number;

	/**
	 * Network latency. Available only if a `Server-Timing` header was returned
	 * in the Response.
	 *
	 * Calculated by taking the difference between the total duration of the
	 * values returned in the `Server-Timing` header and the total time taken
	 * for the request.
	 */
	network: number | null;

	/**
	 * Server-side timing information. Available only if a `Server-Timing` header
	 * was returned in the Response.
	 *
	 * Calculated by parsing the value of the `Server-Timing` header.
	 */
	server: Record<string, number> | null;
}

/**
 * Response wrapper that adds additional timing information.
 */
export type TimedResponse = Response & { timing: Timing };

/**
 * Minimal `fetch` wrapper that exposes a set of basic timing information
 * and metrics about the request.
 *
 * @param ...args Same as `fetch`.
 *
 * @returns `TimedResponse`, which extends `Response` with a `timing` property.
 */
export const timedFetch = async (...args: Parameters<typeof fetch>) => {
	const start = performance.now();

	const res = await fetch(...args);

	const end = performance.now();

	const timing: Timing = {
		total: end - start,
		network: null,
		server: null,
	};

	(res as TimedResponse).timing = timing;

	return res;
};
