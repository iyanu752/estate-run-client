"use client"

import { useState } from "react"
import { CalendarDays, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RevenueData {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  thisYear: number
}

interface RevenueFilterProps {
  data: RevenueData
  onFilterChange: (filter: string) => void
}

export function RevenueFilter({ data, onFilterChange }: RevenueFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState("today")

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    onFilterChange(value)
  }

  const getRevenueByFilter = () => {
    switch (selectedFilter) {
      case "today":
        return data.today
      case "week":
        return data.thisWeek
      case "month":
        return data.thisMonth
      case "year":
        return data.thisYear
      case "total":
        return data.total
      default:
        return data.today
    }
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
              <SelectItem value="total">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center">
          <CalendarDays className="mr-2 h-5 w-5 text-green-600" />
          <div>
            <span className="text-2xl font-bold text-green-600">${getRevenueByFilter().toFixed(2)}</span>
            <p className="text-sm text-gray-500 capitalize">{selectedFilter} Revenue</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
