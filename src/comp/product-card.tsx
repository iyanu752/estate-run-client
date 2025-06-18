// // components/product-card.tsx
// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Plus } from "lucide-react"

// // Updated Product interface to match Supabase 'products' table and CustomerDashboard's definition
// // Price is now assumed to be Naira directly
// export interface Product {
//   id: number; // Supabase 'id' is bigint, so map to number in JS
//   name: string;
//   price: number; // Price is now Naira directly
//   image_url: string | null;
//   vendor_id: string;
//   vendor: string;
//   category: string;
//   description: string | null;
//   stock: number;
//   created_at: string;
// }

// interface ProductCardProps {
//   product: Product
//   onAddToCart: (product: Product) => void
// }

// export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
//   const imageUrl = product.image_url || "/placeholder.svg?height=192&width=384"

//   return (
//     <Card className="overflow-hidden">
//       <div className="relative h-48 w-full">
//         <Image
//           src={imageUrl}
//           alt={product.name}
//           fill
//           className="object-cover"
//         />
//       </div>
//       <CardContent className="p-4">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="font-medium text-base">{product.name}</h3>
//             <p className="text-sm text-gray-500">{product.vendor || "Unknown Vendor"}</p>
//           </div>
//           {/* Price is now displayed directly as Naira */}
//           <p className="font-bold">₦{product.price.toLocaleString()}</p>
//         </div>
//       </CardContent>
//       <CardFooter className="p-4 pt-0">
//         <Button onClick={() => onAddToCart(product)} className="w-full" variant="outline">
//           <Plus className="h-4 w-4 mr-2" /> Add to Cart
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }