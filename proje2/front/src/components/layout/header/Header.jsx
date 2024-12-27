import { Link } from 'react-router-dom';
import styles from './header.module.css'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setSigned } from '../../../redux/slice';


const Header = () => {
    const { signed, user } = useSelector(state => state.coin)
    const dispatch = useDispatch()

    const logout = () => {
        localStorage.removeItem('coinData')
        dispatch(setSigned(false))
    }
    return (
        <ul className={styles.header}>
            <li className={styles.homePage}>
            <Link className={styles.logo} to={'/'}>Coins</Link>

            </li>
            {
                signed
                    ?
                    <li className={styles.auth + ' flex g10'}>
                        <span>{user?.name}</span>
                        <span className='pointer' onClick={logout}>Logout</span>
                    </li>
                    :
                    <li className={styles.auth + ' flex g10'}>
                        <Link to={'/login'}>Sign in</Link>
                        <Link to={'/register'}>Sign up</Link>
                    </li>
            }
        </ul>
    );
};
export default Header;
