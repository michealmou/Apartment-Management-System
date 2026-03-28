// Jest setup file for frontend tests
import '@testing-library/jest-dom';

// Suppress React Router v7 deprecation warnings in tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('React Router Future Flag Warning') ||
     args[0].includes('React Router will begin'))
  ) {
    return;
  }
  originalWarn.call(console, ...args);
};

jest.mock('react-router-dom', () => {
    let actual;
    try {
        actual = jest.requireActual('react-router-dom');
    } catch {
        actual = {};
    }

    return {
        ...actual,
        useNavigate: jest.fn(),
    };
});