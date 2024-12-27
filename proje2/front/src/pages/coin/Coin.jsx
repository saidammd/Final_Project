import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BASE_URL } from '../../config'
import styles from './coin.module.css'
import CoinTable from './coinTable/CoinTable'

export default function Coin() {
    const { id } = useParams()

    const [coin, setCoin] = useState({})

    const getCoin = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/coins/${id}`)
            const data = await response.json()
            setCoin(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCoin(id)
    }, [])
    return (
        <div className={styles.coinDetailed}>
            {
                JSON.stringify(coin) !== "{}"
                ?
                <div className={styles.content}>
                    <div className="left">
                        <img src={coin.imgFrontUrl} alt="" />
                        <img src={coin.imgBackUrl} alt="" />
                    </div>
                    <div className={styles.right}>
                        <h2>{coin.name}</h2>
                        <p>{coin.description}</p>
                        <CoinTable coin={coin} />
                        <Link to={'/'}>Back to the list</Link>
                    </div>
                </div>
                :
                <p>Məlumat tapılmadı</p>
            }
        </div>
    )
}
