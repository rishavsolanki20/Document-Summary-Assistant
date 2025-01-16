import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components/macro';

interface Props {
  onExtractedText: (text: string) => void; // Callback to pass extracted text
}

export const FileUploader: React.FC<Props> = ({ onExtractedText }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null); // Store the file ID
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [error, setError] = useState<string>(''); // Store error messages

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];

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
  };

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

  return (
    <Div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
      <button onClick={handleExtract} disabled={!fileId || isUploading}>
        {isUploading ? 'Processing...' : 'Extract Text'}
      </button>

      {/* Display error message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Div>
  );
};

const Div = styled.div`
  padding: 1rem;
  background-color: #e0f7fa;
  border: 1px solid #00bcd4;

  input[type='file'] {
    margin-bottom: 1rem;
  }

  button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    background-color: #00bcd4;
    color: white;
    border: none;
    cursor: pointer;

    &:disabled {
      background-color: #cccccc;
    }
  }
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  color: red;
  font-size: 0.9rem;
`;
