import { useDispatch, useSelector } from "react-redux";

function FinalCell(){
    const dispatch = useDispatch();
    const dice = useSelector(state => {
        return state.dice;
    });

    function rollDice(){
        dispatch({type: 'RollDice'});
    }

    return (
        <div style={{'position': 'relative'}}>
            <div className="center">
                {
                    dice.rollable?(
                        <button onClick={rollDice}>
                            {
                                dice.value?dice.value:'Roll'
                            }
                        </button>
                    ):(
                        <span>{dice.valueSet?dice.value:"Can't roll"}</span>
                    )
                }
            </div>
        </div>
    );
}

export default FinalCell;