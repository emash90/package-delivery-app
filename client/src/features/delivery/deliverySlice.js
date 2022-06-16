import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import deliveryService from "./deliveryService";

const initialState = {
    allDeliveries: [],
    deliveries: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

//create delivery

export const createDelivery = createAsyncThunk(
    "deliveries/create",
    async (deliveryData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.createDelivery(deliveryData, token);
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
//get deliveries
export const getDeliveries = createAsyncThunk(
    "deliveries/getAll",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.getDeliveries(token);
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
//get all deliveries
export const getAllDeliveries = createAsyncThunk(
    "deliveries/getEverything",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.getAllDeliveries(token);
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

//get single delivery

export const getOneDelivery = createAsyncThunk(
    "deliveries/getOne",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.getOneDelivery(id, token);
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

//update delivery
export const updatedDelivery = createAsyncThunk(
    "deliveries/updateOne",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.updatedDelivery(id, token);
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

//delete delivery
export const deleteDelivery = createAsyncThunk(
    "deliveries/delete",
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await deliveryService.deleteDelivery(id, token);
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
export const deliverySlice = createSlice({
    name: "deliveries",
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
            .addCase(createDelivery.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries.push(action.payload);
            })
            .addCase(createDelivery.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getDeliveries.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDeliveries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload;
            })
            .addCase(getDeliveries.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getAllDeliveries.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllDeliveries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.allDeliveries = action.payload;
            })
            .addCase(getAllDeliveries.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getOneDelivery.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getOneDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload;
            })
            .addCase(getOneDelivery.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updatedDelivery.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updatedDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = action.payload;
            })
            .addCase(updatedDelivery.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteDelivery.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteDelivery.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.deliveries = state.deliveries.filter(
                    (pack) => pack._id !== action.payload.id
                );
            })
            .addCase(deleteDelivery.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});
export const { reset } = deliverySlice.actions;
export default deliverySlice.reducer;
