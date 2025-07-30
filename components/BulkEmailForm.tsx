'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BulkEmailSchema, type BulkEmailData } from '@/lib/validations';
import toast from 'react-hot-toast';
import { Users, Loader2, Plus, X, AtSign, FileText, User, AlertTriangle, Upload } from 'lucide-react';
import { emailFromConfigs } from '@/lib/email-configs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BulkEmailFormProps {
  initialData?: Partial<BulkEmailData>;
}

export default function BulkEmailForm({ initialData }: BulkEmailFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailInputs, setEmailInputs] = useState<string[]>(['']);

  const form = useForm<BulkEmailData>({
    resolver: zodResolver(BulkEmailSchema),
    defaultValues: {
      fromConfig: 'contact',
      ...initialData,
      emails: ['']
    }
  });

  const addEmailInput = () => {
    const newInputs = [...emailInputs, ''];
    setEmailInputs(newInputs);
    form.setValue('emails', newInputs);
  };

  const removeEmailInput = (index: number) => {
    if (emailInputs.length > 1) {
      const newInputs = emailInputs.filter((_, i) => i !== index);
      setEmailInputs(newInputs);
      form.setValue('emails', newInputs);
    }
  };

  const updateEmail = (index: number, value: string) => {
    const newInputs = [...emailInputs];
    newInputs[index] = value;
    setEmailInputs(newInputs);
    form.setValue('emails', newInputs.filter(email => email.trim() !== ''));
  };

  const handleBulkEmailPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    const emails = pastedText
      .split(/[,\n\r\t;]+/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'));
    
    if (emails.length > 0) {
      setEmailInputs(emails);
      form.setValue('emails', emails);
      toast.success(`${emails.length} emails added!`);
    }
  };

  const onSubmit = async (data: BulkEmailData) => {
    const validEmails = data.emails.filter(email => email.trim() !== '');
    
    if (validEmails.length === 0) {
      toast.error('Please add at least one valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/send-bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          emails: validEmails
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Bulk emails sent successfully!');
        if (result.errors && result.errors.length > 0) {
          console.warn('Some emails failed:', result.errors);
          toast.error(`${result.errors.length} emails failed to send. Check console for details.`);
        }
        form.reset();
        setEmailInputs(['']);
      } else {
        toast.error(result.error || 'Failed to send bulk emails');
      }
    } catch (error) {
      toast.error('An error occurred while sending bulk emails');
      console.error('Bulk email send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validEmailCount = emailInputs.filter(e => e.trim()).length;

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Recipients Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AtSign className="h-5 w-5" />
                <span>Email Recipients</span>
                {validEmailCount > 0 && (
                  <Badge variant="secondary">{validEmailCount} recipients</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Add individual email addresses or paste a list of emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Individual Email Inputs */}
              <div className="space-y-3">
                {emailInputs.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="recipient@example.com"
                      className="bg-muted/50"
                    />
                    {emailInputs.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEmailInput(index)}
                        className="h-10 w-10 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addEmailInput}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Email
              </Button>

              <Separator />

              {/* Bulk Email Paste */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Bulk Email Import</span>
                </Label>
                <Textarea
                  onPaste={handleBulkEmailPaste}
                  rows={4}
                  placeholder="Paste emails here separated by commas, semicolons, or new lines..."
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Copy emails from Excel, CSV, or any text format and paste them here
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Email Configuration */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Subject</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Email subject"
                      {...field}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* From Config */}
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
          </div>

          {/* From Name */}
          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>From Name (Optional)</span>
                </FormLabel>
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

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Email Content</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your email content here (HTML supported)..."
                    rows={12}
                    {...field}
                    className="bg-muted/50 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Warning Card */}
          <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-yellow-900 dark:text-yellow-100 text-base">
                <AlertTriangle className="h-4 w-4" />
                <span>Bulk Email Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-yellow-800 dark:text-yellow-200 space-y-2">
                <p>
                  • Bulk emails will be sent in batches to respect rate limits
                </p>
                <p>
                  • Large lists may take some time to process completely
                </p>
                <p>
                  • Make sure all email addresses are valid to avoid bounces
                </p>
                <p>
                  • Consider personalizing content for better engagement
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {validEmailCount > 0 ? (
                <span className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Ready to send to {validEmailCount} recipient{validEmailCount !== 1 ? 's' : ''}</span>
                </span>
              ) : (
                'Add recipients to send bulk email'
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading || validEmailCount === 0}
              size="lg"
              className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Send to {validEmailCount} Recipients
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
