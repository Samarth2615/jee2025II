// netlify/functions/uploadToGitHub.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { filename, content } = JSON.parse(event.body);
  const token = process.env.GITHUB_PAT;
  const repo = 'username/repository';
  const path = `uploads/${filename}`;
  
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `Upload ${filename}`,
      content: content, // Base64-encoded content
    }),
  });

  const result = await response.json();
  if (response.ok) {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'File uploaded successfully',
        url: result.content.html_url 
      }),
    };
  } else {
    return {
      statusCode: response.status,
      body: JSON.stringify({ 
        message: 'Failed to upload file',
        error: result 
      }),
    };
  }
};
