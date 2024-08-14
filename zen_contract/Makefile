.PHONY: create verify

RPC_URL := "https://polygon-amoy.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS"
PRIVATE_KEY := "d24a1e50cbe57f62cee61b828580ecca06c6142900db3afe1e4f881ffff90751"
ETHERSCAN_API_KEY := "KYMVDX8WU228DWI7NKU5X9193QJUM6FHE7"
CONTRACT_ADDRESS := "0x2dD9b4F3228Cf879fBe3Ea518B6a68FE1a296568"
CHAIN_ID := 80002
ARG1 := "0xA7AdF06a1D3a2CA827D4EddA96a1520054713E1c"


# RPC_URL := "https://eth-sepolia.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS"
# PRIVATE_KEY := "58b0b8ee887bfd9ce2db2d4c5fb878f8d1ea0a4b4705d8b8e1883e0ab9306327"
# ETHERSCAN_API_KEY := "CS1FB5NXQHTV2US3JIMJIZ63IQATK7QKBX"
# CONTRACT_ADDRESS := "0xCD3725168F444923bfAEd2c35E464Afc0a50801b"
# CHAIN_ID := 11155111
# ARG1 := "0xA7AdF06a1D3a2CA827D4EddA96a1520054713E1c"

create:
	forge create --rpc-url $(RPC_URL) --constructor-args $(ARG1) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify src/zr/zrSignCrossChainFaucetApp.sol:zrSignCrossChainFaucetApp

verify:
	forge verify-contract $(CONTRACT_ADDRESS) src/zr/zrSignCrossChainFaucetApp.sol:zrSignCrossChainFaucetApp --chain-id $(CHAIN_ID) --constructor-args $$(cast abi-encode "constructor(address)" $(ARG1)) --etherscan-api-key $(ETHERSCAN_API_KEY)

deploy-sign-types:
	forge create --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify src/zr/libraries/SignTypes.sol:SignTypes 
	@echo "SignTypes deployed at: $$(grep -oP 'Deployed to: \K\w+' deployment.log)"


# 0xBae98B6107eE2111c31A43567DeCA8a18f2b45a2 getBaseFee
# 0x211eff4a105f50c6674c622243b56fcb66c65115 getestimation
