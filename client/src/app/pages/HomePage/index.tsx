/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileUploader } from 'app/components/FileUploader';
import { TextExtraction } from '../../components/TextExtraction';
import { SummaryDisplay } from 'app/components/SummaryDisplay';
import styled from 'styled-components/macro';

export function HomePage() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');

  return (
    <Wrapper>
      <Helmet>
        <title>Text Extraction and Summarization</title>
        <meta
          name="description"
          content="Text extraction and summarization app"
        />
      </Helmet>

      <Content>
        <h1>Text Extraction and Summarization</h1>

        {/* File Upload */}
        <FileUploader onExtractedText={setExtractedText} />

        {/* Display Extracted Text and Summarize Button */}
        {extractedText && (
          <>
            <TextExtraction extractedText={extractedText} />
            <SummaryDisplay
              extractedText={extractedText}
              onSummarizedText={setSummary}
            />
          </>
        )}

        {/* Display Summary */}
        {summary && (
          <SummaryContainer>
            <h3>Summary</h3>
            <p>{summary}</p>
          </SummaryContainer>
        )}
      </Content>
    </Wrapper>
  );
}

// Styled Components

const Wrapper = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f4f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Content = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  text-align: center;
  color: #333;

  h1 {
    color: #00796b;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
`;

const SummaryContainer = styled.div`
  background-color: #e0f7fa;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;

  h3 {
    color: #00796b;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
  }
`;
