import { NextRequest, NextResponse } from 'next/server';
import { extractInvoiceDataFromFile, validateFileType, formatFileSize } from '@/lib/file-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, Word document, or image files.' },
        { status: 400 }
      );
    }

    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File size too large. Maximum size is ${formatFileSize(maxSize)}` },
        { status: 400 }
      );
    }

    // Extract data from file using Gemini
    const extractedData = await extractInvoiceDataFromFile(file);

    return NextResponse.json({
      success: true,
      data: extractedData,
      message: 'Invoice data extracted successfully'
    });

  } catch (error) {
    console.error('Invoice extraction error:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process file' },
      { status: 500 }
    );
  }
}
