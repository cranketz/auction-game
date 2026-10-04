// Complete two-player HTTP smoke, including immediate bids and all-pass settlement.
process.argv[2]??='http://127.0.0.1:3000';
await import('./verify-live.mjs');
