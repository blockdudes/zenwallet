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
    address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357",
    src: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png?1696509996",
  },
  {
    label: "USDC ",
    address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
    src: "https://assets.coingecko.com/coins/images/6319/standard/usdc.png?1696506694",
  },
  {
    label: "USTD ",
    address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
    src: "https://assets.coingecko.com/coins/images/325/standard/Tether.png?1696501661",
  },
  {
    label: "EURS ",
    address: "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E",
    src: "https://assets.coingecko.com/coins/images/32913/standard/eurs.png?1699824583",
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
