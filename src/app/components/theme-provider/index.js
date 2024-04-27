"use client";
import { MoralisProvider } from "react-moralis";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { NotificationProvider } from "web3uikit";

import React from "react";

const ThemeProvider = ({ children }) => {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/71510/nft-marketplace/version/latest",
  });
  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={client}>
        <NotificationProvider>{children}</NotificationProvider>
      </ApolloProvider>
    </MoralisProvider>
  );
};

export default ThemeProvider;
