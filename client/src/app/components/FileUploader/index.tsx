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
  const [isUploading, setIsUploading] = useState(false); // Uploading state
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

    setIsUploading(true); // Set uploading state to true
    setError(''); // Reset any previous errors

    const formData = new FormData();
    formData.append('file', file); // Append the selected file to the form data

    try {
      // Upload file to the backend
      const uploadResponse = await axios.post(
        'http://localhost:5000/upload',
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
      setIsUploading(false); // Reset uploading state
    }
  };

  // Handle text extraction
  const handleExtract = async () => {
    if (!fileId) {
      setError('No file uploaded. Please upload a file first.');
      return;
    }

    setIsUploading(true);

    try {
      // Extract text from the uploaded file
      const extractResponse = await axios.post(
        'http://localhost:5000/extract',
        { fileId },
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
      setIsUploading(false);
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

      <Button
        onClick={handleUpload}
        disabled={isUploading || !file || isUploaded}
      >
        {isUploading
          ? 'Uploading...'
          : isUploaded
          ? 'File Uploaded'
          : 'Upload File'}
      </Button>
      <Button onClick={handleExtract} disabled={!fileId || isUploading}>
        {isUploading ? 'Processing...' : 'Extract Text'}
      </Button>

      {/* Add a remove file button if a file is selected and uploaded */}
      {file && !isUploading && !isUploaded && (
        <RemoveButton onClick={handleRemoveFile}>Remove File</RemoveButton>
      )}

      {/* Display error message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;
`;

const DropzoneWrapper = styled.div<{ isDragging: boolean; hasError: boolean }>`
  padding: 2rem;
  border: 3px dashed
    ${props =>
      props.hasError ? 'red' : props.isDragging ? '#00bcd4' : '#cccccc'};
  background-color: ${props => (props.isDragging ? '#e0f7fa' : 'transparent')};
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;

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
      props.hasError ? 'red' : props.isDragging ? '#00bcd4' : '#cccccc'};
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
`;

const Button = styled.button`
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #00bcd4;
  color: white;
  border: none;
  cursor: pointer;

  &:disabled {
    background-color: #cccccc;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #f44336; /* Red color for remove button */
  margin-top: 1rem;
  &:hover {
    background-color: #d32f2f;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.9rem;
`;
