"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Vote, Shield, Users, BarChart3, Blocks, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdminRoute = pathname.startsWith("/admin")
  const isVoterRoute = pathname.startsWith("/voter")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Vote className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">BlockVote</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant={pathname === "/" ? "secondary" : "ghost"} size="sm">
              Home
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant={isAdminRoute ? "secondary" : "ghost"} size="sm">
              <Shield className="mr-1.5 h-4 w-4" />
              Admin
            </Button>
          </Link>
          <Link href="/voter">
            <Button variant={isVoterRoute ? "secondary" : "ghost"} size="sm">
              <Users className="mr-1.5 h-4 w-4" />
              Voter
            </Button>
          </Link>
          <Link href="/results">
            <Button variant={pathname === "/results" ? "secondary" : "ghost"} size="sm">
              <BarChart3 className="mr-1.5 h-4 w-4" />
              Results
            </Button>
          </Link>
          <Link href="/election/transactions">
            <Button variant={pathname === "/election/transactions" ? "secondary" : "ghost"} size="sm">
              <Blocks className="mr-1.5 h-4 w-4" />
              Blockchain
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div className={cn("border-t bg-card md:hidden", mobileMenuOpen ? "block" : "hidden")}>
        <nav className="container mx-auto flex flex-col gap-1 p-4">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Button variant={pathname === "/" ? "secondary" : "ghost"} className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isAdminRoute ? "secondary" : "ghost"} className="w-full justify-start">
              <Shield className="mr-2 h-4 w-4" />
              Admin Portal
            </Button>
          </Link>
          <Link href="/voter" onClick={() => setMobileMenuOpen(false)}>
            <Button variant={isVoterRoute ? "secondary" : "ghost"} className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Voter Portal
            </Button>
          </Link>
          <Link href="/results" onClick={() => setMobileMenuOpen(false)}>
            <Button variant={pathname === "/results" ? "secondary" : "ghost"} className="w-full justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              Results
            </Button>
          </Link>
          <Link href="/election/transactions" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant={pathname === "/election/transactions" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Blocks className="mr-2 h-4 w-4" />
              Blockchain
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
