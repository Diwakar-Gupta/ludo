import { createStore } from "redux";
import {produce} from "immer";
import initialState from "./initialState";
import { pieceRemove, hash, pieceNextCellFor, pieceAdd } from './initialState';

function rollDice(state){
    const value = Math.round(Math.random()*5)+1;

    return produce(state, draft => {
        draft.dice.rollable = false;
        draft.dice.valueSet = true;
        draft.dice.value = value;
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

function pieceClicked(state, piece){
    if(state.turn.all[state.turn.currentTurn] !== piece.color){
        console.log('Not your turn');
        return state;
    }
    if(!state.dice.valueSet){
        console.log('Roll Dice first');
        return state;
    }
    const value = state.dice.value;

    let currentCell = state.cells[piece.cell];
    let nThCell = currentCell;

    for(let i=0;i<value;i++){
        nThCell = pieceNextCellFor(nThCell, piece.color);
        if(!nThCell){
            console.log('cannot move');
            return state;
        }
        nThCell = state.cells[nThCell];
    }

    let newState = produce(state, draft => {
        piece = clonePiece(piece);
        currentCell = cloneCell(currentCell);
        nThCell = cloneCell(nThCell);
        
        pieceRemove(currentCell, piece);
        let removedPieces = pieceAdd(nThCell, state, piece);

        // next player
        if(removedPieces.length == 0){
            draft.turn.currentTurn+=1;
            if(draft.turn.currentTurn === draft.turn.all.length){
                draft.turn.currentTurn=0;
            }
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

        draft.dice.rollable = true;
        draft.dice.valueSet = false;
        draft.dice.value = value;
    });
    
    return newState;
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