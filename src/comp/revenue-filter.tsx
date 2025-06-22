"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getVendorDashboard } from "../service/dashboardService"

interface RevenueFilterProps {
  supermarketId: string
}

export function RevenueFilter({ supermarketId }: RevenueFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("today")
  const [revenue, setRevenue] = useState<number | null>(null)

  const fetchVendorRevenue = async (range: string) => {
    try {
      const stats = await getVendorDashboard(supermarketId, range)
      setRevenue(stats.Revenue)
      console.log("Dashboard stats:", stats)
    } catch (error) {
      console.error("Error fetching vendor dashboard stats:", error)
    }
  }

  useEffect(() => {
    fetchVendorRevenue(selectedFilter)
  }, [selectedFilter])

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
  }

  return (
    <Card className="border-black/10">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Revenue Overview</CardTitle>
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-green-600" />
          <div>
            <span className="text-2xl font-bold text-green-600">
              {revenue !== null ? `$${revenue.toFixed(2)}` : 'Loading...'}
            </span>
            <p className="text-sm text-gray-500 capitalize">{selectedFilter} Revenue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
