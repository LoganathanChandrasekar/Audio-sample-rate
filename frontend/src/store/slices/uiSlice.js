import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  toasts: [],
  modalOpen: false,
  modalContent: null,
  theme: 'dark',
};

let toastId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    addToast(state, action) {
      toastId += 1;
      state.toasts.push({
        id: toastId,
        type: action.payload.type || 'info',
        message: action.payload.message,
        duration: action.payload.duration || 4000,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openModal(state, action) {
      state.modalOpen = true;
      state.modalContent = action.payload;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.modalContent = null;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addToast,
  removeToast,
  openModal,
  closeModal,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
