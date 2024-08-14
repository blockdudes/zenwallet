"use client";
import React, { useState } from "react";
import { UserBorrowedDialog } from "./userBorrowedDialog";

const ASSETS = [
  { name: "Ethereum", amount: 5, address: "0x213243wqdsfrwqe1r32efdvwcsaxdewr" },
  { name: "Cardano", amount: 1000, address: "0x213243wqdsfrwqe1r32efdvwcsaxdewr" },
];

const UserBorrowed = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const handleBorrowClick = (asset: any) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="text-white ">ASSETS YOU BORROWED</div>
      <div className="relative">
        <div className="text-sm text-left text-gray-300">
          {/* Static header */}
          <div className="text-xs uppercase bg-white/20 top-0 z-10 rounded-t-lg backdrop-blur-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-4 px-6 justify-center">Asset</th>
                  <th className="py-4 px-6 justify-center">Borrowed Amount</th>
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
                      {asset.amount}
                    </td>
                    <td className="py-4 px-6 flex justify-center">
                      <button
                        className="text-sm bg-white/10 hover:bg-white/20 rounded-md px-5 py-1 backdrop-blur-sm text-black"
                        onClick={() => handleBorrowClick(asset)}
                      >
                        Repay
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {dialogOpen && selectedAsset && <UserBorrowedDialog asset={selectedAsset} onClose={() => setDialogOpen(false)} />}
    </div>
  );
};

export default UserBorrowed;