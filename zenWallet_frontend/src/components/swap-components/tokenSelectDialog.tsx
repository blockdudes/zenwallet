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
    address: "0x8D492c6bbbd7e876865a2a5d4833559e9b0b73c1",
    src: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996",
  },
  {
    label: "USDC ",
    address: "0x1854f0007819E877bA944C0eEEc198AE13675B05",
    src: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
  {
    label: "USTD ",
    address: "0xd7689c83e1Be126a9C1Cc2f387bBe6fE1e860708",
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
