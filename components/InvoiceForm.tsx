'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceEmailSchema, type InvoiceEmailData } from '@/lib/validations';
import toast from 'react-hot-toast';
import { Receipt, Loader2, CreditCard, Building, User, AtSign, Calendar, DollarSign, FileText, Send } from 'lucide-react';
import { emailFromConfigs } from '@/lib/email-configs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function InvoiceForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceEmailData>({
    resolver: zodResolver(InvoiceEmailSchema) as any,
    defaultValues: {
      fromConfig: 'contact',
      taxRate: '0%',
      taxAmount: '$0.00',
      lateFeeInfo: '2% per month on overdue amounts',
      paymentTerms: 'Net 30 days',
      paymentMethods: 'Bank transfer, Credit card, PayPal',
      servicesTable: `<table style="width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background-color: #f3f4f6;">
      <th style="padding: 12px; text-align: left; border: 1px solid #e5e7eb;">Description</th>
      <th style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">Qty</th>
      <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Rate</th>
      <th style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">Amount</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">Web Development Services</td>
      <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">1</td>
      <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">$5,000</td>
      <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">$5,000</td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #e5e7eb;">UI/UX Design</td>
      <td style="padding: 12px; text-align: center; border: 1px solid #e5e7eb;">1</td>
      <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">$2,000</td>
      <td style="padding: 12px; text-align: right; border: 1px solid #e5e7eb;">$2,000</td>
    </tr>
  </tbody>
</table>`
    }
  });

  const onSubmit = async (data: InvoiceEmailData) => {
    setIsLoading(true);
    try {
      // Process the invoice template with the form data
      const templateData = {
        CLIENT_NAME: data.clientName,
        CLIENT_ADDRESS: data.clientAddress,
        CLIENT_CITY_STATE_ZIP: data.clientCityStateZip,
        CLIENT_EMAIL: data.to,
        INVOICE_NUMBER: data.invoiceNumber,
        INVOICE_DATE: data.invoiceDate,
        DUE_DATE: data.dueDate,
        SERVICES_TABLE: data.servicesTable,
        SUBTOTAL: data.subtotal,
        TAX_RATE: data.taxRate,
        TAX_AMOUNT: data.taxAmount,
        TOTAL_AMOUNT: data.totalAmount,
        PAYMENT_TERMS: data.paymentTerms,
        LATE_FEE_INFO: data.lateFeeInfo,
        PAYMENT_METHODS: data.paymentMethods,
        PAYMENT_LINK: '#',
        DOWNLOAD_INVOICE_LINK: '#'
      };

      // Get the invoice template
      const { allTemplates, processTemplate } = await import('@/lib/MailForge-templates');
      const template = allTemplates.invoice_send;
      const processedContent = processTemplate(template.template, templateData);

      // Send the email
      const emailData = {
        to: data.to,
        subject: `Invoice #${data.invoiceNumber} - MailForge`,
        content: processedContent,
        fromName: data.fromName,
        fromConfig: data.fromConfig
      };

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Invoice sent successfully!');
        form.reset();
      } else {
        toast.error(result.error || 'Failed to send invoice');
      }
    } catch (error) {
      toast.error('An error occurred while sending the invoice');
      console.error('Invoice send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Client Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <AtSign className="h-4 w-4" />
                        <span>Client Email</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="client@example.com"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Client Name</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ABC Company Inc."
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123 Business St, Suite 100"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientCityStateZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City, State, ZIP</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="New York, NY 10001"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="h-5 w-5" />
                <span>Invoice Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="INV-2025-001"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Invoice Date</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="servicesTable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Table (HTML)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="HTML table with services and pricing..."
                        rows={8}
                        {...field}
                        className="bg-muted/50 font-mono text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Financial Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subtotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtotal</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$7,000.00"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$7,577.50"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="8.25%"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Amount</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="$577.50"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="paymentTerms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Terms</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Net 30 days"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Methods</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bank transfer, Credit card, PayPal"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lateFeeInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Late Fee Information</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="2% per month on overdue amounts"
                        {...field}
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Email Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fromConfig"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Email</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/50">
                            <SelectValue placeholder="Select sender email" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {emailFromConfigs.map((config) => (
                            <SelectItem key={config.id} value={config.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{config.name}</span>
                                <span className="text-xs text-muted-foreground">{config.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fromName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name or Company"
                          {...field}
                          className="bg-muted/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="min-w-[160px] bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Receipt className="mr-2 h-4 w-4" />
                  Send Invoice
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
   