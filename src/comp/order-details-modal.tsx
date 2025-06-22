"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Phone, Clock } from "lucide-react"

interface OrderItem {
  id: number
  name: string
  quantity: number
  price: number
  unit: string
  image?: string
}

interface Order {
  id: string
  customer: string
  customerEmail: string
  customerPhone: string
  customerAvatar?: string
  date: string
  time: string
  items: OrderItem[]
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  status: "Pending" | "Confirmed" | "Preparing" | "Ready" | "Completed" | "Cancelled"
  deliveryAddress: string
  specialInstructions?: string
  estimatedPreparationTime?: string
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onUpdateStatus: (orderId: string, newStatus: Order["status"]) => void
}

// Mock detailed order data
const getOrderDetails = (orderId: string): Order => ({
  id: orderId,
  customer: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "+1 (555) 123-4567",
  customerAvatar: "/placeholder.svg?height=40&width=40",
  date: "2023-06-16",
  time: "14:30",
  items: [
    {
      id: 1,
      name: "Fresh Apples",
      quantity: 3,
      price: 2.99,
      unit: "per lb",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "Whole Wheat Bread",
      quantity: 1,
      price: 3.49,
      unit: "loaf",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "Organic Milk",
      quantity: 2,
      price: 4.99,
      unit: "gallon",
      image: "/placeholder.svg?height=60&width=60",
    },
  ],
  subtotal: 18.95,
  deliveryFee: 3.99,
  tax: 1.52,
  total: 24.46,
  status: "Pending",
  deliveryAddress: "123 Estate Ave, Block A, Apt 101",
  specialInstructions: "Please ring doorbell twice. Leave at door if no answer.",
  estimatedPreparationTime: "15-20 minutes",
})

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  Preparing: "bg-orange-100 text-orange-800 border-orange-300",
  Ready: "bg-purple-100 text-purple-800 border-purple-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
}

const nextStatusMap = {
  Pending: "Confirmed",
  Confirmed: "Preparing",
  Preparing: "Ready",
  Ready: "Completed",
  Completed: null,
  Cancelled: null,
} as const

export function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus }: OrderDetailsModalProps) {
  if (!order) return null

  const orderDetails = getOrderDetails(order.id)
  const nextStatus = nextStatusMap[orderDetails.status]

  const handleStatusUpdate = () => {
    if (nextStatus) {
      onUpdateStatus(orderDetails.id, nextStatus as Order["status"])
    }
  }

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      onUpdateStatus(orderDetails.id, "Cancelled")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Badge variant="outline" className={statusColors[orderDetails.status]}>
              {orderDetails.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Order #{orderDetails.id} • Placed on {orderDetails.date} at {orderDetails.time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={orderDetails.customerAvatar || "/placeholder.svg"} alt={orderDetails.customer} />
                <AvatarFallback>{orderDetails.customer.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium">{orderDetails.customer}</p>
                  <p className="text-sm text-gray-600">{orderDetails.customerEmail}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {orderDetails.customerPhone}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {orderDetails.deliveryAddress}
                  </div>
                </div>
                {orderDetails.specialInstructions && (
                  <div className="text-sm">
                    <span className="font-medium">Special Instructions: </span>
                    <span className="text-gray-600">{orderDetails.specialInstructions}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Items</h3>
            <div className="space-y-3">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} {item.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>${orderDetails.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${orderDetails.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Preparation Time */}
          {orderDetails.estimatedPreparationTime &&
            orderDetails.status !== "Completed" &&
            orderDetails.status !== "Cancelled" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Estimated Preparation Time</p>
                  <p className="text-sm text-blue-600">{orderDetails.estimatedPreparationTime}</p>
                </div>
              </div>
            )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {orderDetails.status !== "Completed" && orderDetails.status !== "Cancelled" && (
            <>
              <Button variant="outline" onClick={handleCancelOrder} className="text-red-600 hover:text-red-700">
                Cancel Order
              </Button>
              {nextStatus && <Button onClick={handleStatusUpdate}>Mark as {nextStatus}</Button>}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
