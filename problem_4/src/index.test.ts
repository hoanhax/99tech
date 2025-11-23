import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';
import {
    testCases,
    recursiveTestCases,
    performanceTestConfigs,
    validateConsistency
} from './testData';

describe('Sum to N Functions', () => {
    describe('sum_to_n_a (Mathematical Formula)', () => {
        testCases.forEach(({ input, expected, description }) => {
            test(`should return ${expected} for input ${input} (${description})`, () => {
                expect(sum_to_n_a(input)).toBe(expected);
            });
        });

        test('should be fastest for large numbers', () => {
            const start = performance.now();
            sum_to_n_a(performanceTestConfigs.largeInput);
            const end = performance.now();
            expect(end - start).toBeLessThan(1); // Should be very fast
        });
    });

    describe('sum_to_n_b (Iterative)', () => {
        testCases.forEach(({ input, expected, description }) => {
            test(`should return ${expected} for input ${input} (${description})`, () => {
                expect(sum_to_n_b(input)).toBe(expected);
            });
        });
    });

    describe('sum_to_n_c (Recursive)', () => {
        recursiveTestCases.forEach(({ input, expected, description }) => {
            test(`should return ${expected} for input ${input} (${description})`, () => {
                expect(sum_to_n_c(input)).toBe(expected);
            });
        });
    });

    describe('Consistency Across All Implementations', () => {
        const smallTestCases = recursiveTestCases; // These are already filtered for reasonable size

        smallTestCases.forEach(({ input, expected, description }) => {
            test(`all implementations should return ${expected} for input ${input} (${description})`, () => {
                const resultA = sum_to_n_a(input);
                const resultB = sum_to_n_b(input);
                const resultC = sum_to_n_c(input);

                // Use the validateConsistency utility function from testData
                expect(validateConsistency(resultA, resultB, resultC, expected)).toBe(true);
            });
        });
    });

    describe('Performance Comparison', () => {
        test('formula approach should be fastest', () => {
            const testValue = performanceTestConfigs.mediumInput;
            const iterations = performanceTestConfigs.iterations;

            const startA = performance.now();
            for (let i = 0; i < iterations; i++) {
                sum_to_n_a(testValue);
            }
            const timeA = performance.now() - startA;

            const startB = performance.now();
            for (let i = 0; i < iterations; i++) {
                sum_to_n_b(testValue);
            }
            const timeB = performance.now() - startB;

            // Formula should be significantly faster than iterative
            expect(timeA).toBeLessThan(timeB);
        });
    });
});
