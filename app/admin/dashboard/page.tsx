"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Plus, Users, Calendar, Play, Square, FileCode, BarChart3, LogOut, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navbar } from "@/components/navbar"

// Mock data for UI display
const mockElections = [
  {
    election_id: 1,
    election_name: "Presidential Election 2024",
    start_time: "2024-11-01 08:00",
    end_time: "2024-11-01 20:00",
    status: "active",
  },
  {
    election_id: 2,
    election_name: "Student Council Election",
    start_time: "2024-10-15 09:00",
    end_time: "2024-10-15 17:00",
    status: "completed",
  },
  {
    election_id: 3,
    election_name: "Board of Directors Vote",
    start_time: "2024-12-01 10:00",
    end_time: "2024-12-01 18:00",
    status: "pending",
  },
]

const mockCandidates = [
  {
    candidate_id: 1,
    candidate_name: "John Smith",
    party_name: "Progressive Party",
    wallet_address: "0x1234...5678",
    election_id: 1,
  },
  {
    candidate_id: 2,
    candidate_name: "Jane Doe",
    party_name: "Democratic Alliance",
    wallet_address: "0x2345...6789",
    election_id: 1,
  },
  {
    candidate_id: 3,
    candidate_name: "Alex Johnson",
    party_name: "Unity Party",
    wallet_address: "0x3456...7890",
    election_id: 1,
  },
]

const mockContracts = [
  { contract_id: 1, contract_address: "0xabcd...ef01", election_id: 1, deployed_at: "2024-10-30 14:30" },
  { contract_id: 2, contract_address: "0xbcde...f012", election_id: 2, deployed_at: "2024-10-14 10:00" },
]

