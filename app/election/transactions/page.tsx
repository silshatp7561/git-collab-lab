"use client"

import { useState } from "react"
import { Blocks, Search, ExternalLink, Clock, Fuel, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Mock blockchain transaction data (Blockchain_Transaction table)
const mockTransactions = [
  {
    transaction_id: 1,
    tx_hash: "0x8f2e3a1b7c4d5e6f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
    block_number: 18456789,
    gas_used: 21000,
    timestamp: "2024-11-01 14:30:25",
    type: "vote",
  },
  {
    transaction_id: 2,
    tx_hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    block_number: 18456790,
    gas_used: 21000,
    timestamp: "2024-11-01 14:31:12",
    type: "vote",
  },
  {
    transaction_id: 3,
    tx_hash: "0x9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d",
    block_number: 18456785,
    gas_used: 150000,
    timestamp: "2024-11-01 14:25:00",
    type: "contract_deploy",
  },
  {
    transaction_id: 4,
    tx_hash: "0x2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    block_number: 18456791,
    gas_used: 21000,
    timestamp: "2024-11-01 14:32:45",
    type: "vote",
  },
  {
    transaction_id: 5,
    tx_hash: "0x4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
    block_number: 18456792,
    gas_used: 21000,
    timestamp: "2024-11-01 14:33:18",
    type: "vote",
  },
]

export default function BlockchainTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = mockTransactions.filter(
    (tx) =>
      tx.tx_hash.toLowerCase().includes(searchQuery.toLowerCase()) || tx.block_number.toString().includes(searchQuery),
  )

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "vote":
        return <Badge variant="secondary">Vote</Badge>
      case "contract_deploy":
        return <Badge className="bg-accent text-accent-foreground">Contract Deploy</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Blocks className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Blockchain Transactions</h1>
            <p className="mt-2 text-muted-foreground">View all voting transactions recorded on the blockchain</p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <Hash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTransactions.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
                <Blocks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.max(...mockTransactions.map((tx) => tx.block_number))}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Vote Transactions</CardTitle>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockTransactions.filter((tx) => tx.type === "vote").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Gas Used</CardTitle>
                <Fuel className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {mockTransactions.reduce((acc, tx) => acc + tx.gas_used, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction hash or block number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Based on Blockchain_Transaction schema: tx_hash, block_number, gas_used, timestamp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>tx_hash</TableHead>
                      <TableHead>block_number</TableHead>
                      <TableHead>gas_used</TableHead>
                      <TableHead>timestamp</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.transaction_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="rounded bg-muted px-2 py-1 text-xs">
                              {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                            </code>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">{tx.block_number}</TableCell>
                        <TableCell className="font-mono">{tx.gas_used.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {tx.timestamp}
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(tx.type)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
