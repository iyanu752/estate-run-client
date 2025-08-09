"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Clock } from "lucide-react";
import { updateOrderStatus } from "@/service/orderService";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VendorOrder {
  _id: string;
  userId: {
    email: string;
    firstName: string;
    supermarket: string;
    phone: string;
  };
  items: {
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
      unit?: string;
    };
    quantity: number;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  status: string;
  orderId: string;
  createdAt: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: VendorOrder | null;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
  onRefreshOrder?: (orderId: string) => Promise<VendorOrder | null>; // Add this prop
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  // confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  packed: "bg-orange-100 text-orange-800 border-orange-300",
  "out-for-delivery": "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
  "payment-failed": "bg-red-50 text-red-700 border-red-200",
};

export function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onRefreshOrder,
}: OrderDetailsModalProps) {
  const [currentOrder, setCurrentOrder] = useState<VendorOrder | null>(order);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  // Update local state when order prop changes
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);

  if (!currentOrder) return null;

  const subtotal = currentOrder.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const deliveryFee = 500;
  const tax = 500;
  const total = currentOrder.totalAmount;

  const handleStatusUpdate = async () => {
    if (currentOrder.status !== "pending") return;

    setIsUpdating(true);
    try {
      // await updateOrderStatus(currentOrder.orderId, "confirmed");
      // const updatedOrder = { ...currentOrder, status: "confirmed" };
      // setCurrentOrder(updatedOrder);
      // onUpdateStatus(currentOrder.orderId, "confirmed");
      // await new Promise((resolve) => setTimeout(resolve, 500));
      await updateOrderStatus(currentOrder.orderId, "packed");
      const finalOrder = { ...currentOrder, status: "packed" };
      setCurrentOrder(finalOrder);
      onUpdateStatus(currentOrder.orderId, "packed");
      if (onRefreshOrder) {
        const refreshedOrder = await onRefreshOrder(currentOrder.orderId);
        if (refreshedOrder) {
          setCurrentOrder(refreshedOrder);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(currentOrder._id, "cancelled");

      const updatedOrder = { ...currentOrder, status: "cancelled" };
      setCurrentOrder(updatedOrder);
      onUpdateStatus(currentOrder._id, "cancelled");

      if (onRefreshOrder) {
        const refreshedOrder = await onRefreshOrder(currentOrder._id);
        if (refreshedOrder) {
          setCurrentOrder(refreshedOrder);
        }
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    } finally {
      setIsUpdating(false);
      setShowCancelDialog(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <Badge
              variant="outline"
              className={
                statusColors[currentOrder.status] ||
                "bg-gray-100 text-gray-800 border-gray-300"
              }
            >
              {currentOrder.status.charAt(0).toUpperCase() +
                currentOrder.status.slice(1).replace(/-/g, " ")}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Order #{currentOrder.orderId} • Placed on{" "}
            {formatDate(currentOrder.createdAt)} at{" "}
            {formatTime(currentOrder.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {currentOrder.userId?.firstName?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium">
                    {currentOrder.userId?.firstName || "Customer"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentOrder.userId?.email}
                  </p>
                </div>
                <div className="flex items-start gap-4 text-sm text-gray-600">
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="break-words">
                      {currentOrder.deliveryAddress}
                    </span>
                  </div>
                </div>
                {currentOrder.deliveryInstructions && (
                  <div className="text-sm">
                    <span className="font-medium">Special Instructions: </span>
                    <span className="text-gray-600">
                      {currentOrder.deliveryInstructions}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Order Items</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <div
                  key={item.product._id || index}
                  className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      ₦{item.product.price.toFixed(2)}{" "}
                      {item.product.unit || "each"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">
                      ₦{(item.product.price * item.quantity).toFixed(2)}
                    </p>
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
                <span>₦{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>₦{tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Status Info */}
          {currentOrder.status !== "delivered" &&
            currentOrder.status !== "cancelled" && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Order Status</p>
                  <p className="text-sm text-blue-600">
                    {currentOrder.status === "pending" &&
                      "Awaiting confirmation"}
                    {/* {currentOrder.status === "confirmed" && "Order confirmed"} */}
                    {/* {currentOrder.status === "packed" && "Being processed"} */}
                    {currentOrder.status === "packed" && "Being packed"}
                    {currentOrder.status === "out-for-delivery" &&
                      "Out for delivery"}
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Footer Buttons */}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {currentOrder.status === "pending" && (
            <>
              <AlertDialog
                open={showCancelDialog}
                onOpenChange={setShowCancelDialog}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    disabled={isUpdating}
                  >
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this order? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, keep order</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleCancelOrder}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Cancelling..." : "Yes, cancel order"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={handleStatusUpdate} disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Mark as Packed"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
