// // components/order-card.tsx
// "use client";

// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";

// // ← Add these Select imports:
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";

// export type OrderStatus =
//   | "pending"
//   | "received"
//   | "packing"
//   | "picked_up"
//   | "delivered"
//   | "payment_failed"
//   | "payment_abandoned";

// // Extend Order to include confirmation_code
// export interface Order {
//   id: number;
//   created_at: string;
//   customer_id: string;
//   delivery_address: string;
//   payment_status: string;
//   status: OrderStatus;
//   total_amount: number | null;
//   rider_id: string | null;
//   payment_ref: string | null;
//   confirmation_code?: string | null;      // <— Already present
//   customer_name?: string;
//   customer_phone?: string;
//   items?: OrderItemDisplay[];
//   rider_name?: string;    // Used by vendor/rider/admin
//   rider_phone?: string;   // Used by vendor/rider/admin
// }

// // Type for items within an order (display purposes)
// export interface OrderItemDisplay {
//   id: number;
//   product_id: number;
//   quantity: number;
//   price_at_purchase: number;
//   product_name?: string;
//   product_image_url?: string;
// }

// interface OrderCardProps {
//   order: Order;
//   role: "customer" | "vendor" | "rider" | "admin";
//   onStatusChange?: (orderId: number, newStatus: OrderStatus) => void;
//   onAssignRider?: (orderId: number, riderId: string) => void;
//   onClaimOrder?: (orderId: number) => void;
// }

// const getStatusColor = (status: OrderStatus) => {
//   switch (status) {
//     case "received":
//     case "packing":
//       return "bg-yellow-500 text-white";
//     case "picked_up":
//       return "bg-blue-500 text-white";
//     case "delivered":
//       return "bg-green-500 text-white";
//     case "payment_failed":
//     case "payment_abandoned":
//       return "bg-red-500 text-white";
//     default:
//       return "bg-gray-300 text-gray-800";
//   }
// };

// const getStatusText = (status: OrderStatus) => {
//   switch (status) {
//     case "pending":
//       return "Pending";
//     case "received":
//       return "New Order";
//     case "packing":
//       return "Packing";
//     case "picked_up":
//       return "Picked Up";
//     case "delivered":
//       return "Delivered";
//     case "payment_failed":
//       return "Payment Failed";
//     case "payment_abandoned":
//       return "Payment Abandoned";
//     default:
//       return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ");
//   }
// };

// export default function OrderCard({
//   order,
//   role,
//   onStatusChange,
//   onAssignRider,
//   onClaimOrder,
// }: OrderCardProps) {
//   const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status);

//   useEffect(() => {
//     setCurrentStatus(order.status);
//   }, [order.status]);

//   const handleStatusSelect = (newStatus: OrderStatus) => {
//     setCurrentStatus(newStatus);
//     if (onStatusChange) {
//       onStatusChange(order.id, newStatus);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <div className="flex justify-between items-start">
//           <CardTitle className="text-lg">
//             Order #{String(order.id).slice(0, 8)}
//           </CardTitle>
//           <Badge className={getStatusColor(order.status)}>
//             {getStatusText(order.status)}
//           </Badge>
//         </div>
//         <div className="flex items-center text-sm text-gray-500 mt-1">
//           <span className="mr-2">
//             {new Date(order.created_at).toLocaleString()}
//           </span>
//           {order.payment_status === "paid" && (
//             <Badge variant="secondary" className="bg-green-100 text-green-700">
//               Paid
//             </Badge>
//           )}
//           {order.payment_status === "unpaid" && (
//             <Badge variant="secondary" className="bg-red-100 text-red-700">
//               Unpaid
//             </Badge>
//           )}
//         </div>
//       </CardHeader>

//       {/* Show confirmation code at the very top if role === "customer" */}
//       {role === "customer" && order.confirmation_code && (
//         <CardDescription className="px-4 pt-2 pb-0">
//           <span className="font-medium">Confirmation Code:</span>{" "}
//           <span className="text-indigo-600">{order.confirmation_code}</span>
//         </CardDescription>
//       )}

//       <CardContent className="p-4 pt-2">
//         <div className="space-y-2">
//           <p className="text-sm font-medium">
//             Customer: {order.customer_name} ({order.customer_phone})
//           </p>
//           <p className="text-sm text-gray-600">
//             Address: {order.delivery_address}
//           </p>
//         </div>
//         <Separator className="my-4" />
//         <h4 className="font-medium text-sm mb-2">Items:</h4>
//         <ul className="text-sm space-y-1">
//           {order.items && order.items.length > 0 ? (
//             order.items.map((item) => (
//               <li key={item.id} className="flex justify-between">
//                 <span>
//                   {item.product_name} x {item.quantity}
//                 </span>
//                 <span>
//                   ₦{(item.price_at_purchase * item.quantity).toLocaleString()}
//                 </span>
//               </li>
//             ))
//           ) : (
//             <li>No items found.</li>
//           )}
//         </ul>
//         <Separator className="my-4" />
//         <div className="flex justify-between text-base font-bold">
//           <span>Total:</span>
//           <span>₦{(order.total_amount || 0).toLocaleString()}</span>
//         </div>
//       </CardContent>

//       {/* Depending on role (vendor/rider/admin), you may add footer actions. For a customer we simply show nothing more. */}
//       {role === "customer" ? null : (
//         <CardFooter className="p-4 pt-0">
//           {/* Example: vendor could change status, rider could claim, etc. */}
//           {role === "vendor" && onStatusChange && (
//             <Select
//               defaultValue={order.status}
//               onValueChange={(value: any) =>
//                 handleStatusSelect(value as OrderStatus)
//               }
//             >
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Change status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="received">Received</SelectItem>
//                 <SelectItem value="packing">Packing</SelectItem>
//                 <SelectItem value="picked_up">Picked Up</SelectItem>
//                 <SelectItem value="delivered">Delivered</SelectItem>
//                 <SelectItem value="cancelled">Cancelled</SelectItem>
//               </SelectContent>
//             </Select>
//           )}
//           {role === "rider" && onClaimOrder && (
//             <Button
//               onClick={() => onClaimOrder(order.id)}
//               disabled={order.rider_id !== null}
//             >
//               {order.rider_id ? "Assigned" : "Claim Order"}
//             </Button>
//           )}
//         </CardFooter>
//       )}
//     </Card>
//   );
// }