export default function AdminDashboard() {
  const [electionForm, setElectionForm] = useState({
    election_name: "",
    start_time: "",
    end_time: "",
    status: "pending",
  })

  const [candidateForm, setCandidateForm] = useState({
    candidate_name: "",
    party_name: "",
    wallet_address: "",
    election_id: "",
  })

  const [contractForm, setContractForm] = useState({
    contract_address: "",
    election_id: "",
  })

  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Election created successfully! (UI placeholder)")
  }

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Candidate added successfully! (UI placeholder)")
  }

  const handleDeployContract = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Smart contract deployed successfully! (UI placeholder)")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-accent text-accent-foreground">Active</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage elections, candidates, and smart contracts</p>
          </div>
          <div className="flex gap-2">
            <Link href="/results">
              <Button variant="outline" size="sm">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Results
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockElections.length}</div>
              <p className="text-xs text-muted-foreground">1 active election</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCandidates.length}</div>
              <p className="text-xs text-muted-foreground">Across all elections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Smart Contracts</CardTitle>
              <FileCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockContracts.length}</div>
              <p className="text-xs text-muted-foreground">Deployed contracts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">Recorded on blockchain</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="elections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Elections Tab */}
          <TabsContent value="elections" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Create Election Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Election
                  </CardTitle>
                  <CardDescription>Set up a new election with details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateElection} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="election_name">election_name</Label>
                      <Input
                        id="election_name"
                        placeholder="Enter election name"
                        value={electionForm.election_name}
                        onChange={(e) => setElectionForm({ ...electionForm, election_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="start_time">start_time</Label>
                        <Input
                          id="start_time"
                          type="datetime-local"
                          value={electionForm.start_time}
                          onChange={(e) => setElectionForm({ ...electionForm, start_time: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end_time">end_time</Label>
                        <Input
                          id="end_time"
                          type="datetime-local"
                          value={electionForm.end_time}
                          onChange={(e) => setElectionForm({ ...electionForm, end_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">status</Label>
                      <Select
                        value={electionForm.status}
                        onValueChange={(value) => setElectionForm({ ...electionForm, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">
                      Create Election
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Elections List */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Elections</CardTitle>
                  <CardDescription>Start, stop, or view election details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockElections.map((election) => (
                      <div
                        key={election.election_id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{election.election_name}</span>
                            {getStatusBadge(election.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {election.start_time} - {election.end_time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {election.status === "pending" && (
                            <Button size="sm" variant="outline">
                              <Play className="mr-1 h-3 w-3" />
                              Start
                            </Button>
                          )}
                          {election.status === "active" && (
                            <Button size="sm" variant="outline">
                              <Square className="mr-1 h-3 w-3" />
                              Stop
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add Candidate Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Candidate
                  </CardTitle>
                  <CardDescription>Register a new candidate for an election</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="candidate_name">candidate_name</Label>
                      <Input
                        id="candidate_name"
                        placeholder="Enter candidate name"
                        value={candidateForm.candidate_name}
                        onChange={(e) => setCandidateForm({ ...candidateForm, candidate_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="party_name">party_name</Label>
                      <Input
                        id="party_name"
                        placeholder="Enter party name"
                        value={candidateForm.party_name}
                        onChange={(e) => setCandidateForm({ ...candidateForm, party_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="candidate_wallet_address">wallet_address</Label>
                      <Input
                        id="candidate_wallet_address"
                        placeholder="0x..."
                        className="font-mono text-sm"
                        value={candidateForm.wallet_address}
                        onChange={(e) => setCandidateForm({ ...candidateForm, wallet_address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="election_id">election_id</Label>
                      <Select
                        value={candidateForm.election_id}
                        onValueChange={(value) => setCandidateForm({ ...candidateForm, election_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select election" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockElections.map((election) => (
                            <SelectItem key={election.election_id} value={election.election_id.toString()}>
                              {election.election_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button type="submit" className="w-full">
                      Add Candidate
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Candidates Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Registered Candidates</CardTitle>
                  <CardDescription>All candidates across elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>candidate_name</TableHead>
                        <TableHead>party_name</TableHead>
                        <TableHead>wallet_address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCandidates.map((candidate) => (
                        <TableRow key={candidate.candidate_id}>
                          <TableCell className="font-medium">{candidate.candidate_name}</TableCell>
                          <TableCell>{candidate.party_name}</TableCell>
                          <TableCell className="font-mono text-xs">{candidate.wallet_address}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Deploy Contract Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    Deploy Smart Contract
                  </CardTitle>
                  <CardDescription>Deploy a voting contract for an election</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleDeployContract} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contract_address">contract_address</Label>
                      <Input
                        id="contract_address"
                        placeholder="0x..."
                        className="font-mono text-sm"
                        value={contractForm.contract_address}
                        onChange={(e) => setContractForm({ ...contractForm, contract_address: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract_election_id">election_id</Label>
                      <Select
                        value={contractForm.election_id}
                        onValueChange={(value) => setContractForm({ ...contractForm, election_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select election" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockElections.map((election) => (
                            <SelectItem key={election.election_id} value={election.election_id.toString()}>
                              {election.election_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>deployed_at</Label>
                      <Input
                        type="datetime-local"
                        defaultValue={new Date().toISOString().slice(0, 16)}
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">Auto-generated on deployment</p>
                    </div>

                    <Button type="submit" className="w-full">
                      Deploy Contract
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Deployed Contracts */}
              <Card>
                <CardHeader>
                  <CardTitle>Deployed Contracts</CardTitle>
                  <CardDescription>Smart contracts linked to elections</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>contract_address</TableHead>
                        <TableHead>election_id</TableHead>
                        <TableHead>deployed_at</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockContracts.map((contract) => (
                        <TableRow key={contract.contract_id}>
                          <TableCell className="font-mono text-xs">{contract.contract_address}</TableCell>
                          <TableCell>{contract.election_id}</TableCell>
                          <TableCell className="text-sm">{contract.deployed_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Election Results</CardTitle>
                <CardDescription>View and manage election results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2 font-semibold">View Detailed Results</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Access comprehensive election results and analytics
                  </p>
                  <Link href="/results">
                    <Button>
                      Go to Results Page
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
