import { ethers } from "ethers";
import { sendMessage } from "@/lib/utils/helper";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/lib/models/User";

const UNISWAP_ROUTER_ADDRESS = "0x6CF35Df42a167B668cAae46AcE41A57D46cF51a9";
export const POST = async (request: any) => {
	try {
        await connectToDatabase();
		const webhookData = await request.json();
		const erc20TransferSignature = 'Transfer(address,address,uint256,address,address)';
		const erc20TransferSignatureHash = ethers.id(erc20TransferSignature);
        console.log(erc20TransferSignatureHash)

		if (!webhookData || !webhookData.event || !webhookData.event.data || !webhookData.event.data.block || !webhookData.event.data.block.logs || webhookData.event.data.block.logs.length === 0) {
            console.log("No relevant data")
			return new Response(JSON.stringify({ message: "No relevant data" }), { status: 404 });
		}

        const abiCoder = new ethers.AbiCoder();

        webhookData.event.data.block.logs.forEach(async (log: any) => {
			if (log.topics.includes(erc20TransferSignatureHash)) {
                console.log(log)
				const fromAddress = abiCoder.decode(['address'], log.topics[1])[0];
                const toAddress = abiCoder.decode(['address'], log.topics[2])[0];
                const amount = abiCoder.decode(['uint256'], log.data)[0];
                const tokenInAddress = abiCoder.decode(['address'], log.topics[3])[0];
                const tokenOutAddress = abiCoder.decode(['address'], log.topics[4])[0];

                console.log(fromAddress, toAddress, tokenInAddress, tokenOutAddress, amount)
                // 0xC96F22C409D374F33C577075178226aa838f0894 0x40181C67cD44a76BFE0aB62E439B6b3ef4CF096e 0x0000000000000000000000000000000000000000 10000000000000n
                const fromUser = await User.findOne({ walletAddress: fromAddress });
                const toUser = await User.findOne({ walletAddress: toAddress });

                const fromChatId = fromUser?.chatId;
                const toChatId = toUser?.chatId;

                
				if (fromAddress.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase() || toAddress.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase()) {
                    const action = fromAddress.toLowerCase() === UNISWAP_ROUTER_ADDRESS.toLowerCase() ? "received from" : "sent to";
                    const message = `A transaction of ${amount.toString()} tokens ${action} Uniswap.`;
                    fromChatId && await sendMessage(fromChatId, message);
                    toChatId && await sendMessage(toChatId, message);
                } else {
                    if (tokenInAddress === ethers.ZeroAddress) { 
                        fromChatId && await sendMessage(fromChatId, `ETH value of ${ethers.formatEther(amount)} is deducted from your account.`);
                        toChatId && await sendMessage(toChatId, `You have received ${ethers.formatEther(amount)} ETH.`);
                    } else { 
                        fromChatId && await sendMessage(fromChatId, `Token value of ${amount.toString()} is deducted from your account.`);
                        toChatId && await sendMessage(toChatId, `You have received ${amount.toString()} of token at address ${tokenInAddress}.`);
                    }
                }
			}
		});

		return new Response(JSON.stringify({ message: "Processed successfully" }), { status: 200 });
	} catch (error) {
		console.error('Error processing webhook:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
	}
}

