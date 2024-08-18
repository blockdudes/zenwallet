.PHONY: create verify

RPC_URL := "https://polygon-amoy.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS"
PRIVATE_KEY := "3f84a7d510f8f920768fd8246f4db7e0be89a972cbcbc2d30b37281d2297b0e6"
ETHERSCAN_API_KEY := "KYMVDX8WU228DWI7NKU5X9193QJUM6FHE7"
CONTRACT_ADDRESS := "0xE2eDA16703e4f45A1383b5EC5a2fb09E98252cF3"
CHAIN_ID := 80002
ARG1 := "0xA7AdF06a1D3a2CA827D4EddA96a1520054713E1c"
ARG2 := "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"
ARG3 := "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"



# RPC_URL := "https://eth-sepolia.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS"
# PRIVATE_KEY := "3f84a7d510f8f920768fd8246f4db7e0be89a972cbcbc2d30b37281d2297b0e6"
# ETHERSCAN_API_KEY := "CS1FB5NXQHTV2US3JIMJIZ63IQATK7QKBX"
# CONTRACT_ADDRESS := "0x73ADd94eBDD35aCa54149376d59fB44f6c14aF3F"
# CHAIN_ID := 11155111
# ARG1 := "0xA7AdF06a1D3a2CA827D4EddA96a1520054713E1c"
# ARG2 := "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"
# ARG3 := "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951"
# 0x24e2734c6CFeE65b07837E1f37073F57542A4844


create:
	forge create --rpc-url $(RPC_URL) --constructor-args $(ARG1) $(ARG2) $(ARG3) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify src/zr/ZWallet.sol:ZWallet

verify:
	forge verify-contract $(CONTRACT_ADDRESS) src/zr/ZenContract.sol:ZenContract --chain-id $(CHAIN_ID) --constructor-args $$(cast abi-encode "constructor(address,address,address)" $(ARG1) $(ARG2) $(ARG3)) --etherscan-api-key $(ETHERSCAN_API_KEY)

deploy-sign-types:
	forge create --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify src/zr/libraries/SignTypes.sol:SignTypes 
	@echo "SignTypes deployed at: $$(grep -oP 'Deployed to: \K\w+' deployment.log)"

factory:
	forge create src/zr/MyTokenFactory.sol:MyTokenFactory --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify

verify-factory:
	forge verify-contract "0x5ef0ea63FA2902f0089c12b2af574bB0E0d2cB9C" src/zr/MyTokenFactory.sol:MyTokenFactory --chain-id $(CHAIN_ID)  --etherscan-api-key $(ETHERSCAN_API_KEY)

verify-token:
	forge verify-contract "0x21Dc74F18166F73d48978c3E3167F29c44a19328" src/zr/Erc20.sol:MyERC20 --chain-id $(CHAIN_ID) --constructor-args $$(cast abi-encode "constructor(string,string,uint256,uint8)" "USDT" "USDT" 100000000 6) --etherscan-api-key $(ETHERSCAN_API_KEY)

# sepolia - libraries = ["src/zr/libraries/SignTypes.sol:SignTypes:0xa547575b26Ff136a9d2700ec067111cDAc67F158"]

# amoy - libraries = ["src/	zr/libraries/SignTypes.sol:SignTypes:0xccF68f83A9A6A780cb00fC9C6509A1814dB617c8"]
