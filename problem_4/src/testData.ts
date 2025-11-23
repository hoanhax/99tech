/**
 * Test data for sum_to_n functions
 * Contains various test cases including edge cases and performance test data
 */

export interface TestCase {
    input: number;
    expected: number;
    description?: string;
}

/**
 * Comprehensive test cases for all three implementations
 */
export const testCases: TestCase[] = [
    // Basic positive cases
    { input: 1, expected: 1, description: "Single number" },
    { input: 2, expected: 3, description: "Small positive number" },
    { input: 3, expected: 6, description: "Small positive number" },
    { input: 4, expected: 10, description: "Small positive number" },
    { input: 5, expected: 15, description: "Example case from problem statement" },
    { input: 10, expected: 55, description: "Medium positive number" },
    { input: 100, expected: 5050, description: "Large positive number" },

    // Edge cases
    { input: 0, expected: 0, description: "Zero edge case" },

    // Negative numbers
    { input: -1, expected: -1, description: "Single negative number" },
    { input: -2, expected: -3, description: "Small negative number" },
    { input: -3, expected: -6, description: "Small negative number" },
    { input: -5, expected: -15, description: "Negative equivalent of example case" },
    { input: -10, expected: -55, description: "Medium negative number" },

    // Large numbers (within safe integer range)
    { input: 1000, expected: 500500, description: "Large number for performance testing" },
    { input: 9999, expected: 49995000, description: "Very large number" },
];

/**
 * Test cases specifically for recursive function (smaller numbers to avoid stack overflow)
 */
export const recursiveTestCases: TestCase[] = testCases.filter(
    testCase => Math.abs(testCase.input) <= 1000
);

/**
 * Performance test configurations
 */
export const performanceTestConfigs = {
    smallInput: 100,
    mediumInput: 1000,
    largeInput: 10000,
    iterations: 1000,
};

/**
 * Utility function to validate if all implementations return the same result
 */
export function validateConsistency(
    resultA: number,
    resultB: number,
    resultC: number,
    expected: number
): boolean {
    return resultA === expected &&
           resultB === expected &&
           resultC === expected &&
           resultA === resultB &&
           resultB === resultC;
}
