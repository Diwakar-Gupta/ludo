import { createStore } from "redux";
import {produce} from "immer";
import initialState from "./initialState";
import { pieceRemove, hash, pieceNextCellFor, pieceAdd } from './initialState';

export function currentPlayerColor(state){
    return state.turn.all[state.turn.currentTurn];
}

function rollDice(state){
    const value = Math.round(Math.random()*5)+1;

    return produce(state, draft => {
        draft.dice.rollable = false;
        draft.dice.valueSet = true;
        draft.dice.value = value;

        let color = currentPlayerColor(state);
        let meta = canColorMove(color, value, state);
        if(meta.length === 0){
            resetDice(draft);
            changeTurnNextPlayer(draft);
            console.log("You can't move any piece with this steps");
        } else if(meta.length === 1) {
            let {piece, currentCell, nThCell} = meta[0];
            movePiece(state, draft, piece, currentCell, nThCell, value);
        }
    });
}

function cloneCell(cell){
    return {
        ...cell,
        pieces: [...cell.pieces],
    };
}

function clonePiece(piece){
    return {
        ...piece,
    };
}

function resetDice(draft){
    draft.dice.rollable = true;
    draft.dice.valueSet = false;
}

function changeTurnNextPlayer(draft){
    draft.turn.currentTurn+=1;
    if(draft.turn.currentTurn === draft.turn.all.length){
        draft.turn.currentTurn=0;
    }
}

// return false
// return {currentCell, newCell}
function canPieceMove(piece, value, state){
    let currentCell = state.cells[piece.cell];

    if(currentCell.index >= 18){
        if(value === 6){
            let nThCellHash = pieceNextCellFor(currentCell, piece.color);
            let nThCell = state.cells[nThCellHash];
            return {currentCell, nThCell};
        } else {
            return undefined;
        }
    } else {
        let nThCell = currentCell;
        for(let i=0;i<value;i++){
            nThCell = pieceNextCellFor(nThCell, piece.color);
            if(!nThCell){
                return undefined;
            }
            nThCell = state.cells[nThCell];
        }
        return {currentCell, nThCell};
    }
}
// return false
// return [
//     {piece, currentCell, nThCell},
//     {piece, currentCell, nThCell}
// ]
function canColorMove(color, value, state){
    let allPiecesHashForColor = state.homeInfo[color].all;
    let meta=[];

    for(let i=0;i<allPiecesHashForColor.length;i++){
        let piece = state.pieces[allPiecesHashForColor[i]];

        let metaTmp = canPieceMove(piece, value, state);
        if(metaTmp){
            let d = {
                ...metaTmp,
                piece: piece,
            };
            meta.push(d);
        }
    }
    return meta;
}

function pieceCompleted(piece, state, draft){
    let color = piece.color;
    let allPieceInfo = state.homeInfo[color];
    allPieceInfo = {
        ...allPieceInfo,
        all: [...allPieceInfo.all],
        completed: [...allPieceInfo.completed],
    };
    allPieceInfo.completed.push(hash(piece));
    draft.homeInfo[color] = allPieceInfo;
    console.log('completed');
    console.log(piece);
}

function pieceClicked(state, piece){
    if(!state.dice.valueSet){
        console.log('Roll Dice first');
        return state;
    }
    if(state.turn.all[state.turn.currentTurn] !== piece.color){
        console.log('Not your turn');
        return state;
    }
    const value = state.dice.value;

    let meta = canPieceMove(piece, value, state);
    if(!meta){
        meta = canColorMove(piece.color, value, state);
        if(meta.length === 0){
            console.log("You can't move any piece with this steps");
            return produce(state, draft => {
                resetDice(draft);
                changeTurnNextPlayer(draft);
            });
        } else {
            console.log('Try different piece');
            return state;
        }
    }
    let {currentCell, nThCell} = meta;

    let newState = produce(state, draft => {
        movePiece(state, draft, piece, currentCell, nThCell, value);
    });
    
    return newState;
}

function movePiece(state, draft, piece, currentCell, nThCell, value){
    piece = clonePiece(piece);
    currentCell = cloneCell(currentCell);
    nThCell = cloneCell(nThCell);
    
    pieceRemove(currentCell, piece);
    let removedPieces = pieceAdd(nThCell, state, piece);

    const currPieceCompleted = piece.cell === 'final0';
    if(currPieceCompleted){
        pieceCompleted(piece, state, draft);
    }

    const remainingPieceLength = draft.homeInfo[piece.color].all.length - draft.homeInfo[piece.color].completed.length;

    // next player
    if(remainingPieceLength>0 && (removedPieces.length > 0 || value===6 || currPieceCompleted)){
        // turn with current player
    } else {
        changeTurnNextPlayer(draft);
    }

    removedPieces.forEach(piceHash => {
        let piece = state.pieces[piceHash];
        piece = {...piece};
        delete piece.cell;
        let color = piece.color;

        for(let i=18;i<22;i++){
            let homeCell = state.cells[hash({color, index: i})];
            
            if(homeCell.pieces.length === 0){
                homeCell = cloneCell(homeCell);
                pieceAdd(homeCell, state, piece);
                draft.cells[hash(homeCell)] = homeCell;
                draft.pieces[hash(piece)] = piece;
                return;
            }
        }
    });

    draft.pieces[hash(piece)] = piece;
    draft.cells[hash(currentCell)] = currentCell;
    draft.cells[hash(nThCell)] = nThCell;

    resetDice(draft);
}

function reducer(state, action){
    if(!state){
        return initialState();
    }
    switch (action.type) {
        case 'RollDice':{
            return rollDice(state);
        }
        case 'PieceClicked':{
            return pieceClicked(state, action.payload);
        }
        case 'reset':{
            return initialState();
        }
        default: {
            return state;
        }
    }
}

const store = createStore(reducer);

export default store;