import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    // jb user form submit krega to jo bhi data hoga vo es userData me aa jayega
    try {
      const response = await axiosClient.post("/user/register", userData); //ye userData server ko bhej diya
      return response.data.user;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("Sending login request with:", credentials);
      const response = await axiosClient.post("/user/login", credentials);
      console.log("Login response received:", response.data);
      return response.data.user;
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      return rejectWithValue({
        message: error.response?.data || error.message || "Login failed",
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check"); //es req ke sath browser token attach kra dega
      // then check hoga ki ye valid user hai ya nhi (es req ke sath bhejne ke liye hmare pass koi data nhi hai
      // esliye hmne koi data nhi bheja)
      // (e.g coderArmy login button , jaise es pr click krte hai to browser token bhej deta hai bakend ko then check
      //   hota hai ki hm valid user hai ya nhi agar ha to apn direct wibsite me enter ho jate hai, apn ko login ka data
      //   fill nhi krna pdta)

      return data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue(null); // Special case for no session
      }
      return rejectWithValue(error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register User Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true; //loading: ki page load ho rha(value true) hai ya load ho gya(value false),
        //       so that agar loading ki value true hai to ab agar user again req bhejega to apn us req ko nhi bhejenge
        //       backedn ko(e.g user ne first time login page pr click kiya then loading ki value true hogi jb tk
        //       ki page load na ho jaye, let page load hone se phle hi user ne again page ko load krane ki req bhej di to apn
        //       es req ko backend ko nhi bhejenge, bcoz phle wali req abhi bhi process me hai
        // )

        state.error = null; //i.e abhi koi error nhi hai
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload; //action.payload ==> ye ek obj hoga agar esme user ka data aaya
        // to !action.payload ki value false ho jayegi and !!action.payload ki value true ho jayegi
        //  but agar action.payload me koi data nhi aaya(i.e action.payload=null) then !action.payload ki value true ho jayegi and !!action.payload ki
        //  value false ho jayegi

        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.data || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login User Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.data || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Check Auth Cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.data || null;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout User Cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.data || null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
