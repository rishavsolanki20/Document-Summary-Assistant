/* eslint-disable prettier/prettier */
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components/macro';

interface Props {
  onExtractedText: (text: string) => void; // Callback to pass extracted text
}

export const FileUploader: React.FC<Props> = ({ onExtractedText }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null); // Store the file ID
  const [isUploadingFile, setIsUploadingFile] = useState(false); // Uploading state for file
  const [isExtractingText, setIsExtractingText] = useState(false); // Extracting text state
  const [error, setError] = useState<string>(''); // Store error messages
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [isUploaded, setIsUploaded] = useState(false); // Track whether the file is uploaded

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];

      // Validate file type
      if (
        !['application/pdf', 'image/png', 'image/jpeg'].includes(
          selectedFile.type,
        )
      ) {
        setError('Please upload a PDF or an image file.');
        return;
      }

      setFile(selectedFile);
      setError(''); // Clear any previous error messages
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => {
      setIsDragging(false);
      setError('Invalid file type. Please upload a PDF or an image file.');
    },
    accept: {
      'application/pdf': [],
      'image/png': [],
      'image/jpeg': [],
    },
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    setIsUploadingFile(true); // Set uploading state for file to true
    setError(''); // Reset any previous errors

    const formData = new FormData();
    formData.append('file', file); // Append the selected file to the form data

    try {
      // Upload file to the backend
      const uploadResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const { fileId: uploadedFileId } = uploadResponse.data; // Extract fileId
      setFileId(uploadedFileId); // Save fileId for extraction API call
      setIsUploaded(true); // Set the file as uploaded

      alert('File uploaded successfully. Ready for text extraction!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(
        axios.isAxiosError(error) && error.response
          ? `Error: ${error.response?.data?.error || 'Unknown error'}`
          : 'An error occurred while uploading the file.',
      );
    } finally {
      setIsUploadingFile(false); // Reset uploading state
    }
  };

  // Handle text extraction
  const handleExtract = async () => {
    if (!fileId) {
      setError('No file uploaded. Please upload a file first.');
      return;
    }

    setIsExtractingText(true); // Set extracting text state to true

    try {
      // Extract text from the uploaded file
      const extractResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/extract`,
        {
          fileId,
        },
      );

      // Pass extracted text to the parent component
      onExtractedText(extractResponse.data.extractedText || '');
    } catch (error) {
      console.error('Error extracting text:', error);
      setError(
        axios.isAxiosError(error) && error.response
          ? `Error: ${error.response?.data?.error || 'Unknown error'}`
          : 'An error occurred while extracting text.',
      );
    } finally {
      setIsExtractingText(false); // Reset extracting text state
    }
  };

  // Handle removing the file
  const handleRemoveFile = () => {
    setFile(null); // Reset the file state
    setFileId(null); // Reset the fileId state
    setError(''); // Reset any previous errors
    setIsUploaded(false); // Reset upload state
  };

  return (
    <Container>
      <DropzoneWrapper
        {...getRootProps()}
        isDragging={isDragging}
        hasError={!!error}
      >
        <input {...getInputProps()} />
        <p>
          {file
            ? `File selected: ${file.name}`
            : 'Drag and drop a file here, or click to select a file (PDF, PNG, JPEG only).'}
        </p>
      </DropzoneWrapper>

      {/* Upload button */}
      <Button
        onClick={handleUpload}
        disabled={isUploadingFile || !file || isUploaded}
        isActive={!!file} // Apply active style based on file existence
      >
        {isUploadingFile
          ? 'Uploading...'
          : isUploaded
          ? 'File Uploaded'
          : 'Upload File'}
      </Button>

      {/* Extract button */}
      <ExtractButton
        onClick={handleExtract}
        disabled={!fileId || isExtractingText}
        isActive={!!fileId}
      >
        {isExtractingText ? 'Processing...' : 'Extract Text'}
      </ExtractButton>

      {/* Remove file button */}
      {file && !isUploadingFile && !isUploaded && (
        <RemoveButton onClick={handleRemoveFile} isActive={true}>
          Remove File
        </RemoveButton>
      )}

      {/* Display error message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  border-radius: 5px;

  @media (max-width: 600px) {
    padding: 0.5rem;
  }
`;

const DropzoneWrapper = styled.div<{ isDragging: boolean; hasError: boolean }>`
  padding: 2rem;
  border: 3px dashed
    ${props =>
      props.hasError ? 'red' : props.isDragging ? '#000000' : '#5dd667'};
  background-color: ${props => (props.isDragging ? '#e0f7fa' : 'transparent')};
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  /* Ensuring border consistency by not altering the padding */
  box-sizing: border-box;

  /* Center content */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* Plus sign */
  &::before {
    content: '+';
    font-size: 3rem;
    color: ${props =>
      props.hasError ? 'red' : props.isDragging ? '#000000' : '#5dd667'};
    animation: ${props => (props.isDragging ? 'pulse 1.5s infinite' : 'none')};
  }

  /* Keyframes for pulsating effect */
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* Instruction text */
  p {
    margin: 0.5rem 0 0;
    font-size: 1rem;
    color: ${props => (props.hasError ? 'red' : '#666')};
  }

  @media (max-width: 600px) {
    padding: 1rem;
    p {
      font-size: 0.9rem;
    }
  }
`;

const Button = styled.button<{ isActive: boolean }>`
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: ${props =>
    props.isActive
      ? 'linear-gradient(135deg, #1b1b1b, #4c4c4c, #9e9e9e, #4c4c4c,#2d2d2d, #1b1b1b)' // Dark at edges, greyish in the center
      : '#cccccc'};
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
  margin: 5px;
  border-radius: 6px;
  transition: background-color 0.3s ease;

  font-size: 20px; /* Set font size */
  font-family: 'SofiaSans-Bold', sans-serif; /* Set font family */

  &:disabled {
    background-color: #cccccc; /* Solid color for disabled state */
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const ExtractButton = styled(Button)`
  background: ${props =>
    props.isActive
      ? 'linear-gradient(135deg, #5dd667, #aae59c, #4caf50, #388e3c)'
      : '#cccccc'};

  &:disabled {
    background-color: #cccccc; /* Disabled color */
  }
`;

const RemoveButton = styled(Button)`
  background: #f44336; /* Red background for remove button */
  margin-top: 1rem;

  &:disabled {
    background-color: #cccccc; /* Disabled color */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
`;
