**FIFA World Cup 2026 Predictor**

A web-based interactive simulator for predicting the 2026 FIFA World Cup tournament. This tool allows users to simulate group stage results, playoff matches, and the entire knockout bracket based on real FIFA rules and rankings.

**Live Demo**

Try the live version at: https://ismailoksuz.github.io/FIFA-World-Cup-2026-Predictor/

**Features**

- **Dual Prediction Modes**: 
  - **Score Mode**: Enter exact match scores for realistic simulations
  - **Ranking Mode**: Drag-and-drop teams to rank groups visually
- **Playoff Path Selection**: Choose winners for UEFA and Intercontinental playoff paths
- **Group Stage Prediction**: Enter scores or rank teams across 12 groups
- **Automatic Qualification**: Automatically calculates group standings and qualifiers
- **Knockout Bracket**: Interactive knockout phase with click-to-advance functionality
- **FIFA Rules Compliant**: Implements official FIFA third-place qualification rules
- **Real-time Updates**: Live updates as scores are entered or rankings changed
- **Random Score Generator**: One-click random score filling for quick simulations
- **Responsive Design**: Works on desktop and mobile devices

**How It Works**

**Score Mode:**
1. **Select Playoff Winners**: Choose winners from UEFA Paths A-D and Intercontinental Pathways 1-2
2. **Enter Group Scores**: Input scores for all 6 matches in each of the 12 groups
3. **View Knockout Stage**: The bracket automatically populates with qualified teams
4. **Predict Knockout Matches**: Click on teams to advance them through the bracket
5. **Crown the Champion**: Follow the tournament through to the final winner

**Ranking Mode:**
1. **Select Playoff Winners**: Choose winners from UEFA Paths A-D and Intercontinental Pathways 1-2
2. **Drag & Drop Ranking**: Visually arrange teams in each group by dragging
3. **Select Third-Place Teams**: Manually choose the best 8 third-place teams
4. **View Knockout Stage**: The bracket populates with your ranked teams
5. **Predict Knockout Matches**: Click on teams to advance them through the bracket
6. **Crown the Champion**: Follow the tournament through to the final winner

**Technical Implementation**

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Drag & Drop**: Native HTML5 Drag and Drop API with custom ranking logic
- **Data Structures**: 
  - Group standings calculated with tie-breakers (points, goal difference, goals scored, FIFA ranking)
  - Third-place qualification based on official FIFA combinations (495 scenarios)
  - Knockout bracket with automatic propagation of winners
- **External Data**:
  - Team flags via FIFA API
  - FIFA rankings for tie-breaking
  - Official third-place matchup tables

**Project Structure**

- `index.html` - Main HTML file
- `style.css` - All styling
- `script.js` - Core application logic
- `best3-data.js` - Third-place qualification scenarios
- `fifarank.js` - FIFA team rankings

**Usage Instructions**

1. Open `index.html` in a modern web browser or visit the live demo
2. Select winners for all playoff paths
3. Choose your prediction mode:
   - **Score Mode**: Enter scores for all group matches (or use "Fill Random Scores")
   - **Ranking Mode**: Drag teams to rank them, then select the best 8 third-place teams
4. Click teams in the knockout bracket to advance them
5. The champion is automatically determined in the final

**Key Algorithms**

- **Group Standings Calculation**: Sorts teams by points, goal difference, goals scored, FIFA ranking
- **Drag & Drop Ranking**: Visual team positioning with persistent state management
- **Third-Place Qualification**: Identifies best 8 third-place teams and matches them correctly using official FIFA tables
- **Knockout Propagation**: Winners automatically advance to appropriate next-round matches
- **Bracket Rendering**: Dynamically generates bracket based on current results

**Browser Compatibility**

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Author**

İsmail ÖKSÜZ
- GitHub: https://github.com/ismailoksuz

**License**

This project is available for educational and personal use.
