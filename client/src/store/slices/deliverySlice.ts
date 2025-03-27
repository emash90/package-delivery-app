
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deliveryApi } from '../../services/api';

export interface Delivery {
  id: string;
  package: string;
  address: string;
  recipient: string;
  phone: string;
  timeWindow: string;
  status: string;
  distance: string;
}

interface DeliveryState {
  driverDeliveries: Delivery[];
  ownerDeliveries: Delivery[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  driverDeliveries: [],
  ownerDeliveries: [],
  isLoading: false,
  error: null,
};

export const fetchDriverDeliveries = createAsyncThunk(
  'deliveries/fetchDriver',
  async (_, { rejectWithValue }) => {
    try {
      return await deliveryApi.getDriverDeliveries();
    } catch (error) {
      return rejectWithValue('Failed to fetch driver deliveries.');
    }
  }
);

export const fetchOwnerDeliveries = createAsyncThunk(
  'deliveries/fetchOwner',
  async (_, { rejectWithValue }) => {
    try {
      return await deliveryApi.getOwnerDeliveries();
    } catch (error) {
      return rejectWithValue('Failed to fetch owner deliveries.');
    }
  }
);

export const startDelivery = createAsyncThunk(
  'deliveries/start',
  async (deliveryId: string, { rejectWithValue }) => {
    try {
      return await deliveryApi.startDelivery(deliveryId);
    } catch (error) {
      return rejectWithValue('Failed to start delivery.');
    }
  }
);

export const completeDelivery = createAsyncThunk(
  'deliveries/complete',
  async (deliveryId: string, { rejectWithValue }) => {
    try {
      return await deliveryApi.completeDelivery(deliveryId);
    } catch (error) {
      return rejectWithValue('Failed to complete delivery.');
    }
  }
);

const deliverySlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDriverDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.driverDeliveries = action.payload;
      })
      .addCase(fetchDriverDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOwnerDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOwnerDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ownerDeliveries = action.payload;
      })
      .addCase(fetchOwnerDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(startDelivery.fulfilled, (state, action) => {
        const index = state.driverDeliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.driverDeliveries[index] = action.payload;
        }
      })
      .addCase(completeDelivery.fulfilled, (state, action) => {
        const index = state.driverDeliveries.findIndex(
          (delivery) => delivery.id === action.payload.id
        );
        if (index !== -1) {
          state.driverDeliveries[index] = action.payload;
        }
      });
  },
});

export const { clearErrors } = deliverySlice.actions;
export default deliverySlice.reducer;
