import React from 'react'
import CoinListElement from '../coinListElement/CoinListElement'
import styles from './coinsList.module.css'

export default function CoinsList({ coins }) {
    return (
        <div className={styles.coinsList}>
            {
                coins.length
                    ?
                    coins.map((coin) => (
                        <CoinListElement coin={coin} />
                    ))
                    :
                    <p>Məlumat tapılmadı</p>
            }
        </div>
    )
}
