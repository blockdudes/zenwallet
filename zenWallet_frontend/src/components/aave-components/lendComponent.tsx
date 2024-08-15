"use client";
import React, { useState } from "react";
import { LendDialog } from "./LendDialog"; // Import LendDialog

const ASSETS = [
  { name: "USDC", walletBalance: 1.5, address: "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8" },
];

const LendComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleLendClick = (asset: any) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="text-white  bg-white/10 hover:bg-white/20 rounded-md px-5 py-1 backdrop-blur-sm">ASSETS TO LEND</div>
      <div className="relative ">
        <div className="text-sm text-left text-gray-300">
          {/* Static header */}
          <div className="text-xs uppercase bg-white/20  top-0 z-10 rounded-t-lg backdrop-blur-md">
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
                        onClick={() => handleLendClick(asset)}
                      >
                        Lend
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {dialogOpen && selectedAsset && <LendDialog asset={selectedAsset} onClose={() => setDialogOpen(false)} />}
    </div>
  );
};

export default LendComponent;