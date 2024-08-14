"use client";
import React, { useState } from "react";
import { BorrowDialog } from "./borrowDialog";

const ASSETS = [
  { name: "USDT", walletBalance: 5, address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0" },
  { name: "DAI", walletBalance: 20, address: "0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357" },
  { name: "EURS", walletBalance: 50, address: "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E" },
];

const BorrowComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleBorrowClick = (asset: any) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="text-white ">ASSETS TO BORROW</div>
      <div className="relative ">
        <div className="text-sm text-left text-gray-300">
          {/* Static header */}
          <div className="text-xs uppercase bg-white/20 top-0 z-10 rounded-t-lg backdrop-blur-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-4 px-6 justify-center">Asset</th>
                  <th className="py-4 px-6 justify-center">Wallet Balance</th>
                  <th className="py-4 px-6 justify-center">Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          {/* Scrollable body */}
          <div className="overflow-auto rounded-b-lg bg-white/10 backdrop-blur-md">
            <table className="w-full">
              <tbody className="bg-transparent">
                {ASSETS.map((asset, index) => (
                  <tr key={index}>
                    <td className="py-4 px-6 text-white justify-center">
                      {asset.name}
                    </td>
                    <td className="py-4 px-6 text-white justify-center">
                      {asset.walletBalance}
                    </td>
                    <td className="py-4 px-6 flex justify-center">
                      <button
                        className="text-sm bg-white/10 hover:bg-white/20 rounded-md px-5 py-1 backdrop-blur-sm text-black"
                        onClick={() => handleBorrowClick(asset)}
                      >
                        Borrow
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {dialogOpen && selectedAsset && <BorrowDialog asset={selectedAsset} onClose={() => setDialogOpen(false)} />}
    </div>
  );
};

export default BorrowComponent;