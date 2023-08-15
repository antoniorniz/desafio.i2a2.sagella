const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

const apiKey = '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'; // Substitua pela sua chave de API

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

let isSagellaSpeaking = false;

// Histórico das mensagens
const messageHistory = [];

async function sendMessage() {
    const userMessage = userInput.value;
    if (userMessage.trim() !== '') {
        appendMessage('Você', userMessage, 'user-message');
        messageHistory.push({ role: 'user', content: userMessage });
        if (!isSagellaSpeaking) {
            isSagellaSpeaking = true;
            await callOpenAI();
            isSagellaSpeaking = false;
        }
        userInput.value = '';
    }
}

async function callOpenAI() {
    const prompt = buildPrompt();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messageHistory.concat([{ role: 'system', content: prompt }])
        })
    });

    const responseData = await response.json();
    const assistantMessage = responseData.choices[0].message.content;
    appendMessage('Sagella', assistantMessage, 'assistant-message');
    processSagellaResponse(assistantMessage);
}

function buildPrompt() {
    return "Você é uma psicóloga virtual chamada Sagella. Faça perguntas para entender o problema do paciente e ofereça orientações e apoio.";
}

function processSagellaResponse(assistantMessage) {
    // Sua lógica para processar a resposta da LLM
}

function appendMessage(role, content, className) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${role}: ${content}`;
    messageDiv.classList.add(className);
    chatLog.appendChild(messageDiv);
}
