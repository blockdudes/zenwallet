import axios from "axios";
import connectToDatabase from '@/lib/mongodb';
import { User } from "@/lib/models/User";


export const GET = async (request: any) => {
    try {
        await connectToDatabase();
        const users = await User.find();
        return new Response(JSON.stringify({ users }), { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

