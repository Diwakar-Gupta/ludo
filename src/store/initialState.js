export function hash({color, index}){
    return `${color}${index}`;
}

function Cell(color, index){
    this.index = index;
    this.color=color;
    this.pieces = [];
}

export function pieceAdd(self, draft, piece){
    self.pieces = [...self.pieces];
    if(self.isSafe){
        self.pieces.push(hash(piece));
        piece.cell = hash(self);
        return [];
    } else {
        let newPiece = [hash(piece)];
        piece.cell = hash(self);
        let removed = [];
        self.pieces.forEach(piece2Hash => {
            let piece2 = draft.pieces[piece2Hash];
            if(piece.color === piece2.color){
                newPiece.push(piece2Hash);
            } else {
                removed.push(piece2Hash);
            }
        });
        self.pieces = newPiece;
        return removed;
    }
}

export function pieceRemove(self, piece){
    self.pieces = [...self.pieces];  
    const index = self.pieces.findIndex(pieceHash => pieceHash === hash(piece));
    if(index !== -1){
        self.pieces.splice(index, 1);
    }
}

export function pieceNextCellFor(self, color){
    if(self.nextColorCell?.[color]){
        return self.nextColorCell?.[color];
    } else {
        return self.nextCell;
    }
}


function Piece(color, index){
    this.index = index;
    this.color=color;
}

function mapCellProps(cell){
    if(cell.index === 2 || cell.index === 16){
        cell.isSafe=true;
    }
    if([16, 10, 9, 8, 7, 6].includes(cell.index)){
        cell.isColoredCell = true;
    }
}

function getCells(num, color){
    let cells = [];
    for(let i=0;i<num;i++){
        let cell = new Cell(color, i);
        cells.push(cell);
        mapCellProps(cell);
    }
    return cells;
}

function mapNextCell({red, blue,yellow, green, finalCell}){
    let allPaths = [red, blue, yellow, green];

    allPaths.forEach(cells => {
        for(let i=0;i<5;i++){
            cells[i].nextCell = hash(cells[i+1]);
        }

        cells[5].nextCell = hash(cells[11]);
        cells[11].nextCell = hash(cells[17]);

        for(let i=17;i>=13;i--){
            cells[i].nextCell = hash(cells[i-1]);
        }

        cells[6].nextCell = hash(finalCell);
    });
    for(let i=7;i<=11;i++){
        red[i].nextColorCell = {
            'red': hash(red[i-1])
        };
        blue[i].nextColorCell = {
            'blue': hash(blue[i-1])
        };
        yellow[i].nextColorCell = {
            'yellow': hash(yellow[i-1])
        };
        green[i].nextColorCell = {
            'green': hash(green[i-1])
        };
    }

    red[12].nextCell = hash(blue[0]);
    blue[12].nextCell = hash(yellow[0]);
    yellow[12].nextCell = hash(green[0]);
    green[12].nextCell = hash(red[0]);

    allPaths.forEach(cells => {
        for(let i=18;i<cells.length;i++){
            cells[i].nextCell = hash(cells[16]);
        }
    });
}

function putCellsInState(state, red, blue, yellow, green){
    let allPaths = [red, blue, yellow, green];

    allPaths.forEach(cells => {
        cells.forEach(cell => {
            state.cells[hash(cell)] = cell;
        });
    });
}

function initialState(initState = {'green': 4, 'blue': 4, 'red': 4, 'yellow': 4}){
    let state = {};
    
    let red = getCells(22, 'red');
    let blue = getCells(22, 'blue');
    let yellow = getCells(22, 'yellow');
    let green = getCells(22, 'green');

    let finalCell = new Cell('final', 0); // hash should be final0
    finalCell.isSafe = true;
    mapNextCell({red, blue, yellow, green, finalCell});

    // Insert Cell in state
    state.cells = {};
    state.cells[hash(finalCell)] = finalCell;
    putCellsInState(state, red, blue, yellow, green);

    // Insert Turn in state
    state.turn={all:[], currentTurn: 0};
    ['red', 'blue', 'yellow', 'green'].forEach((color) => {
        if(initState[color]){
            state.turn.all.push(color);
        }
    });
    state.turn.currentTurn = Math.round(Math.random()*(state.turn.all.length-1));
    
    // Insert Piece in state
    state.pieces={};
    state.homeInfo={};
    Object.keys(initState).forEach(color => {
        let num = initState[color];
        state.homeInfo[color] = {all:[], completed:[]};

        for(let i=0;i<num;i++){
            let piece = new Piece(color, i);
            pieceAdd(state.cells[hash({color, index:i+18})], state, piece);
            
            state.pieces[hash(piece)] = piece;
            state.homeInfo[color].all.push(hash(piece));
        }
    });

    // Leader board
    state.leaderboard={}

    // Insert Dice in state
    state.dice = {
        rollable : true,
        valueSet : false,
    };
    
    return state;
}

export default initialState;