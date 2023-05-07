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

function pieceClicked(state, piece){
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
        piece = {...piece};
        currentCell = {...currentCell};
        nThCell = {...nThCell};
        
        pieceRemove(currentCell, piece);
        pieceAdd(nThCell, state, piece);

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