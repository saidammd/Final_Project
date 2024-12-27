import React from 'react'
import Filter from '../../components/filter/Filter'
import styles from './filtered.module.css'
import CoinsList from '../../components/coinsList/CoinsList'
import { useSelector } from 'react-redux'

export default function Filtered() {
    const { filteredCoins } = useSelector((state) => state.coin)
    return (
        <div className={styles.filtered}>
            <div className="heading">List of the coins</div>
            <Filter />
            <CoinsList coins={filteredCoins} />
        </div>
    )
}
