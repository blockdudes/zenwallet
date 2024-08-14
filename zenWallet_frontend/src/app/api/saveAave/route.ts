import axios from "axios";
import { ethers } from "ethers";
import { fetchWalletAddress, sendMessage } from "@/lib/utils/helper";
import connectToDatabase from '@/lib/mongodb';
import { User , ISaveAaveData} from "@/lib/models/User";

export const POST = async (request: any) => {
    try {
        const saveAaveData: ISaveAaveData = await request.json();
        const { userAddress, amount, tokenAddress, callbackType } = saveAaveData;
        const user = await User.findOne({ telegramChatId: userAddress });
        if (!user) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }
        user.aaveData.push({ userAddress, amount, tokenAddress, callbackType });
        await user.save();
        return new Response(JSON.stringify({ message: "Processed successfully" }), { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

