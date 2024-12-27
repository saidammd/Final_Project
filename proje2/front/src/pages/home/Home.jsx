import React from 'react'
import Filter from '../../components/filter/Filter'
import styles from './home.module.css'
import CoinsType from './components/coinsType/CoinsType'

export default function Home() {
  return (
    <div className={styles.homePage}>
        <div className="heading">Homepage</div>
        <Filter />
        <CoinsType />
    </div>
  )
}
