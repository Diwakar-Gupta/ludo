import style from './Home.module.css';
import Cell from './Cell';
import { useSelector } from 'react-redux';
import { currentPlayerColor } from '../store/store';

function Home({ color }){

    const currentChange = useSelector(state => {
        const currentColor = currentPlayerColor(state);
        return currentColor === color;
    });

    return (
        <div className={`${style.home} ${color}`}>
            <div className={style.borderOnly}>
                <div className={style.cellContainer}>
                    <div>
                        <Cell key={0} index={18} round={true} color={color} />
                        <Cell key={1} index={19} round={true} color={color} />
                    </div>
                    {
                        currentChange?(
                            <div><i className="fa fa-asterisk" aria-hidden="true"></i></div>
                        ):(
                            <div></div>
                        )
                    }
                    <div>
                        <Cell key={2} index={20} round={true} color={color} />
                        <Cell key={3} index={21} round={true} color={color} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;