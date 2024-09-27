// store/yourSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface productState {
  id: number;
  name: string;
  description: string;
  thumbnail: string[];
  images: string[];
  price: number;
  discount: number;
  category: string;
  brand: string;
  tags: string[];
  variants: object[];
}

const initialState: productState = {
  id: 0,
  name: "",
  description: "",
  thumbnail: [],
  images: [],
  price: 0,
  discount: 0,
  category: "",
  brand: "",
  tags: [],
  variants: [],
};

const createProductSlice = createSlice({
  name: "addProductSlice",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.id = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setThumbnail: (state, action) => {
      state.thumbnail = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBrand: (state, action) => {
      state.brand = action.payload;
    },
    setTags(state, action: PayloadAction<string[]>) {
      state.tags = action.payload;
    },
    setVariants(state, action: PayloadAction<Object[]>) {
      state.variants = action.payload;
    },
    clearProductFields(state) {
      return initialState; // Reset to initial state
    },
  },
});

export const {
  setId,
  setName,
  setDescription,
  setThumbnail,
  setImages,
  setPrice,
  setDiscount,
  setCategory,
  setBrand,
  setTags,
  setVariants,
  clearProductFields,
} = createProductSlice.actions;
export default createProductSlice.reducer;
