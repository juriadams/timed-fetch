---
"@juriadams/timed-fetch": patch
---

Convert TimedResponse from type to class with improved console.log output. The Response now properly displays timing information when logged, instead of showing "Response { ... }". Added custom inspect and toJSON methods for better debugging experience.
