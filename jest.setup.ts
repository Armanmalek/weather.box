import fetch from 'jest-fetch-mock';
global.fetch = fetch as any;
fetch.mockResponse(JSON.stringify({ testing: true }));
