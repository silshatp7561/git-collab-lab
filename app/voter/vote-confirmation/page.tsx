"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, ArrowLeft, ExternalLink, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState } from "react"

export default function VoteConfirmationPage() {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  const electionId = searchParams.get("election") || "1"
  const candidateId = searchParams.get("candidate") || "1"
  const txHash = searchParams.get("tx") || "0x8f2e...a1b3"

  // Mock data based on params
  const voteData = {
    voter_id: 1,
    candidate_id: Number.parseInt(candidateId),
    election_id: Number.parseInt(electionId),
    transaction_hash: txHash,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    candidate_name: "John Smith",
    election_name: "Presidential Election 2024",
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(voteData.transaction_hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent">
              <CheckCircle2 className="h-8 w-8 text-accent-foreground" />
            </div>
            <CardTitle className="text-2xl">Vote Confirmed!</CardTitle>
            <CardDescription>Your vote has been securely recorded on the blockchain</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-4 font-semibold">Vote Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">voter_id</span>
                  <span className="font-mono">{voteData.voter_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">candidate_id</span>
                  <span className="font-mono">{voteData.candidate_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">election_id</span>
                  <span className="font-mono">{voteData.election_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">transaction_hash</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{voteData.transaction_hash}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">timestamp</span>
                  <span className="text-xs">{voteData.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                You voted for <span className="font-semibold text-foreground">{voteData.candidate_name}</span> in
              </p>
              <p className="font-medium">{voteData.election_name}</p>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/election/transactions">
                <Button className="w-full bg-transparent" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Blockchain Explorer
                </Button>
              </Link>
              <Link href="/voter/dashboard">
                <Button className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
