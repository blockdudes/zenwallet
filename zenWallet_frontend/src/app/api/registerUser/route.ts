import axios from "axios";
import { ethers } from "ethers";
import { fetchWalletAddress, sendMessage } from "@/lib/utils/helper";
import connectToDatabase from '@/lib/mongodb';
import { User } from "@/lib/models/User";



const TELEGRAM_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

if (!TELEGRAM_TOKEN) {
    console.error('Telegram bot token is not set. Please check your environment variables.');
}

const userStates: { [key: number]: string } = {};

async function setBotCommands() {
    try {
        const commands = [
            { command: 'start', description: 'Start interacting with the bot' },
            { command: 'register', description: 'Register your email' },
            { command: 'help', description: 'Get help' },
        ];
        const response = await axios.post(`${TELEGRAM_API}/setMyCommands`, { commands });
        console.log('Bot commands set:', response.data);
    } catch (error) {
        console.error('Error setting bot commands:', error);
    }
}

setBotCommands();

async function handleMessage(update: any) {
    
    let chatId;
    console.log(chatId)
    let text;

    if (update.callback_query) {
        chatId = update.callback_query.message.chat.id;
        text = update.callback_query.data;
    } else if (update.message) {
        chatId = update.message.chat.id;
        text = update.message.text;
    } else {
        console.error('Unhandled update type:', update);
        return;
    }

    const state = userStates[chatId];

    if (text === '/start') {
        const message = "Welcome to our service! 🎉 Please choose an option:";
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📝 Register", callback_data: 'register' }],
                    [{ text: "ℹ️ Help", callback_data: 'help' }]
                ]
            }
        };
        await sendMessage(chatId, message, options);
    } else if (text === '/register' || text === 'register' && state !== 'awaiting_help') {
        userStates[chatId] = 'awaiting_email';
        await sendMessage(chatId, "Please enter your email:");
    } else if (text === 'help' || text === '/help') {
        userStates[chatId] = 'awaiting_help';
        await sendMessage(chatId, "Please write your query. We will contact you shortly.");
    } else if (state === 'awaiting_help') {
        await sendMessage(chatId, "Thanks, we will get back to you soon.");
        delete userStates[chatId];
    } else if (state === 'awaiting_email') {
        const existingUser = await User.findOne({email: text})
        if(existingUser){
            await sendMessage(chatId, "You are already subscribed.");
        }else{
            await saveData(chatId, text);
            delete userStates[chatId];
            await sendMessage(chatId, "Thank you, your email has been subscribed.");
        }
    }
}


async function saveData(chatId: number, email: string) {
    try {
        await connectToDatabase();
        const walletAddress = await fetchWalletAddress(email);
        const newUser = new User({
            email: email,
            walletAddress: walletAddress,
            telegramChatId: chatId,
        })


        await newUser.save(); 
        await sendMessage(chatId, "User registered successfully!");
    } catch (error) {
        console.error('Failed to save email:', error);
        await sendMessage(chatId, "Failed to save email.");
    }
}

export const POST = async (request: any) => {
    try {
        const webhookData = await request.json();
        await handleMessage(webhookData);
        return new Response(JSON.stringify({ message: "Processed successfully" }), { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

