"use client";
import React, { useState } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";
import QRCode from "react-qr-code";
import { useActiveAccount } from "thirdweb/react";

const RecieveDetails = () => {
  const activeAccount = useActiveAccount();

  const [address, setAddress] = useState(activeAccount?.address);

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-4)}`;
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="flex flex-col gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={address || ""} size={300} />
        </div>
        <div className="flex gap-4 items-center">
          <div className="w-full text-white rounded-md p-2 bg-white/10 backdrop-blur-sm">
            {truncateAddress(address || "")}
          </div>
          <ClipboardDocumentCheckIcon
            className="w-10 h-10 text-white/50 cursor-pointer"
            onClick={handleCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default RecieveDetails;
