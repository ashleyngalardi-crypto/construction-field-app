import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WebRoute =
  | 'auth'
  | 'phone-auth'
  | 'sms-verification'
  | 'pin-setup'
  | 'pin-lock'
  | 'admin-login'
  | 'main'
  | 'home'
  | 'tasks'
  | 'crew'
  | 'admin';

export interface NavigationParam {
  phoneNumber?: string;
  [key: string]: any;
}

interface WebNavigationState {
  current: WebRoute;
  history: WebRoute[];
  params: Record<WebRoute, NavigationParam>;
}

const initialState: WebNavigationState = {
  current: 'auth',
  history: [],
  params: {
    'auth': {},
    'phone-auth': {},
    'sms-verification': {},
    'pin-setup': {},
    'pin-lock': {},
    'admin-login': {},
    'main': {},
    'home': {},
    'tasks': {},
    'crew': {},
    'admin': {},
  },
};

export const webNavigationSlice = createSlice({
  name: 'webNavigation',
  initialState,
  reducers: {
    navigateTo: (
      state,
      action: PayloadAction<{ route: WebRoute; params?: NavigationParam }>
    ) => {
      const { route, params } = action.payload;
      state.history.push(state.current);
      state.current = route;
      if (params) {
        state.params[route] = params;
      }
    },
    goBack: (state) => {
      if (state.history.length > 0) {
        state.current = state.history.pop()!;
      }
    },
    reset: (state, action: PayloadAction<WebRoute>) => {
      state.current = action.payload;
      state.history = [];
      state.params = initialState.params;
    },
  },
});

export const { navigateTo, goBack, reset } = webNavigationSlice.actions;
export default webNavigationSlice.reducer;
