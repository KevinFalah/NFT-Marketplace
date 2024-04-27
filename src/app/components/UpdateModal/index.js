import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Modal, Input, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../../../constants/NftMarketplace.json";
import { ethers } from "ethers";

const UpdateModal = ({
  isOpen,
  onClose,
  marketplaceAddress,
  nftAddress,
  tokenId,
}) => {
  const [dataInput, setDataInput] = useState("0");
  const dispatchNotif = useNotification();

  const { runContractFunction: updateListing, isLoading } = useWeb3Contract({
    abi: nftMarketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress,
      tokenId,
      newPrice: ethers.parseEther(dataInput ?? "0"),
    },
  });

  const handleNotif = (type) => {
    dispatchNotif({
      type: type === "SUCCESS" ? "success" : "error",
      message: type === "SUCCESS" ? "Item Updated!" : "Failed Update",
      title: type === "SUCCESS" ? "Item Updated!" : "Failed Update",
      position: "topR",
    });
    onClose();
    setDataInput("0");
  };

  const handleSubmit = () => {
    updateListing({
      onSuccess: () => handleNotif("SUCCESS"),
      onError: (err) => {
        handleNotif("ERROR");
        console.log(err);
      },
    });
  };

  return (
    <Modal
      isVisible={isOpen}
      onCancel={onClose}
      width="400px"
      isOkDisabled={isLoading}
      onOk={handleSubmit}
    >
      <h1 className="font-bold mb-5 text-center">Update Listing</h1>
      <div className="p-2 pb-7">
        <Input
          label="Update listing price in L1 Currency (ETH)"
          autoFocus
          type="number"
          onChange={(e) => setDataInput(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default UpdateModal;
