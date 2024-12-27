import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coins: [],
  filteredCoins: [],
  coinType: "",
  signed: false,
  user:{}
};

const coinProjectSlice = createSlice({
  name: "coin",
  initialState,
  reducers: {
    setCoins: (state, action) => {
      state.coins = action.payload;
    },
    setFilteredCoins: (state, action) => {
      state.filteredCoins = action.payload
    },
    setCoinType: (state, action) => {
      state.coinType = action.payload
    },
    setSigned: (state, action) => {
      state.signed = action.payload
    },
    setUser: (state,action) => {
      state.user = action.payload
    }
  },
});

export const {
  setCoins,
  setFilteredCoins,
  setCoinType,
  setSigned,
  setUser
} = coinProjectSlice.actions;
export default coinProjectSlice.reducer;
