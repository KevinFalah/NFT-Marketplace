import React from "react";
import { useMoralis } from "react-moralis";
import NFTBox from "../NFTBox";
import networkMapping from "../../../constants/networkMapping.json";
import { GET_ACTIVE_ITEMS, GET_LISTED_ITEMS } from "../../../constants/subgraphQueries";
import { useQuery } from "@apollo/client";

const Main = () => {
  const { chainId, isWeb3Enabled } = useMoralis();

  const chainString = chainId ? parseInt(chainId).toString() : null;
  const marketplaceAddress = chainId
    ? networkMapping[chainString].NftMarketplace[0]
    : null;

  const { loading, data: listedNfts, error } = useQuery(GET_LISTED_ITEMS);
  // const { loading, data: listedNfts, error } = useQuery(GET_ACTIVE_ITEMS);

  console.log({listedNfts})

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap gap-5">
        {isWeb3Enabled && chainId ? (
          loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            // listedNfts.activeItems.map((nft) => {
            listedNfts.itemListeds.map((nft) => {
              const { price, nftAddress, tokenId, seller } = nft;
              return marketplaceAddress ? (
                <NFTBox
                  price={price}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  marketplaceAddress={marketplaceAddress}
                  seller={seller}
                  key={`${nftAddress}${tokenId}`}
                />
              ) : (
                <div>Network error, please switch to a supported network. </div>
              );
            })
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
};

export default Main;
