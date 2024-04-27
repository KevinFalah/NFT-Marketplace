"use client";
import Link from "next/link";
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <nav className="p-5 border-b-2 flex items-center justify-between px-6">
      <h1 className="text-3xl">NFT Marketplace </h1>
      <div className="flex items-center justify-between">
        <Link className="font-semibold hover:text-gray-500 mr-5" href="/">
          NFT Marketplace
        </Link>
        <Link className="font-semibold hover:text-gray-500" href="/sell-nft">
          Sell NFT
        </Link>

        <ConnectButton />
      </div>
    </nav>
  );
}
