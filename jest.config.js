module.exports = {
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
