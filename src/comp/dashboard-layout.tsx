// "use client"

// import type React from "react"

// import { useState } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// import { Menu, User, ShoppingBag, Store, Bike, BarChart3, LogOut, Bell } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"

// type Role = "customer" | "vendor" | "rider" | "admin"

// interface NavItem {
//   title: string
//   href: string
//   icon: React.ElementType
// }

// const roleNavItems: Record<Role, NavItem[]> = {
//   customer: [
//     { title: "Browse", href: "/dashboard/customer", icon: ShoppingBag },
//     { title: "My Orders", href: "/dashboard/customer/orders", icon: BarChart3 },
//     { title: "Profile", href: "/dashboard/customer/profile", icon: User },
//   ],
//   vendor: [
//     { title: "Products", href: "/dashboard/vendor", icon: Store },
//     { title: "Orders", href: "/dashboard/vendor/orders", icon: ShoppingBag },
//     { title: "Analytics", href: "/dashboard/vendor/analytics", icon: BarChart3 },
//     { title: "Profile", href: "/dashboard/vendor/profile", icon: User },
//   ],
//   rider: [
//     { title: "Available Orders", href: "/dashboard/rider", icon: ShoppingBag },
//     { title: "My Deliveries", href: "/dashboard/rider/deliveries", icon: Bike },
//     { title: "History", href: "/dashboard/rider/history", icon: BarChart3 },
//     { title: "Profile", href: "/dashboard/rider/profile", icon: User },
//   ],
//   admin: [
//     { title: "Overview", href: "/dashboard/admin", icon: BarChart3 },
//     { title: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBag },
//     { title: "Vendors", href: "/dashboard/admin/vendors", icon: Store },
//     { title: "Riders", href: "/dashboard/admin/riders", icon: Bike },
//     { title: "Customers", href: "/dashboard/admin/customers", icon: User },
//     { title: "Settings", href: "/dashboard/admin/settings", icon: User },
//   ],
// }

// const getRoleFromPath = (path: string): Role => {
//   if (path.includes("/dashboard/customer")) return "customer"
//   if (path.includes("/dashboard/vendor")) return "vendor"
//   if (path.includes("/dashboard/rider")) return "rider"
//   if (path.includes("/dashboard/admin")) return "admin"
//   return "customer" // Default
// }

// const getRoleName = (role: Role): string => {
//   return role.charAt(0).toUpperCase() + role.slice(1)
// }

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname()
//   const role = getRoleFromPath(pathname)
//   const [open, setOpen] = useState(false)

//   const navItems = roleNavItems[role]

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       <header className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 h-16 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <Sheet open={open} onOpenChange={setOpen}>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="md:hidden">
//                   <Menu className="h-5 w-5" />
//                   <span className="sr-only">Toggle menu</span>
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-64 p-0">
//                 <div className="h-16 flex items-center px-4 border-b">
//                   <Link href="/" className="font-bold text-lg">
//                     EstateRun
//                   </Link>
//                 </div>
//                 <nav className="flex flex-col gap-1 p-2">
//                   {navItems.map((item) => (
//                     <Link
//                       key={item.href}
//                       href={item.href}
//                       onClick={() => setOpen(false)}
//                       className={`flex items-center gap-3 px-3 py-2 rounded-md ${
//                         pathname === item.href
//                           ? "bg-gray-100 text-gray-900"
//                           : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                       }`}
//                     >
//                       <item.icon className="h-5 w-5" />
//                       {item.title}
//                     </Link>
//                   ))}
//                   <Link
//                     href="/"
//                     className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-50 mt-4"
//                   >
//                     <LogOut className="h-5 w-5" />
//                     Logout
//                   </Link>
//                 </nav>
//               </SheetContent>
//             </Sheet>
//             <Link href="/" className="font-bold text-lg hidden md:block">
//               EstateRun
//             </Link>
//             <Badge variant="outline" className="ml-2">
//               {getRoleName(role)}
//             </Badge>
//           </div>

//           <nav className="hidden md:flex items-center gap-1">
//             {navItems.map((item) => (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
//                   pathname === item.href
//                     ? "bg-gray-100 text-gray-900"
//                     : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
//                 }`}
//               >
//                 <item.icon className="h-4 w-4" />
//                 {item.title}
//               </Link>
//             ))}
//           </nav>

//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" className="relative">
//               <Bell className="h-5 w-5" />
//               <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
//             </Button>
//             <Avatar>
//               <AvatarImage src="/placeholder-user.jpg" alt="User" />
//               <AvatarFallback>{getRoleName(role).charAt(0)}</AvatarFallback>
//             </Avatar>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

//       <footer className="bg-white border-t py-4 mt-auto">
//         <div className="container mx-auto px-4 text-center text-sm text-gray-500">
//           © 2024 EstateRun. All rights reserved.
//         </div>
//       </footer>
//     </div>
//   )
// }
