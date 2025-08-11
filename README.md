# Student Insights Dashboard

An interactive Student Data Analytics Dashboard that lets you upload Excel student data, analyze it visually, and perform powerful operations in one place.  
From filtering and searching to automated calls and AI-generated reports, this dashboard is designed for speed, precision, and insights.

## Features

- Upload Excel file to import student data
- Graphical breakdown of student interests
- Filters by year, branch, and interests with instant search
- Add or delete rows dynamically
- Export or download the updated dashboard view
- Click on any student row to:
  - Send an email
  - Place an automated call by typing the message to be spoken
- AI-generated reports with:
  - Conclusions from the data
  - Detection of trending interests
  - Data-driven recommendations
- Real-time access using ngrok
- Smart insights powered by Gemini API

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js
- APIs:
  - Twilio - automated calls and messaging
  - Gemini API - AI analysis and reporting
  - Ngrok - localhost tunneling
- File handling: XLSX parsing for Excel uploads
- Have used Multer as a middleware for files so it will uploads the file in uploads/ folder in your local environment

## Installation and Setup

- Need to initiate the Node.js environment  
- Need to download all the npm packages  
- For `.env` file, include: Twilio SID, Twilio Auth Token, Twilio Phone Number, Gemini API Key, NGROK public url.
- For getting twilio credintials just make account in twilio and you will get auth toke, sid and your twilio phonenumber.
- For ngrok public URL: first run `npm start` and then run `ngrok http 3000`

## Note
If you have free trial of twilio, then it can only call the twilio verify mobile number so you need to first verify the mobilenumbers of student in twilio with just OTP.
