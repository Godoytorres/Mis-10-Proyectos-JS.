// Selección de elementos para el manejo de navegación y temas
const navButtons = document.querySelectorAll('.main-nav button');
const projects = document.querySelectorAll('.project');
const themeToggle = document.getElementById('themeToggle');
const themeText = document.getElementById('themeText');

// Función para mostrar solo la sección activa
function showProject(id) {
    projects.forEach(section => {
        section.classList.toggle('active', section.id === id);
    });
}

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        showProject(button.dataset.target);
    });
});

// Tema guardado en localStorage y aplicación inicial
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
    themeToggle.checked = theme === 'dark';
    themeText.textContent = theme === 'dark' ? 'Modo oscuro' : 'Modo claro';
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'dark' : 'light');
});

// Proyecto 1: Contador Inteligente
const counterValue = document.getElementById('counterValue');
const counterPlus = document.getElementById('counterPlus');
const counterMinus = document.getElementById('counterMinus');
const counterReset = document.getElementById('counterReset');

let currentCount = Number(localStorage.getItem('counterValue')) || 0;

function updateCounter() {
    counterValue.textContent = currentCount;
    counterValue.classList.remove('positive', 'negative', 'zero');
    counterValue.classList.add(currentCount > 0 ? 'positive' : currentCount < 0 ? 'negative' : 'zero');
    localStorage.setItem('counterValue', currentCount);
}

counterPlus.addEventListener('click', () => {
    currentCount += 1;
    updateCounter();
});

counterMinus.addEventListener('click', () => {
    currentCount -= 1;
    updateCounter();
});

counterReset.addEventListener('click', () => {
    currentCount = 0;
    updateCounter();
});

updateCounter();

// Proyecto 2: Lista de Tareas
const todoInput = document.getElementById('todoInput');
const todoAdd = document.getElementById('todoAdd');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todoItems')) || [];

function saveTodos() {
    localStorage.setItem('todoItems', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';

        const span = document.createElement('span');
        span.textContent = todo.text;
        span.addEventListener('click', () => {
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        });

        li.appendChild(span);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}

todoAdd.addEventListener('click', () => {
    const text = todoInput.value.trim();
    if (!text) return;
    todos.push({ text, completed: false });
    todoInput.value = '';
    saveTodos();
    renderTodos();
});

renderTodos();

// Proyecto 3: Adivina el Número
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const guessMessage = document.getElementById('guessMessage');
const guessAttempts = document.getElementById('guessAttempts');
const guessReset = document.getElementById('guessReset');

let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function resetGuessGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    guessAttempts.textContent = attempts;
    guessMessage.textContent = 'Nuevo juego iniciado. Ingresa un número entre 1 y 100.';
    guessInput.value = '';
}

guessButton.addEventListener('click', () => {
    const value = Number(guessInput.value);
    if (!value || value < 1 || value > 100) {
        guessMessage.textContent = 'Ingresa un número válido entre 1 y 100.';
        return;
    }
    attempts += 1;
    guessAttempts.textContent = attempts;
    if (value === secretNumber) {
        guessMessage.textContent = '¡Correcto! Has adivinado el número.';
    } else if (value < secretNumber) {
        guessMessage.textContent = 'Muy bajo. Intenta un número más grande.';
    } else {
        guessMessage.textContent = 'Muy alto. Intenta un número más pequeño.';
    }
});

guessReset.addEventListener('click', resetGuessGame);
resetGuessGame();

// Proyecto 4: Calculadora Básica
const calcDisplay = document.getElementById('calcDisplay');
const calcButtons = document.querySelectorAll('.calculator-buttons button[data-value]');
const calcEqual = document.getElementById('calcEqual');
const calcClear = document.getElementById('calcClear');

let calcExpression = '';

function updateCalculatorDisplay(text) {
    calcDisplay.value = text;
}

calcButtons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        if (calcExpression === '0' && /[0-9]/.test(value)) {
            calcExpression = value;
        } else {
            calcExpression += value;
        }
        updateCalculatorDisplay(calcExpression);
    });
});

calcEqual.addEventListener('click', () => {
    try {
        const sanitized = calcExpression.replace(/[^0-9.+\-*/]/g, '');
        const result = Function(`"use strict"; return (${sanitized})`)();
        if (result === Infinity || result === -Infinity || Number.isNaN(result)) {
            updateCalculatorDisplay('Error');
        } else {
            calcExpression = String(result);
            updateCalculatorDisplay(calcExpression);
        }
    } catch {
        updateCalculatorDisplay('Error');
    }
});

