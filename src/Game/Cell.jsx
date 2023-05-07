import { useSelector } from 'react-redux';
import style from './Cell.module.css';
import PieceContainer from './PieceContainer';
import {hash} from '../store/initialState';

function Cell({ color, round, index }){

    const cell = useSelector(state => {
        return state.cells[hash({color, index})];
    });

    return (
        <div className={`${style.cell} ${round?style.round:''} ${cell.isColoredCell?cell.color:''} ${cell.isSafe?style.safe:''}`}>
            {
                cell.isSafe?<span key={'star'}>☆</span>:''
                // index
            }
            <div key="pieceContainer" className={style.pieceContainer}>
                <PieceContainer pieces={cell.pieces} />
            </div>
        </div>
    );
}

export default Cell;