import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';
import * as authService from '../../services/auth/authService';
import * as biometricService from '../../services/auth/biometricService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  pinSetup: false,
};

// Async thunks
export const sendPhoneVerificationCode = createAsyncThunk(
  'auth/sendPhoneVerificationCode',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      const verificationId = await authService.sendPhoneVerificationCode(phoneNumber);
      return { verificationId, phoneNumber };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send verification code');
    }
  }
);

export const verifyPhoneCode = createAsyncThunk(
  'auth/verifyPhoneCode',
  async (code: string, { rejectWithValue }) => {
    try {
      const { user, idToken } = await authService.verifyPhoneCode(code);
      return { user, idToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid verification code');
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { user, idToken } = await authService.signInWithEmail(email, password);
      return { user, idToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid email or password');
    }
  }
);

export const setupPin = createAsyncThunk(
  'auth/setupPin',
  async ({ userId, pin }: { userId: string; pin: string }, { rejectWithValue }) => {
    try {
      await authService.storePinSecurely(userId, pin);
      return { pinSetupComplete: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to set up PIN');
    }
  }
);

export const authenticateWithPin = createAsyncThunk(
  'auth/authenticateWithPin',
  async ({ userId, pin }: { userId: string; pin: string }, { rejectWithValue }) => {
    try {
      const isValid = await authService.authenticateWithPin(userId, pin);
      if (!isValid) {
        return rejectWithValue('Invalid PIN');
      }
      return { authenticated: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'PIN verification failed');
    }
  }
);

export const completeAuthentication = createAsyncThunk(
  'auth/completeAuthentication',
  async (
    { user, idToken }: { user: authService.AuthUser; idToken: string },
    { rejectWithValue }
  ) => {
    try {
      // Save user to Firestore
      await authService.saveUserToFirestore(user);
      return { user, idToken };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to complete authentication');
    }
  }
);

export const checkBiometricAvailability = createAsyncThunk(
  'auth/checkBiometricAvailability',
  async (_, { rejectWithValue }) => {
    try {
      const status = await biometricService.checkBiometricAvailability();
      return status;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check biometric availability');
    }
  }
);

export const enableBiometric = createAsyncThunk(
  'auth/enableBiometric',
  async (userId: string, { rejectWithValue }) => {
    try {
      const success = await biometricService.enableBiometricForUser(userId);
      if (!success) {
        return rejectWithValue('Failed to enable biometric');
      }
      return { biometricEnabled: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to enable biometric');
    }
  }
);

export const disableBiometric = createAsyncThunk(
  'auth/disableBiometric',
  async (userId: string, { rejectWithValue }) => {
    try {
      const success = await biometricService.disableBiometricForUser(userId);
      if (!success) {
        return rejectWithValue('Failed to disable biometric');
      }
      return { biometricEnabled: false };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to disable biometric');
    }
  }
);

export const authenticateWithBiometric = createAsyncThunk(
  'auth/authenticateWithBiometric',
  async (_, { rejectWithValue }) => {
    try {
      const success = await biometricService.authenticateWithBiometric('Unlock the app');
      if (!success) {
        return rejectWithValue('Biometric authentication failed');
      }
      return { authenticated: true };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Biometric authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Authentication actions
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.pinSetup = false;
      state.error = null;
    },

    // PIN setup
    setPinSetup: (state, action: PayloadAction<boolean>) => {
      state.pinSetup = action.payload;
    },

    // Loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Update specific user fields
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Biometric settings
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.biometricEnabled = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    // Send phone verification code
    builder
      .addCase(sendPhoneVerificationCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPhoneVerificationCode.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendPhoneVerificationCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Verify phone code
    builder
      .addCase(verifyPhoneCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyPhoneCode.fulfilled, (state) => {
        state.isLoading = false;
        state.pinSetup = false; // Require PIN setup after phone verification
      })
      .addCase(verifyPhoneCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.pinSetup = false; // Require PIN setup after email verification
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Setup PIN
    builder
      .addCase(setupPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setupPin.fulfilled, (state) => {
        state.isLoading = false;
        state.pinSetup = true;
      })
      .addCase(setupPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Authenticate with PIN
    builder
      .addCase(authenticateWithPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateWithPin.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(authenticateWithPin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Complete authentication
    builder
      .addCase(completeAuthentication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeAuthentication.fulfilled, (state, action: any) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(completeAuthentication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check biometric availability
    builder
      .addCase(checkBiometricAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkBiometricAvailability.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkBiometricAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Enable biometric
    builder
      .addCase(enableBiometric.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(enableBiometric.fulfilled, (state, action: any) => {
        state.isLoading = false;
        if (state.user) {
          state.user.biometricEnabled = action.payload.biometricEnabled;
        }
      })
      .addCase(enableBiometric.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Disable biometric
    builder
      .addCase(disableBiometric.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disableBiometric.fulfilled, (state, action: any) => {
        state.isLoading = false;
        if (state.user) {
          state.user.biometricEnabled = action.payload.biometricEnabled;
        }
      })
      .addCase(disableBiometric.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Authenticate with biometric
    builder
      .addCase(authenticateWithBiometric.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(authenticateWithBiometric.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(authenticateWithBiometric.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUser,
  clearAuth,
  setPinSetup,
  setLoading,
  setError,
  clearError,
  updateUserProfile,
  setBiometricEnabled,
} = authSlice.actions;

export default authSlice.reducer;
