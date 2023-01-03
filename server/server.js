import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration,  OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}); 

console.log(process.env.OPENAI_API_KEY);

const openAi = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res) => {
    res.status(200).send({
        message: "Welcome",
    })
});

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const respone = await openAi.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: respone.data.choices[0].text
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(error || 'Something went wrong');
    }
});

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))