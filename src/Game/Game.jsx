import Home from './Home';
import Path from './Path';
import style from './Game.module.css';
import { Provider } from 'react-redux';
import store from '../store/store';
import FinalCell from './FinalCell';

function Game(){
    return (
        <Provider store={store}>
            <div class={style.container}>
                <Home color="red" />
                <Path color="blue" DT LR />
                <Home color="blue" />
                <Path color="red" RL DT />
                <FinalCell />
                <Path color="yellow" LR TD />
                <Home color="green"  />
                <Path color="green" TD RL />
                <Home color="yellow" />
            </div>
        </Provider>
    );
}

export default Game;