'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailDraftSchema, type EmailDraftData } from '@/lib/validations';
import toast from 'react-hot-toast';
import { Bot, Loader2, Copy, Check, Sparkles, ArrowRight, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AIDraftGeneratorProps {
  onDraftGenerated?: (subject: string, content: string) => void;
}

export default function AIDraftGenerator({ onDraftGenerated }: AIDraftGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{ subject: string; content: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const form = useForm<EmailDraftData>({
    resolver: zodResolver(EmailDraftSchema),
    defaultValues: {
      tone: 'professional',
      emailType: 'custom'
    }
  });

  const onSubmit = async (data: EmailDraftData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setGeneratedDraft({
          subject: result.subject,
          content: result.content
        });
        toast.success('Email draft generated successfully!');
      } else {
        toast.error(result.error || 'Failed to generate email draft');
      }
    } catch (error) {
      toast.error('An error occurred while generating the draft');
      console.error('Draft generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const useDraft = () => {
    if (generatedDraft && onDraftGenerated) {
      onDraftGenerated(generatedDraft.subject, generatedDraft.content);
      toast.success('Draft applied to email form!');
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Purpose */}
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Email Purpose</span>
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe what this email is for (e.g., 'Welcome new customer to our platform', 'Follow up on abandoned cart', etc.)"
                    rows={3}
                    {...field}
                    className="bg-muted/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Type */}
            <FormField
              control={form.control}
              name="emailType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select email type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="welcome">
                        <div className="flex items-center space-x-2">
                          <span>🎉</span>
                          <span>Welcome Email</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="notification">
                        <div className="flex items-center space-x-2">
                          <span>🔔</span>
                          <span>Notification</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="marketing">
                        <div className="flex items-center space-x-2">
                          <span>📢</span>
                          <span>Marketing</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="support">
                        <div className="flex items-center space-x-2">
                          <span>🛠️</span>
                          <span>Support</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="quotation">
                        <div className="flex items-center space-x-2">
                          <span>💰</span>
                          <span>Quotation</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="invoice">
                        <div className="flex items-center space-x-2">
                          <span>🧾</span>
                          <span>Invoice/Bill</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="custom">
                        <div className="flex items-center space-x-2">
                          <span>✨</span>
                          <span>Custom</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tone */}
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/50">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="professional">
                        <div className="flex items-center space-x-2">
                          <span>👔</span>
                          <span>Professional</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="friendly">
                        <div className="flex items-center space-x-2">
                          <span>😊</span>
                          <span>Friendly</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="casual">
                        <div className="flex items-center space-x-2">
                          <span>👋</span>
                          <span>Casual</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="formal">
                        <div className="flex items-center space-x-2">
                          <span>🎩</span>
                          <span>Formal</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recipient Name */}
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Recipient Name</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Customer's name"
                      {...field}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center space-x-2">
                    <Building className="h-4 w-4" />
                    <span>Company Name</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your company name"
                      {...field}
                      className="bg-muted/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Additional Context */}
          <FormField
            control={form.control}
            name="additionalContext"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Context</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any additional information or specific details to include"
                    rows={2}
                    {...field}
                    className="bg-muted/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Call to Action */}
          <FormField
            control={form.control}
            name="callToAction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Call to Action</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="What action should the recipient take?"
                    {...field}
                    className="bg-muted/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="min-w-[160px] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Draft
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {generatedDraft && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span>Generated Draft</span>
              <Badge variant="secondary">AI Generated</Badge>
            </CardTitle>
            <CardDescription>
              Your AI-generated email draft is ready. You can copy individual sections or use the entire draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subject */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Subject Line</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedDraft.subject, 'Subject')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'Subject' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-sm font-medium">{generatedDraft.subject}</p>
              </div>
            </div>

            <Separator />

            {/* Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Email Content</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(generatedDraft.content, 'Content')}
                  className="h-8 w-8 p-0"
                >
                  {copiedField === 'Content' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg border max-h-64 overflow-y-auto">
                <div className="text-sm prose prose-sm max-w-none dark:prose-invert" 
                     dangerouslySetInnerHTML={{ __html: generatedDraft.content }} />
              </div>
            </div>

            {onDraftGenerated && (
              <div className="flex justify-end pt-4">
                <Button onClick={useDraft} size="lg" className="min-w-[140px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Use This Draft
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
