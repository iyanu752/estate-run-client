"use client"

import { CheckCircle, Clock, Package, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OrderTrackingProps {
  orderId: string
  status: "pending" | "confirmed" | "packing" | "picked_up" | "out_for_delivery" | "delivered"
  estimatedDelivery?: string
  rider?: {
    name: string
    phone: string
    rating: number
  }
}

const statusSteps = [
  { id: "pending", label: "Order Placed", icon: Clock },
  { id: "confirmed", label: "Confirmed", icon: CheckCircle },
  { id: "packing", label: "Packing", icon: Package },
  { id: "picked_up", label: "Picked Up", icon: Truck },
  { id: "out_for_delivery", label: "Out for Delivery", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle },
]

export function OrderTracking({ orderId, status, estimatedDelivery, rider }: OrderTrackingProps) {
  const currentStepIndex = statusSteps.findIndex((step) => step.id === status)

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return "completed"
    if (stepIndex === currentStepIndex) return "current"
    return "pending"
  }

  const getStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return "text-green-600"
      case "current":
        return "text-blue-600"
      default:
        return "text-gray-400"
    }
  }

  const getStatusBadgeVariant = () => {
    switch (status) {
      case "delivered":
        return "default"
      case "out_for_delivery":
      case "picked_up":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <Card className="border-black/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Order #{orderId}</CardTitle>
          <Badge variant={getStatusBadgeVariant()} className={status === "delivered" ? "bg-green-600" : ""}>
            {statusSteps.find((step) => step.id === status)?.label}
          </Badge>
        </div>
        {estimatedDelivery && <p className="text-sm text-gray-600">Estimated delivery: {estimatedDelivery}</p>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Steps */}
          <div className="space-y-3">
            {statusSteps.map((step, index) => {
              const stepStatus = getStepStatus(index)
              const Icon = step.icon

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      stepStatus === "completed"
                        ? "border-green-600 bg-green-600 text-white"
                        : stepStatus === "current"
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${getStatusColor(stepStatus)}`}>{step.label}</p>
                    {stepStatus === "current" && <p className="text-xs text-gray-500">In progress...</p>}
                    {stepStatus === "completed" && <p className="text-xs text-green-600">Completed</p>}
                  </div>
                  {index < statusSteps.length - 1 && (
                    <div className={`ml-4 h-6 w-0.5 ${stepStatus === "completed" ? "bg-green-600" : "bg-gray-300"}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Rider Information */}
          {rider && (status === "picked_up" || status === "out_for_delivery") && (
            <div className="mt-4 rounded-md border border-gray-200 p-3">
              <h4 className="font-medium">Your Delivery Rider</h4>
              <div className="mt-1 flex items-center justify-between">
                <div>
                  <p className="text-sm">{rider.name}</p>
                  <p className="text-xs text-gray-500">{rider.phone}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm">⭐ {rider.rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
