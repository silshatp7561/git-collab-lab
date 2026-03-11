import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Online Voting System | Blockchain-Based Secure Voting",
  description:
    "A secure, transparent, and tamper-proof online voting system powered by blockchain technology. College Mini Project.",
   
}

export const viewport: Viewport = {
  themeColor: "#3b5bdb",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        
      </body>
    </html>
  )
}
