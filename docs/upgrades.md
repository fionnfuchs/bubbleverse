# Upgrades
## Adding Upgrades
Step by step: 
- Add upgrade modifier (influences the game logic) in `game.js:MODIFIERS` 
- Add upgrade data (cost and modifier values) in `game.js:UPGRDATA` 
- Update modifiers from upgrade data in  `game.js:calculateTempValues()` 
- Add upgrade ui in html 
- Update new ui elements in `updateUI()` in `ui.js` 
- Add `click()` to button in  `initializeButtons()` 