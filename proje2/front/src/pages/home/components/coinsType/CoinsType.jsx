import React, { useEffect } from 'react'
import styles from './CoinsType.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from '../../../../icons'
import { BASE_URL } from '../../../../config'
import { useDispatch, useSelector } from 'react-redux'
import { setCoinType, setFilteredCoins } from '../../../../redux/slice'

export default function CoinsType() {
    const { coins } = useSelector(state => state.coin)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const content = [
        {
            heading: "Bullion coins",
            navigateTo: "",
            image: "https://i.postimg.cc/mkdPNp9f/South-Vietnamese-Dong-1.png",
            type: "investment"
        },
        {
            heading: "Exclusive coins",
            navigateTo: "",
            image: "https://i.postimg.cc/QdzprCHG/ISK-2.png",
            type: 'exclusive'
        },
        {
            heading: "Commemorative coins",
            navigateTo: "",
            image: "https://i.postimg.cc/J44JDZXC/Looney-1.png",
            type: "memorable"
        },
    ]

    const generateQueryString = (paramsObj) => {
        const queryParams = [];

        Object.keys(paramsObj).forEach((key) => {
            const value = paramsObj[key];
            if (value) {
                queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        });

        return queryParams.length ? `?${queryParams.join('&')}` : '';
    };

    const fetchAndDisplayCoins = async (coinType) => {
        const queryString = generateQueryString({ type: coinType });
        const url = `${BASE_URL}/coinsSearch${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error fetching data');
            }

            const data = await response.json();
            console.log('Server response:', data);
            dispatch(setFilteredCoins(data))
            dispatch(setCoinType(coinType))
            navigate('/filtered')
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        dispatch(setCoinType(''))
        dispatch(setFilteredCoins(coins))
    }, [])

    return (
        <div className={styles.coinsType}>
            {
                content.map((type, key) => (
                    <div className={styles.coinsType_element} key={key}>
                        <h2>{type.heading}</h2>
                        <span to={'/filtered'} onClick={() => fetchAndDisplayCoins(type.type)}>
                            Show all
                            {ArrowRight}
                        </span>
                        <img src={type.image} alt="" />
                    </div>
                ))
            }
        </div>
    )
}
