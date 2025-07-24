
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
  trackingId: string;
  createdAt: string;
  estimatedDeliveryTime: string;
  updatedAt: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  issue: string;
  driverId: string;
  ownerId: string;
}

interface DeliveryState {
  driverDeliveries: Delivery[];
  driverCompletedDeliveries: Delivery[];
  ownerDeliveries: Delivery[];
  pendingDeliveries: Delivery[]; 
  isLoading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  driverDeliveries: [],
  driverCompletedDeliveries: [],
  ownerDeliveries: [],
  pendingDeliveries: [],
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

export const fetchDriverCompletedDeliveries = createAsyncThunk(
  'deliveries/fetchDriverCompleted',
  async (_, { rejectWithValue }) => {
    try {
      return await deliveryApi.getDriverCompletedDeliveries();
    } catch (error) {
      return rejectWithValue('Failed to fetch driver completed deliveries.');
    }
  }
);

export const fetchPendingDeliveries = createAsyncThunk(
  'deliveries/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      return await deliveryApi.getPendingDeliveries();
    } catch (error) {
      return rejectWithValue('Failed to fetch pending deliveries.');
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
      .addCase(fetchDriverCompletedDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDriverCompletedDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.driverCompletedDeliveries = action.payload;
      })
      .addCase(fetchDriverCompletedDeliveries.rejected, (state, action) => {
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
      })
      .addCase(fetchPendingDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingDeliveries = action.payload;
      })
      .addCase(fetchPendingDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors } = deliverySlice.actions;
export default deliverySlice.reducer;