calcClear.addEventListener('click', () => {
    calcExpression = '';
    updateCalculatorDisplay('0');
});

updateCalculatorDisplay('0');

// Proyecto 5: Cambiador de Colores Aleatorios
const colorChange = document.getElementById('colorChange');
const colorCode = document.getElementById('colorCode');
const copyColor = document.getElementById('copyColor');

function randomHexColor() {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`;
}

function applyBackgroundColor(color) {
    document.body.style.backgroundColor = color;
    colorCode.textContent = color;
}

colorChange.addEventListener('click', () => {
    const color = randomHexColor();
    applyBackgroundColor(color);
});

copyColor.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(colorCode.textContent);
        alert('Código copiado al portapapeles.');
    } catch (error) {
        alert('No se pudo copiar el código.');
    }
});

applyBackgroundColor('#ffffff');

// Proyecto 6: Temporizador
const timerMinutes = document.getElementById('timerMinutes');
const timerSeconds = document.getElementById('timerSeconds');
const timerDisplay = document.getElementById('timerDisplay');
const timerStart = document.getElementById('timerStart');
const timerPause = document.getElementById('timerPause');
const timerReset = document.getElementById('timerReset');
const timerMessage = document.getElementById('timerMessage');

let timerInterval = null;
let remainingSeconds = Number(timerMinutes.value) * 60 + Number(timerSeconds.value);

function updateTimerText() {
    const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const seconds = String(remainingSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    clearInterval(timerInterval);
    remainingSeconds = Number(timerMinutes.value) * 60 + Number(timerSeconds.value);
    timerMessage.textContent = '';
    timerInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timerMessage.textContent = '¡Tiempo terminado!';
            remainingSeconds = 0;
            updateTimerText();
            return;
        }
        remainingSeconds -= 1;
        updateTimerText();
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    remainingSeconds = Number(timerMinutes.value) * 60 + Number(timerSeconds.value);
    timerMessage.textContent = '';
    updateTimerText();
}

timerStart.addEventListener('click', startTimer);
timerPause.addEventListener('click', pauseTimer);
timerReset.addEventListener('click', resetTimer);
updateTimerText();

// Proyecto 7: Generador de Contraseñas
const passUpper = document.getElementById('passUpper');
const passLower = document.getElementById('passLower');
const passNumbers = document.getElementById('passNumbers');
const passSymbols = document.getElementById('passSymbols');
const passLength = document.getElementById('passLength');
const passLengthValue = document.getElementById('passLengthValue');
const passGenerate = document.getElementById('passGenerate');
const passCopy = document.getElementById('passCopy');
const passResult = document.getElementById('passResult');

const characterSets = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+[]{}|;:,.<>?'
};

function generatePassword() {
    let pool = '';
    if (passUpper.checked) pool += characterSets.upper;
    if (passLower.checked) pool += characterSets.lower;
    if (passNumbers.checked) pool += characterSets.numbers;
    if (passSymbols.checked) pool += characterSets.symbols;
    const length = Number(passLength.value);
    if (!pool) {
        passResult.textContent = 'Selecciona al menos un tipo de carácter.';
        return;
    }
    let password = '';
    for (let i = 0; i < length; i += 1) {
        password += pool[Math.floor(Math.random() * pool.length)];
    }
    passResult.textContent = password;
}

passLength.addEventListener('input', () => {
    passLengthValue.textContent = passLength.value;
});

passGenerate.addEventListener('click', generatePassword);
passCopy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(passResult.textContent);
        alert('Contraseña copiada.');
    } catch {
        alert('No se pudo copiar la contraseña.');
    }
});

// Proyecto 9: Piedra, Papel o Tijera
const rpsButtons = document.querySelectorAll('.rps-button');
const rpsResult = document.getElementById('rpsResult');
const rpsUserScore = document.getElementById('rpsUserScore');
const rpsComputerScore = document.getElementById('rpsComputerScore');
const rpsReset = document.getElementById('rpsReset');

let userScore = 0;
let computerScore = 0;

function getComputerChoice() {
    const options = ['piedra', 'papel', 'tijera'];
    return options[Math.floor(Math.random() * options.length)];
}

function determineWinner(user, computer) {
    if (user === computer) return 'Empate';
    if ((user === 'piedra' && computer === 'tijera') ||
        (user === 'papel' && computer === 'piedra') ||
        (user === 'tijera' && computer === 'papel')) {
        userScore += 1;
        return '¡Ganaste!';
    }
    computerScore += 1;
    return 'La computadora gana.';
}

rpsButtons.forEach(button => {
    button.addEventListener('click', () => {
        const userChoice = button.dataset.move;
        const computerChoice = getComputerChoice();
        const result = determineWinner(userChoice, computerChoice);
        rpsResult.textContent = `${result} Tú: ${userChoice} | Comp: ${computerChoice}`;
        rpsUserScore.textContent = userScore;
        rpsComputerScore.textContent = computerScore;
    });
});

rpsReset.addEventListener('click', () => {
    userScore = 0;
    computerScore = 0;
    rpsUserScore.textContent = '0';
    rpsComputerScore.textContent = '0';
    rpsResult.textContent = 'Marcador reiniciado. Juega otra vez.';
});

// Proyecto 10: Galería de Imágenes con Filtros
const galleryGrid = document.getElementById('galleryGrid');
const galleryFilters = document.querySelectorAll('.gallery-filter');
const gallerySearch = document.getElementById('gallerySearch');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

const images = [
    { category: 'animales', title:'Tigre hermoso', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuAGEs3h-xH2Uioh579PchsNzeaI0cvpI1cw&' },
    { category: 'animales', title: 'Elefante en la sabana', src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZFDn6rsT7oc5WPBjCBrNNsnelE18S__h3Ow&s' },
    { category: 'animales', title: 'Pájaro colorido', src: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS6niZdPd7-_5znpimosTGknHCS4-E9o--dHNsJaMaDT9N726oq' },
    { category: 'tecnologia', title: 'Laptop moderna', src: 'https://www.acerstore.cl/cdn/shop/articles/p-pasta-disipadora_jpg.jpg?v=1729285190&width=1100' },
    { category: 'tecnologia', title: 'Circuitos electrónicos', src: 'https://img.freepik.com/psd-premium/cyberpunk-matrix-estilo-lineas-hacker-simbolos-electrico-azul-ch-forma-y2k-colecciones-arte-luz-neon_1020495-191133.jpg?semt=ais_hybrid&w=740&q=80' },
    { category: 'tecnologia', title: 'Pantalla con código', src: 'https://media.istockphoto.com/id/892876552/es/foto/delito-inform%C3%A1tico.jpg?s=612x612&w=0&k=20&c=h1HTnIrMq2BSSd0VWViwIWtZ1Vj_OR77HoWVVVWcpKs=' },
    { category: 'naturaleza', title: 'Bosque verde', src: 'https://img.magnific.com/foto-gratis/paisaje-sol-brillando-sobre-bosque-verde-lleno-arboles-altos-otras-plantas_181624-11833.jpg?semt=ais_hybrid&w=740&q=80' },
    { category: 'naturaleza', title: 'Montañas al amanecer', src: 'https://thumbs.dreamstime.com/b/paisaje-de-la-monta%C3%B1a-en-el-amanecer-45021452.jpg' },
    { category: 'naturaleza', title: 'Cascada brillante', src: 'https://thumbs.dreamstime.com/b/una-cascada-brillante-en-naturaleza-m%C3%A1gicamente-hermosa-e-intacta-y-blanca-260726822.jpg' }
];

let activeFilter = 'all';
let searchTerm = '';

function renderGallery() {
    galleryGrid.innerHTML = '';
    const filteredImages = images.filter(image => {
        const matchesFilter = activeFilter === 'all' || image.category === activeFilter;
        const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filteredImages.forEach(image => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        const img = document.createElement('img');
        img.src = `${image.src}`;
        img.alt = image.title;
        const caption = document.createElement('p');
        caption.textContent = image.title;
        card.appendChild(img);
        card.appendChild(caption);
        card.addEventListener('click', () => {
            modalImage.src = image.src;
            modalCaption.textContent = `${image.title} (${image.category})`;
            imageModal.classList.remove('hidden');
        });
        galleryGrid.appendChild(card);
    });
}

galleryFilters.forEach(button => {
    button.addEventListener('click', () => {
        activeFilter = button.dataset.filter;
        galleryFilters.forEach(btn => btn.classList.toggle('active', btn === button));
        renderGallery();
    });
});

gallerySearch.addEventListener('input', event => {
    searchTerm = event.target.value;
    renderGallery();
});

modalClose.addEventListener('click', () => {
    imageModal.classList.add('hidden');
});

imageModal.addEventListener('click', event => {
    if (event.target === imageModal) {
        imageModal.classList.add('hidden');
    }
});

renderGallery();