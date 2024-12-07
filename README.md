# Harry Potter Sliding Puzzle Game 

A magical sliding puzzle game featuring characters from the Harry Potter universe! Help Harry navigate through Hogwarts while avoiding Dementors and Death Eaters.

## How to Play

1. **Starting the Game**
   - Open `index.html` in your web browser
   - Click on one of the level buttons to start playing
   - Level 1 is recommended for beginners

2. **Game Objective**
   - Move Harry (2x2 piece) to the bottom-right corner of the grid
   - Navigate through obstacles and enemies
   - Complete all three levels to win the game

3. **Moving Pieces**
   - Click on any character to move them
   - Pieces can only move if there's an empty space adjacent to them
   - Different characters have different sizes and movement patterns

4. **Character Types**

### Large Characters (2x2 Blocks)
- **Harry**: The main character you need to guide to victory
- **Voldemort**: A formidable obstacle in advanced levels

### Special Characters (2x1 Blocks)
- **Thestral**: A magical flying creature that creates vertical escape paths
- **Dementor**: Dark creatures that block vertical paths

### Supporting Characters (1x1 Blocks)
- **Hermione & Ron**: Your faithful allies
- **Bellatrix, Lucius & Draco**: Death Eaters who try to block your path
- **Other characters**: Various Hogwarts students and staff

## How to Control Characters

1. **Selecting Characters**
   - Simply click on the character you want to move
   - The character must have an empty adjacent space to be moveable
   - If a character can't move, clicking on it won't do anything

2. **Moving Characters**
   - After clicking a character, it will automatically move to an available adjacent space
   - Characters will move in the direction where there is an empty space
   - For characters that can move in multiple directions:
     - If there are multiple empty spaces, the character will move in this priority:
     - Try to move up first
     - Then try to move down
     - Then try to move left
     - Finally try to move right

3. **Special Movement Controls**
   - **Thestral**:
     - Click once to move normally to an adjacent space
     - If there's a piece one space away and an empty space two spaces away vertically,
       the Thestral will automatically jump over the piece

   - **Dementor**:
     - Can only move up or down
     - Click to move to the next available vertical space

   - **Large Characters (Harry, Voldemort)**:
     - Need a 2x2 empty space to move into
     - Click to move when there's enough space available

4. **Movement Tips**
   - Plan your moves carefully before clicking
   - Look for available empty spaces around each character
   - Remember that larger characters (2x2) need more empty space to move
   - If a character doesn't move when clicked, look for obstacles blocking its path

## Character Movement Patterns

Each character type has unique movement abilities that you can use strategically:

### Large Characters (2x2 Blocks)
- **Harry & Voldemort**: Can move in all four directions (up, down, left, right)
- Need more space to move due to their larger size
- Must plan carefully as they can get blocked easily

### Special Characters (2x1 Blocks)
- **Thestral**:
  - Can move in all directions
  - Special ability: Can jump over one piece vertically (up or down)
  - Use this ability to bypass blocked paths
  - Perfect for creating escape routes for Harry

- **Dementor**:
  - Can only move vertically (up and down)
  - Use this limitation to your advantage by positioning them away from critical paths

### Supporting Characters (1x1 Blocks)
- **All 1x1 characters**: Can move in all four directions
- Easier to maneuver due to their small size
- Use them to clear paths for larger pieces

## Strategic Tips
1. Use Thestrals to:
   - Jump over blocking pieces
   - Create quick escape routes
   - Help move other pieces out of Harry's way

2. Work around Dementors by:
   - Using their vertical-only movement to predict their possible positions
   - Creating horizontal escape routes where they can't follow

3. Use the small characters to:
   - Clear paths for Harry
   - Block enemy movements
   - Create temporary diversions

## Difficulty Levels

### Level 1: Introduction
- Features Harry, a Thestral, and your closest allies
- Simple escape paths with moderate challenge
- Perfect for learning the game mechanics

### Level 2: Increased Difficulty
- Introduces Dementors and Death Eaters
- More complex paths and strategic blocking
- Requires careful planning to succeed

### Level 3: Maximum Challenge
- Multiple Dementors patrol the halls
- Full complement of Death Eaters
- Most challenging escape paths
- Test your mastery of the game mechanics

## Tips for Success
1. Plan your moves carefully - sometimes you need to move other pieces to clear a path for Harry
2. Use the Thestrals to your advantage - they can help create escape routes
3. Watch out for Dementors blocking vertical paths
4. Try to keep enemy pieces away from your intended escape route
5. Sometimes you need to make temporary moves to set up a better position

## Technical Requirements
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- JavaScript enabled
- All character images (`.png` format) must be in the `images` folder

## Files Included
- `index.html`: Main game file
- `styles.css`: Game styling
- `script.js`: Game logic and mechanics
- `images/`: Directory containing all character images

## Play Now! 
[Click here to play the game](https://YOUR_GITHUB_USERNAME.github.io/harry-potter-slidingPuzzle-game)

## Game Features 
- Three challenging levels with increasing difficulty
- Multiple character blocks:
  - Harry Potter (2x2)
  - Magical creatures (1x2): Thestral and Dementor
  - Locations (2x1): Hogwarts Express and Castle
  - Various characters (1x1): Hermione, Ron, and more!
- Intuitive controls:
  - Click/tap to select
  - Arrow keys or drag to move
  - Touch-screen friendly
- Best score tracking
- Magical visual effects

## Local Development 
1. Clone the repository:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/harry-potter-slidingPuzzle-game.git
```

2. Open `index.html` in your browser to play locally

## Technologies Used 
- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage for score tracking

## License 
This project is for educational purposes only. Harry Potter characters and related elements are trademarks of and  Warner Bros. Entertainment Inc.

## Credits 
- Game Design & Development: [Your Name]
- Character Images: Harry Potter Movie Series
- Background Images: Hogwarts Great Hall

Enjoy playing the Harry Potter Sliding Puzzle Game! May your path to victory be magical! 
