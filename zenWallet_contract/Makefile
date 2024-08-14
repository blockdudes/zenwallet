.PHONY: create verify

RPC_URL := "https://eth-sepolia.g.alchemy.com/v2/0hnyAnUKEEZR33s1EVRNly0BXZThh_XS"
PRIVATE_KEY := "58b0b8ee887bfd9ce2db2d4c5fb878f8d1ea0a4b4705d8b8e1883e0ab9306327"
ETHERSCAN_API_KEY := "CS1FB5NXQHTV2US3JIMJIZ63IQATK7QKBX"
CONTRACT_ADDRESS := "0xe5a85EC3eEDFdde1A3c6A5f0CA940b3862F25c52"
CHAIN_ID := 11155111
ARG1 := "0xA7AdF06a1D3a2CA827D4EddA96a1520054713E1c"
ARG2 := "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008"

create:
	forge create --rpc-url $(RPC_URL) --constructor-args $(ARG1) $(ARG2) --private-key $(PRIVATE_KEY) --etherscan-api-key $(ETHERSCAN_API_KEY) --verify src/ZenWallet.sol:ZenWallet

verify:
	forge verify-contract $(CONTRACT_ADDRESS) src/ZenWallet.sol:ZenWallet --chain-id $(CHAIN_ID) --constructor-args $$(cast abi-encode "constructor(address,address)" $(ARG1) $(ARG2)) --etherscan-api-key $(ETHERSCAN_API_KEY)



# 0xBae98B6107eE2111c31A43567DeCA8a18f2b45a2 getBaseFee
# 0x211eff4a105f50c6674c622243b56fcb66c65115 getestimation
