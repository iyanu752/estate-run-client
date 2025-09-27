import { useState } from "react";
import { toast } from "sonner";
import { createVerifyCode } from "@/service/codesService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Check,
  Clock,
  Copy,
  MessageSquare,
  QrCode,
  User,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VisitorFormData {
  visitorName: string;
  visitorPhone: number;
  purposeOfVisit: string;
  date: string;
  from: string;
  to: string;
  specialInstructions: string;
}

interface VisitorCode extends VisitorFormData {
  id: string;
  userId: string;
  verificationCode: number;
  codeStatus: string;
  createdAt: string;
}

interface VisitorCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (code: VisitorCode) => void;
}

export default function VisitorCodeGenerator({
  isOpen,
  onClose,
  onGenerate,
}: VisitorCodeGeneratorProps) {
  const [formData, setFormData] = useState<VisitorFormData>({
    visitorName: "",
    visitorPhone: 0,
    purposeOfVisit: "",
    date: "",
    from: "",
    to: "",
    specialInstructions: "",
  });

  const [generatedCode, setGeneratedCode] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerateCode = async () => {
    if (
      !formData.visitorName.trim() ||
      !formData.date ||
      !formData.from ||
      !formData.to ||
      !formData.visitorPhone ||
      !formData.purposeOfVisit
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        toast.error("User is not logged in");
        return;
    }

    const response = await createVerifyCode({ ...formData, userId });
    if (response) {
        const generated: VisitorCode = response;
        setGeneratedCode(generated.verificationCode);
        onGenerate(generated);
        toast.success("Verification code generated!");
    } else {
        toast.error("No data returned from server");
    }
    } catch (error) {
    console.error("Error generating verification code", error);
    toast.error("Failed to generate code");
    } finally {
    setIsLoading(false);
    }


  };

  const copyToClipboard = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode.toString());
        setCopied(true);
        toast.success("Copied code to clipboard");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error("error in generating code", error);
      }
    }
  };

  const handleClose = () => {
    setFormData({ 
      visitorName: "",
      visitorPhone: 0,
      purposeOfVisit: "",
      date: "",
      from: "",
      to: "",
      specialInstructions: "",
    });
    setGeneratedCode(null);
    setCopied(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Generate Visitor Code
            </DialogTitle>
            <DialogDescription>
              Create a secure access code for your visitor
            </DialogDescription>
          </DialogHeader>

          {!generatedCode ? (
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="visitorName">Visitor Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="visitorName"
                    value={formData.visitorName}
                    onChange={(e) =>
                      handleInputChange("visitorName", e.target.value)
                    }
                    className="pl-10"
                    placeholder="Enter visitor's full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitorPhone">Visitor Phone</Label>
                <Input
                  id="visitorPhone"
                  type="tel"
                  value={formData.visitorPhone}
                  onChange={(e) =>
                    handleInputChange("visitorPhone", e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Visit *</Label>
                <Select
                  value={formData.purposeOfVisit}
                  onValueChange={(value) =>
                    handleInputChange("purposeOfVisit", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family_visit">Family Visit</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="business">Business Meeting</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="validDate">Date *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from">From *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="validFromTime"
                      type="time"
                      value={formData.from}
                      onChange={(e) =>
                        handleInputChange("from", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntilTime">Until *</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="to"
                      type="time"
                      value={formData.to}
                      onChange={(e) => handleInputChange("to", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialInstructions">
                  Special Instructions
                </Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) =>
                      handleInputChange("specialInstructions", e.target.value)
                    }
                    className="pl-10"
                    placeholder="Any special instructions for security..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleGenerateCode}
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate Code"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-4">
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="mb-4">
                    <QrCode className="mx-auto h-16 w-16 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Visitor Code Generated!
                  </h3>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-2xl font-mono font-bold text-green-800">
                      {generatedCode}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 bg-transparent"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Visitor:</strong> {formData.visitorName}
                </p>
                <p>
                  <strong>Purpose:</strong>{" "}
                  {formData.purposeOfVisit
                    .replace("_", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <p>
                  <strong>Valid:</strong> {formData.date} from {formData.from}{" "}
                  to {formData.to}
                </p>
              </div>

              <DialogFooter>
                <Button onClick={handleClose} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
