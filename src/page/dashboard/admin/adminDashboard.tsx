"use client"

import { useState } from "react"
import { Building, LogOut, Plus, Search, ShoppingCart, Trash, User, Users, Star, Truck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { AnalyticsCharts } from "@/components/analytics-charts"

// Mock data for stats
const stats = {
  totalUsers: 124,
  totalVendors: 8,
  totalRiders: 12,
  totalSupermarkets: 8,
  activeUsers: 87,
}

// Mock data for users
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "Active",
    joinDate: "2023-05-10",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    joinDate: "2023-05-15",
  },
  {
    id: 3,
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "User",
    status: "Inactive",
    joinDate: "2023-04-22",
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    joinDate: "2023-06-01",
  },
]

// Mock data for vendors
const vendors = [
  {
    id: 1,
    name: "Fresh Mart",
    owner: "Michael Brown",
    email: "michael@freshmart.com",
    status: "Active",
    items: 120,
    joinDate: "2023-03-15",
  },
  {
    id: 2,
    name: "Quick Stop",
    owner: "Lisa Davis",
    email: "lisa@quickstop.com",
    status: "Active",
    items: 85,
    joinDate: "2023-04-10",
  },
  {
    id: 3,
    name: "Gourmet Grocery",
    owner: "David Wilson",
    email: "david@gourmetgrocery.com",
    status: "Active",
    items: 150,
    joinDate: "2023-02-20",
  },
  {
    id: 4,
    name: "Value Market",
    owner: "Emily Taylor",
    email: "emily@valuemarket.com",
    status: "Inactive",
    items: 95,
    joinDate: "2023-05-05",
  },
]

// Add riders mock data after vendors data:
const riders = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    status: "Active",
    rating: 4.8,
    totalDeliveries: 156,
    assignedOrders: 3,
    joinDate: "2023-04-15",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    status: "Active",
    rating: 4.9,
    totalDeliveries: 203,
    assignedOrders: 2,
    joinDate: "2023-03-20",
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@example.com",
    status: "Inactive",
    rating: 4.6,
    totalDeliveries: 89,
    assignedOrders: 0,
    joinDate: "2023-05-10",
  },
]

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Update the filtered data logic to include riders:
  const filteredRiders = riders.filter(
    (rider) =>
      rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Estate Run</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Admin</span>
            <a href="/">
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </a>
            {/* Add profile button to header: */}
            <a href="/profile/admin">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold">Admin Dashboard</h2>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Vendors</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.totalVendors}</span>
              </div>
            </CardContent>
          </Card>

          {/* Update the stats cards to include riders: */}
          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Riders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Truck className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.totalRiders}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Supermarkets</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.totalSupermarkets}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Users</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.activeUsers}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              {/* Update the tabs to include rider management: */}
              <TabsList className="mb-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="vendors">Vendors</TabsTrigger>
                <TabsTrigger value="riders">Riders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder={`Search ${activeTab}...`}
                    className="w-[250px] pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {/* Update the Add button text logic: */}
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add {activeTab === "users" ? "User" : activeTab === "vendors" ? "Vendor" : "Rider"}
                </Button>
              </div>
            </div>

            <TabsContent value="users" className="border-none p-0">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Join Date</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">{user.role}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.status === "Active" ? "default" : "outline"}
                            className={user.status === "Active" ? "bg-green-600" : "text-gray-500"}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{user.joinDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
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

            <TabsContent value="vendors" className="border-none p-0">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium">Supermarket</th>
                      <th className="px-4 py-3 font-medium">Owner</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Items</th>
                      <th className="px-4 py-3 font-medium">Join Date</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b">
                        <td className="px-4 py-3">{vendor.name}</td>
                        <td className="px-4 py-3">{vendor.owner}</td>
                        <td className="px-4 py-3">{vendor.email}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={vendor.status === "Active" ? "default" : "outline"}
                            className={vendor.status === "Active" ? "bg-green-600" : "text-gray-500"}
                          >
                            {vendor.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{vendor.items}</td>
                        <td className="px-4 py-3">{vendor.joinDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Edit
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

            {/* Add rider management tab content after vendors tab: */}
            <TabsContent value="riders" className="border-none p-0">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Rating</th>
                      <th className="px-4 py-3 font-medium">Deliveries</th>
                      <th className="px-4 py-3 font-medium">Assigned Orders</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRiders.map((rider) => (
                      <tr key={rider.id} className="border-b">
                        <td className="px-4 py-3">{rider.name}</td>
                        <td className="px-4 py-3">{rider.email}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={rider.status === "Active" ? "default" : "outline"}
                            className={rider.status === "Active" ? "bg-green-600" : "text-gray-500"}
                          >
                            {rider.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {rider.rating}
                          </div>
                        </td>
                        <td className="px-4 py-3">{rider.totalDeliveries}</td>
                        <td className="px-4 py-3">{rider.assignedOrders}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Assign Order
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
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
            <TabsContent value="analytics" className="border-none p-0">
              <h3 className="mb-4 text-lg font-bold">Platform Analytics</h3>
              {/* <AnalyticsCharts userType="admin" /> */}
            </TabsContent>
          </Tabs>
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
