import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type AaveData = {
    userAddress: number;
    amount: number;
    tokenAddress: string;
    callbackType: string;
}

type UserData = {
    email: string;
    walletAddress: string;
    telegramChatId: string;
    aaveData: AaveData[];
}

type initialUserData = {
    user: UserData | null;
    error: string | null;
    loading: boolean;
}

const initialUserData: initialUserData = {
    user: null,
    error: null,
    loading: false,
}

export const getUserData = createAsyncThunk("getUserData", async (email: string, { rejectWithValue }) => {
    try {

        const response = await axios.get(`/api/getUser/${email}`);
        let userData: UserData = {
            email: response.data.email,
            walletAddress: response.data.walletAddress,
            telegramChatId: response.data.telegramChatId,
            aaveData: response.data.aaveData,
        }
        return userData;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const getUserDataSlice = createSlice({
    name: "getUserData",
    initialState: initialUserData,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getUserData.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        });
        builder.addCase(getUserData.rejected, (state, action) => {
            console.log("error: ");
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default getUserDataSlice.reducer;



// const SaveAaveDataSchema = new Schema({
//     userAddress: { type: Number, required: true },
//     amount: { type: Number, required: true },
//     tokenAddress: { type: String, required: true },
//     callbackType: { type: String, enum: Object.values(CALLBACK_TYPE), required: true },
// });

// const UserSchema: Schema<IUser> = new Schema({
//     email: { type: String, required: true, unique: true, lowercase: true },
//     walletAddress: { type: String, required: true },
//     telegramChatId: { type: String, required: true },
//     aaveData: { type: [SaveAaveDataSchema], default: [] },
// }, { timestamps: true });


