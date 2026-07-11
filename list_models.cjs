const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log("No GEMINI_API_KEY found");
  process.exit(1);
}

https.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log("Models:");
    try {
      const json = JSON.parse(data);
      if (json.models) {
        json.models.forEach(m => console.log(m.name));
      } else {
        console.log(json);
      }
    } catch (e) {
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
