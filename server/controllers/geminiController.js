const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;

// This is the new, correct, and working URL for the Hugging Face 'gpt2' model
const MODEL_API_URL = "https://api-inference.huggingface.co/models/gpt2";

if (!HUGGING_FACE_API_TOKEN) {
    console.error('SERVER ERROR: HUGGING_FACE_API_TOKEN is not set in environment variables. AI suggestions will not work.');
}

const getAISuggestion = async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ msg: 'Please provide a prompt for AI recipe suggestion.' });
    }

    try {
        const response = await axios.post(
            MODEL_API_URL,
            { inputs: prompt },
            {
                headers: {
                    'Authorization': `Bearer ${HUGGING_FACE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const suggestion = response.data[0].generated_text;
        res.json({ suggestion: suggestion });

    } catch (err) {
        console.error('Error generating AI recipe suggestion from Hugging Face:', err);

        let errorMessage = 'Failed to get AI suggestion from Hugging Face. Please try again.';
        if (err.response && err.response.data && err.response.data.error) {
             console.error('Hugging Face API Error Response:', err.response.data.error);
             errorMessage = err.response.data.error;
        } else if (err.message) {
            errorMessage = err.message;
        }

        res.status(500).json({ msg: errorMessage });
    }
};

module.exports = { getAISuggestion };