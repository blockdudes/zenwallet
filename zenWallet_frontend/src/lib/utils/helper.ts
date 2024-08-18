import axios from 'axios';
import { ethers } from 'ethers';

const TELEGRAM_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

if (!TELEGRAM_TOKEN) {
    console.error('Telegram bot token is not set. Please check your environment variables.');
}

async function fetchWalletAddress(email: string): Promise<string | null> {
    const apiUrl = `https://embedded-wallet.thirdweb.com/api/2023-11-30/embedded-wallet/user-details?queryBy=email&email=${email}`;
    const config = {
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY}`
        }
    };
    try {
        const response = await axios.get(apiUrl, config);
        return response.data[0].walletAddress;
    } catch (error) {
        console.error('Error fetching wallet address:', error);
        return null;
    }
}

async function sendMessage(chatId: number, text: string, options: any = {}) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: text,
        ...options
    });
}

async function getUserData(address: string) {
    console.log("helper");
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getUser/${address}`);
    console.log(response);
    return response.data;
}

async function postAsset(address: string, asset: string, amount: number, type: number) {

    const response = await axios.post(`/api/saveAave`, { userAddress: address, amount: amount, tokenAddress: asset, callbackType: type });
    return response.data;
}


const providerAmoy = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_AMOY_RPC_URL);
const providerSepolia = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL);
const usdcAddress = "0x267EFC7CCbCEf743FdA8EB1a3Ec95656a4A4CF25";
const usdtAddress = "0x21Dc74F18166F73d48978c3E3167F29c44a19328";
const zwalletAddress = "0xCc36eA2d9a5fB00b2E5eE9eddBe862deEEDF44a8";
export { fetchWalletAddress, sendMessage, getUserData, postAsset , providerAmoy, providerSepolia, usdcAddress, usdtAddress, zwalletAddress};
