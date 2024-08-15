import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TokenContractABI } from "../../../abis/tokenContractABI";
import { getContract, prepareContractCall, readContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { client } from "@/lib/client";

type userAsset = {
  name: string;
  amount: number;
  address: string;
};

const initialState = {
  userAssets: [] as userAsset[],
  error: null,
  loading: false,
};

export const getUserAssets = createAsyncThunk(
  "contractCall/getUserAssets",
  async (userAddress: string, { rejectWithValue }) => {
    try {
      const erc20Contract = getContract({
        address: "0x0000000000000000000000000000000000000000",
        abi: TokenContractABI.abi as any,
        chain: sepolia,
        client: client,
      });

      

      const tokenBalance = await readContract({
        contract: erc20Contract,
        method: "balanceOf",
        params: [userAddress],
      });


      return ;

    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
