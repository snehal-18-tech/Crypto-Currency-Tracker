import type { CryptoData } from "@/lib/features/crypto/cryptoSlice"

// Generate random sparkline data
const generateSparklineData = (length = 168, volatility = 0.05, trend = 0) => {
  const data: number[] = []
  let value = 100 + Math.random() * 100

  for (let i = 0; i < length; i++) {
    // Add random change with trend bias
    const change = (Math.random() - 0.5 + trend * 0.1) * volatility * value
    value += change
    // Ensure value stays positive
    value = Math.max(value, 1)
    data.push(value)
  }

  return data
}

export const initialCryptoData: CryptoData[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/placeholder.svg?height=32&width=32",
    price: 93759.48,
    change1h: 0.43,
    change24h: 0.93,
    change7d: 11.11,
    marketCap: 1861618902186,
    volume: 43874950947,
    volumeInCrypto: 467.81,
    circulatingSupply: 19.85,
    maxSupply: 21,
    sparkline: generateSparklineData(168, 0.02, 0.2),
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    image: "/placeholder.svg?height=32&width=32",
    price: 1802.46,
    change1h: 0.6,
    change24h: 3.21,
    change7d: 13.68,
    marketCap: 217581279327,
    volume: 23547469307,
    volumeInCrypto: 13.05,
    circulatingSupply: 120.71,
    maxSupply: null,
    sparkline: generateSparklineData(168, 0.03, 0.3),
  },
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    image: "/placeholder.svg?height=32&width=32",
    price: 1.0,
    change1h: 0.0,
    change24h: 0.0,
    change7d: 0.04,
    marketCap: 145320022085,
    volume: 92288882007,
    volumeInCrypto: 92.25,
    circulatingSupply: 145.27,
    maxSupply: null,
    sparkline: generateSparklineData(168, 0.001, 0),
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    image: "/placeholder.svg?height=32&width=32",
    price: 2.22,
    change1h: 0.46,
    change24h: 0.54,
    change7d: 6.18,
    marketCap: 130073814966,
    volume: 5131481491,
    volumeInCrypto: 2.3,
    circulatingSupply: 58.39,
    maxSupply: 100,
    sparkline: generateSparklineData(168, 0.04, 0.1),
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    image: "/placeholder.svg?height=32&width=32",
    price: 606.65,
    change1h: 0.09,
    change24h: -1.2,
    change7d: 3.73,
    marketCap: 85471956947,
    volume: 1874281784,
    volumeInCrypto: 3.08,
    circulatingSupply: 140.89,
    maxSupply: 200,
    sparkline: generateSparklineData(168, 0.03, 0.05),
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    image: "/placeholder.svg?height=32&width=32",
    price: 151.51,
    change1h: 0.53,
    change24h: 1.26,
    change7d: 14.74,
    marketCap: 78381958631,
    volume: 4881674486,
    volumeInCrypto: 32.25,
    circulatingSupply: 517.31,
    maxSupply: null,
    sparkline: generateSparklineData(168, 0.05, 0.3),
  },
]
