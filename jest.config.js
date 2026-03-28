module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        "/node_modules/",
        '/logs/',
        '/src/**/*.js', // Ignore all files in src except controllers and models
        '!src/config/**',
        '!src/routes/**',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
        './src/controllers/authController.js': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85
        },
        './rc/utils/tokenUtils.js': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        },
        './src/middleware/authMiddleware.js': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90
        },
    },
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    verbose: true,
};