const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 3000;

// Production CORS settings
const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://159.203.136.138',
    'http://159.203.136.138:3000',
    'https://159.203.136.138',
    'https://159.203.136.138:3000'
];

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Serve static files from the React build directory
app.use(express.static('dist'));
// Also serve static assets (images, etc.) from root
app.use(express.static('.'));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Resume Rewriter Backend is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Add security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

const rateLimit = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;
    
    if (!rateLimitMap.has(clientIP)) {
        rateLimitMap.set(clientIP, []);
    }
    
    const requests = rateLimitMap.get(clientIP);
    const validRequests = requests.filter(time => time > windowStart);
    
    if (validRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
        });
    }
    
    validRequests.push(now);
    rateLimitMap.set(clientIP, validRequests);
    next();
};

// Apply rate limiting to API routes
app.use('/api', rateLimit);

// Proxy endpoint for resume rewriting (resume.js)
app.post('/api/rewrite-resume', async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText) {
            return res.status(400).json({
                error: 'Resume text is required'
            });
        }

        const comprehensivePrompt = `You are an expert resume writer and ATS optimization specialist with 15+ years of experience helping candidates get hired at top companies. Your goal is to create a powerful, concise resume that maximizes hiring potential.

CRITICAL REQUIREMENTS:
• Keep total length to 1 page (2 pages MAX for senior roles)
• Optimize for ATS scanning with strategic keyword placement
• Use strong action verbs and quantified results
• Create compelling, scannable format for busy hiring managers
• Focus on impact and achievements over job duties

REWRITE STRATEGY:
1. PROFESSIONAL SUMMARY (2-3 lines max)
   - Lead with your strongest value proposition
   - Include 1-2 key metrics/achievements
   - Match keywords to target roles

2. CORE SKILLS (1 section, bullet format)
   - 8-12 relevant technical and soft skills
   - Use exact terms from job postings
   - Group related skills logically

3. PROFESSIONAL EXPERIENCE (3-4 bullet points per role)
   - Start each bullet with strong action verbs
   - Include specific numbers, percentages, dollar amounts
   - Focus on achievements, not responsibilities
   - Show progression and increasing impact

4. EDUCATION (minimal unless recent grad)
   - Degree, school, year (relevant coursework only if space allows)

5. OPTIONAL: Certifications/Projects (only if space allows and highly relevant)

FORMATTING RULES:
• Use clean, ATS-friendly formatting (no graphics, tables, or columns)
• Consistent bullet points and spacing
• Clear section headers
• Standard fonts (Arial, Calibri, Times New Roman)
• Strategic bolding for key achievements only

POWER WORDS TO USE:
Achieved, Led, Increased, Reduced, Generated, Implemented, Optimized, Managed, Created, Delivered, Exceeded, Improved

Resume to rewrite (keep factual information accurate):
${resumeText}

OUTPUT: Return ONLY the rewritten resume. No analysis, no commentary, no extra sections. Just a clean, powerful, ATS-optimized resume that will get this candidate hired.`;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 3000,
                temperature: 0.3,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a senior hiring manager and executive recruiter with 20+ years of experience. You excel at identifying top talent and know exactly what makes a resume stand out to other senior hiring managers. You understand both ATS systems and human psychology in hiring decisions.'
                    },
                    {
                        role: 'user',
                        content: comprehensivePrompt
                    }
                ]
            })
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text(); 
            console.error('OpenAI API Error:', openaiResponse.status,
  errorText);
            return res.status(openaiResponse.status).json({
                error: 'API service error. Please try again later.'
            });
        }

        const data = await openaiResponse.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return res.status(500).json({
                error: 'Invalid response format from API service'
            });
        }

        res.json({
            success: true,
            rewrittenResume: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Proxy endpoint for fetching external URLs (cater.js - URL fetching)
app.post('/api/fetch-url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                error: 'URL is required'
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch (urlError) {
            return res.status(400).json({
                error: 'Invalid URL format'
            });
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            redirect: 'follow',
            timeout: 10000
        });

        if (!response.ok) {
            return res.status(response.status).json({
                error: `Failed to fetch URL: ${response.status} ${response.statusText}`
            });
        }

        const htmlContent = await response.text();

        res.json({
            success: true,
            htmlContent: htmlContent
        });

    } catch (error) {
        res.status(500).json({
            error: 'Could not fetch the URL. The website may be blocking automated requests.',
            message: error.message
        });
    }
});

