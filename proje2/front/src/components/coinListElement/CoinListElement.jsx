import React from 'react'
import { Link } from 'react-router-dom'
import styles from './coinListElement.module.css'

export default function CoinListElement({ coin }) {
    return (
        <Link to={`/coins/${coin.id}`} className={styles.coinListElement + ' flex g30' }>
            <div className="img">
                <img src={coin?.imgFrontUrl} alt="" />
            </div>
            <div className="text">
                <h2>{coin?.name ? coin.name : ''}</h2>
                <p>{coin?.shortDesc ? coin.shortDesc : ''}</p>
            </div>
        </Link>
    )
}
