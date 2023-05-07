import Cell from './Cell';
import style from './Path.module.css';

function Path({ color, DT, TD, LR, RL }){
    let cells = [];
    for(let i=0;i<18;i++){
        cells.push(i);
    }

    const direction = `${DT?style.DT:''} ${TD?style.TD:''} ${LR?style.LR:''} ${RL?style.RL:''}`;

    return (
        <div class={`${style.path} ${direction} ${style[color]}`}>
            <div>
                {
                    cells.slice(0, 6).map((value) => {
                        return <Cell index={value} />
                    })
                }
            </div>
            <div>
                {
                    cells.slice(6, 12).map((value) => {
                        return <Cell index={value} />
                    })
                }
            </div>
            <div>
                {
                    cells.slice(12, 18).map((value) => {
                        return <Cell index={value} />
                    })
                }
            </div>
        </div>
    );
}

export default Path;