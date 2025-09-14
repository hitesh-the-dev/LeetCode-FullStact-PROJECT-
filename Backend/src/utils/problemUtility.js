const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript": 63
      // ye sari chije Judge0 ke doc me di hue hai
        // read complete Judge0 document(it is very easy and understandable)
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{


const options = {
  method: "POST",
  url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
  params: {
    base64_encoded: "false",
  },
  headers: {
    "x-rapidapi-key": process.env.JUDGE0_KEY,
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json",
  },
  data: {
    submissions,
  },
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

 return await fetchData();

}

const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{

const options = {
  method: "GET",
  url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
  params: {
    tokens: resultToken.join(","),
    base64_encoded: "false",
    fields: "*",
  },
  headers: {
    "x-rapidapi-key": process.env.JUDGE0_KEY,
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
  },
};

async function fetchData() {
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}


 while(true){

 const result =  await fetchData();

  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);

  if(IsResultObtained)
    return result.submissions;


  await waiting(1000);
}


}


module.exports = { getLanguageById, submitBatch, submitToken };


// In place of fetch() we will use axios:
/*

We use Axios for making HTTP requests from the browser or Node.js because it provides a simple and powerful API. Here are some key reasons:
1. **Promise-based**: Axios uses Promises (and async/await) for handling asynchronous operations, which makes it easier to write clean, non-blocking code.
2. **Browser and Node.js**: It works both in the browser (using XMLHttpRequests) and in Node.js (using the built-in `http` module), providing a consistent API.
3. **Request and Response Interceptors**: You can intercept requests and responses to transform or log them, which is useful for adding authentication tokens or handling errors globally.
4. **Automatic JSON Transformation**: Axios automatically transforms JSON data for both requests and responses, so you don't have to parse responses manually.
5. **Cancellation**: It supports request cancellation using the CancelToken API (or AbortController in newer versions), which is useful for canceling requests when a component unmounts or when a new request is made.
6. **Protection against XSRF**: Axios can be configured to include cross-site request forgery (XSRF) tokens in requests.
7. **Progress Updates**: For uploads and downloads, Axios provides a way to monitor progress, which is helpful for tracking file uploads.
8. **Wide Browser Support**: It supports a wide range of browsers, including older ones.
9. **Community and Maintenance**: Axios is widely used and well-maintained, with a large community and plenty of resources available.
Example of a simple GET request with Axios:
```javascript
const axios = require('axios');
// Make a request for a user with a given ID
axios.get('/user?ID=12345')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
```
Using async/await:
```javascript
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```
Example of setting up an interceptor to add an authentication token:
```javascript
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```
While the native `fetch` API is also an option, Axios provides a more feature-rich and convenient way to handle HTTP requests in many cases. However, note that the `fetch` API is built into modern browsers and doesn't require an external library, so for simple use cases, you might prefer to use `fetch`.
Axios is a popular JavaScript library used for making HTTP requests from browsers or Node.js. It offers several advantages over native methods (like fetch) and other alternatives:

1. Simplified Syntax & Consistency
Axios provides a clean, intuitive API (e.g., axios.get(), axios.post()), reducing boilerplate code.

Works consistently across browsers and Node.js, unlike fetch, which requires polyfills for older browsers.

2. Automatic JSON Handling
Automatically transforms request/response data to/from JSON (no need to manually call .json() as with fetch).

Example:

javascript
// With Axios (automatic parsing)
axios.get('/api/data')
  .then(response => console.log(response.data));

// With fetch (manual parsing)
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data));
3. Error Handling
Axios treats HTTP errors (e.g., 404, 500) as promise rejections, simplifying error catching.

fetch only rejects promises for network failures, not HTTP errors, requiring extra checks.

4. Request/Response Interceptors
Intercept and modify requests/responses globally (e.g., add auth headers, log errors):

javascript
// Add token to every request
axios.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
5. Request Cancellation
Supports request cancellation using CancelTokens (or AbortController in newer versions), useful for avoiding unnecessary requests after navigation or user actions.

6. Progress Tracking
Monitor upload/download progress (especially useful for large files):

javascript
axios.post('/api/upload', data, {
  onUploadProgress: progressEvent => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    console.log(percentCompleted);
  }
});
7. Built-in XSRF Protection
Automatically includes CSRF tokens in requests if configured.

8. Concurrent Requests
Execute multiple requests simultaneously using axios.all() and axios.spread().

When to Use Axios vs. fetch
Use Axios for complex applications needing streamlined error handling, interceptors, or advanced features.

Use fetch for simple requests where no external dependencies are desired (though note fetch lacks some features by default).

Example Comparison
javascript
// Axios
axios.post('/api/data', { name: 'John' })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));

// Fetch
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
})
  .then(response => {
    if (!response.ok) throw new Error('HTTP error');
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
Conclusion
Axios simplifies HTTP requests with a developer-friendly API, robust error handling, and advanced features like interceptors and cancellation. While modern fetch is capable, Axios remains a preferred choice for many projects due to its convenience and reliability.

*/