// Proxy endpoint for job description extraction (cater.js - first API call)
app.post('/api/extract-job-description', async (req, res) => {
    try {
        const { htmlContent } = req.body;

        if (!htmlContent) {
            return res.status(400).json({
                error: 'HTML content is required'
            });
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 2000,
                temperature: 0.3,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a job description extractor. Extract job descriptions, requirements, and responsibilities from HTML content.'
                    },
                    {
                        role: 'user',
                        content: `Extract the job description, requirements, and responsibilities from the HTML content below. Return only the clean job description text, removing any HTML tags, navigation elements, or irrelevant content.

HTML content: ${htmlContent.substring(0, 4000)}`
                    }
                ]
            })
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API Error:', openaiResponse.status, errorText);
            return res.status(openaiResponse.status).json({
                error: 'API service error. Please try again later.'
            });
        }

        const data = await openaiResponse.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return res.status(500).json({
                error: 'Invalid response format from API service'
            });
        }

        res.json({
            success: true,
            jobDescription: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Proxy endpoint for resume tailoring (cater.js - second API call)
app.post('/api/tailor-resume', async (req, res) => {
    try {
        const { currentResume, jobDescription } = req.body;

        if (!currentResume) {
            return res.status(400).json({
                error: 'Current resume is required'
            });
        }

        if (!jobDescription) {
            return res.status(400).json({
                error: 'Job description is required'
            });
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 4000,
                temperature: 0.7,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional resume writer with expertise in tailoring resumes to specific job descriptions while maintaining truthfulness.'
                    },
                    {
                        role: 'user',
                        content: `Your task is to rewrite resumes to better align with specific job descriptions while maintaining truthfulness and the candidate's actual experience. Focus on optimizing keywords, highlighting relevant skills, and restructuring content to match the job requirements.

Please rewrite the following resume to better match this job description. Keep all information truthful but optimize the language, keywords, and emphasis to align with the job requirements.

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME:
${currentResume}

Please provide a complete, well-formatted resume that better targets this specific job opportunity.`
                    }
                ]
            })
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API Error:', openaiResponse.status, errorText);
            return res.status(openaiResponse.status).json({
                error: 'API service error. Please try again later.'
            });
        }

        const data = await openaiResponse.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return res.status(500).json({
                error: 'Invalid response format from API service'
            });
        }

        res.json({
            success: true,
            tailoredResume: data.choices[0].message.content
        });

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Proxy endpoint for API key testing (jobfit.js - first API call)
app.post('/api/test-api-key', async (req, res) => {
    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 5,
                messages: [{ role: 'user', content: 'Test' }]
            })
        });

        if (openaiResponse.ok) {
            res.json({
                success: true,
                valid: true
            });
        } else {
            res.json({
                success: true,
                valid: false,
                status: openaiResponse.status
            });
        }

    } catch (error) {
        res.status(500).jso
        n({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Proxy endpoint for job fit analysis (jobfit.js - second API call)
app.post('/api/analyze-job-fit', async (req, res) => {
    try {
        const { resumeContent, jobTitle, jobDescription, jobRequirements } = req.body;

        if (!resumeContent) {
            return res.status(400).json({
                error: 'Resume content is required'
            });
        }

        if (!jobTitle || !jobDescription) {
            return res.status(400).json({
                error: 'Job title and description are required'
            });
        }

        // Process content to fit within token limits
        const processedResume = resumeContent.substring(0, 3000);
        const processedJob = `${jobTitle} ${jobDescription} ${jobRequirements || ''}`.substring(0, 2000);

        const prompt = `Job: ${jobTitle}
Requirements: ${processedJob}
Resume: ${processedResume}

You are a Senior Hiring Manager with over 20 years of experience.  Rate fit 0-100 and provide brief analysis. JSON format:
{"score": X, "summary": "...", "strengths": ["..."], "gaps": ["..."], "tips": ["..."]}`;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                max_tokens: 800,
                temperature: 0.1,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a Senior Hiring Manager with over 20 years of experience. Analyze job fit between resumes and job descriptions.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API Error:', openaiResponse.status, errorText);
            return res.status(openaiResponse.status).json({
                error: 'API service error. Please try again later.'
            });
        }

        const data = await openaiResponse.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
            return res.status(500).json({
                error: 'Invalid response format from API service'
            });
        }

        const content = data.choices[0].message.content.trim();

        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            const jsonContent = jsonMatch ? jsonMatch[0] : content;
            const parsedResponse = JSON.parse(jsonContent);

            const result = {
                jobFitScore: Math.max(0, Math.min(100, parsedResponse.score || parsedResponse.jobFitScore || 50)),
                summary: parsedResponse.summary || "Analysis completed successfully.",
                strengths: parsedResponse.strengths || ["Relevant experience found"],
                gaps: parsedResponse.gaps || ["Areas for improvement identified"],
                recommendations: parsedResponse.tips || parsedResponse.recommendations || ["Continue developing skills"]
            };

            res.json({
                success: true,
                ...result
            });

        } catch (parseError) {
            // Fallback with simple text analysis
            const score = content.match(/\d+/)?.[0] || 70;
            res.json({
                success: true,
                jobFitScore: parseInt(score),
                summary: "Analysis completed. Review the detailed feedback below.",
                strengths: ["Relevant background identified"],
                gaps: ["Some areas for improvement noted"],
                recommendations: ["Focus on matching key requirements"]
            });
        }

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
    // Don't intercept API calls or health check
    if (req.path.startsWith('/api/') || req.path === '/health') {
        return res.status(404).json({ error: 'Endpoint not found' });
    }
    res.sendFile(__dirname + '/dist/index.html');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Resume Rewriter Backend running on port ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API Endpoints:`);
    console.log(`   • /api/rewrite-resume - Resume rewriting`);
    console.log(`   • /api/extract-job-description - Job description extraction`);
    console.log(`   • /api/tailor-resume - Resume tailoring`);
    console.log(`   • /api/test-api-key - API key validation`);
    console.log(`   • /api/analyze-job-fit - Job fit analysis`);
    console.log(`🌐 Serving React SPA from dist/ directory`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📱 Open http://localhost:${PORT} in your browser`);
});
