const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

function printToTerminal(text) {
    const p = document.createElement('div');
    p.textContent = text;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';
        printToTerminal('> ' + command);
        switch(command) {
            case 'help':
                printToTerminal('Commands: about, projects, arcade, socials, clear, ls');
                break;
            case 'about':
                document.getElementById('manifesto').scrollIntoView();
                printToTerminal('Scrolling to Manifesto...');
                break;
            case 'projects':
                document.getElementById('projects').scrollIntoView();
                printToTerminal('Scrolling to R&D Lab...');
                break;
            case 'arcade':
                document.getElementById('arcade').scrollIntoView();
                printToTerminal('Loading Interactive Logic Lab...');
                break;
            case 'socials':
                document.getElementById('socials').scrollIntoView();
                printToTerminal('Connecting to Network...');
                break;
            case 'clear':
                terminalOutput.innerHTML = '';
                break;
            case 'ls':
                printToTerminal('about.txt  projects/  skills.md  resume.pdf');
                break;
            case 'cat about.txt':
                printToTerminal('Harsh Sharma. CS @ BITS Pilani. ML & Policy.');
                break;
            default:
                printToTerminal('Command not found. Type "help".');
        }
    }
});