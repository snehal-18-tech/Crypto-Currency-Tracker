import CryptoTable from "@/components/crypto-table"
import { Providers } from "@/components/providers"
import { SearchFilterBar } from "@/components/search-filter-bar"

export default function Home() {
  return (
    <Providers>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Cryptocurrency Market</h1>
          <SearchFilterBar />
        </div>
        <CryptoTable />
      </main>
    </Providers>
  )
}
