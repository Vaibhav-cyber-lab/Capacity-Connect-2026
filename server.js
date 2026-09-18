import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(ai),
  });
});

// AI Course Generation Endpoint
app.post('/api/ai/generate-syllabus', async (req, res) => {
  try {
    const { topic, duration, targetAudience } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!ai) {
      return res.json({
        title: topic,
        description: `Comprehensive training program covering ${topic} tailored for ${targetAudience || 'professionals'}.`,
        modules: [
          `Introduction to ${topic}`,
          `Core Principles and Frameworks`,
          `Practical Industry Implementations`,
          `Mastery Project and Case Studies`,
        ],
        estimatedHours: 20,
      });
    }

    const prompt = `Act as an expert curriculum designer. Generate a structured JSON course outline for:
Topic: ${topic}
Duration: ${duration || '4 Weeks'}
Audience: ${targetAudience || 'General Professionals'}

Format response strictly in JSON:
{
  "title": "${topic}",
  "description": "2-3 concise summary sentences",
  "modules": ["Module 1", "Module 2", "Module 3", "Module 4"],
  "estimatedHours": 24
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text);
    return res.json(parsed);
  } catch (error) {
    console.error('AI Generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate course outline via AI engine.',
    });
  }
});

// AI Quiz Generator Endpoint
app.post('/api/ai/generate-quiz', async (req, res) => {
  try {
    const { topic, count = 3 } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    if (!ai) {
      return res.json({
        questions: [
          {
            id: 'q1',
            text: `What is the primary baseline practice in ${topic}?`,
            options: [
              { id: 'o1', text: 'Systematic Assessment' },
              { id: 'o2', text: 'Unstructured Trial' },
              { id: 'o3', text: 'Passive Observation' },
            ],
            correctOptionId: 'o1',
          },
        ],
      });
    }

    const prompt = `Generate a ${count}-question multiple choice quiz on the topic "${topic}".
Return only JSON in the following format:
{
  "questions": [
    {
      "id": "q1",
      "text": "Question text here?",
      "options": [
        { "id": "o1", "text": "Answer 1" },
        { "id": "o2", "text": "Answer 2" },
        { "id": "o3", "text": "Answer 3" }
      ],
      "correctOptionId": "o1"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text);
    return res.json(parsed);
  } catch (error) {
    console.error('Quiz Generation error:', error);
    return res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

// Serve frontend static build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Capacity Connect Backend running on http://localhost:${PORT}`);
});
