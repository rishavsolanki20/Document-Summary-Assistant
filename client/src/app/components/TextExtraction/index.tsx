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
      <StyledHeading>Extracted Text</StyledHeading>
      <p>{extractedText}</p>
    </Div>
  );
};

const Div = styled.div`
  padding: 1rem;
  max-height: 300px;
  overflow-y: auto;
`;
const StyledHeading = styled.h3`
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
    left: 33%;
    width: 34%;
    height: 50%; /* Half the height of the <h3> */
    background-color: #9ee6a4; /* Background color */
    z-index: -1; /* Place the background behind the text */
    transition: all 0.3s ease; /* Smooth transitions for responsiveness */
  }

  /* Responsive adjustments */
  @media (max-width: 1024px) {
    font-size: 1.8rem;

    &::before {
      left: 20%;
      width: 60%;
      height: 45%;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;

    &::before {
      left: 15%;
      width: 70%;
      height: 40%;
    }
  }

  @media (max-width: 480px) {
    font-size: 1.4rem;

    &::before {
      left: 14%;
      width: 74%;
      height: 50%;
    }
  }
`;
