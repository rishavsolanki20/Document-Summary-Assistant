/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FileUploader } from 'app/components/FileUploader';
import { TextExtraction } from '../../components/TextExtraction';
import { SummaryDisplay } from 'app/components/SummaryDisplay';
import styled from 'styled-components/macro';
import logo from '../../components/Logo.svg';

export function HomePage() {
  const [extractedText, setExtractedText] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [showUploadButton, setShowUploadButton] = useState<boolean>(false); // Initially false, will be set to true after summary generation

  // Function to reload the page and hide the "Upload Another" button
  const handleUploadAnother = () => {
    window.location.reload();
    setShowUploadButton(false); // Re-enable the upload button after reload
  };

  // Function to show the "Upload Another" button after summary generation
  const handleGenerateSummary = () => {
    setShowUploadButton(true); // Show the Upload Another button after generating summary
  };

  return (
    <Wrapper>
      {/* Logo in the top-left corner */}
      <LogoDiv>
        <Logo src={logo} alt="App Logo" />
      </LogoDiv>

      <Content>
        <StyledHeading>Text Extraction and Summarization</StyledHeading>

        {/* File Upload */}
        <FileUploader onExtractedText={setExtractedText} />

        {/* Display Extracted Text and Summarize Button */}
        {extractedText && (
          <>
            <TextExtraction extractedText={extractedText} />
            <SummaryDisplay
              extractedText={extractedText}
              onSummarizedText={setSummary}
              onGenerateSummary={handleGenerateSummary} // Callback to handle summary generation
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

        {/* Upload Another Button */}
        {showUploadButton && (
          <Button onClick={handleUploadAnother}>Upload Another</Button>
        )}
      </Content>
    </Wrapper>
  );
}

// Styled Components
const LogoDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  z-index: 10;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 50%;
    height: 8%;
  }

  @media (max-width: 480px) {
    width: 50%;
    height: 8%;
  }
`;

const Logo = styled.img`
  position: relative;
  top: 2rem;
  left: 2rem;
  z-index: 10;

  /* Responsive adjustments */
  @media (max-width: 768px) {
    top: 1.5rem;
    left: 1.5rem;
    width: 60%;
  }

  @media (max-width: 480px) {
    top: 1rem;
    left: 1rem;
    width: 60%; /* Further scale down the logo */
  }
`;

const StyledHeading = styled.h1`
  position: relative;
  font-size: 2rem;
  text-align: center;
  color: #000000; /* Text color */
  z-index: 1; /* Ensure text is above the background */

  /* Create the background using ::before */
  &::before {
    content: '';
    position: absolute;
    bottom: 0; /* Align the background to the bottom of the text */
    left: 8%;
    width: 85%;
    height: 50%; /* Half the height of the <h1> */
    background-color: #9ee6a4; /* Background color */
    z-index: -1; /* Place the background behind the text */
  }
`;

const Wrapper = styled.div`
  font-family: Arial, sans-serif;
  background-color: #f4f7fa;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  border-radius: 5px;
  position: relative; /* Ensures absolute positioning for Logo works */
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
    color: #000000;
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  p {
    font-size: 1rem;
    color: #555;
  }
`;

const SummaryContainer = styled.div`
  background-color: #9ee6a4;
  padding: 1.5rem;
  border-radius: 4px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;

  h3 {
    color: #000000;
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(
    135deg,
    #5dd667,
    #aae59c,
    #4caf50,
    #388e3c
  ); /* Matching Extract Text button gradient */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  width: 100%;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #388e3c; /* Darker shade on hover */
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem;
  }
`;
