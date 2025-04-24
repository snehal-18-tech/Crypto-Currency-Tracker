"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { selectFilteredCryptos, updateCryptoData, selectPagination, setPage } from "@/lib/features/crypto/cryptoSlice"
import { InfoIcon, StarIcon, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import { WebSocketService } from "@/lib/websocket-service"
import PriceChart from "@/components/price-chart"
import { useRouter } from "next/navigation"

export default function CryptoTable() {
  const dispatch = useDispatch()
  const router = useRouter()
  const cryptos = useSelector(selectFilteredCryptos)
  const { currentPage, itemsPerPage, totalItems } = useSelector(selectPagination)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("favorites")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    // Initialize WebSocket service
    const wsService = new WebSocketService()

    // Start receiving updates
    const unsubscribe = wsService.subscribe((data) => {
      dispatch(updateCryptoData(data))
    })

    // Clean up on unmount
    return () => {
      unsubscribe()
      wsService.disconnect()
    }
  }, [dispatch])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const sortedCryptos = [...cryptos]

  if (sortConfig !== null) {
    sortedCryptos.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Calculate pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  const paginatedCryptos = sortedCryptos.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
  }

  const handleRowClick = (id: string) => {
    router.push(`/crypto/${id}`)
  }

  const getSortIcon = (key: string) => {
    if (sortConfig?.key !== key) {
      return <ArrowUpDown className="h-4 w-4 ml-1 inline opacity-50" />
    }
    return sortConfig.direction === "ascending" ? (
      <TrendingUp className="h-4 w-4 ml-1 inline text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 ml-1 inline text-red-500" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("price")}
              >
                Price {getSortIcon("price")}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("change1h")}
              >
                1h % {getSortIcon("change1h")}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("change24h")}
              >
                24h % {getSortIcon("change24h")}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("change7d")}
              >
                7d % {getSortIcon("change7d")}
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("marketCap")}
              >
                Market Cap {getSortIcon("marketCap")}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Market capitalization is the total value of a cryptocurrency.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => requestSort("volume")}
              >
                Volume(24h) {getSortIcon("volume")}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        A measure of how much of a cryptocurrency was traded in the last 24 hours.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-right">
                Circulating Supply
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 inline-block ml-1" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        The amount of coins that are circulating in the market and are in public hands.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="min-w-[150px]">Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCryptos.map((crypto, index) => (
              <TableRow
                key={crypto.id}
                className="cursor-pointer hover:bg-muted/50 transition-all"
                onClick={() => handleRowClick(crypto.id)}
              >
                <TableCell className="font-medium">
                  <button onClick={(e) => toggleFavorite(crypto.id, e)} className="mr-2">
                    <StarIcon
                      className={`h-4 w-4 transition-colors ${
                        favorites.includes(crypto.id)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300 hover:text-gray-400"
                      }`}
                    />
                  </button>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <img
                      src={crypto.image || "/placeholder.svg"}
                      alt={crypto.name}
                      className="w-8 h-8 mr-3 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <div className="flex flex-col items-end">
                    {formatCurrency(crypto.price)}
                    {crypto.priceChange && (
                      <span
                        className={`text-xs ${
                          crypto.priceChange > 0 ? "text-green-600" : crypto.priceChange < 0 ? "text-red-600" : ""
                        }`}
                      >
                        {crypto.priceChange > 0 ? "+" : ""}
                        {formatCurrency(crypto.priceChange)}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className={`text-right ${crypto.change1h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(crypto.change1h)}
                </TableCell>
                <TableCell className={`text-right ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(crypto.change24h)}
                </TableCell>
                <TableCell className={`text-right ${crypto.change7d >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatPercentage(crypto.change7d)}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(crypto.marketCap)}</TableCell>
                <TableCell className="text-right">
                  <div>{formatCurrency(crypto.volume)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatNumber(crypto.volumeInCrypto)} {crypto.symbol}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
                  </div>
                  {crypto.maxSupply && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width: `${(crypto.circulatingSupply / crypto.maxSupply) * 100}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <PriceChart data={crypto.sparkline} change7d={crypto.change7d} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink onClick={() => handlePageChange(page)} isActive={page === currentPage}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
