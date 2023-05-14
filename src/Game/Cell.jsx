import { useSelector } from 'react-redux';
import style from './Cell.module.css';
import PieceContainer from './PieceContainer';
import {hash} from '../store/initialState';

function Cell({ color, round, index }){

    const cell = useSelector(state => {
        return state.cells[hash({color, index})];
    });

    let star = '';
    if(cell.isSafe){
        if(cell.isColoredCell){
            star = (<span className='star' key={'star'}>
                        <i className="fa fa-star" aria-hidden="true"></i>
                    </span>);
        } else {
            star = (<span className='star' key={'star'}>
                        <i className="fa fa-star-o" aria-hidden="true"></i>
                    </span>);
        }
    } else {
    }

    return (
        <div className={`${style.cell} ${round?style.round:''} ${cell.isColoredCell?`${cell.color} ${style.coloredCell}`:''} ${cell.isSafe?style.safe:''}`}>
            {star}
            <div key="pieceContainer" className={style.pieceContainer}>
                <PieceContainer pieces={cell.pieces} />
            </div>
        </div>
    );
}

export default Cell;