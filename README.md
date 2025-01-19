# Text Extraction and Summarization App

This React-based web application allows users to upload files (PDFs or images), extract text, and generate summaries. The app uses a backend API to handle file uploads and text extraction.

## Features

- Upload PDF, PNG, or JPEG files.
- Extract text from uploaded files.
- Generate summaries from the extracted text.
- View summaries and re-upload files for further processing.
- Responsive and user-friendly design.

---

## Table of Contents

1. [Installation](#installation)

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone git@github.com:rishavsolanki20/Document-Summary-Assistant.git
   ```

   2.**Navigate to the project directory:**

```bash
cd Document-Summary-Assistant/client
```

3. **Install dependencies:**

```bash
yarn install
```

4. **Start the development server:**

```bash
npm start
```

**URL**
https://document-summary-assistant.netlify.app/

## Approach

The backend of the project is built using Node.js with Express, handling file uploads, text extraction, and summarization. Users can upload files (PDFs, images) via the /upload route, and the backend processes these files using Tesseract.js for OCR and pdf-parse for PDF text extraction. The extracted text is then sent to the /summarize route, where the Lama 3 AI model generates a concise summary of the content, providing valuable insights from long documents. The backend also uses Supabase for storing and managing the uploaded files.

The frontend is developed using React, providing a seamless and interactive interface for users. It enables file uploads, displays extracted text, and shows the AI-generated summaries. The React app interacts with the backend API to facilitate these operations, allowing users to upload files, view extracted content, and generate summaries with a simple, intuitive UI. This integration of backend functionalities with a user-friendly frontend makes the entire process efficient and easy to use, ensuring a smooth experience for the users.
