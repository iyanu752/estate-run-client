import { Building, ShoppingCart, User, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// import Navbar from "@/comp/navbar";
// import Footer from "@/comp/footer";
export default function Home() {
  return (
 <div className="min-h-screen bg-white">
      {/* <Navbar/> */}
      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">Welcome to Estate Run</h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            A minimalistic platform connecting residents with local supermarkets and vendors within your estate.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/login">
              <Button size="lg">Get Started</Button>
            </a>
            <a href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-3">
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                For Residents
              </CardTitle>
              <CardDescription>Access local supermarkets and shop with ease</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Browse supermarkets in your estate, check their operating hours, and shop for items without leaving your
                home.
              </p>
            </CardContent>
            <CardFooter>
              <a href="/login?type=user" className="w-full">
                <Button className="w-full" variant="outline">
                  Login as Resident
                </Button>
              </a>
            </CardFooter>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                For Vendors
              </CardTitle>
              <CardDescription>Manage your supermarket and inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Update your store hours, manage inventory, and connect with residents in the estate.
              </p>
            </CardContent>
            <CardFooter>
              <a href="/login?type=seller" className="w-full">
                <Button className="w-full" variant="outline">
                  Login as Vendor
                </Button>
              </a>
            </CardFooter>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                For Riders
              </CardTitle>
              <CardDescription>Deliver orders and manage your routes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Accept delivery requests, manage your routes, and track your earnings as a delivery rider.
              </p>
            </CardContent>
            <CardFooter>
              <a href="/login?type=rider" className="w-full">
                <Button className="w-full" variant="outline">
                  Login as Rider
                </Button>
              </a>
            </CardFooter>
          </Card>

          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                For Admins
              </CardTitle>
              <CardDescription>Oversee the entire platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Manage users, vendors, and ensure the smooth operation of the Estate Run platform.
              </p>
            </CardContent>
            <CardFooter>
              <a href="/login?type=admin" className="w-full">
                <Button className="w-full" variant="outline">
                  Login as Admin
                </Button>
              </a>
            </CardFooter>
          </Card>
        </section>
      </main>
      {/* <Footer/> */}
    </div>
  );
}
