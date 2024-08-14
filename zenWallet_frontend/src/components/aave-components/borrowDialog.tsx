import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { postAsset } from "@/lib/utils/helper";
import { useActiveAccount } from "thirdweb/react";

interface Asset {
  name: string;
  address: string;
  walletBalance: number;
}

export function BorrowDialog({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(0);
  const activeAccount = useActiveAccount();

  // const handleBorrow = async () => {
  //   if (!activeAccount) {
  //     console.error("No active account found");
  //     return;
  //   }
  //   const response = await postAsset(
  //     activeAccount.address,
  //     asset.address,
  //     amount,
  //     1
  //   );
  //   console.log(response);
  //   onClose();
  // };

  const storeTransaction = (transactionData: any) => {
    // Fetch existing transactions from localStorage
    const existingTransactions = localStorage.getItem("transactionData");
    const transactions = existingTransactions
      ? JSON.parse(existingTransactions)
      : [];

    if (!Array.isArray(transactions)) {
      console.error("Stored transaction data is corrupted or not an array");
      return; // Optionally handle this case more gracefully
    }
    // Add the new transaction to the array using the spread operator
    const updatedTransactions = [...transactions, transactionData];

    // Save the updated array back to localStorage
    localStorage.setItem(
      "transactionData",
      JSON.stringify(updatedTransactions)
    );
  };

  const handleBorrow = () => {
    const transactionData = {
      TYPE: "aave.borrow",
      AMOUNT: amount,
      TOKEN_ADDRESS: asset.address,
      SENDER_ADDRESS: activeAccount?.address,
      RECEIVER_ADDRESS: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    };
    storeTransaction(transactionData);
    onClose();
  }

  return (
    <Dialog
      open={true}
      size="xs"
      handler={onClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      className=" !bg-white/30 rounded-[10px] text-white"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <DialogHeader
        className="text-white"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Borrow Assets
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="text-white border-[1px] border-white p-2  rounded-lg w-full ">
            {asset.name}
          </div>
          <div className="text-white border-[1px] border-white p-2  rounded-lg w-full ">
            {asset.walletBalance}
          </div>

          <Input
            label="Amount to Borrow"
            type="number"
            color="white"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            crossOrigin={undefined}
          />
        </div>
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Button
          variant="text"
          color="blue"
          onClick={onClose}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Cancel
        </Button>
        <Button
          variant="text"
          color="yellow"
          onClick={handleBorrow}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Borrow
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
