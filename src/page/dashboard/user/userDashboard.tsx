"use client"

import { useState } from "react"
import { Clock, LogOut, Search, ShoppingCart, User } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

// Mock data for supermarkets
const supermarkets = [
  {
    id: 1,
    name: "Fresh Mart",
    description: "Your everyday grocery store with fresh produce",
    isOpen: true,
    openTime: "8:00 AM",
    closeTime: "9:00 PM",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    name: "Quick Stop",
    description: "Convenience store for quick shopping needs",
    isOpen: true,
    openTime: "7:00 AM",
    closeTime: "11:00 PM",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    name: "Gourmet Grocery",
    description: "Premium grocery items and specialty foods",
    isOpen: false,
    openTime: "9:00 AM",
    closeTime: "8:00 PM",
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 4,
    name: "Value Market",
    description: "Budget-friendly grocery shopping",
    isOpen: true,
    openTime: "8:30 AM",
    closeTime: "10:00 PM",
    image: "/placeholder.svg?height=100&width=200",
  },
]

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSupermarkets = supermarkets.filter((market) =>
    market.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Estate Run</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Resident</span>
            <a href="/profile/user">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </a>
            <a href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Available Supermarkets</h2>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search supermarkets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSupermarkets.map((market) => (
              <Card key={market.id} className="border-black/10 transition-all hover:shadow-md">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{market.name}</CardTitle>
                    <Badge
                      variant={market.isOpen ? "default" : "outline"}
                      className={market.isOpen ? "bg-green-600" : "text-gray-500"}
                    >
                      {market.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <img
                    src={market.image || "/placeholder.svg"}
                    alt={market.name}
                    className="mb-3 h-[100px] w-full rounded-md object-cover"
                  />
                  <p className="mb-2 text-sm text-gray-600">{market.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {market.openTime} - {market.closeTime}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <a href={`/dashboard/user/supermarket/${market.id}`} className="w-full">
                    <Button variant="outline" className="w-full" disabled={!market.isOpen}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {market.isOpen ? "Shop Now" : "Currently Closed"}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Estate Run. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
