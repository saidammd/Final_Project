import React, { useState } from 'react'
import styles from './filter.module.css'
import AdvancedFilter from './advancedFilter/AdvancedFilter'
import { ArrowDown, ArrowUp } from '../../icons'
import { BASE_URL } from '../../config'
import { useDispatch, useSelector } from 'react-redux'
import { setFilteredCoins } from '../../redux/slice'
import { useNavigate } from 'react-router-dom'

export default function Filter() {
    const {coinType} = useSelector(state => state.coin)
    const [formData, setFormData] = useState({
        name: ''
    })
    const [advanced, setAdvanced] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const changeFormData = (name, value) => {
        setFormData(state => {
            return { ...state, [name]: value }
        })
    }

    const objectToQuery = (obj) => {
        const params = [];

        Object.keys(obj).forEach((key) => {
            const value = obj[key];
            if (value) {
                params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        });

        return params.length ? `?${params.join('&')}` : '';
    };

    const onSubmit = async () => {
        const queryString = objectToQuery({...formData, type: coinType});
        const url = `${BASE_URL}/coinsSearch${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Ошибка при запросе данных');
            }

            const results = await response.json();
            console.log('Ответ от сервера:', results);
            dispatch(setFilteredCoins(results))
            navigate('/filtered')
            setAdvanced(false)
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    return (
        <div className={styles.filter}>
            <form>

                <div className="formContent">
                    <label>
                        Input field
                    </label>
                    <div className="flex g30">
                        <input name='name' type="text" onChange={(e) => changeFormData(e.target.name, e.target.value)} />
                        <button onClick={onSubmit} type='button' className="submitBtn">
                            Search
                        </button>
                    </div>


                </div>

                <p onClick={() => setAdvanced(!advanced)}>Advanced filter <span>{advanced ? ArrowUp : ArrowDown}</span> </p>

                {
                    advanced
                        ?
                        <AdvancedFilter status={true} formData={formData} setFormData={setFormData} />
                        :
                        <></>
                }
            </form>
        </div>
    )
}
