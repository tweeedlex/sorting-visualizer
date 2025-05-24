import '@testing-library/jest-dom';

Object.defineProperty(global, 'performance', {
  writable: true,
  value: {
    ...performance,
    now: jest.fn(() => Date.now()),
  },
});

jest.mock('timers');