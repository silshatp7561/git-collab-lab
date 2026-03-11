"use client"

import { useState } from "react"
import { Trophy, BarChart3, Calendar, Users, Crown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

// Mock Election_Result data
const mockResults = {
  "1": {
    election_id: 1,
    election_name: "Presidential Election 2024",
    status: "active",
    declared_at: null,
    total_votes: 1247,
    candidates: [
      {
        result_id: 1,
        candidate_id: 1,
        candidate_name: "John Smith",
        party_name: "Progressive Party",
        vote_count: 523,
        is_winner: true,
      },
      {
        result_id: 2,
        candidate_id: 2,
        candidate_name: "Jane Doe",
        party_name: "Democratic Alliance",
        vote_count: 412,
        is_winner: false,
      },
      {
        result_id: 3,
        candidate_id: 3,
        candidate_name: "Alex Johnson",
        party_name: "Unity Party",
        vote_count: 312,
        is_winner: false,
      },
    ],
  },
  "2": {
    election_id: 2,
    election_name: "Student Council Election",
    status: "completed",
    declared_at: "2024-10-15 18:30:00",
    total_votes: 856,
    candidates: [
      {
        result_id: 4,
        candidate_id: 4,
        candidate_name: "Sarah Wilson",
        party_name: "Student Voice",
        vote_count: 389,
        is_winner: true,
      },
      {
        result_id: 5,
        candidate_id: 5,
        candidate_name: "Mike Brown",
        party_name: "Campus United",
        vote_count: 287,
        is_winner: false,
      },
      {
        result_id: 6,
        candidate_id: 6,
        candidate_name: "Emily Davis",
        party_name: "Future Leaders",
        vote_count: 180,
        is_winner: false,
      },
    ],
  },
}

export default function ResultsPage() {
  const [selectedElection, setSelectedElection] = useState<string>("1")

  const currentResult = mockResults[selectedElection as keyof typeof mockResults]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Election Results</h1>
            <p className="mt-2 text-muted-foreground">View real-time results from the Election_Result table</p>
          </div>

          {/* Election Selector */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Select Election</label>
                  <Select value={selectedElection} onValueChange={setSelectedElection}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                      <SelectValue placeholder="Select an election" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(mockResults).map((result) => (
                        <SelectItem key={result.election_id} value={result.election_id.toString()}>
                          {result.election_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    className={
                      currentResult?.status === "completed"
                        ? "bg-accent text-accent-foreground"
                        : "bg-primary text-primary-foreground"
                    }
                  >
                    {currentResult?.status}
                  </Badge>
                  {currentResult?.declared_at && (
                    <span className="text-sm text-muted-foreground">declared_at: {currentResult.declared_at}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentResult?.total_votes.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Candidates</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentResult?.candidates.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {currentResult?.candidates.find((c) => c.is_winner)?.candidate_name}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Visualization */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Progress Bars */}
            <Card>
              <CardHeader>
                <CardTitle>Vote Distribution</CardTitle>
                <CardDescription>Visual representation of vote_count per candidate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentResult?.candidates
                  .sort((a, b) => b.vote_count - a.vote_count)
                  .map((candidate, index) => {
                    const percentage = Math.round((candidate.vote_count / currentResult.total_votes) * 100)
                    return (
                      <div key={candidate.result_id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {candidate.is_winner && <Crown className="h-4 w-4 text-yellow-500" />}
                            <span className="font-medium">{candidate.candidate_name}</span>
                            <span className="text-sm text-muted-foreground">({candidate.party_name})</span>
                          </div>
                          <span className="font-mono text-sm">
                            {candidate.vote_count} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className={index === 0 ? "[&>div]:bg-accent" : ""} />
                      </div>
                    )
                  })}
              </CardContent>
            </Card>

            {/* Results Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Results</CardTitle>
                <CardDescription>Election_Result schema: candidate_name, vote_count, declared_at</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>candidate_name</TableHead>
                      <TableHead className="text-right">vote_count</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResult?.candidates
                      .sort((a, b) => b.vote_count - a.vote_count)
                      .map((candidate, index) => (
                        <TableRow key={candidate.result_id}>
                          <TableCell>
                            {candidate.is_winner ? (
                              <div className="flex items-center gap-1">
                                <Crown className="h-4 w-4 text-yellow-500" />
                                <span className="font-bold">1</span>
                              </div>
                            ) : (
                              index + 1
                            )}
                          </TableCell>
                          <TableCell>
                            <div>
                              <span className="font-medium">{candidate.candidate_name}</span>
                              <p className="text-xs text-muted-foreground">{candidate.party_name}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {candidate.vote_count.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {Math.round((candidate.vote_count / currentResult.total_votes) * 100)}%
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Winner Announcement */}
          {currentResult?.status === "completed" && (
            <Card className="mt-8 border-accent bg-accent/10">
              <CardContent className="py-8 text-center">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-accent" />
                <h2 className="text-2xl font-bold">Winner Declared!</h2>
                <p className="mt-2 text-xl">{currentResult.candidates.find((c) => c.is_winner)?.candidate_name}</p>
                <p className="text-muted-foreground">{currentResult.candidates.find((c) => c.is_winner)?.party_name}</p>
                <p className="mt-4 text-sm text-muted-foreground">declared_at: {currentResult.declared_at}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
