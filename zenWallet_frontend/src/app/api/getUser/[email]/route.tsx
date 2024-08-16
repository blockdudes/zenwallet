import axios from "axios";
import connectToDatabase from '@/lib/mongodb';
import { User } from "@/lib/models/User";


export const GET = async (request: any, {params}: {params: {email: string}}) => {
    try {
        await connectToDatabase();
        const identifier = params.email;
        let user;
        if (identifier.startsWith('0x') && !identifier.includes('@')) {
            user = await User.findOne({ walletAddress: identifier });
        } else {
            user = await User.findOne({ email: identifier });
        }
        return new Response(JSON.stringify({ user }), { status: 200 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

