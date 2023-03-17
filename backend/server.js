require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});

// const response = await openai.listEngines();

app.get("/", (req, res) => {
  res.send("Hello from server!");
});

app.post("/openai", async (req, res) => {
  try {
    const studentAnswer = req.body.studentAnswer;
    const correctAnswer = req.body.correctAnswer;
    const question = req.body.question;
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `
      pretend you are examiner.
      you asked the question, ${question}
      student answer is ${studentAnswer} and
      correct answer is ${correctAnswer},
      compare student answert and correct answer and provide suggestions for the student`,
      max_tokens: 1000,
      temperature: 0,
    });

    console.log(response.data.choices[0]);
    res.status(201).json({ message: response.data.choices[0].text });
  } catch (e) {
    console.log(e);
    res.status(204);
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
