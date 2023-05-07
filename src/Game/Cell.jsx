import style from './Cell.module.css';

function Cell({ round, index }){
    return (
        <div className={`${style.cell} ${round?style.round:''}`}>
            {index}
        </div>
    );
}

export default Cell;