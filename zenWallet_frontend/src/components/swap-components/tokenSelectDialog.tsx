import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

// Example tokens list
const tokens = [
  {
    label: "DAI ",
    address: "0xd9D669551F605c0032b6F853707dF74cBcb4B15F",
    src: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996",
  },
  {
    label: "USDC ",
    address: "0x267EFC7CCbCEf743FdA8EB1a3Ec95656a4A4CF25",
    src: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
  {
    label: "USTD ",
    address: "0x21Dc74F18166F73d48978c3E3167F29c44a19328",
    src: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
  },
];

interface TokenSelectDialogProps {
  onSelect: (token: { label: string; address: string; src: string }) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function TokenSelectDialog({
  onSelect,
  open,
  setOpen,
}: TokenSelectDialogProps) {
  const handleClose = () => setOpen(false);

  return (
    <Dialog
      open={open}
      size="xs"
      handler={handleClose}
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0.9, y: -100 },
      }}
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
      className="!min-w-[200px] min-h-[400px] max-w-[200px] max-h-[400px] !bg-white/30 rounded-[10px] "
    >
      <DialogHeader
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="text-white"
      >
        Select a Token
      </DialogHeader>
      <DialogBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="grid grid-cols-1 gap-4">
          {tokens.map((token) => (
            <Button
              key={token.address}
              variant="gradient"
              color="white"
              onClick={() => {
                onSelect(token);
                handleClose();
              }}
              className="text-white bg-white/30 font-bold flex justify-start items-center gap-4"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <div className="bg-white rounded-full p-1">
                <img
                  src={token.src}
                  alt={token.label}
                  className="w-4 h-4 "
                />
              </div>
              <div>{token.label}</div>
            </Button>
          ))}
        </div>
      </DialogBody>
      <DialogFooter
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <Button
          variant="text"
          color="red"
          onClick={handleClose}
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
