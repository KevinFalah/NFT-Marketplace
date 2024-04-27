"use client";
import { MoralisProvider } from "react-moralis";
import LayoutWrapper from "./components/LayoutWrapper";
import Main from "./components/Main";

export default function Home() {
  return (
    <LayoutWrapper>
      <Main />
    </LayoutWrapper>
  );
}
