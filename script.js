// Game configuration
const GRID_SIZE = 6; // 6x6 grid to accommodate larger pieces
let puzzle = [];
let currentLevel = 1;

// Character configurations
const characters = {
    // 2x2 blocks
    largeCharacters: ['harry', ],
    // 1x2 blocks (vertical)
    specialCharacters: ['thestral', 'dementor'],
    // 1x1 blocks
    supportingCharacters: [
        'hermione', 'ron', 'neville',
        'ginny', 'bellatrix', 'lucius',
        'draco', 'snape','voldemort'
    ]
};

// Level configurations
const levels = {
    1: {
        mainCharacter: 'harry',
        obstacles: ['thestral'],
        allies: ['hermione', 'ron']
    },
    2: {
        mainCharacter: 'harry',
        obstacles: ['thestral', 'dementor'],
        enemies: ['bellatrix', 'lucius']
    },
    3: {
        mainCharacter: 'harry',
        obstacles: ['dementor', 'dementor', 'thestral'],
        enemies: ['voldemort', 'bellatrix', 'lucius', 'draco']
    }
};

// Piece class to handle different sized characters
class Piece {
    constructor(character, width, height) {
        this.character = character;
        this.width = width;
        this.height = height;
        this.position = { x: 0, y: 0 };
    }
}

function startGame(level) {
    currentLevel = level;
    puzzle = [];
    initializePuzzle(level);
    renderPuzzle();
}

function initializePuzzle(level) {
    // Create empty grid
    for (let i = 0; i < GRID_SIZE; i++) {
        puzzle[i] = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            puzzle[i][j] = null;
        }
    }

    // Place characters based on level configuration
    const levelConfig = levels[level];
    
    // Place main character (Harry)
    placePiece(new Piece(levelConfig.mainCharacter, 2, 2), 0, 0);
    
    // Place obstacles (vertical 1x2 pieces)
    let obstacleX = GRID_SIZE - 1;
    levelConfig.obstacles.forEach(obstacle => {
        placePiece(new Piece(obstacle, 1, 2), obstacleX, 1);
        obstacleX--;
    });

    // Place other characters
    if (levelConfig.allies) {
        levelConfig.allies.forEach((ally, index) => {
            placePiece(new Piece(ally, 1, 1), 1, index + 3);
        });
    }

    if (levelConfig.enemies) {
        levelConfig.enemies.forEach((enemy, index) => {
            placePiece(new Piece(enemy, 1, 1), GRID_SIZE - 2, index + 1);
        });
    }
}

function placePiece(piece, x, y) {
    if (isValidPlacement(piece, x, y)) {
        piece.position = { x, y };
        for (let i = 0; i < piece.height; i++) {
            for (let j = 0; j < piece.width; j++) {
                puzzle[y + i][x + j] = piece;
            }
        }
    }
}

function isValidPlacement(piece, x, y) {
    if (x < 0 || y < 0 || x + piece.width > GRID_SIZE || y + piece.height > GRID_SIZE) {
        return false;
    }

    for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
            if (puzzle[y + i][x + j] !== null) {
                return false;
            }
        }
    }
    return true;
}

