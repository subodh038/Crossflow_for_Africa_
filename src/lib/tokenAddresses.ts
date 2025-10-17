import { base, celo, mainnet, sepolia, celoAlfajores } from 'wagmi/chains';
import { pushChain, somniaTestnet, celoSepoliaTestnet } from '@/config/wagmi';

export const TOKEN_ADDRESSES = {
  USDT: {
    [mainnet.id]: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    [base.id]: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    [sepolia.id]: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
  },
  USDC: {
    [mainnet.id]: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    [base.id]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    [sepolia.id]: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
  cUSD: {
    [celo.id]: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
    [celoAlfajores.id]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
    [celoSepoliaTestnet.id]: '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1',
  },
} as const;

export const TOKEN_DECIMALS = {
  ETH: 18,
  PC: 18,
  STT: 18,
  USDT: 6,
  USDC: 6,
  cUSD: 18,
  CELO: 18,
} as const;
