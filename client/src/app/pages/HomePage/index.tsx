// src/app/pages/HomePage/index.tsx
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileUploader } from 'app/components/FileUploader';
import { TextExtraction } from '../../components/TextExtraction';
import { SummaryDisplay } from 'app/components/SummaryDisplay';

export function HomePage() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  return (
    <>
      <Helmet>
        <title>Text Extraction and Summarization</title>
        <meta
          name="description"
          content="Text extraction and summarization app"
        />
      </Helmet>

      <div>
        <h1>Text Extraction and Summarization</h1>

        {/* File Upload */}
        <FileUploader onExtractedText={setExtractedText} />

        {/* Display Extracted Text and Summarize Button */}
        {extractedText && (
          <>
            <TextExtraction extractedText={extractedText} />
            <SummaryDisplay extractedText={extractedText} />
          </>
        )}

        {/* Display Summary */}
        {summary && (
          <div>
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </>
  );
}
