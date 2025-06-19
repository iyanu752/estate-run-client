import { CheckCircle, Clock, LogOut, MapPin, Package, Star, Truck, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { RevenueFilter } from "@/components/revenue-filter"

// Mock data for rider stats
const riderStats = {
  totalDeliveries: 156,
  todayDeliveries: 8,
  pendingDeliveries: 3,
  rating: 4.8,
  revenue: {
    total: 2340.5,
    today: 45.6,
    thisWeek: 234.8,
    thisMonth: 890.4,
    thisYear: 2340.5,
  },
}

// Mock data for pending deliveries
const pendingDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001",
    customer: "John Doe",
    address: "123 Estate Ave, Block A",
    items: 5,
    amount: 34.95,
    distance: "0.8 km",
    estimatedTime: "15 min",
    status: "Ready for pickup",
  },
  {
    id: "DEL-002",
    orderId: "ORD-005",
    customer: "Jane Smith",
    address: "456 Estate Blvd, Block B",
    items: 3,
    amount: 21.47,
    distance: "1.2 km",
    estimatedTime: "20 min",
    status: "Ready for pickup",
  },
  {
    id: "DEL-003",
    orderId: "ORD-008",
    customer: "Robert Johnson",
    address: "789 Estate St, Block C",
    items: 7,
    amount: 52.3,
    distance: "0.5 km",
    estimatedTime: "10 min",
    status: "In progress",
  },
]

// Mock data for delivery history
const deliveryHistory = [
  {
    id: "DEL-100",
    orderId: "ORD-100",
    customer: "Sarah Williams",
    address: "321 Estate Rd, Block D",
    items: 4,
    amount: 28.75,
    deliveryFee: 3.5,
    completedAt: "2023-06-16 14:30",
    rating: 5,
  },
  {
    id: "DEL-099",
    orderId: "ORD-099",
    customer: "Michael Brown",
    address: "654 Estate Way, Block A",
    items: 6,
    amount: 41.2,
    deliveryFee: 4.0,
    completedAt: "2023-06-16 13:15",
    rating: 4,
  },
  {
    id: "DEL-098",
    orderId: "ORD-098",
    customer: "Lisa Davis",
    address: "987 Estate Circle, Block B",
    items: 2,
    amount: 15.6,
    deliveryFee: 2.5,
    completedAt: "2023-06-16 12:00",
    rating: 5,
  },
]

export default function RiderDashboard() {
  // const [revenueFilter, setRevenueFilter] = useState("today")

  const acceptDelivery = (deliveryId: string) => {
    console.log("Accepting delivery:", deliveryId)
    // In a real app, this would update the delivery status
  }

  const completeDelivery = (deliveryId: string) => {
    console.log("Completing delivery:", deliveryId)
    // In a real app, this would mark the delivery as completed
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold tracking-tight">Estate Run</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Welcome, Rider</span>
            <a href="/profile/rider">
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
        <h2 className="mb-6 text-2xl font-bold">Rider Dashboard</h2>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* <RevenueFilter data={riderStats.revenue} onFilterChange={setRevenueFilter} /> */}
          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Deliveries</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-gray-400" />
                <span className="text-2xl font-bold">{riderStats.totalDeliveries}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Today's Deliveries</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-400" />
                <span className="text-2xl font-bold">{riderStats.todayDeliveries}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold">{riderStats.pendingDeliveries}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Rating</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center">
                <Star className="mr-2 h-5 w-5 text-yellow-400" />
                <span className="text-2xl font-bold">{riderStats.rating}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending Deliveries</TabsTrigger>
            <TabsTrigger value="history">Delivery History</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="border-none p-0">
            <h3 className="mb-4 text-lg font-bold">Available Deliveries</h3>

            <div className="space-y-4">
              {pendingDeliveries.map((delivery) => (
                <Card key={delivery.id} className="border-black/10">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{delivery.customer}</CardTitle>
                        <p className="text-sm text-gray-500">Order #{delivery.orderId}</p>
                      </div>
                      <Badge
                        variant={delivery.status === "In progress" ? "default" : "outline"}
                        className={delivery.status === "In progress" ? "bg-blue-600" : "text-gray-500"}
                      >
                        {delivery.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        {delivery.address}
                      </div>
                      <div className="flex items-center text-sm">
                        <Package className="mr-2 h-4 w-4 text-gray-400" />
                        {delivery.items} items • ${delivery.amount}
                      </div>
                      <div className="flex items-center text-sm">
                        <Truck className="mr-2 h-4 w-4 text-gray-400" />
                        {delivery.distance} • {delivery.estimatedTime}
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      {delivery.status === "Ready for pickup" ? (
                        <Button onClick={() => acceptDelivery(delivery.id)} size="sm">
                          Accept Delivery
                        </Button>
                      ) : (
                        <Button onClick={() => completeDelivery(delivery.id)} size="sm">
                          Mark as Delivered
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="border-none p-0">
            <h3 className="mb-4 text-lg font-bold">Recent Deliveries</h3>

            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium">Order</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Address</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Delivery Fee</th>
                    <th className="px-4 py-3 font-medium">Completed</th>
                    <th className="px-4 py-3 font-medium">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map((delivery) => (
                    <tr key={delivery.id} className="border-b">
                      <td className="px-4 py-3">{delivery.orderId}</td>
                      <td className="px-4 py-3">{delivery.customer}</td>
                      <td className="px-4 py-3">{delivery.address}</td>
                      <td className="px-4 py-3">${delivery.amount}</td>
                      <td className="px-4 py-3 font-medium text-green-600">${delivery.deliveryFee}</td>
                      <td className="px-4 py-3">{delivery.completedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {delivery.rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Estate Run. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
