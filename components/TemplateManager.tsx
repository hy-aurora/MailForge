'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, Copy, Check, ArrowRight, Loader2, Settings, Grid } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
}

interface TemplateManagerProps {
  onTemplateSelect?: (content: string) => void;
}

export default function TemplateManager({ onTemplateSelect }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateContent, setTemplateContent] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, string>>({
    RECIPIENT_NAME: 'John Doe',
    
    CTA_LINK: 'https://mailForge.com',
    CTA_TEXT: 'Get Started',
    NOTIFICATION_CONTENT: 'Your account has been updated.',
    OFFER_TITLE: 'Special Discount',
    OFFER_DESCRIPTION: '50% off your next purchase',
    SUPPORT_RESPONSE: 'We have resolved your issue.',
    PROJECT_UPDATE_CONTENT: 'We have completed the initial design phase and are now moving into development.',
    NEXT_STEPS: 'Next week we will begin the frontend development and setup the database.',
    // Quotation variables
    QUOTATION_NUMBER: 'QUO-2025-001',
    QUOTATION_DATE: '2025-01-28',
    VALID_UNTIL: '2025-02-28',
    PROJECT_DESCRIPTION: 'Custom website development with modern design and functionality',
    SERVICES_TABLE: '<table style="width: 100%; border-collapse: collapse;"><tr><td>Web Development</td><td>$5,000</td></tr></table>',
    TOTAL_AMOUNT: '$7,000',
    PAYMENT_TERMS: '50% upfront, 50% on completion',
    SUPPORT_PERIOD: '30 days',
    ACCEPT_QUOTATION_LINK: 'https://mailForge.com/accept',
    DISCUSS_QUOTATION_LINK: 'https://mailForge.com/discuss',
    // Invoice variables
    CLIENT_NAME: 'ABC Company Inc.',
    CLIENT_ADDRESS: '123 Business St, Suite 100',
    CLIENT_CITY_STATE_ZIP: 'New York, NY 10001',
    CLIENT_EMAIL: 'billing@abccompany.com',
    INVOICE_NUMBER: 'INV-2025-001',
    INVOICE_DATE: '2025-01-28',
    DUE_DATE: '2025-02-28',
    SUBTOTAL: '$7,000.00',
    TAX_RATE: '8.25%',
    TAX_AMOUNT: '$577.50',
    LATE_FEE_INFO: '2% per month on overdue amounts',
    PAYMENT_METHODS: 'Bank transfer, Credit card, PayPal',
    PAYMENT_LINK: 'https://mailForge.com/pay',
    DOWNLOAD_INVOICE_LINK: 'https://mailForge.com/download-invoice'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      if (response.ok) {
        const result = await response.json();
        setTemplates(result.templates || []);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    }
  };

  const processTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template first');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          variables
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setTemplateContent(result.content);
        toast.success('Template processed successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to process template');
      }
    } catch (error) {
      console.error('Error processing template:', error);
      toast.error('An error occurred while processing the template');
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

  const useTemplate = () => {
    if (templateContent && onTemplateSelect) {
      onTemplateSelect(templateContent);
      toast.success('Template applied to email form!');
    }
  };

  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const selectedTemplateInfo = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Select Template</span>
            {templates.length > 0 && (
              <Badge variant="secondary">{templates.length} available</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Choose from pre-built email templates for common use cases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="template-select">Email Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{template.name}</span>
                      <span className="text-xs text-muted-foreground">{template.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedTemplateInfo && (
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-semibold">{selectedTemplateInfo.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplateInfo.description}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Variables */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Template Variables</span>
            </CardTitle>
            <CardDescription>
              Customize the template by updating these variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(variables).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`var-${key}`} className="text-sm font-medium">
                    {key.replace(/_/g, ' ')}
                  </Label>
                  <Input
                    id={`var-${key}`}
                    value={value}
                    onChange={(e) => updateVariable(key, e.target.value)}
                    placeholder={`Enter ${key.replace(/_/g, ' ').toLowerCase()}`}
                    className="bg-muted/50"
                  />
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button
                onClick={processTemplate}
                disabled={isLoading}
                size="lg"
                className="min-w-[160px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Template
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Preview */}
      {templateContent && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grid className="h-5 w-5" />
                <span>Template Preview</span>
                <Badge variant="secondary">Ready to Use</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(templateContent, 'Template')}
                >
                  {copiedField === 'Template' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  Copy
                </Button>
                {onTemplateSelect && (
                  <Button size="sm" onClick={useTemplate} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Review the processed template before using it in your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-6 bg-muted/50 max-h-96 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: templateContent }} 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
