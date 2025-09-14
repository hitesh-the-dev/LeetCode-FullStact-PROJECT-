// Boilerplate templates for different programming languages
// These templates provide a good starting point for coding problems

const boilerplateTemplates = {
  "Two Sum": {
    title: "Two Sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
    difficulty: "easy",
    tags: ["array", "hashMap"],
    visibleTestCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    hiddenTestCases: [
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      },
      {
        input: "nums = [1,2,3,4,5], target = 8",
        output: "[2,4]"
      }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: `#include <vector>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};

int main() {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = solution.twoSum(nums, target);
    
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your code here
    
};

// Test case
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: `#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            
            if (map.find(complement) != map.end()) {
                return {map[complement], i};
            }
            
            map[nums[i]] = i;
        }
        
        return {};
    }
};

int main() {
    Solution solution;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = solution.twoSum(nums, target);
    
    cout << "[" << result[0] << "," << result[1] << "]" << endl;
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = solution.twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
};

// Test case
const nums = [2, 7, 11, 15];
const target = 9;
const result = twoSum(nums, target);
console.log(result);`
      }
    ]
  },
  
  "Add Two Numbers": {
    title: "Add Two Numbers",
    description: `Write a program that takes two integers as input and returns their sum.

Example 1:
Input: 2 3
Output: 5
Explanation: 2 + 3 equals 5

Example 2:
Input: -1 5
Output: 4
Explanation: -1 + 5 equals 4

Constraints:
- -10^9 <= a, b <= 10^9`,
    difficulty: "easy",
    tags: ["math"],
    visibleTestCases: [
      {
        input: "2 3",
        output: "5",
        explanation: "2 + 3 equals 5"
      },
      {
        input: "-1 5",
        output: "4",
        explanation: "-1 + 5 equals 4"
      }
    ],
    hiddenTestCases: [
      {
        input: "10 20",
        output: "30"
      },
      {
        input: "100 250",
        output: "350"
      }
    ],
    startCode: [
      {
        language: "C++",
        initialCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    // Read input here
    cin >> a >> b;
    
    // Calculate and output the sum
    cout << a + b << endl;
    
    return 0;
}`
      },
      {
        language: "Java",
        initialCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Read input here
        int a = sc.nextInt();
        int b = sc.nextInt();
        
        // Calculate and output the sum
        System.out.println(a + b);
        
        sc.close();
    }
}`
      },
      {
        language: "JavaScript",
        initialCode: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const [a, b] = input.split(' ').map(Number);
    
    // Calculate and output the sum
    console.log(a + b);
    
    rl.close();
});`
      }
    ],
    referenceSolution: [
      {
        language: "C++",
        completeCode: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`
      },
      {
        language: "Java",
        completeCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}`
      },
      {
        language: "JavaScript",
        completeCode: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    const [a, b] = input.split(' ').map(Number);
    console.log(a + b);
    rl.close();
});`
      }
    ]
  }
};

module.exports = boilerplateTemplates;
