import Piece from "./Piece";
import style from './PieceContainer.module.css';

function PieceContainer({ pieces }){
    return (
        <div className={style.pieceContainer}>
            {
                pieces.map((pieceHash) => {
                    return <Piece key={pieceHash} pieceHash={pieceHash} />
                })
            }
        </div>
    );
}

export default PieceContainer;