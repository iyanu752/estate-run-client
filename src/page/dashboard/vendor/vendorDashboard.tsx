import { useState } from "react"
import {
  Clock,
  Edit,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash,
  DollarSign,
  User,
  Calendar,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { AnalyticsCharts } from "@/components/analytics-charts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for vendor's supermarket
const supermarket = {
  id: 1,
  name: "Fresh Mart",
  description: "Your everyday grocery store with fresh produce",
  isOpen: true,
  openTime: "8:00 AM",
  closeTime: "9:00 PM",
  image: "/placeholder.svg?height=200&width=400",
  totalItems: 120,
  outOfStock: 5,
  pendingOrders: 3,
}

// Mock data for items
const items = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    price: 2.99,
    unit: "per lb",
    inStock: true,
    quantity: 50,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Whole Wheat Bread",
    category: "Bakery",
    price: 3.49,
    unit: "loaf",
    inStock: true,
    quantity: 25,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Organic Milk",
    category: "Dairy",
    price: 4.99,
    unit: "gallon",
    inStock: true,
    quantity: 30,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "Chicken Breast",
    category: "Meat",
    price: 6.99,
    unit: "per lb",
    inStock: false,
    quantity: 0,
    image: "/placeholder.svg?height=100&width=100",
  },
]

// Mock data for orders
const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    date: "2023-06-16",
    items: 5,
    total: 34.95,
    status: "Pending",
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    date: "2023-06-15",
    items: 3,
    total: 21.47,
    status: "Completed",
  },
  {
    id: "ORD-003",
    customer: "Robert Johnson",
    date: "2023-06-15",
    items: 7,
    total: 52.3,
    status: "Pending",
  },
]

// Mock data for revenue and orders by date filter
const revenueData = {
  today: { revenue: 234.5, orders: 12 },
  week: { revenue: 1567.8, orders: 89 },
  month: { revenue: 4890.25, orders: 342 },
  year: { revenue: 12450.75, orders: 1456 },
  total: { revenue: 15678.9, orders: 1789 },
}

export default function VendorDashboard() {
  const [isOpen, setIsOpen] = useState(supermarket.isOpen)
  const [dateFilter, setDateFilter] = useState("month")

  const getCurrentData = () => {
    return revenueData[dateFilter as keyof typeof revenueData]
  }

  const getFilterLabel = () => {
    switch (dateFilter) {
      case "today":
        return "Today's"
      case "week":
        return "This Week's"
      case "month":
        return "This Month's"
      case "year":
        return "This Year's"
      case "total":
        return "Total"
      default:
        return "This Month's"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Estate Run</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Vendor</span>
            <a href="/profile/vendor">
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
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
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
          <Card className="border-black/10 md:w-1/3">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{supermarket.name}</CardTitle>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <img
                src={supermarket.image || "/placeholder.svg"}
                alt={supermarket.name}
                className="mb-3 h-[150px] w-full rounded-md object-cover"
              />
              <p className="mb-2 text-sm text-gray-600">{supermarket.description}</p>
              <div className="mb-4 flex items-center text-xs text-gray-500">
                <Clock className="mr-1 h-3 w-3" />
                {supermarket.openTime} - {supermarket.closeTime}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Store Status</span>
                <div className="flex items-center gap-2">
                  <span className={isOpen ? "text-green-600" : "text-gray-500"}>{isOpen ? "Open" : "Closed"}</span>
                  <Switch checked={isOpen} onCheckedChange={setIsOpen} />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            {/* Date Filter */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[140px]">
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
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Revenue */}
              <Card className="border-black/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{getFilterLabel()} Revenue</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-green-400" />
                    <span className="text-2xl font-bold text-green-600">${getCurrentData().revenue.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Total Orders */}
              <Card className="border-black/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">{getFilterLabel()} Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-blue-400" />
                    <span className="text-2xl font-bold">{getCurrentData().orders}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Average Order Value */}
              <Card className="border-black/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Avg. Order Value</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-purple-400" />
                    <span className="text-2xl font-bold">
                      ${(getCurrentData().revenue / getCurrentData().orders).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Orders */}
              <Card className="border-black/10">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-yellow-400" />
                    <span className="text-2xl font-bold">{supermarket.pendingOrders}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-3">
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="border-none p-0">
                <div className="flex items-center justify-between">
                  <h3 className="mb-4 text-lg font-bold">Inventory Management</h3>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3 font-medium">Item</th>
                        <th className="px-4 py-3 font-medium">Category</th>
                        <th className="px-4 py-3 font-medium">Price</th>
                        <th className="px-4 py-3 font-medium">Quantity</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <span>{item.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{item.category}</td>
                          <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-3">{item.quantity}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={item.inStock ? "default" : "outline"}
                              className={item.inStock ? "bg-green-600" : "text-red-500"}
                            >
                              {item.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="orders" className="border-none p-0">
                <h3 className="mb-4 text-lg font-bold">Recent Orders</h3>

                <div className="overflow-x-auto rounded-md border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left">
                        <th className="px-4 py-3 font-medium">Order ID</th>
                        <th className="px-4 py-3 font-medium">Customer</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 font-medium">Items</th>
                        <th className="px-4 py-3 font-medium">Total</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-3">{order.id}</td>
                          <td className="px-4 py-3">{order.customer}</td>
                          <td className="px-4 py-3">{order.date}</td>
                          <td className="px-4 py-3">{order.items}</td>
                          <td className="px-4 py-3">${order.total.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={order.status === "Pending" ? "outline" : "default"}
                              className={order.status === "Pending" ? "text-yellow-500" : "bg-green-600"}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="border-none p-0">
                <h3 className="mb-4 text-lg font-bold">Sales Analytics</h3>
                {/* <AnalyticsCharts userType="vendor" /> */}
              </TabsContent>
            </Tabs>
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
