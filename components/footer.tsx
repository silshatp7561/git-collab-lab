import { Vote, Github } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Vote className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">BlockVote</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A secure, transparent, and tamper-proof online voting system powered by blockchain technology.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Quick Links</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Admin Portal
              </Link>
              <Link href="/voter" className="hover:text-foreground transition-colors">
                Voter Portal
              </Link>
              <Link href="/results" className="hover:text-foreground transition-colors">
                Election Results
              </Link>
            </nav>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Project Info</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>College Mini Project</span>
              <span>Blockchain-Based Voting</span>
              <div className="flex items-center gap-1">
                <Github className="h-3.5 w-3.5" />
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Online Voting System. Built with Next.js & Blockchain Technology.</p>
        </div>
      </div>
    </footer>
  )
}
