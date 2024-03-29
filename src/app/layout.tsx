import type { Metadata } from "next"
import Head from "next/head"
import { Inter } from "next/font/google"

import "./base.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Philippe Fanaro's Three.js Portfolio",
  description: "Philippe Fanaro's Three.js Portfolio",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>

      <body
        style={{ margin: 0, background: "#c6e5db" }}
        className={inter.className}
      >
        {children}
      </body>
    </html>
  )
}