function renderPuzzle() {
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 80px)`;

    // Create empty cells first
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.className = 'tile';
            cell.dataset.row = i;
            cell.dataset.col = j;
            grid.appendChild(cell);
        }
    }

    // Add pieces on top of the grid
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const piece = puzzle[i][j];
            if (piece && piece.position.x === j && piece.position.y === i) {
                // Only create piece element for the top-left position of each piece
                const cell = document.createElement('div');
                cell.className = 'tile';
                
                // Set size attribute based on piece dimensions
                if (piece.width === 2 && piece.height === 2) {
                    cell.dataset.size = '2x2';
                } else if (piece.width === 1 && piece.height === 2) {
                    cell.dataset.size = '1x2';
                }

                const img = document.createElement('img');
                img.src = `images/${piece.character}.png`;
                cell.appendChild(img);
                
                // Position the piece absolutely within the grid
                cell.style.gridColumn = `${j + 1} / span ${piece.width}`;
                cell.style.gridRow = `${i + 1} / span ${piece.height}`;
                
                cell.onclick = () => movePiece(i, j);
                grid.appendChild(cell);
            }
        }
    }
}

function movePiece(i, j) {
    const piece = puzzle[i][j];
    if (!piece) return;

    // Define special movement patterns based on character type
    let possibleMoves = [];
    
    if (piece.character === 'thestral') {
        // Thestral can jump over one piece vertically
        possibleMoves = [
            { dx: 0, dy: -2 }, // jump up 2 spaces
            { dx: 0, dy: 2 },  // jump down 2 spaces
            { dx: 0, dy: -1 }, // move up 1 space
            { dx: 0, dy: 1 },  // move down 1 space
            { dx: -1, dy: 0 }, // move left
            { dx: 1, dy: 0 }   // move right
        ];
    } else if (piece.character === 'dementor') {
        // Dementor can only move vertically
        possibleMoves = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 }   // down
        ];
    } else {
        // Standard moves for other characters
        possibleMoves = [
            { dx: 0, dy: -1 }, // up
            { dx: 0, dy: 1 },  // down
            { dx: -1, dy: 0 }, // left
            { dx: 1, dy: 0 }   // right
        ];
    }

    // Try each possible move
    for (const move of possibleMoves) {
        const newX = piece.position.x + move.dx;
        const newY = piece.position.y + move.dy;

        if (canMove(piece, newX, newY)) {
            // For Thestral's jump movement
            if (Math.abs(move.dy) === 2) {
                // Check if there's a piece to jump over
                const middleY = piece.position.y + (move.dy / 2);
                if (puzzle[middleY][piece.position.x] === null) {
                    continue; // Can't jump over empty space
                }
            }

            // Clear current position
            for (let y = piece.position.y; y < piece.position.y + piece.height; y++) {
                for (let x = piece.position.x; x < piece.position.x + piece.width; x++) {
                    puzzle[y][x] = null;
                }
            }

            // Move to new position
            placePiece(piece, newX, newY);
            renderPuzzle();
            checkWinCondition();
            break;
        }
    }
}

function canMove(piece, newX, newY) {
    if (newX < 0 || newY < 0 || 
        newX + piece.width > GRID_SIZE || 
        newY + piece.height > GRID_SIZE) {
        return false;
    }

    // Check if the new position is empty
    for (let i = 0; i < piece.height; i++) {
        for (let j = 0; j < piece.width; j++) {
            if (puzzle[newY + i][newX + j] !== null && 
                puzzle[newY + i][newX + j] !== piece) {
                return false;
            }
        }
    }
    return true;
}

function checkWinCondition() {
    const mainPiece = puzzle[0][0];
    if (mainPiece && mainPiece.character === levels[currentLevel].mainCharacter &&
        mainPiece.position.x === GRID_SIZE - mainPiece.width &&
        mainPiece.position.y === GRID_SIZE - mainPiece.height) {
        document.getElementById('message').textContent = 'Level Complete!';
        setTimeout(() => {
            if (currentLevel < 3) {
                startGame(currentLevel + 1);
            } else {
                document.getElementById('message').textContent = 'Congratulations! You completed all levels!';
            }
        }, 1500);
    }
}

// Game state
let steps = 0;
let bestScores = {};
let selectedPiece = null;
let isDragging = false;
let startX, startY;

// Character definitions
const CHARACTERS = {
    HARRY: { type: 'main', size: '2x2', image: 'images/harry.png' },
    THESTRAL: { type: 'vertical', size: '1x2', image: 'images/thestral.png' },
    DEMENTOR: { type: 'vertical', size: '1x2', image: 'images/dementor.png' },
    TRAIN: { type: 'horizontal', size: '2x1', image: 'images/train.png' },
    CASTLE: { type: 'horizontal', size: '2x1', image: 'images/castle.png' },
    HERMIONE: { type: 'small', size: '1x1', image: 'images/hermione.png' },
    RON: { type: 'small', size: '1x1', image: 'images/ron.png' },
    DRACO: { type: 'small', size: '1x1', image: 'images/draco.png' },
    SNAPE: { type: 'small', size: '1x1', image: 'images/snape.png' },
    BELLATRIX: { type: 'small', size: '1x1', image: 'images/bellatrix.png' },
    VOLDEMORT: { type: 'small', size: '1x1', image: 'images/voldemort.png' },
    LUCIUS: { type: 'small', size: '1x1', image: 'images/lucius.png' },
    NEVILLE: { type: 'small', size: '1x1', image: 'images/neville.png' },
    GINNY: { type: 'small', size: '1x1', image: 'images/ginny.png' }
};

// Level configurations
const LEVELS = {
    1: {
        pieces: [
            { id: 'HARRY', x: 1, y: 0 },      // 2x2 main character
            { id: 'THESTRAL', x: 0, y: 0 },   // 1x2 vertical
            { id: 'TRAIN', x: 0, y: 2 },      // 2x1 horizontal
            { id: 'RON', x: 2, y: 2 },        // 1x1
            { id: 'HERMIONE', x: 3, y: 3 },   // 1x1 - moved to prevent overlap
            { id: 'DRACO', x: 0, y: 3 },      // 1x1
            { id: 'SNAPE', x: 2, y: 3 }       // 1x1
        ]
    },
    2: {
        pieces: [
            { id: 'HARRY', x: 1, y: 0 },
            { id: 'DEMENTOR', x: 0, y: 0 },
            { id: 'CASTLE', x: 2, y: 2 },
            { id: 'THESTRAL', x: 3, y: 0 },
            { id: 'BELLATRIX', x: 0, y: 2 },
            { id: 'VOLDEMORT', x: 0, y: 3 },
            { id: 'LUCIUS', x: 3, y: 3 },
            { id: 'NEVILLE', x: 1, y: 2 }
        ]
    },
    3: {
        pieces: [
            { id: 'HARRY', x: 1, y: 0 },
            { id: 'DEMENTOR', x: 0, y: 0 },
            { id: 'THESTRAL', x: 3, y: 0 },
            { id: 'TRAIN', x: 0, y: 2 },
            { id: 'CASTLE', x: 2, y: 3 },
            { id: 'GINNY', x: 2, y: 2 },
            { id: 'BELLATRIX', x: 3, y: 2 },
            { id: 'VOLDEMORT', x: 0, y: 4 },
            { id: 'LUCIUS', x: 3, y: 4 }
        ]
    }
};

// Initialize the game
function initGame() {
    loadBestScores();
    setupEventListeners();
    loadLevel(currentLevel);
    updateUI();
}

// Load saved best scores
function loadBestScores() {
    const saved = localStorage.getItem('harryPotterPuzzleBestScores');
    if (saved) {
        bestScores = JSON.parse(saved);
    }
}

// Save best score
function saveBestScore() {
    if (!bestScores[currentLevel] || steps < bestScores[currentLevel]) {
        bestScores[currentLevel] = steps;
        localStorage.setItem('harryPotterPuzzleBestScores', JSON.stringify(bestScores));
        showMessage('New Best Score!', 'achievement');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Game control buttons
    document.getElementById('restart-btn').addEventListener('click', () => loadLevel(currentLevel));
    document.getElementById('prev-level').addEventListener('click', () => loadLevel(currentLevel - 1));
    document.getElementById('next-level').addEventListener('click', () => loadLevel(currentLevel + 1));
    
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress, { passive: false });
    
    // Prevent scrolling when using arrow keys
    window.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
             'Up', 'Down', 'Left', 'Right', ' ', 'Spacebar'].includes(e.key)) {
            if (selectedPiece || e.target.closest('.block')) {
                e.preventDefault();
                return false;
            }
        }
    }, { passive: false });
    
    // Clear selection when clicking outside pieces
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.block')) {
            document.querySelectorAll('.block').forEach(block => block.classList.remove('selected'));
            selectedPiece = null;
        }
    });
}

// Handle keyboard input
function handleKeyPress(e) {
    if (!selectedPiece) return;
    
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight',
                      'Up', 'Down', 'Left', 'Right'];
                      
    if (arrowKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        
        let direction;
        switch(e.key) {
            case 'ArrowUp':
            case 'Up':
                direction = 'up';
                break;
            case 'ArrowDown':
            case 'Down':
                direction = 'down';
                break;
            case 'ArrowLeft':
            case 'Left':
                direction = 'left';
                break;
            case 'ArrowRight':
            case 'Right':
                direction = 'right';
                break;
            default:
                return;
        }
        
        if (tryMove(direction)) {
            // Add visual feedback for successful move
            selectedPiece.classList.add('moving');
            setTimeout(() => {
                selectedPiece.classList.remove('moving');
            }, 150);
        }
    }
}

// Create a game piece
function createPiece({ id, x, y }) {
    const char = CHARACTERS[id];
    const element = document.createElement('div');
    
    element.className = `block ${char.type}`;
    element.dataset.id = id;
    element.style.gridColumn = `${x + 1} / span ${char.size === '2x2' || char.size === '2x1' ? 2 : 1}`;
    element.style.gridRow = `${y + 1} / span ${char.size === '2x2' || char.size === '1x2' ? 2 : 1}`;
    
    const img = document.createElement('img');
    img.src = char.image;
    img.alt = id.toLowerCase();
    element.appendChild(img);
    
    // Add click handler for selection
    element.addEventListener('click', selectPiece);
    
    // Add drag handlers
    element.addEventListener('mousedown', startDrag);
    element.addEventListener('touchstart', startDrag, { passive: false });
    
    return element;
}

// Handle piece click
function selectPiece(e) {
    e.preventDefault();
    const piece = e.currentTarget;
    
    // Remove selection from all other pieces
    document.querySelectorAll('.block').forEach(block => {
        block.classList.remove('selected');
    });
    
    // Select this piece
    piece.classList.add('selected');
    selectedPiece = piece;
}

// Load level
function loadLevel(level) {
    if (level < 1 || level > Object.keys(LEVELS).length) return;
    
    currentLevel = level;
    steps = 0;
    selectedPiece = null;
    
    const grid = document.getElementById('puzzle-grid');
    grid.innerHTML = '';
    
    // Create exit zone
    const exitZone = document.createElement('div');
    exitZone.className = 'exit-zone';
    exitZone.style.gridRow = '5';
    exitZone.style.gridColumn = '1 / span 2';
    grid.appendChild(exitZone);
    
    // Create pieces
    LEVELS[level].pieces.forEach(piece => {
        const element = createPiece(piece);
        grid.appendChild(element);
    });
    
    updateUI();
}

// Start dragging
function startDrag(e) {
    e.preventDefault();
    
    // Only handle left mouse button
    if (e.type === 'mousedown' && e.button !== 0) return;
    
    const piece = e.target.closest('.block');
    if (!piece) return;
    
    // Remove selection from other pieces
    document.querySelectorAll('.block').forEach(block => {
        if (block !== piece) block.classList.remove('selected');
    });
    
    selectedPiece = piece;
    isDragging = true;
    piece.classList.add('selected');
    
    // Store initial touch/mouse position
    if (e.type === 'mousedown') {
        startX = e.clientX;
        startY = e.clientY;
    } else {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }
    
    // Add event listeners for drag and release
    if (e.type === 'mousedown') {
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    } else {
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }
}

// Handle dragging
function drag(e) {
    if (!isDragging || !selectedPiece) return;
    e.preventDefault();
    
    const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
    
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const threshold = 30; // Minimum pixels to trigger a move
    
    // Only move if we exceed the threshold
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        let direction = '';
        
        // Determine primary direction of movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
        } else {
            direction = deltaY > 0 ? 'down' : 'up';
        }
        
        // Try to move and reset start position if successful
        if (tryMove(direction)) {
            startX = currentX;
            startY = currentY;
        }
    }
}

// Stop dragging
function stopDrag() {
    if (selectedPiece) {
        selectedPiece.classList.remove('dragging');
    }
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
}

// Try to move a piece
function tryMove(direction) {
    if (!selectedPiece) return false;
    
    const currentCol = parseInt(selectedPiece.style.gridColumn);
    const currentRow = parseInt(selectedPiece.style.gridRow);
    
    const isMain = selectedPiece.classList.contains('main');
    const isHorizontal = selectedPiece.classList.contains('horizontal');
    const isVertical = selectedPiece.classList.contains('vertical');
    
    const colSpan = isMain || isHorizontal ? 2 : 1;
    const rowSpan = isMain || isVertical ? 2 : 1;
    
    let newCol = currentCol;
    let newRow = currentRow;
    
    // Calculate new position based on direction
    switch(direction) {
        case 'up':
            if (currentRow <= 1) return false;
            newRow--;
            break;
        case 'down':
            if (currentRow + rowSpan > 5) return false;
            newRow++;
            break;
        case 'left':
            if (currentCol <= 1) return false;
            newCol--;
            break;
        case 'right':
            if (currentCol + colSpan > 4) return false;
            newCol++;
            break;
    }
    
    // Check if move is valid
    if (canMove(selectedPiece, newCol, newRow)) {
        selectedPiece.style.gridColumn = `${newCol} / span ${colSpan}`;
        selectedPiece.style.gridRow = `${newRow} / span ${rowSpan}`;
        steps++;
        updateUI();
        checkWin();
        return true;
    }
    
    return false;
}

// Check if a move is valid
function canMove(piece, newCol, newRow) {
    const pieces = document.getElementsByClassName('block');
    
    // Get piece dimensions
    const isMain = piece.classList.contains('main');
    const isHorizontal = piece.classList.contains('horizontal');
    const isVertical = piece.classList.contains('vertical');
    const pieceColSpan = isMain || isHorizontal ? 2 : 1;
    const pieceRowSpan = isMain || isVertical ? 2 : 1;
    
    // Check grid boundaries
    if (newCol < 1 || newRow < 1 || 
        newCol + pieceColSpan - 1 > 4 || 
        newRow + pieceRowSpan - 1 > 5) {
        return false;
    }
    
    // Check collision with other pieces
    for (let other of pieces) {
        if (other === piece) continue;
        
        const otherCol = parseInt(other.style.gridColumn);
        const otherRow = parseInt(other.style.gridRow);
        
        // Get other piece dimensions
        const otherMain = other.classList.contains('main');
        const otherHorizontal = other.classList.contains('horizontal');
        const otherVertical = other.classList.contains('vertical');
        const otherColSpan = otherMain || otherHorizontal ? 2 : 1;
        const otherRowSpan = otherMain || otherVertical ? 2 : 1;
        
        // Check for overlap
        const horizontalOverlap = 
            newCol + pieceColSpan - 1 >= otherCol && 
            newCol <= otherCol + otherColSpan - 1;
            
        const verticalOverlap = 
            newRow + pieceRowSpan - 1 >= otherRow && 
            newRow <= otherRow + otherRowSpan - 1;
        
        if (horizontalOverlap && verticalOverlap) {
            return false;
        }
    }
    
    return true;
}

// Check for win condition
function checkWin() {
    const harry = document.querySelector('.block.main');
    if (harry && harry.style.gridRow === '4' && harry.style.gridColumn === '1 / span 2') {
        saveBestScore();
        showMessage('Level Complete!', 'achievement');
        document.getElementById('next-level').disabled = currentLevel >= Object.keys(LEVELS).length;
    }
}

// Update UI elements
function updateUI() {
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('step-count').textContent = steps;
    document.getElementById('best-score').textContent = bestScores[currentLevel] || '-';
    
    document.getElementById('prev-level').disabled = currentLevel <= 1;
    document.getElementById('next-level').disabled = currentLevel >= Object.keys(LEVELS).length;
}

// Show message
function showMessage(text, className = '') {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = className;
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = '';
    }, 2000);
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
