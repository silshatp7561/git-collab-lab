import Link from "next/link"
import { Shield, Users, Blocks, CheckCircle2, Lock, Eye, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm">
                <Blocks className="h-4 w-4 text-primary" />
                <span>Powered by Blockchain Technology</span>
              </div>

              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Online Voting System
                <span className="block text-primary">Using Blockchain</span>
              </h1>

              <p className="mx-auto max-w-2xl text-pretty text-lg text-muted-foreground">
                A secure, transparent, and tamper-proof voting platform designed for modern democratic processes. Every
                vote is recorded on the blockchain, ensuring complete integrity and auditability.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                <Link href="/admin/login">
                  <Button size="lg" className="min-w-[180px] gap-2">
                    <Shield className="h-5 w-5" />
                    Admin Login
                  </Button>
                </Link>
                <Link href="/voter/login">
                  <Button size="lg" variant="outline" className="min-w-[180px] gap-2 bg-transparent">
                    <Users className="h-5 w-5" />
                    Voter Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Key Features</h2>
              <p className="mt-2 text-muted-foreground">Built with security and transparency at its core</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Immutable Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Once recorded, votes cannot be altered or deleted, ensuring complete election integrity.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <Eye className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Full Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    All transactions are publicly verifiable while maintaining voter anonymity.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">One Vote Per Voter</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Smart contracts ensure each verified voter can only cast a single vote per election.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-2 transition-colors hover:border-primary/50">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Real-time Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Election results are calculated and displayed instantly after voting ends.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-t bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="mt-2 text-muted-foreground">Simple steps to cast your secure vote</p>
            </div>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mb-2 font-semibold">Register & Verify</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account with your wallet address and complete verification
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mb-2 font-semibold">Cast Your Vote</h3>
                <p className="text-sm text-muted-foreground">Select your preferred candidate in an active election</p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mb-2 font-semibold">Verify on Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Your vote is recorded on the blockchain with a unique transaction hash
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Schema Info Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">System Architecture</h2>
              <p className="mt-2 text-muted-foreground">Database entities powering the voting system</p>
            </div>

            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Admin", desc: "System administrators" },
                { name: "Election", desc: "Election management" },
                { name: "Candidate", desc: "Election candidates" },
                { name: "Voter", desc: "Registered voters" },
                { name: "Vote", desc: "Cast votes record" },
                { name: "Smart_Contract", desc: "Deployed contracts" },
                { name: "Election_Result", desc: "Final results" },
                { name: "Blockchain_Transaction", desc: "Transaction logs" },
              ].map((entity) => (
                <Card key={entity.name} className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-mono">{entity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{entity.desc}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
