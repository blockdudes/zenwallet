import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { readContract, getContract } from "thirdweb";
import { TokenContractABI } from "@/abis/tokenContractABI";
import { client } from "@/lib/client";
import axios from "axios";
import { sepolia } from "thirdweb/chains";

type AssetData = {
    name: string;
    balance: number;
    address: string;
}

type initialUserData = {
    assets: AssetData[] | null;
    error: string | null;
    loading: boolean;
}

const initialUserData: initialUserData = {
    assets: null,
    error: null,
    loading: false,
}

export const getERC20Token = createAsyncThunk("getUserData", async ({ assets, userAddress }: { assets: AssetData[]; userAddress: string }, { rejectWithValue }) => {
    try {

        for (const asset of assets) {
            const contract = await getContract({
                address: asset.address,
                abi: TokenContractABI.abi as any,
                client: client,
                chain: sepolia
            });

            const balance = await readContract({
                contract: contract,
                method: "balanceOf",
                params: [userAddress]
            });

            asset.balance = balance;
        }
        return assets;
    } catch (error) {
        return rejectWithValue(error);
    }
});

const getERC20TokenSlice = createSlice({
    name: "getUserData",
    initialState: initialUserData,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getERC20Token.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getERC20Token.fulfilled, (state, action) => {
            state.loading = false;
            state.assets = action.payload;
            state.error = null;
        });
        builder.addCase(getERC20Token.rejected, (state, action) => {
            console.log("error: ");
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default getERC20TokenSlice.reducer;