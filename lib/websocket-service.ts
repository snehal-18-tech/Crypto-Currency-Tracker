import type { CryptoData } from "@/lib/features/crypto/cryptoSlice"
import { initialCryptoData } from "@/lib/data"

// This is a mock WebSocket service that simulates real-time updates
export class WebSocketService {
  private interval: NodeJS.Timeout | null = null
  private subscribers: ((data: CryptoData[]) => void)[] = []
  private cryptoData: CryptoData[] = JSON.parse(JSON.stringify(initialCryptoData))
  private volatility = 0.02 // Default volatility

  constructor() {
    this.startSimulation()
  }

  private startSimulation() {
    this.interval = setInterval(() => {
      // Create a deep copy to avoid mutating the original data
      const updatedData = this.cryptoData.map((crypto) => {
        // Randomly update price with some volatility
        const priceChange = crypto.price * (Math.random() * this.volatility - this.volatility / 2) // -1% to +1% by default
        const newPrice = crypto.price + priceChange

        // Update percentage changes
        const change1h = crypto.change1h + (Math.random() * 0.4 - 0.2) // -0.2% to +0.2%
        const change24h = crypto.change24h + (Math.random() * 0.6 - 0.3) // -0.3% to +0.3%
        const change7d = crypto.change7d + (Math.random() * 0.2 - 0.1) // -0.1% to +0.1%

        // Update volume
        const volumeChange = crypto.volume * (Math.random() * 0.04 - 0.02) // -2% to +2%
        const newVolume = crypto.volume + volumeChange
        const newVolumeInCrypto = newVolume / newPrice

        // Update sparkline data by adding new point and removing oldest
        const newSparkline = [...crypto.sparkline.slice(1), newPrice * (100 / crypto.price)]

        return {
          ...crypto,
          price: newPrice,
          change1h,
          change24h,
          change7d,
          volume: newVolume,
          volumeInCrypto: newVolumeInCrypto,
          sparkline: newSparkline,
        }
      })

      this.cryptoData = updatedData

      // Notify all subscribers
      this.subscribers.forEach((callback) => callback(updatedData))
    }, 1500) // Update every 1.5 seconds
  }

  public setVolatility(value: number) {
    // Allow external control of market volatility (0.01 = low, 0.05 = high)
    this.volatility = Math.max(0.01, Math.min(0.05, value))
  }

  public subscribe(callback: (data: CryptoData[]) => void) {
    this.subscribers.push(callback)

    // Immediately send current data
    callback(this.cryptoData)

    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter((cb) => cb !== callback)
    }
  }

  public disconnect() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.subscribers = []
  }
}
