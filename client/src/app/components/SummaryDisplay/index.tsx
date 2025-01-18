import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';

interface Props {
  extractedText: string;
  onSummarizedText: (summary: string) => void; // Callback to pass summary back to parent
}

export const SummaryDisplay = ({ extractedText, onSummarizedText }: Props) => {
  const [summaryLength, setSummaryLength] = useState<string>('short'); // Default summary length
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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

      // Pass the summary back to the parent component via the callback
      onSummarizedText(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Div>
      <h3>Summary</h3>

      {/* Summary Length Selector */}
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

      {/* Summarize Button */}
      <Button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Generating Summary...' : 'Summarize'}
      </Button>

      {/* Error and Summary Display */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Div>
  );
};

const Div = styled.div`
  padding: 1.5rem;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
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

const SelectorWrapper = styled.div`
  margin-bottom: 1rem;

  label {
    font-size: 1rem;
    color: #333;
    margin-right: 0.5rem;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  select {
    padding: 0.5rem;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #00bcd4;
    cursor: pointer;
    transition: all 0.3s ease;

    &:focus {
      border-color: #008c9e;
      outline: none;
    }

    @media (max-width: 768px) {
      font-size: 0.9rem;
      padding: 0.4rem;
    }
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #00bcd4;
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
    background-color: #008c9e;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;
