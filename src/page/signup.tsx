"use client"

import type React from "react"

import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Link from "next/link"
import { Building, ShoppingCart, User, Truck, Eye, EyeOff, Upload } from "lucide-react"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signupUser } from "@/service/authService"

interface FormData {
  // Common fields
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  termsAccepted: boolean

  // User specific
  address?: string
  estate?: string

  // Vendor specific
  businessName?: string
  businessAddress?: string
  businessPhone?: string
  businessDescription?: string
  businessLicense?: string

  // Rider specific
  vehicleType?: string
  vehicleNumber?: string
  licenseNumber?: string
  emergencyContact?: string
  emergencyPhone?: string
}

export default function Signup() {
//   const router = useRouter()
  const [activeTab, setActiveTab] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    termsAccepted: false,
  })

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    const errors: string[] = []

    // Common validations
    if (!formData.firstName.trim()) errors.push("First name is required")
    if (!formData.lastName.trim()) errors.push("Last name is required")
    if (!formData.email.trim()) errors.push("Email is required")
    if (!formData.email.includes("@")) errors.push("Please enter a valid email")
    if (formData.password.length < 8) errors.push("Password must be at least 8 characters")
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match")
    if (!formData.phone.trim()) errors.push("Phone number is required")
    if (!formData.termsAccepted) errors.push("You must accept the terms and conditions")

    // User specific validations
    if (activeTab === "user") {
      if (!formData.address?.trim()) errors.push("Address is required")
    }

    // Vendor specific validations
    if (activeTab === "vendor") {
      if (!formData.businessName?.trim()) errors.push("Business name is required")
      if (!formData.businessAddress?.trim()) errors.push("Business address is required")
    //   if (!formData.businessDescription?.trim()) errors.push("Business description is required")
    }

    // Rider specific validations
    // if (activeTab === "rider") {
    //   if (!formData.vehicleType?.trim()) errors.push("Vehicle type is required")
    //   if (!formData.vehicleNumber?.trim()) errors.push("Vehicle number is required")
    //   if (!formData.licenseNumber?.trim()) errors.push("License number is required")
    //   if (!formData.emergencyContact?.trim()) errors.push("Emergency contact is required")
    //   if (!formData.emergencyPhone?.trim()) errors.push("Emergency phone is required")
    // }

    if (errors.length > 0) {
     toast.error(errors.join("\n"))
      return false
    }

    return true
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const response = await signupUser(firstName, lastName, email);

    if (response.success) {
      toast.success(response.message);
      navigate(`/login?type=${activeTab}&signup=success`);
    } else {
      toast.error(response.message);
    }

    console.log("Signup data sent:", { userType: activeTab, ...formData });
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("An error occurred during signup. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  const renderCommonFields = () => (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500">Must be at least 8 characters</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <a href="/">
              <h1 className="text-2xl font-bold tracking-tight">Estate Run</h1>
            </a>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Already have an account?</span>
              <a href="/login">
                <Button variant="outline">Login</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <Card className="border-black/10">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Join Estate Run</CardTitle>
              <CardDescription>Create your account and start using our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="user" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Resident</span>
                  </TabsTrigger>
                  <TabsTrigger value="vendor" className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="hidden sm:inline">Vendor</span>
                  </TabsTrigger>
                  <TabsTrigger value="rider" className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span className="hidden sm:inline">Rider</span>
                  </TabsTrigger>
                  <TabsTrigger value="admin" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleSubmit} className="mt-6">
                  <TabsContent value="user" className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Resident Registration</h3>
                      <p className="text-sm text-gray-600">Join as a resident to shop from local supermarkets</p>
                    </div>

                    {renderCommonFields()}

                    <div className="space-y-2">
                      <Label htmlFor="address">Home Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Estate Ave, Block A"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apartmentUnit">Apartment/Unit Number</Label>
                      <Input
                        id="apartmentUnit"
                        placeholder="Apt 101"
                        value={formData.estate || ""}
                        onChange={(e) => handleInputChange("estate", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="vendor" className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Vendor Registration</h3>
                      <p className="text-sm text-gray-600">Register your supermarket to start selling</p>
                    </div>

                    {renderCommonFields()}

                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Fresh Mart"
                        value={formData.businessName || ""}
                        onChange={(e) => handleInputChange("businessName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <Input
                        id="businessAddress"
                        placeholder="456 Estate Plaza, Ground Floor"
                        value={formData.businessAddress || ""}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        type="tel"
                        placeholder="+1 (555) 987-6543"
                        value={formData.businessPhone || ""}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description *</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Describe your supermarket and what you offer..."
                        value={formData.businessDescription || ""}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                        required
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="businessLicense">Business License Number</Label>
                      <Input
                        id="businessLicense"
                        placeholder="BL-2023-001"
                        value={formData.businessLicense || ""}
                        onChange={(e) => handleInputChange("businessLicense", e.target.value)}
                      />
                    </div> */}
{/* 
                    <div className="space-y-2">
                      <Label>Business Documents</Label>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="outline" size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload License
                        </Button>
                        <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</span>
                      </div>
                    </div> */}
                  </TabsContent>

                  <TabsContent value="rider" className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Rider Registration</h3>
                      <p className="text-sm text-gray-600">Join as a delivery rider to earn money</p>
                    </div>

                    {renderCommonFields()}
{/* 
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="vehicleType">Vehicle Type *</Label>
                        <Select
                          value={formData.vehicleType || ""}
                          onValueChange={(value) => handleInputChange("vehicleType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="motorcycle">Motorcycle</SelectItem>
                            <SelectItem value="bicycle">Bicycle</SelectItem>
                            <SelectItem value="car">Car</SelectItem>
                            <SelectItem value="scooter">Scooter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                        <Input
                          id="vehicleNumber"
                          placeholder="ABC-123"
                          value={formData.vehicleNumber || ""}
                          onChange={(e) => handleInputChange("vehicleNumber", e.target.value)}
                          required
                        />
                      </div>
                    </div> */}

                    {/* <div className="space-y-2">
                      <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="DL-123456789"
                        value={formData.licenseNumber || ""}
                        onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        required
                      />
                    </div> */}

                    {/* <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                        <Input
                          id="emergencyContact"
                          placeholder="John Doe"
                          value={formData.emergencyContact || ""}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                        <Input
                          id="emergencyPhone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.emergencyPhone || ""}
                          onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                          required
                        />
                      </div>
                    </div> */}
{/* 
                    <div className="space-y-2">
                      <Label>Required Documents</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Driver's License
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Vehicle Registration
                          </Button>
                        </div>
                        <span className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB each)</span>
                      </div>
                    </div> */}
                  </TabsContent>

                  <TabsContent value="admin" className="space-y-4">
                    {/* <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
                      <h3 className="text-lg font-semibold text-yellow-800">Admin Registration</h3>
                      <p className="text-sm text-yellow-700">
                        Admin accounts require approval. Please contact support for admin access.
                      </p>
                    </div> */}

                    {renderCommonFields()}
{/* 
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="customer-service">Customer Service</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="management">Management</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}

                    {/* <div className="space-y-2">
                      <Label htmlFor="adminCode">Admin Access Code</Label>
                      <Input id="adminCode" placeholder="Enter admin access code" type="password" />
                      <p className="text-xs text-gray-500">Contact support to obtain an admin access code</p>
                    </div> */}
                  </TabsContent>

                  {/* Terms and Conditions */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => handleInputChange("termsAccepted", checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the Terms of Service and Privacy Policy *
                        </label>
                        <p className="text-xs text-gray-500">
                          By creating an account, you agree to our{" "}
                          <a href="/terms" className="underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/privacy" className="underline">
                            Privacy Policy
                          </a>
                        </p>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading
                        ? "Creating Account..."
                        : `Create ${activeTab === "user" ? "Resident" : activeTab === "vendor" ? "Vendor" : activeTab === "rider" ? "Rider" : "Admin"} Account`}
                    </Button>
                  </div>
                </form>
              </Tabs>
            </CardContent>
          </Card>
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
