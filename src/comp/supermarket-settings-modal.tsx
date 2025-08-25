/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Settings, Upload, Clock, Building, Camera } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/service/uploadService"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getSupermarket,
  updateSupermarket,
} from "@/service/supermarketService";

interface DaySchedule {
  open: string;
  close: string;
  closed: boolean;
}

interface AutoSchedule {
  enabled: boolean;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

interface SupermarketSettings {
  _id?: string;
  name?: string;
  address?: string;
  status?: string;
  openTime?: string;
  closeTime?: string;
  description?: string;
  ownerId?: string;
  image?: string;
  autoSchedule?: AutoSchedule;
  timezone?: string;
  holidayMode?: boolean;
  isOpen?: boolean; // Added missing property
}

interface SupermarketSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: SupermarketSettings) => void;
  settings: SupermarketSettings;
}

const timeSlots = [
  "12:00 AM",
  "12:30 AM",
  "1:00 AM",
  "1:30 AM",
  "2:00 AM",
  "2:30 AM",
  "3:00 AM",
  "3:30 AM",
  "4:00 AM",
  "4:30 AM",
  "5:00 AM",
  "5:30 AM",
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
];

// const timezones = [
//   "America/New_York",
//   "America/Chicago",
//   "America/Denver",
//   "America/Los_Angeles",
//   "America/Phoenix",
//   "America/Anchorage",
//   "Pacific/Honolulu",
// ]

const daysOfWeek = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultAutoSchedule: AutoSchedule = {
  enabled: false,
  monday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  tuesday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  wednesday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  thursday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  friday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  saturday: { open: "9:00 AM", close: "9:00 PM", closed: false },
  sunday: { open: "9:00 AM", close: "9:00 PM", closed: false },
};

