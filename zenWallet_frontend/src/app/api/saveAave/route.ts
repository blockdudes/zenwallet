import axios from "axios";
import { ethers } from "ethers";
import { fetchWalletAddress, sendMessage } from "@/lib/utils/helper";
import connectToDatabase from '@/lib/mongodb';
import { User, ISaveAaveData, Aave } from "@/lib/models/User";

export const POST = async (request: any) => {
    try {
        await connectToDatabase();
        const saveAaveData = await request.json();
        const { userAddress, amount, tokenAddress, callbackType } = saveAaveData;
        console.log(userAddress, amount, tokenAddress, callbackType);
        const aave = await Aave.create({ userAddress, amount, tokenAddress, callbackType });
        console.log(aave);
        await aave.save();
        return new Response(JSON.stringify({ message: "Processed successfully" }), { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

