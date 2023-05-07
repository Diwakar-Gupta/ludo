import Piece from "./Piece";

function PieceContainer({ pieces }){
    return (
        <div>
            {
                pieces.map((pieceHash) => {
                    return <Piece key={pieceHash} pieceHash={pieceHash} />
                })
            }
        </div>
    );
}

export default PieceContainer;