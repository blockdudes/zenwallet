"use client"
import axios from "axios";

export const getUserData = async (address: string) => {
    console.log("helper");
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/getUser/${address}`);
    console.log(response);
    return response.data;
}

export const postAsset = async (address: string, asset: string, amount: number, type: number) => {
    console.log({
        "address": address,
        "asset": asset,
        "amount": amount,
        "type": type
    });
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/saveAave`, { address,amount,asset,type });
    return response.data;
}


