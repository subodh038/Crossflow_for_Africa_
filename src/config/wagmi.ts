import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, celo, mainnet, sepolia, celoAlfajores } from 'wagmi/chains';
import { defineChain } from 'viem';

export const pushChain = defineChain({
  id: 42101,
  name: 'Push Chain Donut Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Push Chain',
    symbol: 'PC',
  },
  rpcUrls: {
    default: {
      http: ['https://evm.rpc-testnet-donut-node1.push.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Push Explorer', url: 'https://donut.push.network' },
  },
  testnet: true,
});

export const somniaTestnet = defineChain({
  id: 50311,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://somnia-devnet.socialscan.io' },
  },
  testnet: true,
});

export const celoSepoliaTestnet = defineChain({
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo-sepolia.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Celo Sepolia Explorer', url: 'https://celo-sepolia.blockscout.com' },
  },
  testnet: true,
});

export const config = getDefaultConfig({
  appName: 'CrossFlow',
  projectId: '8a48275108eff099915836171a759aef',
  chains: [base, celo, mainnet, pushChain, sepolia, celoAlfajores, somniaTestnet, celoSepoliaTestnet],
  ssr: false,
});
