import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NFT Marketplace",
  description: "Buy or Sell NFT",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
