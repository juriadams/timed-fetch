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
 * Extends the native Response class to include timing data in console output.
 */
export class TimedResponse extends Response {
	public timing: Timing;

	constructor(
		body?: ReadableStream | null,
		init?: ResponseInit,
		timing?: Timing,
	) {
		super(body, init);
		this.timing = timing || {
			total: 0,
			network: null,
			server: null,
		};
	}

	/**
	 * Custom inspect method for better console.log output.
	 * This is used by Node.js and Bun when logging the object.
	 */
	[Symbol.for("nodejs.util.inspect.custom")]() {
		return {
			timing: this.timing,
			status: this.status,
			statusText: this.statusText,
			headers: Object.fromEntries(this.headers.entries()),
			ok: this.ok,
			redirected: this.redirected,
			type: this.type,
			url: this.url,
		};
	}

	/**
	 * Custom toJSON method for JSON.stringify and structured logging.
	 */
	toJSON() {
		return {
			timing: this.timing,
			status: this.status,
			statusText: this.statusText,
			headers: Object.fromEntries(this.headers.entries()),
			ok: this.ok,
			redirected: this.redirected,
			type: this.type,
			url: this.url,
		};
	}

	/**
	 * Override the Symbol.toStringTag for better type identification.
	 */
	get [Symbol.toStringTag]() {
		return "TimedResponse";
	}
}

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

	// Create a new TimedResponse from the original response
	const timedResponse = new TimedResponse(
		res.body,
		{
			status: res.status,
			statusText: res.statusText,
			headers: res.headers,
		},
		timing,
	);

	return timedResponse;
};
