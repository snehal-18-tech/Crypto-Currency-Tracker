"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import {
  ArrowLeft,
  ExternalLink,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  BarChart3,
  Wallet,
} from "lucide-react"
import DetailChart from "@/components/detail-chart"
import { useSelector } from "react-redux"
import { selectCryptoById } from "@/lib/features/crypto/cryptoSlice"

export default function CryptoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  // Local state to store crypto data
  const [cryptoData, setCryptoData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("chart")

  // Get crypto data from Redux store
  const cryptoFromStore = useSelector((state: any) => selectCryptoById(state, id))

  useEffect(() => {
    // Check if this crypto is in favorites
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setIsFavorite(favorites.includes(id))
    }

    // If we have data from the store, use it
    if (cryptoFromStore) {
      setCryptoData(cryptoFromStore)
      setLoading(false)
    } else {
      // Fallback to fetch data if not in store (e.g., direct navigation to URL)
      // For demo purposes, we'll use hardcoded data for bitcoin
      const fallbackData = {
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
        sparkline: Array(168)
          .fill(0)
          .map((_, i) => 90000 + Math.random() * 5000),
      }

      setCryptoData(fallbackData)
      setLoading(false)
    }
  }, [cryptoFromStore, id])

  const toggleFavorite = () => {
    if (typeof window !== "undefined") {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      const newFavorites = isFavorite ? favorites.filter((fav: string) => fav !== id) : [...favorites, id]

      localStorage.setItem("favorites", JSON.stringify(newFavorites))
      setIsFavorite(!isFavorite)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!cryptoData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center h-64">
          <h2 className="text-xl font-semibold mb-2">Cryptocurrency not found</h2>
          <Button onClick={() => router.push("/")}>Return to Home</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="flex items-center">
            <img
              src={cryptoData.image || "/placeholder.svg"}
              alt={cryptoData.name}
              className="w-12 h-12 mr-3 rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                {cryptoData.name}
                <span className="text-muted-foreground ml-2 text-xl">{cryptoData.symbol}</span>
                <Button variant="ghost" size="icon" onClick={toggleFavorite} className="ml-2">
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`} />
                </Button>
              </h1>
              <div className="flex items-center mt-1">
                <Badge variant={cryptoData.change24h >= 0 ? "success" : "destructive"} className="mr-2">
                  {cryptoData.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {formatPercentage(cryptoData.change24h)} (24h)
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Rank #{cryptoData.id === "bitcoin" ? 1 : cryptoData.id === "ethereum" ? 2 : 3}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Website
          </Button>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            Add to Portfolio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-sm">
              <DollarSign className="h-4 w-4 mr-1" /> Current Price
            </CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(cryptoData.price)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-lg font-medium flex items-center ${
                cryptoData.change24h >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {cryptoData.change24h >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {formatPercentage(cryptoData.change24h)} (24h)
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-sm">
              <BarChart3 className="h-4 w-4 mr-1" /> Market Cap
            </CardDescription>
            <CardTitle>{formatCurrency(cryptoData.marketCap)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Fully Diluted Valuation:{" "}
              {formatCurrency(cryptoData.maxSupply ? cryptoData.price * cryptoData.maxSupply : cryptoData.marketCap)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-1" /> Volume (24h)
            </CardDescription>
            <CardTitle>{formatCurrency(cryptoData.volume)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {formatNumber(cryptoData.volumeInCrypto)} {cryptoData.symbol}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chart" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="p-6 border rounded-md bg-white shadow-sm">
          <div className="h-[400px]">
            <DetailChart data={cryptoData.sparkline} change7d={cryptoData.change7d} />
          </div>
        </TabsContent>
        <TabsContent value="info" className="p-6 border rounded-md bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Wallet className="h-5 w-5 mr-2" /> Supply Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Circulating Supply</span>
                  <span className="font-medium">
                    {formatNumber(cryptoData.circulatingSupply)} {cryptoData.symbol}
                  </span>
                </div>
                {cryptoData.maxSupply && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Max Supply</span>
                      <span className="font-medium">
                        {formatNumber(cryptoData.maxSupply)} {cryptoData.symbol}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Supply Progress</span>
                        <span>{((cryptoData.circulatingSupply / cryptoData.maxSupply) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(cryptoData.circulatingSupply / cryptoData.maxSupply) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" /> Market Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Market Cap Rank</span>
                  <span className="font-medium">
                    #{cryptoData.id === "bitcoin" ? 1 : cryptoData.id === "ethereum" ? 2 : 3}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-medium">{formatCurrency(cryptoData.marketCap)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">24h Trading Volume</span>
                  <span className="font-medium">{formatCurrency(cryptoData.volume)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Volume / Market Cap</span>
                  <span className="font-medium">{(cryptoData.volume / cryptoData.marketCap).toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" /> Price Changes
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">1 Hour</span>
                  <span className={`font-medium ${cryptoData.change1h >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatPercentage(cryptoData.change1h)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">24 Hours</span>
                  <span className={`font-medium ${cryptoData.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatPercentage(cryptoData.change24h)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">7 Days</span>
                  <span className={`font-medium ${cryptoData.change7d >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatPercentage(cryptoData.change7d)}
                  </span>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium mb-4">About {cryptoData.name}</h3>
              <p className="text-muted-foreground">
                {cryptoData.name} ({cryptoData.symbol}) is a cryptocurrency with a current price of{" "}
                {formatCurrency(cryptoData.price)}. It has a market capitalization of{" "}
                {formatCurrency(cryptoData.marketCap)} and a 24-hour trading volume of{" "}
                {formatCurrency(cryptoData.volume)}.
                {cryptoData.maxSupply
                  ? ` The maximum supply is capped at ${formatNumber(cryptoData.maxSupply)} ${cryptoData.symbol}.`
                  : ` ${cryptoData.name} does not have a maximum supply cap.`}
              </p>

              <div className="mt-6 flex gap-2">
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Official Website
                </Button>
                <Button variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Explorer
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="markets" className="p-6 border rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-4">Top Markets</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Volume</TableHead>
                  <TableHead className="text-right">Volume %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Binance</TableCell>
                  <TableCell>{cryptoData.symbol}/USDT</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.price * 0.999)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.volume * 0.32)}</TableCell>
                  <TableCell className="text-right">32%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Coinbase</TableCell>
                  <TableCell>{cryptoData.symbol}/USD</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.price * 1.001)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.volume * 0.28)}</TableCell>
                  <TableCell className="text-right">28%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Kraken</TableCell>
                  <TableCell>{cryptoData.symbol}/EUR</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.price * 0.997)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.volume * 0.18)}</TableCell>
                  <TableCell className="text-right">18%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Huobi</TableCell>
                  <TableCell>{cryptoData.symbol}/USDT</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.price * 1.002)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.volume * 0.12)}</TableCell>
                  <TableCell className="text-right">12%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>OKX</TableCell>
                  <TableCell>{cryptoData.symbol}/USDT</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.price * 0.998)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(cryptoData.volume * 0.1)}</TableCell>
                  <TableCell className="text-right">10%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
