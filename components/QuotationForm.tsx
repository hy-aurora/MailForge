"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/FileUpload";
import { Paperclip, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function QuotationForm() {
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    clientName: "",
    clientCompany: "",
    quotationNumber: "",
    amount: "",
    description: "",
    dueDate: "",
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [includeAttachment, setIncludeAttachment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileProcessed = (data: any, file?: File) => {
    // Update form with extracted data
    if (data && Object.keys(data).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
    }

    // Store the uploaded file and auto-check attachment option
    if (file) {
      setUploadedFile(file);
      setIncludeAttachment(true);
    } else {
      setUploadedFile(null);
      setIncludeAttachment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (includeAttachment && uploadedFile) {
        // Send email with attachment using FormData
        const formDataWithFile = new FormData();
        
        // Append form fields
        Object.entries(formData).forEach(([key, value]) => {
          formDataWithFile.append(key, value);
        });
        
        // Append file
        formDataWithFile.append("attachment", uploadedFile);

        const response = await fetch("/api/send-email-with-attachment", {
          method: "POST",
          body: formDataWithFile,
        });

        if (!response.ok) {
          throw new Error("Failed to send email with attachment");
        }

        toast.success("Quotation sent successfully with attachment!");
      } else {
        // Send email without attachment using JSON
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to send email");
        }

        toast.success("Quotation sent successfully!");
      }

      // Reset form
      setFormData({
        to: "",
        subject: "",
        clientName: "",
        clientCompany: "",
        quotationNumber: "",
        amount: "",
        description: "",
        dueDate: "",
      });
      setUploadedFile(null);
      setIncludeAttachment(false);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send quotation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <FileUpload onFileProcessed={handleFileProcessed} />

      {/* Attachment Option - Only show when file is uploaded */}
      {uploadedFile && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="include-attachment"
                checked={includeAttachment}
                onCheckedChange={(checked) => setIncludeAttachment(checked as boolean)}
              />
              <label
                htmlFor="include-attachment"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <span className="flex items-center space-x-2">
                  <Paperclip className="h-4 w-4" />
                  <span>Include uploaded file as attachment</span>
                </span>
              </label>
            </div>
            {includeAttachment && (
              <p className="text-sm text-blue-700 mt-2">
                📎 {uploadedFile.name} will be attached to the email
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quotation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="to" className="block text-sm font-medium mb-1">
                  Recipient Email *
                </label>
                <Input
                  id="to"
                  name="to"
                  type="email"
                  value={formData.to}
                  onChange={handleInputChange}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Quotation for Project"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium mb-1">
                  Client Name
                </label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="clientCompany" className="block text-sm font-medium mb-1">
                  Client Company
                </label>
                <Input
                  id="clientCompany"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleInputChange}
                  placeholder="ABC Corp"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="quotationNumber" className="block text-sm font-medium mb-1">
                  Quotation Number
                </label>
                <Input
                  id="quotationNumber"
                  name="quotationNumber"
                  value={formData.quotationNumber}
                  onChange={handleInputChange}
                  placeholder="Q-2024-001"
                />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <Input
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="$5,000"
                />
              </div>
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Project description and details..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {includeAttachment && uploadedFile
                    ? "Send Quotation with Attachment"
                    : "Send Quotation"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
