"use client"

import { useState } from "react"
import {
  LogOut,
  User,
  Users,
  UserCheck,
  UserX,
  QrCode,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Eye,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for stats
const stats = {
  totalResidents: 156,
  pendingRequests: 8,
  activeVisitorCodes: 12,
  securityAlerts: 3,
}

// Mock data for pending resident requests
const pendingRequests = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 123-4567",
    address: "Block A, Apt 205",
    requestDate: "2024-01-15",
    documents: ["ID Card", "Lease Agreement"],
    status: "pending" as const,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1 (555) 234-5678",
    address: "Block B, Unit 12",
    requestDate: "2024-01-14",
    documents: ["ID Card", "Purchase Agreement"],
    status: "pending" as const,
  },
]

// Mock data for visitor codes
const visitorCodes = [
  {
    id: 1,
    code: "VIS-2024-001",
    residentName: "John Doe",
    visitorName: "Jane Smith",
    purpose: "Family Visit",
    validFrom: "2024-01-15 10:00",
    validUntil: "2024-01-15 18:00",
    status: "active" as const,
    usedAt: null,
  },
  {
    id: 2,
    code: "VIS-2024-002",
    residentName: "Alice Brown",
    visitorName: "Bob Wilson",
    purpose: "Delivery",
    validFrom: "2024-01-15 14:00",
    validUntil: "2024-01-15 16:00",
    status: "used" as const,
    usedAt: "2024-01-15 14:30",
  },
]

// Mock data for residents
const residents = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "Block A, Apt 101",
    status: "active" as const,
    joinDate: "2023-05-10",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Alice Brown",
    email: "alice@example.com",
    phone: "+1 (555) 234-5678",
    address: "Block B, Unit 15",
    status: "active" as const,
    joinDate: "2023-06-15",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function ManagementDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [filterStatus, setFilterStatus] = useState("all")

  const handleApproveRequest = (requestId: number) => {
    // In a real app, this would make an API call
    console.log(`Approving request ${requestId}`)
    alert("Resident request approved successfully!")
  }

  const handleRejectRequest = (requestId: number) => {
    // In a real app, this would make an API call
    console.log(`Rejecting request ${requestId}`)
    alert("Resident request rejected.")
  }

  const handleVerifyVisitorCode = (code: string) => {
    // In a real app, this would verify the code
    console.log(`Verifying visitor code: ${code}`)
    alert(`Visitor code ${code} verified successfully!`)
  }

  const filteredRequests = pendingRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredVisitorCodes = visitorCodes.filter((code) => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.visitorName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = filterStatus === "all" || code.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Estate Run Management</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Estate Manager</span>
            <a href="/profile/management">
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
        <h2 className="mb-6 text-2xl font-bold">Estate Management Dashboard</h2>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Residents</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{stats.totalResidents}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{stats.pendingRequests}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Visitor Codes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <QrCode className="mr-2 h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{stats.activeVisitorCodes}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Security Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                <span className="text-2xl font-bold">{stats.securityAlerts}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="requests">Resident Requests</TabsTrigger>
                <TabsTrigger value="visitors">Visitor Codes</TabsTrigger>
                <TabsTrigger value="residents">Residents</TabsTrigger>
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
                {activeTab === "visitors" && (
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <TabsContent value="overview" className="border-none p-0">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Requests */}
                <Card className="border-black/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingRequests.slice(0, 3).map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-sm text-gray-600">{request.address}</p>
                          </div>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            Pending
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Active Visitor Codes */}
                <Card className="border-black/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <QrCode className="h-5 w-5" />
                      Active Visitor Codes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {visitorCodes
                        .filter((code) => code.status === "active")
                        .slice(0, 3)
                        .map((code) => (
                          <div
                            key={code.id}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{code.code}</p>
                              <p className="text-sm text-gray-600">
                                {code.visitorName} → {code.residentName}
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Active
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="border-none p-0">
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request.id} className="border-black/10">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg" alt={request.name} />
                            <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-semibold">{request.name}</h3>
                              <p className="text-sm text-gray-600">{request.email}</p>
                              <p className="text-sm text-gray-600">{request.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm">
                                <strong>Address:</strong> {request.address}
                              </p>
                              <p className="text-sm">
                                <strong>Request Date:</strong> {request.requestDate}
                              </p>
                              <p className="text-sm">
                                <strong>Documents:</strong> {request.documents.join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                            onClick={() => handleApproveRequest(request.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => handleRejectRequest(request.id)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visitors" className="border-none p-0">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium">Code</th>
                      <th className="px-4 py-3 font-medium">Visitor</th>
                      <th className="px-4 py-3 font-medium">Resident</th>
                      <th className="px-4 py-3 font-medium">Purpose</th>
                      <th className="px-4 py-3 font-medium">Valid Until</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitorCodes.map((code) => (
                      <tr key={code.id} className="border-b">
                        <td className="px-4 py-3 font-mono text-sm">{code.code}</td>
                        <td className="px-4 py-3">{code.visitorName}</td>
                        <td className="px-4 py-3">{code.residentName}</td>
                        <td className="px-4 py-3">{code.purpose}</td>
                        <td className="px-4 py-3">{code.validUntil}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              code.status === "active"
                                ? "bg-green-100 text-green-800"
                                : code.status === "used"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {code.status === "active" ? "Active" : code.status === "used" ? "Used" : "Expired"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {code.status === "active" && (
                              <Button size="sm" variant="outline" onClick={() => handleVerifyVisitorCode(code.code)}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="residents" className="border-none p-0">
              <div className="overflow-x-auto rounded-md border border-gray-200">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium">Resident</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Phone</th>
                      <th className="px-4 py-3 font-medium">Address</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Join Date</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResidents.map((resident) => (
                      <tr key={resident.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={resident.avatar || "/placeholder.svg"} alt={resident.name} />
                              <AvatarFallback>{resident.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {resident.name}
                          </div>
                        </td>
                        <td className="px-4 py-3">{resident.email}</td>
                        <td className="px-4 py-3">{resident.phone}</td>
                        <td className="px-4 py-3">{resident.address}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              resident.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }
                          >
                            {resident.status === "active" ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{resident.joinDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
