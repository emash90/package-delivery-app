import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import packageService from "./packageService";

const initialState = {
    packages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

//create package

export const createPackage = createAsyncThunk(
    "packages/create",
    async (packageData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.createPackage(packageData, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//get packages
export const getPackages = createAsyncThunk(
    "packages/getAll",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.getPackages(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//get all packages
export const getAllPackages = createAsyncThunk(
    "packages/getEverything",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.getAllPackages(token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
//get single package

export const getOnePackage = createAsyncThunk(
    "packages/getOne",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.getOnePackage(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//update package
export const updatedPackage = createAsyncThunk(
    "packages/updateOne",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.updatedPackage(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

//delete package
export const deletePackage = createAsyncThunk(
    "packages/delete",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await packageService.deletePackage(id, token);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);
export const packageSlice = createSlice({
    name: "packages",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createPackage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createPackage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages.push(action.payload);
            })
            .addCase(createPackage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllPackages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllPackages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages = action.payload;
            })
            .addCase(getAllPackages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getPackages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPackages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages = action.payload;
            })
            .addCase(getPackages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getOnePackage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOnePackage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages = action.payload;
            })
            .addCase(getOnePackage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updatedPackage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatedPackage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages = action.payload;
            })
            .addCase(updatedPackage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deletePackage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deletePackage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.packages = state.packages.filter(
                    (pack) => pack._id !== action.payload.id
                );
            })
            .addCase(deletePackage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});
export const { reset } = packageSlice.actions;
export default packageSlice.reducer;
