import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "@/lib/store"
import { initialCryptoData } from "@/lib/data"

export interface CryptoData {
  id: string
  name: string
  symbol: string
  image: string
  price: number
  priceChange?: number
  change1h: number
  change24h: number
  change7d: number
  marketCap: number
  volume: number
  volumeInCrypto: number
  circulatingSupply: number
  maxSupply: number | null
  sparkline: number[]
}

interface FilterState {
  searchTerm: string
  priceRange: "all" | "under100" | "100to1000" | "over1000"
  performance: "all" | "gainers" | "losers"
}

interface PaginationState {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

interface CryptoState {
  data: CryptoData[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
  filters: FilterState
  pagination: PaginationState
}

const initialState: CryptoState = {
  data: initialCryptoData,
  status: "idle",
  error: null,
  filters: {
    searchTerm: "",
    priceRange: "all",
    performance: "all",
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: initialCryptoData.length,
  },
}

export const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoData: (state, action: PayloadAction<CryptoData[]>) => {
      // Calculate price changes before updating
      const updatedData = action.payload.map((newCrypto) => {
        const oldCrypto = state.data.find((c) => c.id === newCrypto.id)
        if (oldCrypto) {
          return {
            ...newCrypto,
            priceChange: newCrypto.price - oldCrypto.price,
          }
        }
        return newCrypto
      })

      state.data = updatedData
      state.pagination.totalItems = updatedData.length
    },
    updateSingleCrypto: (state, action: PayloadAction<Partial<CryptoData> & { id: string }>) => {
      const index = state.data.findIndex((crypto) => crypto.id === action.payload.id)
      if (index !== -1) {
        const oldPrice = state.data[index].price
        const newPrice = action.payload.price || oldPrice

        state.data[index] = {
          ...state.data[index],
          ...action.payload,
          priceChange: action.payload.price ? action.payload.price - oldPrice : undefined,
        }
      }
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.searchTerm = action.payload
      state.pagination.currentPage = 1 // Reset to first page on new search
    },
    setFilter: (state, action: PayloadAction<{ type: string; value: string }>) => {
      const { type, value } = action.payload
      if (type === "priceRange") {
        state.filters.priceRange = value as any
      } else if (type === "performance") {
        state.filters.performance = value as any
      }
      state.pagination.currentPage = 1 // Reset to first page on filter change
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination.currentPage = 1
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    refreshData: (state) => {
      // This is just a trigger for the WebSocket service to refresh data
      // The actual data update happens in the updateCryptoData reducer
    },
  },
})

export const { updateCryptoData, updateSingleCrypto, setSearchTerm, setFilter, resetFilters, setPage, refreshData } =
  cryptoSlice.actions

// Selectors
export const selectAllCryptos = (state: RootState) => state.crypto.data

export const selectFilteredCryptos = (state: RootState) => {
  const { data, filters } = state.crypto

  return data.filter((crypto) => {
    // Search term filter
    const matchesSearch =
      filters.searchTerm === "" ||
      crypto.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase())

    // Price range filter
    let matchesPriceRange = true
    if (filters.priceRange === "under100") {
      matchesPriceRange = crypto.price < 100
    } else if (filters.priceRange === "100to1000") {
      matchesPriceRange = crypto.price >= 100 && crypto.price <= 1000
    } else if (filters.priceRange === "over1000") {
      matchesPriceRange = crypto.price > 1000
    }

    // Performance filter
    let matchesPerformance = true
    if (filters.performance === "gainers") {
      matchesPerformance = crypto.change24h > 0
    } else if (filters.performance === "losers") {
      matchesPerformance = crypto.change24h < 0
    }

    return matchesSearch && matchesPriceRange && matchesPerformance
  })
}

export const selectPagination = (state: RootState) => {
  const filteredCount = selectFilteredCryptos(state).length
  return {
    ...state.crypto.pagination,
    totalItems: filteredCount,
  }
}

export const selectCryptoById = (state: RootState, id: string) => state.crypto.data.find((crypto) => crypto.id === id)

export default cryptoSlice.reducer
