import style from './Home.module.css';
import Cell from './Cell';

function Home({ color }){
    return (
        <div class={`${style.home} ${color}`}>
            <div class={style.borderOnly}>
                <div class={style.cellContainer}>
                    <div>
                        <Cell round={true} />
                        <Cell round={true} />
                    </div>
                    <div>
                        <Cell round={true} />
                        <Cell round={true} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;