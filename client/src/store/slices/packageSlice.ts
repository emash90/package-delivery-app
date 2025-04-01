import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { packageApi } from '../../services/api';
import { logout } from './authSlice'


export interface PackageImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Package {
  id?: string;
  name: string;
  status: string;
  location: string;
  eta: string;
  trackingId? : string;
  createdAt: string;
  recipientContact: string;
  lastUpdate: string;
  images: PackageImage[];
  category: string;
  weight: number;
  description?: string;
  recipientName?: string;
  recipientAddress?: string;
  recipientPhone?: string;
  userId?: string;
}

interface PackageState {
  packages: Package[];
  availablePackages: Package[];
  currentPackage: Package | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  packages: [],
  availablePackages: [],
  currentPackage: null,
  isLoading: false,
  error: null,
};

// Updated to accept userId parameter
export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await packageApi.getByUserId(userId);
    } catch (error) {
      return rejectWithValue('Failed to fetch packages.');
    }
  }
);

export const fetchAvailablePackages = createAsyncThunk(
  'packages/fetchAvailable',
  async (_, { rejectWithValue }) => {
    try {
      return await packageApi.getAvailable();
    } catch (error) {
      return rejectWithValue('Failed to fetch available packages.');
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await packageApi.getById(id);
    } catch (error) {
      return rejectWithValue('Failed to fetch package details.');
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/create',
  async (packageData: Package, { rejectWithValue }) => {
    try {
      return await packageApi.create(packageData);
    } catch (error) {
      return rejectWithValue('Failed to create package.');
    }
  }
);

// New updatePackage thunk
export const updatePackage = createAsyncThunk(
  'packages/update',
  async (packageData: Package, { rejectWithValue }) => {
    try {
      if (!packageData.id) {
        throw new Error('Package ID is required for update');
      }
      return await packageApi.update(packageData.id, packageData);
    } catch (error) {
      return rejectWithValue('Failed to update package.');
    }
  }
);

export const uploadPackageImage = createAsyncThunk(
  'packages/uploadImage',
  async ({ packageId, formData }: { packageId: string, formData: FormData }, { rejectWithValue }) => {
    try {
      return await packageApi.uploadImage(packageId, formData);
    } catch (error) {
      return rejectWithValue('Failed to upload image.');
    }
  }
);

const packageSlice = createSlice({
  name: 'packages',
  initialState,
  reducers: {
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages = action.payload.map(({ _id, ...rest }) => ({
          ...rest,
          id: _id
        }));
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAvailablePackages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePackages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availablePackages = action.payload;
      })
      .addCase(fetchAvailablePackages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPackageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPackage = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.packages.push(action.payload);
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePackage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update the package in the packages array
        const index = state.packages.findIndex(pkg => pkg.id === action.payload.id);
        if (index !== -1) {
          state.packages[index] = action.payload;
        }
        // Update currentPackage if it's the one being updated
        if (state.currentPackage && state.currentPackage.id === action.payload.id) {
          state.currentPackage = action.payload;
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadPackageImage.fulfilled, (state, action) => {
        if (state.currentPackage && state.currentPackage.id === action.payload.packageId) {
          state.currentPackage.images.push(action.payload.image);
        }
      })
      .addCase(logout.fulfilled, (state) => {
        state.packages = [];
        state.availablePackages = [];
        state.currentPackage = null;
      });
  },
});

export const { clearCurrentPackage, clearErrors } = packageSlice.actions;
export default packageSlice.reducer;