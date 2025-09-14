const mongoose = require("mongoose");
const { Schema } = mongoose;

const problemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: [String],
    enum: ["easy", "medium", "hard"],
    required: true,
  },

  tags: {
    type: [String],
    enum: [
      // Basic Data Structures
      "array",
      "string",
      "linkedList",
      "stack",
      "queue",
      "hashMap",
      "hashSet",

      // Trees and Graphs
      "binaryTree",
      "binarySearchTree",
      "tree",
      "graph",
      "dfs",
      "bfs",
      "topologicalSort",

      // Recursion & Backtracking
      "recursion",
      "backtracking",

      // Dynamic Programming
      "dp",
      "memoization",
      "tabulation",
      "knapsack",
      "lcs",
      "lis",

      // Greedy
      "greedy",

      // Math
      "math",
      "prime",
      "gcd",
      "lcm",
      "combinatorics",
      "geometry",
      "modulo",

      // Searching & Sorting
      "binarySearch",
      "twoPointers",
      "slidingWindow",
      "mergeSort",
      "quickSort",
      "countingSort",

      // Bit Manipulation
      "bitManipulation",

      // Strings
      "kmp",
      "manacher",
      "trie",
      "stringMatching",

      // Heaps & Priority Queues
      "heap",
      "priorityQueue",

      // Graph Algorithms
      "dijkstra",
      "floydWarshall",
      "bellmanFord",
      "kruskal",
      "prim",
      "unionFind",
      "disjointSet",

      // Intervals
      "intervals",
      "sweepLine",

      // Geometry
      "geometry",
      "convexHull",

      // Others
      "simulation",
      "design",
      "monotonicStack",
      "monotonicQueue",
      "prefixSum",
      "differenceArray",

      // Advanced Topics
      "segmentTree",
      "fenwickTree",
      "lineSweep",
      "divideAndConquer",
      "rollingHash",
      "suffixArray",

      // Concurrency / OOP
      "oop",
      "concurrency",
    ],
    default: [],
    required: true,
    set: (tags) => tags.map((tag) => tag.toLowerCase()),
  },

  visibleTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: true,
      },
    },
  ],

  hiddenTestCases: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
    },
  ],

  startCode: [
    {
      language: {
        type: String,
        required: true,
      },
      initialCode: {
        type: String,
        required: true,
      },
    },
  ],
  /*
        actual Solution of the problem
        1)so that paid user ko ye solution bta paye and 2)jb user khud ke test case ke liye check
        kre to usko pta paye ki es test case ke liye actual output kya hai
   */
  referenceSolution: [
    {
      language: {
        type: String,
        required: true,
      },
      completeCode: {
        type: String,
        required: true,
      },
    },
  ],

  problemCreator: {
    type: Schema.Types.ObjectId,
    // ki kis person ne es particular question ko  bnaya hai, uski ID user.js me Schema
    // me se leli usi ko ObjectId bol rhe hai
    ref: "user",
    required: true,

  },
});

const Problem = mongoose.model("problem", problemSchema);

module.exports = Problem;

/*

   const referenceSolution = [
    {
        language:"c++",
        completeCode:"C++ Code"
    },
    {
        language:"java",
        completeCode:"java Code"
    },
    {
        language:"js",
        completeCode:"JS Code"
    },
]

*/
