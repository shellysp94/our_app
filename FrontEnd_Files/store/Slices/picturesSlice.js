import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  myPictures: [],
  tempPictures: [],
};

export const picturesSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setAllMyPictures: (state, action) => {
      state.myPictures = [...action.payload.myPictures];
    },
    uploadImages: (state, action) => {
      if (action.payload?.myPictures[1] !== undefined)
        state.myPictures = [...state.myPictures, action.payload?.myPictures[1]];
      if (action.payload?.myPictures[2] !== undefined)
        state.myPictures = [...state.myPictures, action.payload?.myPictures[2]];
    },
    uploadMainImage: (state, action) => {
      state.myPictures[0] = action.payload.myMain;
    },
    setTempPictures: (state, action) => {
      state.tempPictures[action.payload.key] = {image: action.payload.value};
    },
    clearTempPictures: state => {
      state.tempPictures = [];
    },
    clearMyPictures: state => {
      state.myPictures = [];
    },
    clearPicturesSlice: state => initialState,
  },
});

export const {
  getMyPictures,
  setTempPictures,
  clearTempPictures,
  uploadImages,
  uploadMainImage,
  setAllMyPictures,
  clearMyPictures,
  clearPicturesSlice,
} = picturesSlice.actions;

export default picturesSlice.reducer;
