# Problem 4: Sum to N - Three Different Implementations

## Overview

This project provides three unique implementations of a function that calculates the sum from 1 to n (for positive n), or from -1 down to n (for negative n), in TypeScript. Each implementation demonstrates different algorithmic approaches with varying time and space complexity characteristics.

**Note:** The requirement states that n is any integer. Therefore, for negative values of n, we assume the sum should be calculated from n up to -1 (e.g., sum_to_n(-3) = -3 + -2 + -1 = -6).

## Problem Statement

**Task**: Implement a function that calculates the summation to n.

**Input**: `n` - any integer (assuming the result will always be less than `Number.MAX_SAFE_INTEGER`)

**Output**: Summation from 1 to n
- Example: `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`
- For negative numbers: `sum_to_n(-3) === -1 + (-2) + (-3) === -6`

## Implementations

### 1. Mathematical Formula Approach (`sum_to_n_a`)

```typescript
function sum_to_n_a(n: number): number {
    if (n === 0) return 0;

    // Check if the number is negative
    const isNegative = n < 0;

    // Work with absolute value for formula
    const absN = Math.abs(n);

    const result = (absN * (absN + 1)) / 2;
    return isNegative ? -result : result;
}
```

**Complexity Analysis:**
- **Time Complexity**: O(1) - Constant time
- **Space Complexity**: O(1) - Constant space

**Characteristics:**
- ✅ Most efficient approach
- ✅ Direct mathematical calculation
- ✅ Handles both positive and negative numbers

### 2. Iterative Loop Approach (`sum_to_n_b`)

```typescript
function sum_to_n_b(n: number): number {
    let sum = 0;
    const step = n >= 0 ? 1 : -1;

    for (let i = step; step > 0 ? i <= n : i >= n; i += step) {
        sum += i;
    }

    return sum;
}
```

**Complexity Analysis:**
- **Time Complexity**: O(|n|) - Linear time proportional to absolute value of n
- **Space Complexity**: O(1) - Constant space

**Characteristics:**
- ✅ Easy to understand and implement
- ✅ Handles edge cases well
- ✅ Precise for all integer values
- ⚠️ Slower for large values of n compared to formula approach

### 3. Recursive Approach (`sum_to_n_c`)

```typescript
function sum_to_n_c(n: number): number {
    if (n === 0) return 0;
    if (n > 0) {
        return n + sum_to_n_c(n - 1);
    }
    return n + sum_to_n_c(n + 1);
}
```

**Complexity Analysis:**
- **Time Complexity**: O(|n|) - Linear time, makes |n| recursive calls
- **Space Complexity**: O(|n|) - Linear space due to call stack depth

**Characteristics:**
- ✅ Elegant and mathematically intuitive solution
- ✅ Demonstrates recursive problem-solving approach
- ⚠️ Risk of stack overflow for large |n|
- ⚠️ Higher memory usage due to call stack

## Project Structure

```
problem_4/
├── src/
│   ├── index.ts          # Main implementations
│   ├── index.test.ts     # Comprehensive unit tests
│   ├── testData.ts       # Test cases and utilities
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest testing configuration
└── README.md            # This file
```

## Setup and Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
```bash
cd problem_4
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Building the Project
```bash
npm run build
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Coverage
```bash
npm run test:coverage
```

### Cleaning Build Files
```bash
npm run clean
```

### Test Data Structure

The `testData.ts` file provides:
- `testCases`: Comprehensive array of test cases with descriptions
- `recursiveTestCases`: Filtered test cases suitable for recursive function (avoiding stack overflow)
- `performanceTestConfigs`: Standardized configurations for performance testing
- `validateConsistency()`: Utility function to verify all implementations return consistent results

### Test Results Examples

```
✓ sum_to_n_a(5) === 15 (Example case from problem statement)
✓ sum_to_n_b(-3) === -6 (Small negative number)
✓ sum_to_n_c(100) === 5050 (Large positive number)
✓ All implementations return consistent results
✓ Formula approach is fastest for large numbers
```
