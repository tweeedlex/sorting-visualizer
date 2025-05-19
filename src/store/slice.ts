import { createSlice } from "@reduxjs/toolkit";
import {Settings, User} from "../requests/user/types.ts";

export const dataSlice = createSlice({
	name: "data",
	initialState: {
		user: null as User | null,
		settings: null as Settings | null,
	},
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setSettings: (state, action) => {
			state.settings = action.payload;
		}
	},
});

export const {
	setUser,
	setSettings
} = dataSlice.actions;

export default dataSlice.reducer;
