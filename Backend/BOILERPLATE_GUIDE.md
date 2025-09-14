# Boilerplate Code System Guide

## Overview
This system provides automatic boilerplate code for Java, C++, and JavaScript in the problem page. The boilerplate code is stored in the `startCode` field of each problem and is automatically loaded when users switch between languages.

## Language Mapping

### Frontend to Backend (for fetching boilerplate code)
- `javascript` → `JavaScript`
- `java` → `Java` 
- `cpp` → `C++`

### Backend to Frontend (for submissions)
- `C++` → `c++`
- `Java` → `java`
- `JavaScript` → `javascript`

## How It Works

1. **Problem Creation**: When creating a problem, include `startCode` array with language-specific boilerplate code:
   ```javascript
   startCode: [
     {
       language: "C++",
       initialCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}"
     },
     {
       language: "Java", 
       initialCode: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}"
     },
     {
       language: "JavaScript",
       initialCode: "// Your code here\nconsole.log('Hello World');"
     }
   ]
   ```

2. **Frontend Loading**: The frontend automatically loads the appropriate boilerplate code when:
   - A problem is first loaded
   - User switches between languages
   - The language mapping correctly maps frontend language codes to backend language names

3. **Code Submission**: When submitting code, the language is mapped back to the format expected by the Judge0 API.

## File Structure

- `boilerplate-templates.js` - Contains sample problem templates with proper boilerplate code
- `create-sample-problem.js` - Script to create sample problems with boilerplate code
- `test-language-mapping.js` - Test script to verify language mapping works correctly

## Usage

### Creating a New Problem with Boilerplate Code

1. Use the templates in `boilerplate-templates.js` as a reference
2. Ensure language names match exactly: "C++", "Java", "JavaScript"
3. Include comprehensive boilerplate code that helps users get started

### Testing the System

1. Run `node test-language-mapping.js` to verify language mapping
2. Run `node create-sample-problem.js` to create a test problem
3. Check the frontend to ensure boilerplate code loads correctly

## Troubleshooting

### Boilerplate Code Not Loading
- Check that language names in `startCode` match exactly: "C++", "Java", "JavaScript"
- Verify the language mapping in `ProblemPage.jsx` is correct
- Check browser console for any errors

### Language Switching Issues
- Ensure the `useEffect` hook in `ProblemPage.jsx` is properly updating the code
- Verify the language mapping object is correctly mapping frontend to backend languages

### Submission Issues
- Check that the backend language mapping in `userSubmission.js` correctly converts frontend language codes to backend format
- Verify Judge0 API receives the correct language identifier
