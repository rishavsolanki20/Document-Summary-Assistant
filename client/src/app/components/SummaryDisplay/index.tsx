import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';

interface Props {
  extractedText: string;
}

export const SummaryDisplay = ({ extractedText }: Props) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [summaryLength, setSummaryLength] = useState<string>('short'); // Default summary length
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleSummarize = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Reset error message

    try {
      const response = await axios.post('http://localhost:5000/summarize', {
        text: extractedText,
        length: summaryLength, // Send the selected summary length
      });

      // Assuming the response contains the summary text
      setSummary(response.data.summary);
    } catch (err) {
      setError('Failed to generate summary');
      console.error(err);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <Div>
      <h3>Summary</h3>
      <p>{extractedText}</p>

      {/* Summary Length Selector */}
      <div>
        <label htmlFor="summaryLength">Select summary length: </label>
        <select
          id="summaryLength"
          value={summaryLength}
          onChange={e => setSummaryLength(e.target.value)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="long">Long</option>
        </select>
      </div>

      {/* Summarize Button */}
      <button onClick={handleSummarize} disabled={loading}>
        {loading ? 'Generating Summary...' : 'Summarize'}
      </button>

      {/* Error and Summary Display */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {summary && <Summary>{summary}</Summary>}
    </Div>
  );
};

const Div = styled.div`
  padding: 1rem;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
  max-width: 600px;
  margin: 0 auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.875rem;
`;

const Summary = styled.p`
  color: green;
  font-size: 1rem;
  font-weight: bold;
`;
