/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';

interface Props {
  extractedText: string;
  onSummarizedText: (summary: string) => void;
  onGenerateSummary: () => void; // Callback to notify parent when summary is generated
}

export const SummaryDisplay = ({
  extractedText,
  onSummarizedText,
  onGenerateSummary,
}: Props) => {
  const [summaryLength, setSummaryLength] = useState<string>('short');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://document-summary-assistant.vercel.app/summarize',
        {
          text: extractedText,
          length: summaryLength,
        },
      );

      onSummarizedText(response.data.summary);
      onGenerateSummary(); // Notify parent when summary is generated
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      <StyledHeading>Summary</StyledHeading>

      <SelectorWrapper>
        <label htmlFor="summaryLength">Select summary length:</label>
        <select
          id="summaryLength"
          value={summaryLength}
          onChange={e => setSummaryLength(e.target.value)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </SelectorWrapper>

      <Button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Generating Summary...' : 'Summarize'}
      </Button>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Div>
  );
};

const Div = styled.div`
  padding: 1.5rem;
  border: 1px solid #9ee6a4;
  max-width: 600px;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem;
    max-width: 90%;
  }
`;

const StyledHeading = styled.h3`
  position: relative;
  font-size: 2rem;
  text-align: center;
  color: #000000;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 35%;
    width: 30%;
    height: 50%;
    background-color: #9ee6a4;
    z-index: -1;
  }
`;

const SelectorWrapper = styled.div`
  margin-bottom: 1rem;

  label {
    font-size: 1rem;
    color: #333;
    margin-right: 0.5rem;
  }

  select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
    }
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #5dd667, #aae59c, #4caf50, #388e3c);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  width: 100%;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #388e3c;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 1rem;
`;
