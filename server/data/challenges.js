export const challenges = [
  // ═══════════════════════════════════════════
  //  ARRAYS — Easy → Medium
  // ═══════════════════════════════════════════
  {
    id: 'sum-array',
    title: 'Sum of Array',
    description: 'Given an array of integers, return their sum.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[1, 2, 3]', output: '6' },
      { input: '[10, -5, 3]', output: '8' }
    ],
    testCases: [
      { input: '[1, 2, 3]', expected: '6' },
      { input: '[10, -5, 3]', expected: '8' },
      { input: '[]', expected: '0' },
      { input: '[100]', expected: '100' },
      { input: '[-1, -2, -3]', expected: '-6' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the sum'
  },
  {
    id: 'max-element',
    title: 'Maximum Element',
    description: 'Find the maximum element in an array of integers.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[3, 1, 4, 1, 5]', output: '5' },
      { input: '[-1, -5, -2]', output: '-1' }
    ],
    testCases: [
      { input: '[3, 1, 4, 1, 5]', expected: '5' },
      { input: '[-1, -5, -2]', expected: '-1' },
      { input: '[42]', expected: '42' },
      { input: '[0, 0, 0]', expected: '0' },
      { input: '[99, 1, 50, 98]', expected: '99' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the maximum integer'
  },
  {
    id: 'min-element',
    title: 'Minimum Element',
    description: 'Find the minimum element in an array of integers.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[3, 1, 4, 1, 5]', output: '1' },
      { input: '[-1, -5, -2]', output: '-5' }
    ],
    testCases: [
      { input: '[3, 1, 4, 1, 5]', expected: '1' },
      { input: '[-1, -5, -2]', expected: '-5' },
      { input: '[42]', expected: '42' },
      { input: '[0, 0, 0]', expected: '0' },
      { input: '[99, 1, 50, 2]', expected: '1' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the minimum integer'
  },
  {
    id: 'array-product',
    title: 'Array Product',
    description: 'Given a JSON array of integers, print their product.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[2, 3, 4]', output: '24' },
      { input: '[1, 5, -2]', output: '-10' }
    ],
    testCases: [
      { input: '[2, 3, 4]', expected: '24' },
      { input: '[1, 5, -2]', expected: '-10' },
      { input: '[7]', expected: '7' },
      { input: '[1, 1, 1, 1]', expected: '1' },
      { input: '[2, 0, 5]', expected: '0' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the product'
  },
  {
    id: 'array-reverse',
    title: 'Reverse Array',
    description: 'Given a JSON array of integers, print it reversed as a JSON array.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[1, 2, 3]', output: '[3, 2, 1]' },
      { input: '[5, 10]', output: '[10, 5]' }
    ],
    testCases: [
      { input: '[1, 2, 3]', expected: '[3, 2, 1]' },
      { input: '[5, 10]', expected: '[10, 5]' },
      { input: '[1]', expected: '[1]' },
      { input: '[4, 3, 2, 1]', expected: '[1, 2, 3, 4]' },
      { input: '[]', expected: '[]' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the reversed JSON array'
  },
  {
    id: 'sort-array',
    title: 'Sort Array',
    description: 'Given a JSON array of integers, print it sorted in ascending order.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[3, 1, 2]', output: '[1, 2, 3]' },
      { input: '[5, -1, 4]', output: '[-1, 4, 5]' }
    ],
    testCases: [
      { input: '[3, 1, 2]', expected: '[1, 2, 3]' },
      { input: '[5, -1, 4]', expected: '[-1, 4, 5]' },
      { input: '[1]', expected: '[1]' },
      { input: '[9, 7, 5, 3, 1]', expected: '[1, 3, 5, 7, 9]' },
      { input: '[]', expected: '[]' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the sorted JSON array'
  },
  {
    id: 'unique-elements',
    title: 'Unique Elements',
    description: 'Given a JSON array, print only unique elements preserving order.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[1, 2, 2, 3, 1]', output: '[1, 2, 3]' },
      { input: '[5, 5, 5]', output: '[5]' }
    ],
    testCases: [
      { input: '[1, 2, 2, 3, 1]', expected: '[1, 2, 3]' },
      { input: '[5, 5, 5]', expected: '[5]' },
      { input: '[1, 2, 3]', expected: '[1, 2, 3]' },
      { input: '[4]', expected: '[4]' },
      { input: '[3, 1, 4, 1, 5, 9, 2, 6, 5]', expected: '[3, 1, 4, 5, 9, 2, 6]' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print unique elements as JSON array'
  },
  {
    id: 'flatten-array',
    title: 'Flatten Array',
    description: 'Given a nested JSON array (max 2 levels), flatten it.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[[1, 2], [3, 4]]', output: '[1, 2, 3, 4]' },
      { input: '[[1], [2, 3], [4]]', output: '[1, 2, 3, 4]' }
    ],
    testCases: [
      { input: '[[1, 2], [3, 4]]', expected: '[1, 2, 3, 4]' },
      { input: '[[1], [2, 3], [4]]', expected: '[1, 2, 3, 4]' },
      { input: '[[5]]', expected: '[5]' },
      { input: '[[], [1], []]', expected: '[1]' },
      { input: '[[1, 2, 3]]', expected: '[1, 2, 3]' }
    ],
    inputFormat: 'A nested JSON array via stdin',
    outputFormat: 'Print the flattened JSON array'
  },
  {
    id: 'move-zeros',
    title: 'Move Zeros',
    description: 'Move all zeros in an array to the end while keeping the order of other elements. Print as JSON array.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[0, 1, 0, 3, 12]', output: '[1, 3, 12, 0, 0]' },
      { input: '[0, 0, 1]', output: '[1, 0, 0]' }
    ],
    testCases: [
      { input: '[0, 1, 0, 3, 12]', expected: '[1, 3, 12, 0, 0]' },
      { input: '[0, 0, 1]', expected: '[1, 0, 0]' },
      { input: '[1, 2, 3]', expected: '[1, 2, 3]' },
      { input: '[0]', expected: '[0]' },
      { input: '[4, 0, 5, 0, 0, 6]', expected: '[4, 5, 6, 0, 0, 0]' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the result as JSON array'
  },
  {
    id: 'rotate-array',
    title: 'Rotate Array',
    description: 'Rotate an array to the right by K steps. Input: JSON array on first line, K on second line. Print as JSON array.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[1, 2, 3, 4, 5]\n2', output: '[4, 5, 1, 2, 3]' },
      { input: '[1, 2, 3]\n1', output: '[3, 1, 2]' }
    ],
    testCases: [
      { input: '[1, 2, 3, 4, 5]\n2', expected: '[4, 5, 1, 2, 3]' },
      { input: '[1, 2, 3]\n1', expected: '[3, 1, 2]' },
      { input: '[1]\n5', expected: '[1]' },
      { input: '[1, 2]\n2', expected: '[1, 2]' },
      { input: '[1, 2, 3, 4]\n3', expected: '[2, 3, 4, 1]' }
    ],
    inputFormat: 'First line: JSON array. Second line: K',
    outputFormat: 'Print the rotated array as JSON'
  },
  {
    id: 'second-largest',
    title: 'Second Largest',
    description: 'Find the second largest element in a JSON array of distinct integers.',
    difficulty: 'easy',
    category: 'arrays',
    examples: [
      { input: '[3, 1, 4, 1, 5]', output: '4' },
      { input: '[10, 20, 30]', output: '20' }
    ],
    testCases: [
      { input: '[3, 1, 4, 1, 5]', expected: '4' },
      { input: '[10, 20, 30]', expected: '20' },
      { input: '[5, 3]', expected: '3' },
      { input: '[1, 2, 3, 4, 5]', expected: '4' },
      { input: '[100, 50, 75, 25]', expected: '75' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the second largest element'
  },
  {
    id: 'merge-sorted',
    title: 'Merge Sorted Arrays',
    description: 'Merge two sorted arrays into one sorted array. Input: two JSON arrays on separate lines.',
    difficulty: 'medium',
    category: 'arrays',
    examples: [
      { input: '[1, 3, 5]\n[2, 4, 6]', output: '[1, 2, 3, 4, 5, 6]' },
      { input: '[1, 2]\n[3]', output: '[1, 2, 3]' }
    ],
    testCases: [
      { input: '[1, 3, 5]\n[2, 4, 6]', expected: '[1, 2, 3, 4, 5, 6]' },
      { input: '[1, 2]\n[3]', expected: '[1, 2, 3]' },
      { input: '[]\n[1, 2, 3]', expected: '[1, 2, 3]' },
      { input: '[1]\n[1]', expected: '[1, 1]' },
      { input: '[1, 4, 7]\n[2, 3, 5, 6]', expected: '[1, 2, 3, 4, 5, 6, 7]' }
    ],
    inputFormat: 'Two sorted JSON arrays, one per line',
    outputFormat: 'Print the merged sorted array as JSON'
  },

  // ═══════════════════════════════════════════
  //  TWO POINTERS
  // ═══════════════════════════════════════════
  {
    id: 'two-sum-sorted',
    title: 'Two Sum (Sorted)',
    description: 'Given a sorted array and target (on next line), find two numbers that add up to target. Print their 1-based indices space-separated.',
    difficulty: 'easy',
    category: 'two-pointers',
    examples: [
      { input: '[2, 7, 11, 15]\n9', output: '1 2' },
      { input: '[2, 3, 4]\n6', output: '1 3' }
    ],
    testCases: [
      { input: '[2, 7, 11, 15]\n9', expected: '1 2' },
      { input: '[2, 3, 4]\n6', expected: '1 3' },
      { input: '[1, 2, 3, 4, 5]\n9', expected: '4 5' },
      { input: '[-1, 0]\n-1', expected: '1 2' },
      { input: '[1, 3, 5, 7]\n8', expected: '1 4' }
    ],
    inputFormat: 'First line: sorted JSON array. Second line: target',
    outputFormat: 'Print two 1-based indices space-separated'
  },
  {
    id: 'reverse-vowels',
    title: 'Reverse Vowels',
    description: 'Reverse only the vowels in a string (case-insensitive, preserve case).',
    difficulty: 'medium',
    category: 'two-pointers',
    examples: [
      { input: 'hello', output: 'holle' },
      { input: 'leetcode', output: 'leotcede' }
    ],
    testCases: [
      { input: 'hello', expected: 'holle' },
      { input: 'leetcode', expected: 'leotcede' },
      { input: 'aA', expected: 'Aa' },
      { input: 'xyz', expected: 'xyz' },
      { input: 'aeiou', expected: 'uoiea' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the string with vowels reversed'
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    description: 'Given an array of heights, find two lines that together with x-axis form a container holding the most water. Print the max area.',
    difficulty: 'medium',
    category: 'two-pointers',
    examples: [
      { input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]', output: '49' },
      { input: '[1, 1]', output: '1' }
    ],
    testCases: [
      { input: '[1, 8, 6, 2, 5, 4, 8, 3, 7]', expected: '49' },
      { input: '[1, 1]', expected: '1' },
      { input: '[4, 3, 2, 1, 4]', expected: '16' },
      { input: '[1, 2, 1]', expected: '2' },
      { input: '[2, 3, 10, 5, 7, 8, 9]', expected: '36' }
    ],
    inputFormat: 'A JSON array of heights via stdin',
    outputFormat: 'Print the maximum water area'
  },
  {
    id: 'valid-palindrome-ii',
    title: 'Almost Palindrome',
    description: 'Given a string, determine if it can become a palindrome by removing at most one character. Print "true" or "false".',
    difficulty: 'medium',
    category: 'two-pointers',
    examples: [
      { input: 'abca', output: 'true' },
      { input: 'abc', output: 'false' }
    ],
    testCases: [
      { input: 'abca', expected: 'true' },
      { input: 'abc', expected: 'false' },
      { input: 'racecar', expected: 'true' },
      { input: 'a', expected: 'true' },
      { input: 'abcba', expected: 'true' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print true or false'
  },

  // ═══════════════════════════════════════════
  //  SLIDING WINDOW
  // ═══════════════════════════════════════════
  {
    id: 'max-sum-subarray',
    title: 'Max Sum Subarray of Size K',
    description: 'Given an array and K (on next line), find the maximum sum of any contiguous subarray of size K.',
    difficulty: 'easy',
    category: 'sliding-window',
    examples: [
      { input: '[2, 1, 5, 1, 3, 2]\n3', output: '9' },
      { input: '[1, 9, -1, 2]\n2', output: '10' }
    ],
    testCases: [
      { input: '[2, 1, 5, 1, 3, 2]\n3', expected: '9' },
      { input: '[1, 9, -1, 2]\n2', expected: '10' },
      { input: '[5]\n1', expected: '5' },
      { input: '[1, 2, 3, 4, 5]\n2', expected: '9' },
      { input: '[4, 2, 1, 7, 8, 1, 2, 8, 1, 0]\n3', expected: '16' }
    ],
    inputFormat: 'First line: JSON array. Second line: K',
    outputFormat: 'Print the maximum sum'
  },
  {
    id: 'longest-unique-substr',
    title: 'Longest Substring Without Repeating',
    description: 'Find the length of the longest substring without repeating characters.',
    difficulty: 'medium',
    category: 'sliding-window',
    examples: [
      { input: 'abcabcbb', output: '3' },
      { input: 'bbbbb', output: '1' }
    ],
    testCases: [
      { input: 'abcabcbb', expected: '3' },
      { input: 'bbbbb', expected: '1' },
      { input: 'pwwkew', expected: '3' },
      { input: '', expected: '0' },
      { input: 'abcdef', expected: '6' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the length of longest unique substring'
  },
  {
    id: 'min-subarray-sum',
    title: 'Min Size Subarray Sum',
    description: 'Given a positive integer array and target (on next line), find the minimal length subarray whose sum >= target. Print 0 if no such subarray.',
    difficulty: 'medium',
    category: 'sliding-window',
    examples: [
      { input: '[2, 3, 1, 2, 4, 3]\n7', output: '2' },
      { input: '[1, 1, 1, 1]\n10', output: '0' }
    ],
    testCases: [
      { input: '[2, 3, 1, 2, 4, 3]\n7', expected: '2' },
      { input: '[1, 1, 1, 1]\n10', expected: '0' },
      { input: '[1, 4, 4]\n4', expected: '1' },
      { input: '[5, 1, 3, 5, 10, 7, 4, 9, 2, 8]\n15', expected: '2' },
      { input: '[1, 2, 3, 4, 5]\n15', expected: '5' }
    ],
    inputFormat: 'First line: positive integer JSON array. Second line: target',
    outputFormat: 'Print the minimal subarray length (0 if impossible)'
  },
  {
    id: 'max-consecutive-ones',
    title: 'Max Consecutive Ones',
    description: 'Given a binary array (only 0s and 1s), find the maximum number of consecutive 1s.',
    difficulty: 'easy',
    category: 'sliding-window',
    examples: [
      { input: '[1, 1, 0, 1, 1, 1]', output: '3' },
      { input: '[1, 0, 1, 1, 0, 1]', output: '2' }
    ],
    testCases: [
      { input: '[1, 1, 0, 1, 1, 1]', expected: '3' },
      { input: '[1, 0, 1, 1, 0, 1]', expected: '2' },
      { input: '[0, 0, 0]', expected: '0' },
      { input: '[1]', expected: '1' },
      { input: '[1, 1, 1, 1, 1]', expected: '5' }
    ],
    inputFormat: 'A JSON binary array via stdin',
    outputFormat: 'Print the max consecutive ones count'
  },

  // ═══════════════════════════════════════════
  //  STACK / QUEUE
  // ═══════════════════════════════════════════
  {
    id: 'balanced-brackets',
    title: 'Balanced Brackets',
    description: 'Given a string of brackets ()[]{}​, determine if they are balanced. Print "true" or "false".',
    difficulty: 'medium',
    category: 'stack-queue',
    examples: [
      { input: '()[]{}', output: 'true' },
      { input: '([)]', output: 'false' }
    ],
    testCases: [
      { input: '()[]{}', expected: 'true' },
      { input: '([)]', expected: 'false' },
      { input: '{[()]}', expected: 'true' },
      { input: '', expected: 'true' },
      { input: '((()))', expected: 'true' }
    ],
    inputFormat: 'A string of brackets via stdin',
    outputFormat: 'Print true or false'
  },
  {
    id: 'next-greater-element',
    title: 'Next Greater Element',
    description: 'For each element in a JSON array, find the next element that is greater. Use -1 if none. Print as JSON array.',
    difficulty: 'medium',
    category: 'stack-queue',
    examples: [
      { input: '[4, 5, 2, 25]', output: '[5, 25, 25, -1]' },
      { input: '[3, 2, 1]', output: '[-1, -1, -1]' }
    ],
    testCases: [
      { input: '[4, 5, 2, 25]', expected: '[5, 25, 25, -1]' },
      { input: '[3, 2, 1]', expected: '[-1, -1, -1]' },
      { input: '[1, 2, 3]', expected: '[2, 3, -1]' },
      { input: '[7]', expected: '[-1]' },
      { input: '[2, 7, 3, 5, 4, 6, 8]', expected: '[7, 8, 5, 6, 6, 8, -1]' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print next greater elements as JSON array'
  },
  {
    id: 'eval-rpn',
    title: 'Evaluate RPN',
    description: 'Evaluate a Reverse Polish Notation expression. Input is space-separated tokens with operators +, -, *, /. Division truncates toward zero.',
    difficulty: 'medium',
    category: 'stack-queue',
    examples: [
      { input: '2 1 + 3 *', output: '9' },
      { input: '4 13 5 / +', output: '6' }
    ],
    testCases: [
      { input: '2 1 + 3 *', expected: '9' },
      { input: '4 13 5 / +', expected: '6' },
      { input: '5 3 -', expected: '2' },
      { input: '3 4 *', expected: '12' },
      { input: '10 6 9 3 + -11 * / * 17 + 5 +', expected: '22' }
    ],
    inputFormat: 'Space-separated RPN tokens via stdin',
    outputFormat: 'Print the result as integer'
  },
  {
    id: 'asteroid-collision',
    title: 'Asteroid Collision',
    description: 'Given a JSON array of integers representing asteroids moving in a row. Positive = right, negative = left. When two collide, smaller one explodes. Equal = both explode. Print surviving asteroids as JSON array.',
    difficulty: 'hard',
    category: 'stack-queue',
    examples: [
      { input: '[5, 10, -5]', output: '[5, 10]' },
      { input: '[8, -8]', output: '[]' }
    ],
    testCases: [
      { input: '[5, 10, -5]', expected: '[5, 10]' },
      { input: '[8, -8]', expected: '[]' },
      { input: '[10, 2, -5]', expected: '[10]' },
      { input: '[-2, -1, 1, 2]', expected: '[-2, -1, 1, 2]' },
      { input: '[1, -1, -2, -3]', expected: '[-2, -3]' }
    ],
    inputFormat: 'A JSON array of integers via stdin',
    outputFormat: 'Print surviving asteroids as JSON array'
  },

  // ═══════════════════════════════════════════
  //  BINARY SEARCH
  // ═══════════════════════════════════════════
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Given a sorted JSON array and target (on next line), return the index of target. Print -1 if not found.',
    difficulty: 'easy',
    category: 'binary-search',
    examples: [
      { input: '[-1, 0, 3, 5, 9, 12]\n9', output: '4' },
      { input: '[-1, 0, 3, 5, 9, 12]\n2', output: '-1' }
    ],
    testCases: [
      { input: '[-1, 0, 3, 5, 9, 12]\n9', expected: '4' },
      { input: '[-1, 0, 3, 5, 9, 12]\n2', expected: '-1' },
      { input: '[1]\n1', expected: '0' },
      { input: '[1, 3, 5, 7]\n7', expected: '3' },
      { input: '[2, 4, 6, 8, 10]\n4', expected: '1' }
    ],
    inputFormat: 'First line: sorted JSON array. Second line: target',
    outputFormat: 'Print the index or -1'
  },
  {
    id: 'sqrt-integer',
    title: 'Integer Square Root',
    description: 'Given a non-negative integer N, compute the integer part of its square root (floor).',
    difficulty: 'easy',
    category: 'binary-search',
    examples: [
      { input: '8', output: '2' },
      { input: '16', output: '4' }
    ],
    testCases: [
      { input: '8', expected: '2' },
      { input: '16', expected: '4' },
      { input: '0', expected: '0' },
      { input: '1', expected: '1' },
      { input: '100', expected: '10' }
    ],
    inputFormat: 'A non-negative integer via stdin',
    outputFormat: 'Print the integer square root'
  },
  {
    id: 'peak-element',
    title: 'Find Peak Element',
    description: 'Given a JSON array where no two adjacent elements are equal, find any peak element (greater than neighbors). Print its index.',
    difficulty: 'medium',
    category: 'binary-search',
    examples: [
      { input: '[1, 2, 3, 1]', output: '2' },
      { input: '[1, 2, 1, 3, 5, 6, 4]', output: '5' }
    ],
    testCases: [
      { input: '[1, 2, 3, 1]', expected: '2' },
      { input: '[1, 2, 1, 3, 5, 6, 4]', expected: '5' },
      { input: '[1]', expected: '0' },
      { input: '[3, 2, 1]', expected: '0' },
      { input: '[1, 2, 3]', expected: '2' }
    ],
    inputFormat: 'A JSON array via stdin',
    outputFormat: 'Print the index of a peak element'
  },
  {
    id: 'first-last-position',
    title: 'First and Last Position',
    description: 'Given a sorted array and target (on next line), find the first and last position of target. Print as "first last". Print "-1 -1" if not found.',
    difficulty: 'medium',
    category: 'binary-search',
    examples: [
      { input: '[5, 7, 7, 8, 8, 10]\n8', output: '3 4' },
      { input: '[5, 7, 7, 8, 8, 10]\n6', output: '-1 -1' }
    ],
    testCases: [
      { input: '[5, 7, 7, 8, 8, 10]\n8', expected: '3 4' },
      { input: '[5, 7, 7, 8, 8, 10]\n6', expected: '-1 -1' },
      { input: '[1]\n1', expected: '0 0' },
      { input: '[1, 1, 1, 1]\n1', expected: '0 3' },
      { input: '[]\n5', expected: '-1 -1' }
    ],
    inputFormat: 'First line: sorted JSON array. Second line: target',
    outputFormat: 'Print first and last index space-separated'
  },

  // ═══════════════════════════════════════════
  //  GRAPHS (BFS/DFS)
  // ═══════════════════════════════════════════
  {
    id: 'num-islands',
    title: 'Number of Islands',
    description: 'Given a 2D grid of "1"s (land) and "0"s (water) as a JSON 2D array of strings, count the number of islands. An island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
    difficulty: 'medium',
    category: 'graphs',
    examples: [
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
      { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', output: '1' }
    ],
    testCases: [
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' },
      { input: '[["1","1","1"],["0","1","0"],["1","1","1"]]', expected: '1' },
      { input: '[["0","0"],["0","0"]]', expected: '0' },
      { input: '[["1"]]', expected: '1' },
      { input: '[["1","0","1"],["0","1","0"],["1","0","1"]]', expected: '5' }
    ],
    inputFormat: 'A 2D JSON array of "0" and "1" strings',
    outputFormat: 'Print the number of islands'
  },
  {
    id: 'flood-fill',
    title: 'Flood Fill',
    description: 'Given a 2D grid (JSON), a start row, start col, and new color (space-separated on second line), flood-fill from (row,col). Print the modified grid as JSON.',
    difficulty: 'medium',
    category: 'graphs',
    examples: [
      { input: '[[1,1,1],[1,1,0],[1,0,1]]\n1 1 2', output: '[[2,2,2],[2,2,0],[2,0,1]]' },
      { input: '[[0,0,0],[0,0,0]]\n0 0 0', output: '[[0,0,0],[0,0,0]]' }
    ],
    testCases: [
      { input: '[[1,1,1],[1,1,0],[1,0,1]]\n1 1 2', expected: '[[2,2,2],[2,2,0],[2,0,1]]' },
      { input: '[[0,0,0],[0,0,0]]\n0 0 0', expected: '[[0,0,0],[0,0,0]]' },
      { input: '[[1]]\n0 0 5', expected: '[[5]]' },
      { input: '[[0,1],[1,0]]\n0 0 3', expected: '[[3,1],[1,0]]' },
      { input: '[[1,1],[1,1]]\n0 0 2', expected: '[[2,2],[2,2]]' }
    ],
    inputFormat: 'First line: 2D JSON array. Second line: row col newColor',
    outputFormat: 'Print the modified grid as JSON'
  },
  {
    id: 'max-area-island',
    title: 'Max Area of Island',
    description: 'Given a 2D binary grid (JSON array of 0s and 1s), find the maximum area of an island. An island is a group of 1s connected 4-directionally.',
    difficulty: 'hard',
    category: 'graphs',
    examples: [
      { input: '[[0,0,1,0,0],[0,0,0,0,0],[0,1,1,0,0],[0,1,1,0,0]]', output: '4' },
      { input: '[[0,0,0],[0,0,0]]', output: '0' }
    ],
    testCases: [
      { input: '[[0,0,1,0,0],[0,0,0,0,0],[0,1,1,0,0],[0,1,1,0,0]]', expected: '4' },
      { input: '[[0,0,0],[0,0,0]]', expected: '0' },
      { input: '[[1]]', expected: '1' },
      { input: '[[1,1],[1,1]]', expected: '4' },
      { input: '[[1,0,1],[0,0,0],[1,0,1]]', expected: '1' }
    ],
    inputFormat: 'A 2D JSON array of 0s and 1s',
    outputFormat: 'Print the maximum island area'
  },

  // ═══════════════════════════════════════════
  //  DYNAMIC PROGRAMMING
  // ═══════════════════════════════════════════
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: 'You can climb 1 or 2 steps at a time. Given N stairs, how many distinct ways can you climb to the top?',
    difficulty: 'easy',
    category: 'dp',
    examples: [
      { input: '3', output: '3' },
      { input: '5', output: '8' }
    ],
    testCases: [
      { input: '3', expected: '3' },
      { input: '5', expected: '8' },
      { input: '1', expected: '1' },
      { input: '2', expected: '2' },
      { input: '10', expected: '89' }
    ],
    inputFormat: 'An integer N via stdin',
    outputFormat: 'Print the number of distinct ways'
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    description: 'Given a JSON array representing money in each house, find the maximum amount you can rob without robbing two adjacent houses.',
    difficulty: 'medium',
    category: 'dp',
    examples: [
      { input: '[1, 2, 3, 1]', output: '4' },
      { input: '[2, 7, 9, 3, 1]', output: '12' }
    ],
    testCases: [
      { input: '[1, 2, 3, 1]', expected: '4' },
      { input: '[2, 7, 9, 3, 1]', expected: '12' },
      { input: '[5]', expected: '5' },
      { input: '[1, 2]', expected: '2' },
      { input: '[2, 1, 1, 2]', expected: '4' }
    ],
    inputFormat: 'A JSON array of integers via stdin',
    outputFormat: 'Print the maximum rob amount'
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    description: 'Given coin denominations (JSON array, first line) and an amount (second line), find the fewest number of coins to make that amount. Print -1 if impossible.',
    difficulty: 'medium',
    category: 'dp',
    examples: [
      { input: '[1, 5, 10, 25]\n30', output: '2' },
      { input: '[2]\n3', output: '-1' }
    ],
    testCases: [
      { input: '[1, 5, 10, 25]\n30', expected: '2' },
      { input: '[2]\n3', expected: '-1' },
      { input: '[1]\n0', expected: '0' },
      { input: '[1, 2, 5]\n11', expected: '3' },
      { input: '[1]\n5', expected: '5' }
    ],
    inputFormat: 'First line: JSON array of coin denominations. Second line: target amount',
    outputFormat: 'Print the minimum number of coins or -1'
  },
  {
    id: 'lis-length',
    title: 'Longest Increasing Subsequence',
    description: 'Given a JSON array of integers, find the length of the longest strictly increasing subsequence.',
    difficulty: 'hard',
    category: 'dp',
    examples: [
      { input: '[10, 9, 2, 5, 3, 7, 101, 18]', output: '4' },
      { input: '[0, 1, 0, 3, 2, 3]', output: '4' }
    ],
    testCases: [
      { input: '[10, 9, 2, 5, 3, 7, 101, 18]', expected: '4' },
      { input: '[0, 1, 0, 3, 2, 3]', expected: '4' },
      { input: '[7, 7, 7, 7]', expected: '1' },
      { input: '[1]', expected: '1' },
      { input: '[1, 2, 3, 4, 5]', expected: '5' }
    ],
    inputFormat: 'A JSON array of integers via stdin',
    outputFormat: 'Print the length of LIS'
  },
  {
    id: 'max-subarray-sum',
    title: 'Maximum Subarray (Kadane)',
    description: 'Given a JSON array of integers, find the contiguous subarray with the largest sum. Print that sum.',
    difficulty: 'medium',
    category: 'dp',
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6' },
      { input: '[1]', output: '1' }
    ],
    testCases: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expected: '6' },
      { input: '[1]', expected: '1' },
      { input: '[5, 4, -1, 7, 8]', expected: '23' },
      { input: '[-1, -2, -3]', expected: '-1' },
      { input: '[3, -2, 5, -1]', expected: '6' }
    ],
    inputFormat: 'A JSON array of integers via stdin',
    outputFormat: 'Print the maximum subarray sum'
  },

  // ═══════════════════════════════════════════
  //  STRINGS (general)
  // ═══════════════════════════════════════════
  {
    id: 'reverse-string',
    title: 'Reverse a String',
    description: 'Given a string, return it reversed.',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: 'hello', output: 'olleh' },
      { input: 'world', output: 'dlrow' }
    ],
    testCases: [
      { input: 'hello', expected: 'olleh' },
      { input: 'world', expected: 'dlrow' },
      { input: 'a', expected: 'a' },
      { input: 'racecar', expected: 'racecar' },
      { input: 'CodeGolf', expected: 'floGedoC' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the reversed string'
  },
  {
    id: 'count-vowels',
    title: 'Count Vowels',
    description: 'Count vowels (a,e,i,o,u) in a string (case-insensitive).',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: 'hello', output: '2' },
      { input: 'AEIOU', output: '5' }
    ],
    testCases: [
      { input: 'hello', expected: '2' },
      { input: 'AEIOU', expected: '5' },
      { input: 'xyz', expected: '0' },
      { input: 'Beautiful', expected: '5' },
      { input: '', expected: '0' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the vowel count'
  },
  {
    id: 'palindrome-check',
    title: 'Palindrome Check',
    description: 'Check if a string is a palindrome. Print "true" or "false".',
    difficulty: 'easy',
    category: 'strings',
    examples: [
      { input: 'racecar', output: 'true' },
      { input: 'hello', output: 'false' }
    ],
    testCases: [
      { input: 'racecar', expected: 'true' },
      { input: 'hello', expected: 'false' },
      { input: 'a', expected: 'true' },
      { input: 'abba', expected: 'true' },
      { input: 'abc', expected: 'false' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print true or false'
  },
  {
    id: 'remove-duplicates',
    title: 'Remove Duplicates',
    description: 'Remove duplicate characters, keeping first occurrence.',
    difficulty: 'medium',
    category: 'strings',
    examples: [
      { input: 'aabbcc', output: 'abc' },
      { input: 'hello', output: 'helo' }
    ],
    testCases: [
      { input: 'aabbcc', expected: 'abc' },
      { input: 'hello', expected: 'helo' },
      { input: 'abcabc', expected: 'abc' },
      { input: 'a', expected: 'a' },
      { input: 'aaa', expected: 'a' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the string with duplicates removed'
  },
  {
    id: 'caesar-cipher',
    title: 'Caesar Cipher',
    description: 'Shift each letter by N positions forward (wrap z→a). First line: string, second line: N. Only shift a-z and A-Z.',
    difficulty: 'medium',
    category: 'strings',
    examples: [
      { input: 'abc\n1', output: 'bcd' },
      { input: 'xyz\n3', output: 'abc' }
    ],
    testCases: [
      { input: 'abc\n1', expected: 'bcd' },
      { input: 'xyz\n3', expected: 'abc' },
      { input: 'Hello\n13', expected: 'Uryyb' },
      { input: 'abc\n0', expected: 'abc' },
      { input: 'Z\n1', expected: 'A' }
    ],
    inputFormat: 'First line: string. Second line: shift N',
    outputFormat: 'Print the shifted string'
  },
  {
    id: 'run-length-encode',
    title: 'Run-Length Encode',
    description: 'Compress using run-length encoding. e.g. "aaabbc" → "3a2b1c".',
    difficulty: 'medium',
    category: 'strings',
    examples: [
      { input: 'aaabbc', output: '3a2b1c' },
      { input: 'aabbbcccc', output: '2a3b4c' }
    ],
    testCases: [
      { input: 'aaabbc', expected: '3a2b1c' },
      { input: 'aabbbcccc', expected: '2a3b4c' },
      { input: 'a', expected: '1a' },
      { input: 'abc', expected: '1a1b1c' },
      { input: 'zzzzz', expected: '5z' }
    ],
    inputFormat: 'A string via stdin',
    outputFormat: 'Print the run-length encoded string'
  },
  {
    id: 'longest-common-prefix',
    title: 'Longest Common Prefix',
    description: 'Given a JSON array of strings, find the longest common prefix.',
    difficulty: 'medium',
    category: 'strings',
    examples: [
      { input: '["flower","flow","flight"]', output: 'fl' },
      { input: '["dog","racecar","car"]', output: '' }
    ],
    testCases: [
      { input: '["flower","flow","flight"]', expected: 'fl' },
      { input: '["dog","racecar","car"]', expected: '' },
      { input: '["abc","abc","abc"]', expected: 'abc' },
      { input: '["a"]', expected: 'a' },
      { input: '["prefix","pre","prepare"]', expected: 'pre' }
    ],
    inputFormat: 'A JSON array of strings via stdin',
    outputFormat: 'Print the longest common prefix'
  },
  {
    id: 'anagram-check',
    title: 'Anagram Check',
    description: 'Check if two strings (on separate lines) are anagrams (case-insensitive). Print "true" or "false".',
    difficulty: 'medium',
    category: 'strings',
    examples: [
      { input: 'listen\nsilent', output: 'true' },
      { input: 'hello\nworld', output: 'false' }
    ],
    testCases: [
      { input: 'listen\nsilent', expected: 'true' },
      { input: 'hello\nworld', expected: 'false' },
      { input: 'Astronomer\nMoon starer', expected: 'false' },
      { input: 'abc\ncba', expected: 'true' },
      { input: 'aab\naba', expected: 'true' }
    ],
    inputFormat: 'Two strings, one per line',
    outputFormat: 'Print true or false'
  },

  // ═══════════════════════════════════════════
  //  MATH
  // ═══════════════════════════════════════════
  {
    id: 'fizzbuzz-single',
    title: 'FizzBuzz Single',
    description: 'Given N: print "Fizz" if divisible by 3, "Buzz" if by 5, "FizzBuzz" if both, else N.',
    difficulty: 'easy',
    category: 'math',
    examples: [
      { input: '15', output: 'FizzBuzz' },
      { input: '7', output: '7' }
    ],
    testCases: [
      { input: '15', expected: 'FizzBuzz' },
      { input: '3', expected: 'Fizz' },
      { input: '5', expected: 'Buzz' },
      { input: '7', expected: '7' },
      { input: '30', expected: 'FizzBuzz' }
    ],
    inputFormat: 'An integer via stdin',
    outputFormat: 'Print Fizz, Buzz, FizzBuzz, or the number'
  },
  {
    id: 'is-even',
    title: 'Even or Odd',
    description: 'Print "even" or "odd" for the given number.',
    difficulty: 'easy',
    category: 'math',
    examples: [
      { input: '4', output: 'even' },
      { input: '7', output: 'odd' }
    ],
    testCases: [
      { input: '4', expected: 'even' },
      { input: '7', expected: 'odd' },
      { input: '0', expected: 'even' },
      { input: '1', expected: 'odd' },
      { input: '100', expected: 'even' }
    ],
    inputFormat: 'An integer via stdin',
    outputFormat: 'Print "even" or "odd"'
  },
  {
    id: 'factorial',
    title: 'Factorial',
    description: 'Given N, print N!.',
    difficulty: 'easy',
    category: 'math',
    examples: [
      { input: '5', output: '120' },
      { input: '0', output: '1' }
    ],
    testCases: [
      { input: '5', expected: '120' },
      { input: '0', expected: '1' },
      { input: '1', expected: '1' },
      { input: '7', expected: '5040' },
      { input: '10', expected: '3628800' }
    ],
    inputFormat: 'A non-negative integer via stdin',
    outputFormat: 'Print the factorial'
  },
  {
    id: 'fibonacci',
    title: 'Nth Fibonacci',
    description: 'Print the Nth Fibonacci number (0-indexed). F(0)=0, F(1)=1.',
    difficulty: 'medium',
    category: 'math',
    examples: [
      { input: '6', output: '8' },
      { input: '0', output: '0' }
    ],
    testCases: [
      { input: '6', expected: '8' },
      { input: '0', expected: '0' },
      { input: '1', expected: '1' },
      { input: '10', expected: '55' },
      { input: '15', expected: '610' }
    ],
    inputFormat: 'An integer N via stdin',
    outputFormat: 'Print the Nth Fibonacci number'
  },
  {
    id: 'is-prime',
    title: 'Is Prime',
    description: 'Print "true" if the number is prime, "false" otherwise.',
    difficulty: 'medium',
    category: 'math',
    examples: [
      { input: '7', output: 'true' },
      { input: '4', output: 'false' }
    ],
    testCases: [
      { input: '7', expected: 'true' },
      { input: '4', expected: 'false' },
      { input: '2', expected: 'true' },
      { input: '1', expected: 'false' },
      { input: '97', expected: 'true' }
    ],
    inputFormat: 'A positive integer via stdin',
    outputFormat: 'Print true or false'
  },
  {
    id: 'gcd',
    title: 'GCD',
    description: 'Print the greatest common divisor of two space-separated positive integers.',
    difficulty: 'medium',
    category: 'math',
    examples: [
      { input: '12 8', output: '4' },
      { input: '7 3', output: '1' }
    ],
    testCases: [
      { input: '12 8', expected: '4' },
      { input: '7 3', expected: '1' },
      { input: '100 25', expected: '25' },
      { input: '17 17', expected: '17' },
      { input: '48 18', expected: '6' }
    ],
    inputFormat: 'Two integers separated by space',
    outputFormat: 'Print the GCD'
  },
  {
    id: 'sum-digits',
    title: 'Sum of Digits',
    description: 'Print the sum of digits of a non-negative integer.',
    difficulty: 'easy',
    category: 'math',
    examples: [
      { input: '123', output: '6' },
      { input: '9999', output: '36' }
    ],
    testCases: [
      { input: '123', expected: '6' },
      { input: '9999', expected: '36' },
      { input: '0', expected: '0' },
      { input: '5', expected: '5' },
      { input: '100', expected: '1' }
    ],
    inputFormat: 'A non-negative integer via stdin',
    outputFormat: 'Print the sum of digits'
  },
  {
    id: 'binary-convert',
    title: 'Decimal to Binary',
    description: 'Print the binary representation of a non-negative integer.',
    difficulty: 'medium',
    category: 'math',
    examples: [
      { input: '10', output: '1010' },
      { input: '255', output: '11111111' }
    ],
    testCases: [
      { input: '10', expected: '1010' },
      { input: '255', expected: '11111111' },
      { input: '0', expected: '0' },
      { input: '1', expected: '1' },
      { input: '42', expected: '101010' }
    ],
    inputFormat: 'A non-negative integer via stdin',
    outputFormat: 'Print the binary representation'
  },
  {
    id: 'collatz-steps',
    title: 'Collatz Steps',
    description: 'Count steps to reach 1 via Collatz sequence. Even: divide by 2. Odd: 3n+1.',
    difficulty: 'medium',
    category: 'math',
    examples: [
      { input: '6', output: '8' },
      { input: '1', output: '0' }
    ],
    testCases: [
      { input: '6', expected: '8' },
      { input: '1', expected: '0' },
      { input: '2', expected: '1' },
      { input: '3', expected: '7' },
      { input: '27', expected: '111' }
    ],
    inputFormat: 'A positive integer via stdin',
    outputFormat: 'Print the step count'
  },
  {
    id: 'prime-factors',
    title: 'Prime Factors',
    description: 'Print prime factorization as space-separated factors in ascending order.',
    difficulty: 'hard',
    category: 'math',
    examples: [
      { input: '12', output: '2 2 3' },
      { input: '100', output: '2 2 5 5' }
    ],
    testCases: [
      { input: '12', expected: '2 2 3' },
      { input: '100', expected: '2 2 5 5' },
      { input: '7', expected: '7' },
      { input: '36', expected: '2 2 3 3' },
      { input: '60', expected: '2 2 3 5' }
    ],
    inputFormat: 'A positive integer > 1 via stdin',
    outputFormat: 'Print prime factors space-separated'
  },
  {
    id: 'roman-to-int',
    title: 'Roman to Integer',
    description: 'Convert a Roman numeral string to an integer.',
    difficulty: 'hard',
    category: 'math',
    examples: [
      { input: 'XIV', output: '14' },
      { input: 'MCMXCIV', output: '1994' }
    ],
    testCases: [
      { input: 'XIV', expected: '14' },
      { input: 'MCMXCIV', expected: '1994' },
      { input: 'III', expected: '3' },
      { input: 'IX', expected: '9' },
      { input: 'XLII', expected: '42' }
    ],
    inputFormat: 'A Roman numeral string via stdin',
    outputFormat: 'Print the integer value'
  }
];