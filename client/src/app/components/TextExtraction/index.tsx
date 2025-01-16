/**
 *
 * TextExtraction
 *
 */
import React from 'react';
import styled from 'styled-components/macro';

interface Props {
  extractedText: string; // The extracted text passed as a prop
}

export const TextExtraction: React.FC<Props> = ({ extractedText }) => {
  return (
    <Div>
      <h3>Extracted Text</h3>
      <p>{extractedText}</p>
    </Div>
  );
};

const Div = styled.div`
  padding: 1rem;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
  max-height: 300px;
  overflow-y: auto;
`;
