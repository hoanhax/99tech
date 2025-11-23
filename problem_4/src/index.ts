/**
 * Three different implementations of sum to n function
 * Each implementation has different time and space complexity characteristics
 */

/**
 * Implementation A: Mathematical Formula Approach
 * Base on the arithmetic series formula for positive numbers: sum = n * (n + 1) / 2
 * For negative numbers, we calculate the sum from -1 down to n
 *
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 *
 * Most efficient approach, direct calculation
 *
 * @param n - any integer
 * @returns summation from 1 to n (for positive), -1 down to n (for negative), or 0 (for zero)
 */
function sum_to_n_a(n: number): number {
    if (n === 0) return 0;

    // Check if the number is negative
    const isNegative = n < 0;

    // Work with absolute value for formula
    const absN = Math.abs(n);

    const result = (absN * (absN + 1)) / 2;
    return isNegative ? -result : result;
}

/**
 * Implementation B: Iterative Loop Approach
 * Uses a for loop to accumulate the sum step by step
 *
 * Time Complexity: O(|n|)
 * Space Complexity: O(1)
 *
 * Slower for large values of n compared to formula approach
 *
 * @param n - any integer
 * @returns summation from 1 to n (or n to 1 for negative numbers)
 */
function sum_to_n_b(n: number): number {
    let sum = 0;
    const step = n >= 0 ? 1 : -1;

    for (let i = step; step > 0 ? i <= n : i >= n; i += step) {
        sum += i;
    }

    return sum;
}

/**
 * Implementation C: Recursive Approach
 * Uses recursion to break down the problem into smaller subproblems
 * Base case: when n equals 0
 *
 * Time Complexity: O(|n|)
 * Space Complexity: O(|n|)
 *
 * Risk of stack overflow for large |n|, higher memory usage due to call stack
 *
 * @param n - any integer
 * @returns summation from 1 to n (or n to -1 for negative numbers)
 */
function sum_to_n_c(n: number): number {
    if (n === 0) return 0;
    if (n > 0) {
        return n + sum_to_n_c(n - 1);
    }
    return n + sum_to_n_c(n + 1);
}

// Export functions for testing and external usage
export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
