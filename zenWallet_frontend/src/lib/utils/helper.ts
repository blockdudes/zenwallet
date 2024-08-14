import axios from 'axios';

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

export { fetchWalletAddress , sendMessage};