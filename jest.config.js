module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    testRegex: '/tests/.*\\.(test|Test|spec)?\\.(ts|tsx)$',
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
}