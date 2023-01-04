# Chat GPT Open-AI_Api 

Here I will explain how to make a popular gpt chat using the help of node.js


![image](https://user-images.githubusercontent.com/92671053/210306472-a6fa18f9-1574-4632-979c-3d717f8d9cc2.png)


# Installation

## Client Server

Here will explain how to install and run it

```
1. Create new Folder
2. npm create vite@latest client --template vanilla
   > vanilla
   > Javascript
3. cd client
4. npm install
5. npm run dev
```

After running the command, next is
```
1. Delete file counter.js
2. Ganti nama file main.js -> script.js
3. Download assets https://drive.google.com/file/d/1RhtfgrDaO7zoHIJgTUOZKYGdzTFJpe7V/view
4. In folder assets, copy and paste file Favicon.ico to public and delete Vite.svg
```

later the temporary client folder is as follows

![2](https://user-images.githubusercontent.com/92671053/210300655-36069fef-478c-4b97-a6f4-c519ae24ccf9.PNG)

In the ``index.html`` file the code is as follows
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your AI</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <div id="app">
      <div id="chat_container">
        
      </div>

      <form>
        <textarea name="prompt" rows="1" cols="1" placeholder="Ask codex..."></textarea>
        <button type="submit"><img src="assets/send.svg" alt="send" />
      </form>
    </div>

    <script type="module" src="script.js"></script>
  </body>
</html>

```

in file ``style.css`` code is as follows
```css
@import url("https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@100;300;400;500;700;800;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Alegreya Sans", sans-serif;
}

body {
  background: #343541;
}

#app {
  width: 100vw;
  height: 100vh;
  background: #343541;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

#chat_container {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
  gap: 10px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  padding-bottom: 20px;
  scroll-behavior: smooth;
}

/* hides scrollbar */
#chat_container::-webkit-scrollbar {
  display: none;
}

.wrapper {
  width: 100%;
  padding: 15px;
}

.ai {
  background: #40414F;
}

.chat {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.profile {
  width: 36px;
  height: 36px;
  border-radius: 5px;

  background: #5436DA;

  display: flex;
  justify-content: center;
  align-items: center;
}

.ai .profile {
  background: #10a37f;
}

.profile img {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

.message {
  flex: 1;

  color: #dcdcdc;
  font-size: 20px;

  max-width: 100%;
  overflow-x: scroll;

  /*
   * white space refers to any spaces, tabs, or newline characters that are used to format the CSS code
   * specifies how white space within an element should be handled. It is similar to the "pre" value, which tells the browser to treat all white space as significant and to preserve it exactly as it appears in the source code.
   * The pre-wrap value allows the browser to wrap long lines of text onto multiple lines if necessary.
   * The default value for the white-space property in CSS is "normal". This tells the browser to collapse multiple white space characters into a single space, and to wrap text onto multiple lines as needed to fit within its container.
  */
  white-space: pre-wrap; 

  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* hides scrollbar */
.message::-webkit-scrollbar {
  display: none;
}

form {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 10px;
  background: #40414F;

  display: flex;
  flex-direction: row;
  gap: 10px;
}

textarea {
  width: 100%;

  color: #fff;
  font-size: 18px;

  padding: 10px;
  background: transparent;
  border-radius: 5px;
  border: none;
  outline: none;
}

button {
  outline: 0;
  border: 0;
  cursor: pointer;
  background: transparent;
}

form img {
  width: 30px;
  height: 30px;
}
```

in file script.js code is as follows 
```js
import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})
```

Run ``npm run dev`` and look at the result

## Server Side

Now, I will explain how to install and run on the server side

```
1. Create folder -> server
2. Open your terminal 
3. cd server
4. npm init -y
5. npm install cors dotenv nodemon openai
6. npm install express
7. Create file .env 
```

later the temporary server side folder is as follows

![image](https://user-images.githubusercontent.com/92671053/210457082-b59e080f-37a1-43fa-ae0b-45d9c7533078.png)

And all the files are

![image](https://user-images.githubusercontent.com/92671053/210458270-f2c6f244-68e2-4639-9075-52c420394b9f.png)

In the .env file you will fill in the API token obtained from [openAi](https://openai.com/api/)

To get the token API, the steps are as follows
```
1. Create an account
2. Press your profile, then look for [View API Keys]
3. Search for API Keys
4. Create a new secret key
5. Copy the token, then put it in your .env file
```

Then open your ``package.json`` file, replace it as follows
```json
{
  "name": "server",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "scripts": {
    "server": "nodemon server"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "nodemon": "^2.0.20",
    "openai": "^3.1.0"
  }
}

```

Then open your ``server.js`` file, and fill it as follows

```js
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
```

# How To Run?
After following the tutorial above, here's how to run it

For Client
```
1. Open terminal
2. cd client
3. npm run dev
```

For Server
```
1. Open terminal
2. cd server
3. npm run server
```

![image](https://user-images.githubusercontent.com/92671053/210458579-7d11f1d5-2bc5-476e-8b88-8601f040c1fe.png)



## Reference

- **[Javascript Mastery](https://www.youtube.com/watch?v=2FeymQoKvrk&t=2662s)**
- **[openAI_API](https://beta.openai.com/overview)**

