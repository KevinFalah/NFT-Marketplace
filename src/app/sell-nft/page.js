"use client";
import { useMoralis, useWeb3Contract } from "react-moralis";
import LayoutWrapper from "../components/LayoutWrapper";
import { Button, Form, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../../constants/NftMarketplace.json";
import networkMapping from "../../constants/networkMapping.json";
import basicNftAbi from "../../constants/BasicNft.json";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const initializeForm = [
  {
    key: "nftAddress",
    name: "NFT ADDRESS",
    type: "text",
    validation: {
      required: true,
    },
    value: "",
    inputWidth: "50%",
  },
  {
    key: "tokenId",
    name: "Token ID",
    type: "number",
    validation: {
      required: true,
    },
    value: "",
  },
  {
    key: "price",
    name: "Price (in ETH)",
    type: "number",
    validation: {
      required: true,
    },
    value: "",
  },
]

export default function SellNft() {
  const { chainId, account, isWeb3Enabled } = useMoralis();

  const dispatchNotif = useNotification();

  const [isErrorWithdraw, setIsErrorWithdraw] = useState(false);
  const [proceeds, setProceeds] = useState(0);
  const [dataFrom, setDataFrom] = useState(initializeForm)

  const chainIdString = chainId ? parseInt(chainId).toString() : null;
  const marketplaceAddress = chainId
    ? networkMapping[chainIdString]?.NftMarketplace[0]
    : null;

  const { runContractFunction } = useWeb3Contract();

  const handleSubmitSellNft = async (data) => {
    console.log("Approving..");
    const nftAddress = data?.data[0].inputResult;
    const tokenId = data?.data[1].inputResult;
    const price = ethers
      .parseUnits(data?.data[2].inputResult, "ether")
      .toString();

    console.log({ tokenId, price });

    await runContractFunction({
      onSuccess: (tx) => handleListing(tx, nftAddress, tokenId, price),
      params: {
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "approve",
        params: {
          to: marketplaceAddress,
          tokenId: tokenId,
        },
      },
      onError: (err) => {
        handleSuccessNotification("Failed Submit", "ERROR")
        console.log(err)},
    }); 
  };

  const handleListing = async (tx, nftAddress, tokenId, price) => {
    console.log("Listing..");
    await tx.wait();

    await runContractFunction({
      onSuccess: () => handleSuccessNotification("Item Listed", "SUCCESS"),
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "listItem",
        params: {
          nftAddress,
          tokenId,
          price,
        },
      },
      onError: (err) => console.log(err)
    });
  };

  const handleSuccessNotification = (text, type) => {
    console.log('SUCCESS')
    dispatchNotif({
      type: type === "SUCCESS" ? "success" : "error",
      message: text,
      title: text,
      position: "topR",
    });
  };

  const handleWithdraw = async () => {
    await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "withdrawProceeds",
      },
      onSuccess: () => handleSuccessNotification("Withdraw Success", "SUCCESS"),
      onError: (err) => {
        setIsErrorWithdraw(true);
        console.log(err, "<- ERROR WITHDRAW");
      },
    });
  };

  const setupUI = async () => {
    const response = await runContractFunction({
      params: {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (err) => console.log(err),
    });

    if (response) {
      const responseParsed = parseInt(response?._hex).toString();
      setProceeds(ethers.formatEther(responseParsed));
    }
  };

  console.log({ proceeds });

  useEffect(() => {
    if (!isWeb3Enabled) return;
    setupUI();
  }, [isWeb3Enabled]);

  return (
    <LayoutWrapper>
      <Form
      customFooter={<Button type="submit" text="Submit NFT" theme="primary" />}
        buttonConfig={{
          text: "Submit",
          theme: "primary",
        }}
       data={dataFrom}
        onSubmit={handleSubmitSellNft}
        title="Sell NFT"
      />

      <div className="flex justify-center flex-col items-center">
        <h3 className="text-3xl font-semibold mb-3">
          Your proceeds: <b>{proceeds} ETH</b>
        </h3>

        <Button
          disabled={proceeds <= 0}
          text="Withdraw"
          theme="primary"
          size="large"
          onClick={handleWithdraw}
        />
      </div>
    </LayoutWrapper>
  );
}
