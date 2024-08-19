// {
// "walletTypeId": "0xe146c2986893c43af5ff396310220be92058fb9f4ce76b929b80ef0d5307100a",
// "walletIndex": "0",
// "dstChainId": "0xafa90c317deacd3d68f330a30f96e4fa7736e35e8d1426b2e1b2c04bce1c2fb7",
// "payload": "0x08085737076082610942001901400027474044610356361059860010040080808080",
// "broadcast": true
// }


import RLP from 'rlp';
// import { Transaction } from "ethers";
import {ethers} from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://polygon-amoy.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS");
const wallet = new ethers.Wallet("7931780b6318d124c3e3c0b8654f59a5a31f561970b66e1b609b1e28f5b9438e", provider);
// const abi = new ethers.AbiCoder()

export async function rlpEncodeTx(to, value, gasLimit, gasPrice, nonce, data) {
    const transaction = [
        ethers.toBeHex(nonce).replace(/^0x0+/, '0x'), 
        ethers.toBeHex(gasPrice).replace(/^0x0+/, '0x'), 
        ethers.toBeHex(gasLimit).replace(/^0x0+/, '0x'), 
        ethers.getAddress(to),
        ethers.toBeHex(value).replace(/^0x0+/, '0x'), 
        data,
        '0x', 
        '0x', 
        '0x'  
    ];
    const rlpPayload = RLP.encode(transaction);
    return rlpPayload;
}


    // const rlpEncodedTx = await rlpEncodeTx(
    //     '0x20c9192B145CA6D6274704B244614f356361db59',
    //     BigInt(ethers.parseUnits('0.0001', 'ether').toString()),
    //     25000,
    //     Number(ethers.parseUnits('31', 'gwei')),
    //     BigInt(0),
    //     "0x"
    // );

    // console.log("rlpEncodedTx:", Buffer.from(rlpEncodedTx).toString('hex')); 
    // console.log( await provider.getTransactionCount('0xf858B9B489005f7E09B568ff05A91B5ab761a91F'))
// const hexString = '0x' + transaction.map(byte => byte.toString(16).padStart(2, '0')).join('');
// console.log(hexString);

const signature = ethers.utils.id("Transfer(address,address,uint256,address,address)")
console.log(signature)


// latest 0.2512 balance before recieved

