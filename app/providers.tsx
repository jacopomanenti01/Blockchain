'use client';
import * as React from 'react';
import {
  RainbowKitProvider,
  getDefaultConfig,
  Chain,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {
  sepolia, polygonAmoy,
} from 'wagmi/chains';

// const amoy = {
//   id: 80002,  // Replace 12345 with the actual network ID for Amoy Network
//   name: "Polygon Amoy",
//   iconBackground: '#fff',
//   nativeCurrency: {
//     name: 'MATIC',  // Replace with the actual currency name if different
//     symbol: 'MATIC',     // Replace with the actual currency symbol if different
//     decimals: 18,
//   },
//   rpcUrls: {
//     public: {
//       http: ["	https://rpc-amoy.polygon.technology/"], // Replace with the actual RPC URL
//     },
//     default: {
//       http: ["	https://rpc-amoy.polygon.technology/"], // Replace with the actual RPC URL
//     },
//   },
//   testnet: true  // Set to true if Amoy Network is a testnet
// } as const satisfies Chain;


const anvil = {
  id: 31_337,
  name: "Anvil Local",
  iconBackground: '#fff',
  nativeCurrency: { name: 'TETTE', symbol: 'TT', decimals: 18 },
  rpcUrls: {
    public: { http: ["http://localhost:8545"]},
    default: { http: ["http://localhost:8545"]},
  },testnet: true
} as const satisfies Chain;

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [polygonAmoy],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
        {mounted && children}
                </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}