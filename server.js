import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import cors from 'cors';
import path from "path";
import twilio from 'twilio';
import bodyParser from 'body-parser';
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const client = twilio(accountSid, authToken);
const app = express(); 
app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"public","file.html"));
});
var data_con = "";
const up = multer({dest: 'uploads/'});
app.post('/file',up.single('file'),async(req,res)=>{
    try{
        const temp = XLSX.readFile(req.file.path);
        const name = temp.SheetNames[0];
        const mainSheet = temp.Sheets[name];
        const mainData = XLSX.utils.sheet_to_json(mainSheet);
        data_con = mainData;
        console.log(mainData);
        res.sendFile(path.join(__dirname,"public","dashboard.html"));
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error parsing Excel file');
    }
});
app.get("/getcontent",(req,res)=>{
    try
    {
        const data = data_con;
        res.json({data});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send('Error parsing Excel file');
    }
});
app.post("/ai",(req,res)=>{
    res.sendFile(path.join(__dirname,"public","ai-analysis.html"));
});
app.post('/makeCall', async (req, res) => {
    try {
        const {number,message} = req.body;
        console.log(number);
        const call=await client.calls.create({
            url: `${process.env.NGROK_URL}/voice?message=${encodeURIComponent(message)}`,
            to: number,
            from: process.env.TWILIO_FROM
        });
        res.json({ success: true, callSid: call.sid });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});
app.post('/voice', (req, res) => {
    const message = req.query.message || "Hello, this is a test call from Twilio.";
    res.set('Content-Type', 'text/xml');
    res.send(`<Response><Say>${message}</Say></Response>`);
});
app.post('/ai-analysis', async (req, res) => {
  try {
    const data = req.body.data || [];
    const prompt = `
You are an expert analyst tasked with reviewing student data.

The data consists of records including student name, branch, academic year, interests, email, and mobile number.

Please generate a professional and concise report with the following sections, using clear headings and natural paragraphs:

1. Overview: Summarize the total number of students, data points, distribution across branches and years, and diversity of interests.
2. Branch Grouping: Group similar branches logically and describe the distribution of students within these groups.
3. Interest Grouping: Group student interests into broader categories and explain their alignment with branches.
4. Trends and Predictions: Analyze current trends from the data and predict future interest areas, highlighting emerging themes.
5. Conclusion: Provide a final summary of key insights that would help academic or organizational planning.

Do not use bullet points, lists, or markdown formatting. Keep the language simple, professional, and easy to read for all stakeholders.
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();
    res.json({ analysis: text });
  } catch(err){
    console.log(err);
    res.status(500).json({ error: 'AI analysis failed' });
  }
});
const PORT = 3000;
app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});