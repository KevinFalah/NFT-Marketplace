import { gql } from "@apollo/client";

export const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(first: 5) {
            id
            seller
            nftAddress
            tokenId
            price
        }
    }
`;

export const GET_LISTED_ITEMS = gql`
    {
        itemListeds(first: 10) {
            id
            seller
            nftAddress
            tokenId
            price
          }
    }
`
