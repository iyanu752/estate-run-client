"use client"

import type React from "react"

import { useState } from "react"
import { Building, ShoppingCart, User, Truck, Eye, EyeOff} from "lucide-react"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { signupUser } from "@/service/authService"

interface FormData {
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

  // Rider specific
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
  phone?: string
  termsAccepted?: string
  address?: string
  businessName?: string
  businessAddress?: string
  businessPhone?: string
}

export default function Signup() {
  const [activeTab, setActiveTab] = useState("user")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
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
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field)
  }

  const validateField = (field: string) => {
    const newErrors: FormErrors = {}

    switch (field) {
      case 'firstName':
        if (!formData.firstName.trim()) {
          newErrors.firstName = "First name is required"
        } else if (formData.firstName.trim().length < 2) {
          newErrors.firstName = "First name must be at least 2 characters"
        }
        break
      
      case 'lastName':
        if (!formData.lastName.trim()) {
          newErrors.lastName = "Last name is required"
        } else if (formData.lastName.trim().length < 2) {
          newErrors.lastName = "Last name must be at least 2 characters"
        }
        break
      
      case 'email':
        if (!formData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "Please enter a valid email address"
        }
        break
      
      case 'password':
        if (!formData.password) {
          newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
          newErrors.password = "Password must be at least 8 characters"
        }
        //  else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        //   newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        // }
        break
      
      case 'confirmPassword':
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match"
        }
        break
      
      case 'phone':
        if (!formData.phone.trim()) {
          newErrors.phone = "Phone number is required"
        } else if (!/^\d{11}$/.test(formData.phone.trim())) {
          newErrors.phone = "Phone number must be exactly 11 digits"
        }
        break
      
      case 'address':
        if (activeTab === "user" && !formData.address?.trim()) {
          newErrors.address = "Address is required"
        }
        break
      
      case 'businessName':
        if (activeTab === "vendor" && !formData.businessName?.trim()) {
          newErrors.businessName = "Business name is required"
        }
        break
      
      case 'businessAddress':
        if (activeTab === "vendor" && !formData.businessAddress?.trim()) {
          newErrors.businessAddress = "Business address is required"
        }
        break
      
      case 'businessPhone':
        if (activeTab === "vendor" && formData.businessPhone && !/^\d{11}$/.test(formData.businessPhone)) {
          newErrors.businessPhone = "Business phone number must be exactly 11 digits"
        }
        break
      
      case 'termsAccepted':
        if (!formData.termsAccepted) {
          newErrors.termsAccepted = "You must accept the terms and conditions"
        }
        break
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const fields = [
      'firstName', 'lastName', 'email', 'password', 'confirmPassword', 'phone', 'termsAccepted'
    ]

    // Add tab-specific fields
    if (activeTab === "user") {
      fields.push('address')
    } else if (activeTab === "vendor") {
      fields.push('businessName', 'businessAddress', 'businessPhone')
    }

    let isValid = true
    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false
      }
    })

    // Mark all fields as touched to show errors
    const touchedFields: Record<string, boolean> = {}
    fields.forEach(field => {
      touchedFields[field] = true
    })
    setTouched(touchedFields)

    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signupUser(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.address || "", 
        parseInt(formData.phone) || 0, 
        activeTab, 
        formData.estate || "", 
        formData.businessAddress, 
        formData.businessDescription,
        formData.businessPhone ? parseInt(formData.businessPhone) : undefined,
        formData.businessName
      );

      if (response.success) {
        toast.success(response.message);
        navigate(`/login?type=${activeTab}&signup=success`);
      } else {
        toast.error(response.message);
      }

      console.log("Signup data sent:", { 
        userType: activeTab, 
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        estate: formData.estate,
        ...(activeTab === "vendor" && {
          businessName: formData.businessName,
          businessAddress: formData.businessAddress,
          businessPhone: formData.businessPhone,
          businessDescription: formData.businessDescription
        })
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] && errors[field] ? errors[field] : undefined
  }

  const renderCommonFields = () => (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            onBlur={() => handleBlur("firstName")}
            className={getFieldError("firstName") ? "border-red-500 focus:border-red-500" : ""}
            required
          />
          {getFieldError("firstName") && (
            <p className="text-sm text-red-600">{getFieldError("firstName")}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            onBlur={() => handleBlur("lastName")}
            className={getFieldError("lastName") ? "border-red-500 focus:border-red-500" : ""}
            required
          />
          {getFieldError("lastName") && (
            <p className="text-sm text-red-600">{getFieldError("lastName")}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          className={getFieldError("email") ? "border-red-500 focus:border-red-500" : ""}
          required
        />
        {getFieldError("email") && (
          <p className="text-sm text-red-600">{getFieldError("email")}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="text"
          placeholder="08123456789"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
          className={getFieldError("phone") ? "border-red-500 focus:border-red-500" : ""}
          required
        />
        {getFieldError("phone") && (
          <p className="text-sm text-red-600">{getFieldError("phone")}</p>
        )}
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
              onBlur={() => handleBlur("password")}
              className={getFieldError("password") ? "border-red-500 focus:border-red-500" : ""}
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
          {getFieldError("password") ? (
            <p className="text-sm text-red-600">{getFieldError("password")}</p>
          ) : (
            <p className="text-xs text-gray-500">Must be at least 8 characters with uppercase, lowercase, and number</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              className={getFieldError("confirmPassword") ? "border-red-500 focus:border-red-500" : ""}
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
          {getFieldError("confirmPassword") && (
            <p className="text-sm text-red-600">{getFieldError("confirmPassword")}</p>
          )}
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
                        onBlur={() => handleBlur("address")}
                        className={getFieldError("address") ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {getFieldError("address") && (
                        <p className="text-sm text-red-600">{getFieldError("address")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apartmentUnit">Estate</Label>
                      <Input
                        id="apartmentUnit"
                        placeholder="Opic, Isheri North Gra"
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
                        onBlur={() => handleBlur("businessName")}
                        className={getFieldError("businessName") ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {getFieldError("businessName") && (
                        <p className="text-sm text-red-600">{getFieldError("businessName")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessAddress">Business Address *</Label>
                      <Input
                        id="businessAddress"
                        placeholder="456 Estate Plaza, Ground Floor"
                        value={formData.businessAddress || ""}
                        onChange={(e) => handleInputChange("businessAddress", e.target.value)}
                        onBlur={() => handleBlur("businessAddress")}
                        className={getFieldError("businessAddress") ? "border-red-500 focus:border-red-500" : ""}
                        required
                      />
                      {getFieldError("businessAddress") && (
                        <p className="text-sm text-red-600">{getFieldError("businessAddress")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessPhone">Business Phone</Label>
                      <Input
                        id="businessPhone"
                        type="text"
                        placeholder="08102335634"
                        value={formData.businessPhone || ""}
                        onChange={(e) => handleInputChange("businessPhone", e.target.value)}
                        onBlur={() => handleBlur("businessPhone")}
                        className={getFieldError("businessPhone") ? "border-red-500 focus:border-red-500" : ""}
                      />
                      {getFieldError("businessPhone") && (
                        <p className="text-sm text-red-600">{getFieldError("businessPhone")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="businessDescription">Business Description</Label>
                      <Textarea
                        id="businessDescription"
                        placeholder="Describe your supermarket and what you offer..."
                        value={formData.businessDescription || ""}
                        onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="rider" className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Rider Registration</h3>
                      <p className="text-sm text-gray-600">Join as a delivery rider to earn money</p>
                    </div>

                    {renderCommonFields()}
                  </TabsContent>

                  <TabsContent value="admin" className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">Admin Registration</h3>
                      <p className="text-sm text-gray-600">Create an admin account</p>
                    </div>

                    {renderCommonFields()}
                  </TabsContent>

                  {/* Terms and Conditions */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => {
                          handleInputChange("termsAccepted", checked as boolean)
                          if (checked) {
                            setErrors(prev => ({ ...prev, termsAccepted: undefined }))
                          }
                        }}
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
                        {getFieldError("termsAccepted") && (
                          <p className="text-sm text-red-600">{getFieldError("termsAccepted")}</p>
                        )}
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