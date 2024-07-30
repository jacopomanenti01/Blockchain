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
  sepolia,
} from 'wagmi/chains';



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
  chains: [anvil, sepolia],
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