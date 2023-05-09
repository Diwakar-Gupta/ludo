import { useDispatch, useSelector } from "react-redux";
import style from './Piece.module.css';

function Piece({ pieceHash }){

    const dispatch = useDispatch();
    const piece = useSelector(state => {
        return state.pieces[pieceHash];
    });

    function pieceClicked(){
        dispatch({
            type: "PieceClicked",
            payload: piece,
        });
    }

    return (
        <i className={`fa fa-map-marker ${style[piece.color]} ${style.piece}`} onClick={pieceClicked}></i>
    );
}

export default Piece;