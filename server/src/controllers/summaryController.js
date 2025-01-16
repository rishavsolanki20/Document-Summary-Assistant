const Groq = require('groq-sdk');
const dotenv = require('dotenv');

// Configure Groq API
dotenv.config();

// Initialize Groq client with the API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateSummary = async (req, res) => {
  const { text, length } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text content is required" });
  }

  let summaryLength = "short";
  if (["short", "medium", "long"].includes(length)) {
    summaryLength = length;
  }

  // Define token length based on summary length
  let maxTokens;
  switch (summaryLength) {
    case "short":
      maxTokens = 50;
      break;
    case "medium":
      maxTokens = 150;
      break;
    case "long":
      maxTokens = 300;
      break;
    default:
      maxTokens = 50; // Default to "short"
  }

  try {
    // Make the request to Groq's chat completion API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `You are a helpful assistant. Summarize the text provided in a ${summaryLength} format: ${text}`
        }
      ],
      model: "llama3-70b-8192",  // Change model if needed
      temperature: 0.3,
      max_tokens: maxTokens,
      top_p: 1,
      stream: false,
      stop: null
    });
  
    // Log the full response to inspect it (for debugging purposes)
    console.log("Chat completion response:", JSON.stringify(chatCompletion, null, 2));
  
    // Access the summary from message.content
    const summary = chatCompletion.choices && chatCompletion.choices[0] ? chatCompletion.choices[0].message.content : null;
  
    if (summary) {
      return res.status(200).json({ summary });
    } else {
      return res.status(500).json({ error: "Summary could not be generated or response format is incorrect." });
    }
  } catch (err) {
    console.error("Error during summary generation:", err); // Log the error for debugging
    return res
      .status(500)
      .json({ error: "Error during summary generation", details: err.message });
  }
  
  };
