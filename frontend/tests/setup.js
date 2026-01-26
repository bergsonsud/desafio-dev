// Setup file for Jest tests
global.fetch = jest.fn();

// Mock console.error to avoid noise in tests
global.console.error = jest.fn();

// Helper to reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});
