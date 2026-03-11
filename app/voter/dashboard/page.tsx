"use client"

import { useState } from "react"
import Link from "next/link"
import { Vote, Calendar, Users, CheckCircle2, LogOut, ChevronRight, Clock, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"

// Mock data
const mockVoter = {
  voter_id: 1,
  name: "John Voter",
  email: "john@example.com",
  wallet_address: "0x7890...abcd",
  is_verified: true,
}

const mockActiveElections = [
  {
    election_id: 1,
    election_name: "Presidential Election 2024",
    start_time: "2024-11-01 08:00",
    end_time: "2024-11-01 20:00",
    status: "active",
    candidates: [
      {
        candidate_id: 1,
        candidate_name: "John Smith",
        party_name: "Progressive Party",
        wallet_address: "0x1234...5678",
      },
      {
        candidate_id: 2,
        candidate_name: "Jane Doe",
        party_name: "Democratic Alliance",
        wallet_address: "0x2345...6789",
      },
      { candidate_id: 3, candidate_name: "Alex Johnson", party_name: "Unity Party", wallet_address: "0x3456...7890" },
    ],
  },
]

const mockPastVotes = [
  {
    vote_id: 1,
    election_name: "Student Council Election",
    candidate_name: "Sarah Wilson",
    timestamp: "2024-10-15 14:30",
    transaction_hash: "0xdef1...2345",
  },
]

export default function VoterDashboard() {
  const [selectedElection, setSelectedElection] = useState<number | null>(null)
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteDetails, setVoteDetails] = useState<{
    candidate_name: string
    transaction_hash: string
  } | null>(null)

  const handleVote = () => {
    if (!selectedCandidate || !selectedElection) return

    const election = mockActiveElections.find((e) => e.election_id === selectedElection)
    const candidate = election?.candidates.find((c) => c.candidate_id === selectedCandidate)

    if (candidate) {
      setVoteDetails({
        candidate_name: candidate.candidate_name,
        transaction_hash:
          "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6),
      })
      setHasVoted(true)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                {mockVoter.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{mockVoter.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-3.5 w-3.5" />
                <span className="font-mono">{mockVoter.wallet_address}</span>
                {mockVoter.is_verified ? (
                  <Badge className="bg-accent text-accent-foreground">Verified</Badge>
                ) : (
                  <Badge variant="outline">Pending Verification</Badge>
                )}
              </div>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </Link>
        </div>

        {/* Vote Confirmation Modal */}
        {hasVoted && voteDetails && (
          <Card className="mb-8 border-accent bg-accent/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-accent" />
                <CardTitle className="text-accent">Vote Successfully Recorded!</CardTitle>
              </div>
              <CardDescription>Your vote is securely recorded on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground">voter_id</p>
                  <p className="font-mono">{mockVoter.voter_id}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">candidate_id</p>
                  <p className="font-mono">{selectedCandidate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">election_id</p>
                  <p className="font-mono">{selectedElection}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">transaction_hash</p>
                  <p className="font-mono text-sm">{voteDetails.transaction_hash}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/election/transactions">
                  <Button variant="outline" size="sm">
                    View on Blockchain
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  href={`/voter/vote-confirmation?election=${selectedElection}&candidate=${selectedCandidate}&tx=${voteDetails.transaction_hash}`}
                >
                  <Button size="sm">
                    View Confirmation
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Elections */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Active Elections
                </CardTitle>
                <CardDescription>Select an election to cast your vote</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockActiveElections.map((election) => (
                  <div
                    key={election.election_id}
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                      selectedElection === election.election_id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
                    }`}
                    onClick={() => {
                      setSelectedElection(election.election_id)
                      setSelectedCandidate(null)
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{election.election_name}</h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {election.start_time} - {election.end_time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {election.candidates.length} candidates
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">{election.status}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Candidates for Selected Election */}
            {selectedElection && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Select Candidate
                  </CardTitle>
                  <CardDescription>Choose your preferred candidate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockActiveElections
                    .find((e) => e.election_id === selectedElection)
                    ?.candidates.map((candidate) => (
                      <div
                        key={candidate.candidate_id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-colors ${
                          selectedCandidate === candidate.candidate_id
                            ? "border-primary bg-primary/5"
                            : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
                        }`}
                        onClick={() => setSelectedCandidate(candidate.candidate_id)}
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {candidate.candidate_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-medium">{candidate.candidate_name}</h4>
                            <p className="text-sm text-muted-foreground">{candidate.party_name}</p>
                            <p className="mt-1 font-mono text-xs text-muted-foreground">{candidate.wallet_address}</p>
                          </div>
                          {selectedCandidate === candidate.candidate_id && (
                            <CheckCircle2 className="h-6 w-6 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}

                  <Button
                    className="mt-4 w-full"
                    size="lg"
                    disabled={!selectedCandidate || hasVoted}
                    onClick={handleVote}
                  >
                    <Vote className="mr-2 h-5 w-5" />
                    {hasVoted ? "Vote Already Cast" : "Cast Vote"}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    One vote per voter. This action cannot be undone.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voter Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Voter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">voter_id</span>
                  <span className="font-mono">{mockVoter.voter_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">name</span>
                  <span>{mockVoter.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">email</span>
                  <span className="text-xs">{mockVoter.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">is_verified</span>
                  <span>{mockVoter.is_verified ? "true" : "false"}</span>
                </div>
              </CardContent>
            </Card>

            {/* Past Votes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Your Vote History</CardTitle>
              </CardHeader>
              <CardContent>
                {mockPastVotes.length > 0 ? (
                  <div className="space-y-3">
                    {mockPastVotes.map((vote) => (
                      <div key={vote.vote_id} className="rounded-lg border p-3 text-sm">
                        <p className="font-medium">{vote.election_name}</p>
                        <p className="text-muted-foreground">Voted for: {vote.candidate_name}</p>
                        <p className="mt-1 font-mono text-xs text-muted-foreground">tx: {vote.transaction_hash}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No votes cast yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
