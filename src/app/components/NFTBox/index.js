import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Card, useNotification } from "web3uikit";
import nftAbi from "../../../constants/BasicNft.json";
import nftMarketplaceAbi from "../../../constants/NftMarketplace.json";
import Image from "next/image";
import { ethers } from "ethers";
import UpdateModal from "../UpdateModal";

const truncateStr = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr;

  const lengthSeparator = 3;
  const charsToShow = strLen - lengthSeparator;
  const frontCharToShow = Math.ceil(charsToShow / 2);
  const backCharToShow = Math.floor(charsToShow / 2);
  const frontChar = fullStr.substring(0, frontCharToShow);
  const backChar = fullStr.substring(fullStr.length - backCharToShow);

  return `${frontChar}...${backChar}`;
};

const NFTBox = ({ price, nftAddress, tokenId, marketplaceAddress, seller }) => {
  const dispatchNotif = useNotification();
  const { chainId, isWeb3Enabled, account } = useMoralis();
  const [cardData, setCardData] = useState({
    image: "",
    desc: "",
    name: "",
  });
  const [isLoadingIpfs, setIsLoadingIpfs] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const priceNft = ethers.formatEther(price);

  const formatAddress =
    account === seller || !seller ? "You" : truncateStr(seller || "", 13);

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    functionName: "tokenURI",
    contractAddress: nftAddress,
    params: {
      tokenId,
    },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    functionName: "buyItem",
    contractAddress: marketplaceAddress,
    msgValue: price,
    params: {
      nftAddress,
      tokenId,
    },
  });

  const updateUI = async () => {
    setIsLoadingIpfs(true);
    const tokenURI = await getTokenURI();

    if (tokenURI) {
      const requestUrl = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      const tokenURIResponse = await (await fetch(requestUrl)).json();
      const imageUri = tokenURIResponse.image.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );
      setCardData({
        image: imageUri,
        desc: tokenURIResponse.description,
        name: tokenURIResponse.name,
      });
      setIsLoadingIpfs(false);
    }
  };

  const handleCardClick = () => {
    account === seller
      ? setIsOpenModal(!isOpenModal)
      : buyItem({
          onSuccess: () => handleNotif("SUCCESS"),
          onError: (err) => {
            handleNotif("ERROR");
            console.log(err);
          },
        });
  };

  const handleNotif = (type) => {
    dispatchNotif({
      type: type === "SUCCESS" ? "success" : "error",
      message: type === "SUCCESS" ? "Item bought!" : "Failed",
      title: "Item Bought",
      position: "topR",
    });
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      <UpdateModal
        isOpen={isOpenModal}
        nftAddress={nftAddress}
        tokenId={tokenId}
        onClose={() => setIsOpenModal(false)}
        marketplaceAddress={marketplaceAddress}
      />
      <Card
        title={cardData?.name}
        description={cardData?.desc}
        onClick={handleCardClick}
      >
        <div className="p-2">
          <div className="text-end">
            <div>{tokenId}</div>
            <i>Owned by {formatAddress}</i>
            {!isLoadingIpfs ? (
              <Image
                loader={() => cardData.image}
                alt={cardData.name}
                src={cardData.image}
                width="200"
                height="200"
              />
            ) : (
              <div>Loading..</div>
            )}
            <div className="mt-2">{priceNft} ETH</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NFTBox;
