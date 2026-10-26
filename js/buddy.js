document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.createElement('div');
    chatContainer.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:99999; display:flex; flex-direction:column; align-items:flex-end;";

    const chatWindow = document.createElement('div');
    chatWindow.id = "emergency-chat";
    chatWindow.style.cssText = "display:none; width:300px; height:400px; background:#0B0F19; border:1px solid var(--netflix-red, #ff003c); border-radius:12px; margin-bottom:10px; padding:15px; flex-direction:column; color:white; box-shadow:0 10px 30px rgba(0,0,0,0.8);";

    const chatMsgs = document.createElement('div');
    chatMsgs.id = "chat-messages";
    chatMsgs.style.cssText = "flex:1; overflow-y:auto; margin-bottom:10px; font-size:0.9rem; display:flex; flex-direction:column; gap:8px;";

    const chatInput = document.createElement('input');
    chatInput.id = "chat-input";
    chatInput.placeholder = "Ask me about Harsh, his projects, or skills...";
    chatInput.setAttribute('aria-label', 'Message Buddy.AI');
    chatInput.style.cssText = "padding:10px; background:#000; border:1px solid #333; color:white; border-radius:5px; outline:none;";

    const chatBtn = document.createElement('button');
    chatBtn.type = 'button';
    chatBtn.setAttribute('aria-label', 'Open Buddy.AI');
    chatBtn.innerText = "B";
    chatBtn.style.cssText = "width:60px; height:60px; border-radius:50%; background:var(--netflix-red, #ff003c); color:white; font-size:24px; font-weight:bold; border:none; cursor:pointer; box-shadow:0 0 20px var(--netflix-red, #ff003c);";

    chatWindow.appendChild(chatMsgs);
    chatWindow.appendChild(chatInput);
    chatContainer.appendChild(chatWindow);
    chatContainer.appendChild(chatBtn);
    document.body.appendChild(chatContainer);

    const responses = [
        {
            keywords: ['who is he', 'who is harsh'],
            reply: 'Harsh Sharma is a first-year Computer Science student at BITS Pilani, Hyderabad. He is an AI enthusiast and competitive programmer.'
        },
        {
            keywords: ['who are you', 'who is buddy'],
            reply: 'I am Buddy.AI, a custom-built virtual assistant created by Harsh to help you navigate his portfolio. I run entirely in your browser!'
        },
        {
            keywords: ['education', 'college'],
            reply: 'Harsh is currently pursuing his B.E. in Computer Science at BITS Pilani, Hyderabad (2026-2030), and previously studied PCM at DPS Rohini.'
        },
        {
            keywords: ['hire', 'internship'],
            reply: 'Harsh is actively looking for software engineering and AI/ML internships. You can reach him at harsh.sharma80027090@gmail.com.'
        },
        {
            keywords: ['make', 'chronos'],
            reply: "Chronos is Harsh's automation project built using Make.com, designed to schedule and process tasks."
        },
        {
            keywords: ['neuralflood'],
            reply: 'NeuralFlood is a Kaggle hackathon project where Harsh built 52 Machine Learning models in 48 hours to predict urban flood risks.'
        },
        {
            keywords: ['synapse', 'rag'],
            reply: 'Synapse is Harsh’s Retrieval-Augmented Generation chatbot project, built with the Gemini API and vector search for contextual answers.'
        },
        {
            keywords: ['omni', 'converter'],
            reply: 'Omni is Harsh’s file conversion utility for processing and transforming data across formats.'
        },
        {
            keywords: ['project', 'projects'],
            reply: 'Harsh’s featured work includes NeuralFlood, Synapse, Chronos, Omni, competitive programming, and HS-OS. Ask me about any project by name.'
        },
        {
            keywords: ['skill', 'skills', 'technology', 'tech stack'],
            reply: 'Harsh works with C++, Python, machine learning, vector search, and vanilla HTML, CSS, and JavaScript. His portfolio also includes automation and algorithm projects.'
        },
        {
            keywords: ['contact', 'email', 'reach'],
            reply: 'You can reach Harsh at harsh.sharma80027090@gmail.com, or visit the Socials page for his profile links.'
        },
        {
            keywords: ['bits', 'hyderabad', 'location'],
            reply: 'Harsh studies Computer Science at BITS Pilani, Hyderabad.'
        },
        {
            keywords: ['hello', 'hi', 'hey'],
            reply: 'Hello! I can tell you about Harsh, his education, projects, skills, and contact information. What would you like to know?'
        },
        {
            keywords: ['thanks', 'thank you'],
            reply: 'You’re welcome! Let me know if you’d like to hear about a project or get Harsh’s contact information.'
        }
    ];

    function getResponse(message) {
        const normalized = message.toLowerCase().replace(/[^a-z0-9@.+\s-]/g, ' ').replace(/\s+/g, ' ').trim();
        const match = responses.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
        return match ? match.reply : "I am still learning! Try asking about Harsh's 'education', 'projects', 'skills', or 'contact info'.";
    }

    function addChatMsg(sender, text) {
        const msg = document.createElement('div');
        const label = document.createElement('strong');
        label.style.color = 'var(--netflix-red, #ff003c)';
        label.textContent = `${sender}: `;
        msg.appendChild(label);
        msg.appendChild(document.createTextNode(text));
        chatMsgs.appendChild(msg);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;
    }

    document.addEventListener('click', (event) => {
        if (!chatWindow.contains(event.target) && !chatBtn.contains(event.target)) {
            chatWindow.style.display = 'none';
        }
    });
    chatBtn.onclick = () => {
        const isOpen = chatWindow.style.display !== 'flex';
        chatWindow.style.display = isOpen ? 'flex' : 'none';
        if (isOpen && chatMsgs.childElementCount === 0) {
            addChatMsg('Buddy.AI', "Hello! I can help you explore Harsh's portfolio. Ask about his education, projects, skills, or contact info.");
            chatInput.focus();
        }
    };

    chatInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || !chatInput.value.trim()) return;
        const userText = chatInput.value.trim();
        addChatMsg('You', userText);
        chatInput.value = '';

        const typing = document.createElement('div');
        const typingLabel = document.createElement('strong');
        typingLabel.style.color = 'var(--netflix-red, #ff003c)';
        typingLabel.textContent = 'Buddy.AI: ';
        typing.appendChild(typingLabel);
        typing.appendChild(document.createTextNode('typing...'));
        chatMsgs.appendChild(typing);
        chatMsgs.scrollTop = chatMsgs.scrollHeight;

        window.setTimeout(() => {
            if (typing.parentNode === chatMsgs) chatMsgs.removeChild(typing);
            addChatMsg('Buddy.AI', getResponse(userText));
        }, 450);
    });
});