export function SupermarketSettingsModal({
  isOpen,
  onClose,
  onSave,
  settings,
}: SupermarketSettingsModalProps) {
  const [formData, setFormData] = useState<SupermarketSettings>({
    ...settings,
    autoSchedule: settings.autoSchedule || defaultAutoSchedule,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "schedule" | "advanced"
  >("general");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...settings,
        autoSchedule: settings.autoSchedule || defaultAutoSchedule,
      });
    }
  }, [settings, isOpen]);

  const getSupermarketData = async () => {
    try {
      const res = await getSupermarket();
      let supermarketData = res;

      if (res?.data) {
        supermarketData = res.data;
      }

      if (Array.isArray(supermarketData) && supermarketData.length > 0) {
        supermarketData = supermarketData[0];
      }

      setFormData({
        ...supermarketData,
        autoSchedule: supermarketData.autoSchedule || defaultAutoSchedule,
      });
    } catch (error) {
      console.error("Error fetching supermarket data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getSupermarketData();
    }
  }, [isOpen]);

  const handleInputChange = (
    field: keyof typeof formData,
    value: boolean | string | number
  ) => {
    if (field === "holidayMode" && value === true) {
      setFormData((prev) => ({
        ...prev,
        holidayMode: true,
        isOpen: false,
      }));
      return;
    }

    if (field === "isOpen" && value === true) {
      setFormData((prev) => ({
        ...prev,
        isOpen: true,
        holidayMode: false,
      }));
      return;
    }

    // General case
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (formData.holidayMode && formData.isOpen) {
      setFormData((prev) => ({
        ...prev,
        isOpen: false,
      }));
    }
  }, [formData.holidayMode]);

  const handleScheduleChange = (
    day: keyof Omit<AutoSchedule, "enabled">,
    field: keyof DaySchedule,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      autoSchedule: {
        ...prev.autoSchedule!,
        [day]: {
          ...prev.autoSchedule![day],
          [field]: value,
        },
      },
    }));
  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setFile(selectedFile);
    }
  };

    const handleSelectImage = () => {
    fileInputRef.current?.click();
  };


  const handleImageUpload = async () => {
    if (!file) {
      toast.warning("Please select an image first");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      
      // Update form data with the uploaded image URL
      setFormData(prev => ({ ...prev, image: result.secure_url }));
      
      // Clear the file state since upload is complete
      setFile(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.description?.trim()) {
      toast.warning("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      if (!formData._id) {
        console.error("Supermarket ID is missing");
        return;
      }
      await updateSupermarket(formData._id, formData);
      toast.success("Settings saved successfully");
      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setIsLoading(false);
    }
  };

  const copyScheduleToAll = (
    sourceDay: keyof Omit<AutoSchedule, "enabled">
  ) => {
    const sourceSchedule = formData.autoSchedule![sourceDay];
    const updatedSchedule = { ...formData.autoSchedule! };

    daysOfWeek.forEach(({ key }) => {
      if (key !== sourceDay) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (updatedSchedule as any)[key] = { ...sourceSchedule };
      }
    });

    setFormData((prev) => ({
      ...prev,
      autoSchedule: updatedSchedule,
    }));
  };

  // Safe access to form data with defaults
  const supermarketName = formData?.name || "";
  const supermarketStatus = formData?.isOpen || "closed";
  const supermarketDescription = formData?.description || "";
  const supermarketAutoSchedule = formData?.autoSchedule || defaultAutoSchedule;
  const supermarketTimeZone = formData?.timezone || "America/New_York";
  const supermarketOpenTime = formData?.openTime || "9:00 AM";
  const supermarketCloseTime = formData?.closeTime || "9:00 PM";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Supermarket Settings
          </DialogTitle>
          <DialogDescription>
            Manage your supermarket profile, operating hours, and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "schedule"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Schedule
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("advanced")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "advanced"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Advanced
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Profile Picture
                    </CardTitle>
                    <CardDescription>
                      Update your supermarket's profile image
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={formData.image || "/placeholder.svg"}
                          alt={supermarketName}
                        />
                        <AvatarFallback className="text-lg">
                          {supermarketName.charAt(0).toUpperCase() || "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSelectImage}
                          disabled={isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Select Image
                        </Button>
                        
                        {file && (
                          <div className="flex items-center gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={handleImageUpload}
                              disabled={isUploading}
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploading ? "Uploading..." : "Upload Selected Image"}
                            </Button>
                            <span className="text-xs text-gray-600">{file.name}</span>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          Recommended: Square image, at least 200x200px
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported formats: JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Basic Information
                    </CardTitle>
                    <CardDescription>
                      Update your supermarket's basic details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Supermarket Name *</Label>
                      <Input
                        id="name"
                        value={supermarketName}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="e.g., Fresh Mart"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={supermarketDescription}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your supermarket and what makes it special..."
                        rows={3}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Current Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                    <CardDescription>
                      Manually control your store's availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <Label
                          htmlFor="isOpen"
                          className="text-base font-medium"
                        >
                          Store is Currently Open
                        </Label>
                        <p className="text-sm text-gray-500">
                          Override automatic schedule and manually control store
                          status
                        </p>
                      </div>
                      <Switch
                        id="isOpen"
                        checked={formData.isOpen || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("isOpen", checked)
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className="space-y-6">
                {" "}
                {!supermarketAutoSchedule.enabled && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Manual Business Hours
                      </CardTitle>
                      <CardDescription>
                        Set fixed open and close times for your store
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Opening Time</Label>
                        <Select
                          value={supermarketOpenTime}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              openTime: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Closing Time</Label>
                        <Select
                          value={supermarketCloseTime}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              closeTime: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Auto Schedule Toggle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Automatic Schedule
                    </CardTitle>
                    <CardDescription>
                      Enable automatic opening and closing based on your weekly
                      schedule
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <Label
                          htmlFor="autoSchedule"
                          className="text-base font-medium"
                        >
                          Enable Automatic Schedule
                        </Label>
                        <p className="text-sm text-gray-500">
                          Automatically open and close your store based on the
                          schedule below
                        </p>
                      </div>
                      <Switch
                        id="autoSchedule"
                        checked={supermarketAutoSchedule.enabled}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            autoSchedule: {
                              ...prev.autoSchedule!,
                              enabled: checked,
                            },
                          }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
                {/* Weekly Schedule */}
                {supermarketAutoSchedule.enabled && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Schedule</CardTitle>
                      <CardDescription>
                        Set your operating hours for each day of the week
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {daysOfWeek.map(({ key, label }) => {
                        const daySchedule =
                          supermarketAutoSchedule[
                            key as keyof Omit<AutoSchedule, "enabled">
                          ];
                        return (
                          <div key={key} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label className="text-base font-medium">
                                {label}
                              </Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    copyScheduleToAll(
                                      key as keyof Omit<AutoSchedule, "enabled">
                                    )
                                  }
                                >
                                  Copy to All
                                </Button>
                                <Switch
                                  checked={!daySchedule.closed}
                                  onCheckedChange={(checked) =>
                                    handleScheduleChange(
                                      key as keyof Omit<
                                        AutoSchedule,
                                        "enabled"
                                      >,
                                      "closed",
                                      !checked
                                    )
                                  }
                                />
                              </div>
                            </div>

                            {!daySchedule.closed && (
                              <div className="grid grid-cols-2 gap-4 ml-4">
                                <div className="space-y-2">
                                  <Label className="text-sm">
                                    Opening Time
                                  </Label>
                                  <Select
                                    value={daySchedule.open}
                                    onValueChange={(value) =>
                                      handleScheduleChange(
                                        key as keyof Omit<
                                          AutoSchedule,
                                          "enabled"
                                        >,
                                        "open",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm">
                                    Closing Time
                                  </Label>
                                  <Select
                                    value={daySchedule.close}
                                    onValueChange={(value) =>
                                      handleScheduleChange(
                                        key as keyof Omit<
                                          AutoSchedule,
                                          "enabled"
                                        >,
                                        "close",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timeSlots.map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}

                            {daySchedule.closed && (
                              <p className="text-sm text-gray-500 ml-4">
                                Closed all day
                              </p>
                            )}

                            {key !== "sunday" && <Separator />}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                {/* Timezone */}
                {/* <Card>
                  <CardHeader>
                    <CardTitle>Timezone Settings</CardTitle>
                    <CardDescription>Set your local timezone for accurate scheduling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select 
                        value={supermarketTimeZone} 
                        onValueChange={(value) => handleInputChange("timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map((tz) => (
                            <SelectItem key={tz} value={tz}>
                              {tz.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card> */}

                {/* Holiday Mode */}
                <Card>
                  <CardHeader>
                    <CardTitle>Holiday Mode</CardTitle>
                    <CardDescription>
                      Temporarily close your store for holidays or maintenance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <Label
                          htmlFor="holidayMode"
                          className="text-base font-medium"
                        >
                          Enable Holiday Mode
                        </Label>
                        <p className="text-sm text-gray-500">
                          Override all schedules and keep the store closed
                        </p>
                      </div>
                      <Switch
                        id="holidayMode"
                        checked={formData.holidayMode || false}
                        onCheckedChange={(checked) =>
                          handleInputChange("holidayMode", checked)
                        }
                      />
                    </div>
                    {formData.holidayMode && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Holiday Mode is active.</strong> Your store
                          will remain closed regardless of the schedule until
                          you disable this mode.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Current Schedule Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Settings Summary</CardTitle>
                    <CardDescription>
                      Overview of your current store configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Store Status:</span>
                        <span
                          className={`ml-2 ${
                            supermarketStatus
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formData.holidayMode
                            ? "Holiday Mode"
                            : supermarketStatus
                            ? "Open"
                            : "Closed"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Auto Schedule:</span>
                        <span
                          className={`ml-2 ${
                            supermarketAutoSchedule.enabled
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {supermarketAutoSchedule.enabled
                            ? "Enabled"
                            : "Disabled"}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Timezone:</span>
                        <span className="ml-2 text-gray-600">
                          {supermarketTimeZone.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Holiday Mode:</span>
                        <span
                          className={`ml-2 ${
                            formData.holidayMode
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
                          {formData.holidayMode ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
