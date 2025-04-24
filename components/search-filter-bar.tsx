"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, SlidersHorizontal, RefreshCw, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { setSearchTerm, setFilter, resetFilters, refreshData } from "@/lib/features/crypto/cryptoSlice"
import { Badge } from "@/components/ui/badge"

export function SearchFilterBar() {
  const dispatch = useDispatch()
  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(setSearchTerm(localSearchTerm))
  }

  const handleFilterChange = (filterType: string, value: string) => {
    dispatch(setFilter({ type: filterType, value }))

    // Update active filters for UI
    if (value !== "all") {
      setActiveFilters((prev) => {
        const newFilters = prev.filter((f) => !f.startsWith(filterType))
        return [...newFilters, `${filterType}:${value}`]
      })
    } else {
      setActiveFilters((prev) => prev.filter((f) => !f.startsWith(filterType)))
    }
  }

  const handleResetFilters = () => {
    dispatch(resetFilters())
    setActiveFilters([])
    setLocalSearchTerm("")
  }

  const handleRefresh = () => {
    dispatch(refreshData())
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row w-full gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cryptocurrencies..."
              className="pl-8 pr-4"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="default" className="ml-2">
            Search
          </Button>
        </form>

        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleRefresh} className="animate-pulse">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh Data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className={activeFilters.length > 0 ? "bg-primary/10" : ""}>
                      <SlidersHorizontal className="h-4 w-4" />
                      {activeFilters.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
                          {activeFilters.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter Options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground flex items-center">
                  <DollarSign className="h-3 w-3 mr-1" /> Price Range
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterChange("priceRange", "all")}>All Prices</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("priceRange", "under100")}>
                  Under $100
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("priceRange", "100to1000")}>
                  $100 - $1,000
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("priceRange", "over1000")}>
                  Over $1,000
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> Performance
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterChange("performance", "all")}>
                  All Performance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("performance", "gainers")}>
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" /> Top Gainers (24h)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange("performance", "losers")}>
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" /> Top Losers (24h)
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleResetFilters} className="text-red-500">
                Reset All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(":")
            let label = ""
            let variant: "default" | "destructive" | "success" | "secondary" = "default"

            if (type === "priceRange") {
              if (value === "under100") {
                label = "Under $100"
              } else if (value === "100to1000") {
                label = "$100 - $1,000"
              } else if (value === "over1000") {
                label = "Over $1,000"
              }
              variant = "secondary"
            } else if (type === "performance") {
              if (value === "gainers") {
                label = "Top Gainers"
                variant = "success"
              } else if (value === "losers") {
                label = "Top Losers"
                variant = "destructive"
              }
            }

            return (
              <Badge
                key={filter}
                variant={variant}
                className="cursor-pointer"
                onClick={() => handleFilterChange(type, "all")}
              >
                {label} ×
              </Badge>
            )
          })}
          <Badge variant="outline" className="cursor-pointer" onClick={handleResetFilters}>
            Clear All
          </Badge>
        </div>
      )}
    </div>
  )
}
