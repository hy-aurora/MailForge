'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailFormSchema, type EmailFormData } from '@/lib/validations';
import toast from 'react-hot-toast';
import { Send, Loader2, User, AtSign, FileText, Reply } from 'lucide-react';
import { emailFromConfigs } from '@/lib/email-configs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface EmailFormProps {
  initialData?: Partial<EmailFormData>;
  onSent?: () => void;
}

export default function EmailForm({ initialData, onSent }: EmailFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(EmailFormSchema),
    defaultValues: {
      fromConfig: 'contact',
      ...initialData
    }
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Email sent successfully!');
        form.reset();
        onSent?.();
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('An error occurred while sending the email');
      console.error('Email send error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* To Email */}
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <AtSign className="h-4 w-4" />
                  <span>To Email Address</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="recipient@example.com"
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
                <FormLabel className="flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>From Email</span>
                </FormLabel>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* From Name */}
          <FormField
            control={form.control}
            name="fromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>From Name</span>
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
        </div>

        {/* Reply To */}
        <FormField
          control={form.control}
          name="replyTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center space-x-2">
                <Reply className="h-4 w-4" />
                <span>Reply To (Optional)</span>
              </FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="reply@mailForge.com"
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

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            HTML formatting is supported in the email content
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
