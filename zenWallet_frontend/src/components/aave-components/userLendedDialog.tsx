import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useActiveAccount } from "thirdweb/react";

interface Asset {
  name: string;
  address: string;
  amount: number;
}

export function UserLendedDialog({
  asset,
  onClose,
}: {
  asset: Asset;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState(asset.amount);
  const activeAccount = useActiveAccount();

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
  
  const handleWithdraw = () => {
    console.log(`Withdrawing: ${amount} of ${asset.name}`);
    console.log(`Value: ${asset.address}`);
    console.log(`Sender Address: CURRENT_USER_ADDRESS`); // Replace with actual user address
    
    const transactionData = {
      TYPE: "aave.withdraw",
      AMOUNT: amount,
      TOKEN_ADDRESS: asset.address,
      SENDER_ADDRESS: activeAccount?.address,
      RECEIVER_ADDRESS: "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951",
    };
    storeTransaction(transactionData);

    onClose();
    onClose();
  };

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
            {asset.amount}
          </div>
        </div>
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="flex justify-center"
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
          onClick={handleWithdraw}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Withdraw
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
