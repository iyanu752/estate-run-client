"use client"
import { ArrowLeft, Download, Phone } from "lucide-react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrderTracking } from "@/comp/order-tracking"

// Mock order data
const orderData = {
  id: "ORD-ABC123",
  status: "out_for_delivery" as const,
  placedAt: "2023-06-16 14:30",
  estimatedDelivery: "2023-06-16 16:00",
  items: [
    { id: 1, name: "Fresh Apples", price: 2.99, quantity: 3, unit: "per lb" },
    { id: 2, name: "Whole Wheat Bread", price: 3.49, quantity: 1, unit: "loaf" },
    { id: 3, name: "Organic Milk", price: 4.99, quantity: 2, unit: "gallon" },
  ],
  subtotal: 18.95,
  deliveryFee: 3.99,
  tax: 1.52,
  total: 24.46,
  deliveryAddress: {
    fullName: "John Doe",
    phone: "+1 (555) 123-4567",
    address: "123 Estate Ave, Block A, Apt 101",
    instructions: "Leave at door",
  },
  paymentMethod: "Credit Card ending in 1234",
  rider: {
    name: "Alex Johnson",
    phone: "+1 (555) 345-6789",
    rating: 4.8,
  },
}

export default function OrderPage() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id } = useParams<{ id: string }>()
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <a href="/dashboard/user">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            </a>
            <h1 className="text-xl font-bold tracking-tight">Order Details</h1>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Receipt
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Tracking */}
          <div className="lg:col-span-2">
            <OrderTracking
              orderId={orderData.id}
              status={orderData.status}
              estimatedDelivery={orderData.estimatedDelivery}
              rider={orderData.rider}
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Order Info */}
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle>Order Information {id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{orderData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Placed on</p>
                  <p className="font-medium">{orderData.placedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{orderData.paymentMethod}</p>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{orderData.deliveryAddress.fullName}</p>
                <p className="text-sm text-gray-600">{orderData.deliveryAddress.address}</p>
                <p className="text-sm text-gray-600">{orderData.deliveryAddress.phone}</p>
                {orderData.deliveryAddress.instructions && (
                  <p className="text-sm text-gray-500">Instructions: {orderData.deliveryAddress.instructions}</p>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${orderData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>${orderData.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${orderData.tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${orderData.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="border-black/10">
              <CardContent className="p-4">
                <p className="text-sm text-gray-600 mb-3">Need help with your order?</p>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
