# `@juriadams/timed-fetch`

A minimal wrapper around fetch that measures request duration and provides timing metrics such as total duration, network latency, and parsed server-side timings from the Server-Timing header when available.

## Installation

Add `@juriadams/timed-fetch` to your project using your package manager of choice (bun, npm, pnpm, ...).

```bash
bun add @juriadams/timed-fetch
```

## Usage

The simplest way to use this library is to replace `fetch` with `timedFetch`:

```ts
import { timedFetch } from '@juriadams/timed-fetch';

const res = await timedFetch('https://api.acme.co/v1/health');
   // ^ `TimedResponse`

console.log(res.timing);
             // ^ `Timing`

// `Timing`:
// {
//   total: 21.2,    // Total duration in milliseconds.
//   network: 11.4,  // Calculated network latency in milliseconds.
//   server: {       // Values parsed from returned `Server-Timing` header.
//     total: 9.8,
//     auth: 1.7,
//     db: 8.1,
//   },
// }
```

You can also integrate `timedFetch` seamlessly with other libraries, such as [Hono](https://github.com/honojs/hono):

```ts
import { timedFetch } from '@juriadams/timed-fetch';
import { Hono } from 'hono';
import { hc } from 'hono/client';

const api = new Hono().get('/v1/health', (c) =>
  c.json({ data: null, error: null })
);

type Api = typeof api;

const apiClient = hc<Api>('https://api.acme.co');

// Pass `timedFetch` as the `fetch` option.
const res = await apiClient.v1.health.$get({}, { fetch: timedFetch });
   // ^ `TimedResponse` ...
```