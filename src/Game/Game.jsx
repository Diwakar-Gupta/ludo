import Home from './Home';
import Path from './Path';
import style from './Game.module.css';

function Game(){
    return (
        <div class={style.container}>
            <Home color="red" />
            <Path color="blue" DT LR />
            <Home color="blue" />
            <Path color="red" RL DT />
            <div id="final">Final</div>
            <Path color="yellow" LR TD />
            <Home color="green"  />
            <Path color="green" TD RL />
            <Home color="yellow" />
        </div>
    );
}

export default Game;