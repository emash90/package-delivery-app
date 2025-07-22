
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userApi } from '../../services/api';
import { User, UserRole, Permission, DEFAULT_PERMISSIONS } from '../../types/permissions';

interface AuthState {
  user: User | null;
  token: string | null;
  selectedRole: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  selectedRole: null,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await userApi.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await userApi.register(userData);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await userApi.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch user data.');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    localStorage.removeItem('token');
    // No need to dispatch the original logout action if we're handling it here
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSelectedRole: (state, action: PayloadAction<UserRole | null>) => {
      state.selectedRole = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          roleId: action.payload.roleId,
          permissions: action.payload.permissions || DEFAULT_PERMISSIONS[action.payload.role],
          status: action.payload.status,
          lastLogin: action.payload.lastLogin ? new Date(action.payload.lastLogin) : undefined,
          createdAt: action.payload.createdAt ? new Date(action.payload.createdAt) : undefined,
          updatedAt: action.payload.updatedAt ? new Date(action.payload.updatedAt) : undefined,
        }
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          roleId: action.payload.roleId,
          permissions: action.payload.permissions || DEFAULT_PERMISSIONS[action.payload.role],
          status: action.payload.status,
          lastLogin: action.payload.lastLogin ? new Date(action.payload.lastLogin) : undefined,
          createdAt: action.payload.createdAt ? new Date(action.payload.createdAt) : undefined,
          updatedAt: action.payload.updatedAt ? new Date(action.payload.updatedAt) : undefined,
        };
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.selectedRole = null;
      });
  },
});

export const { setSelectedRole, clearErrors } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserPermissions = (state: { auth: AuthState }) => state.auth.user?.permissions || [];
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsAuthenticated = (state: { auth: AuthState }) => !!state.auth.user && !!state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// Permission checking selector
export const selectHasPermission = (state: { auth: AuthState }, permission: Permission) => {
  const userPermissions = state.auth.user?.permissions || [];
  return userPermissions.includes(permission);
};

// Multiple permissions checking selector
export const selectHasAnyPermission = (state: { auth: AuthState }, permissions: Permission[]) => {
  const userPermissions = state.auth.user?.permissions || [];
  return permissions.some(permission => userPermissions.includes(permission));
};

// Role checking selector
export const selectHasRole = (state: { auth: AuthState }, role: UserRole) => {
  return state.auth.user?.role === role;
};

export default authSlice.reducer;
