import React, { useEffect, useState } from 'react';
import styles from './coinTable.module.css';

const CoinTable = ({ coin }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (JSON.stringify(coin) !== '{}') {
            setData([
                { label: 'Issuing Country', value: coin.country },
                { label: 'Composition', value: coin.composition },
                { label: 'Quality', value: coin.quality },
                { label: 'Denomination', value: `${coin.denomination}` },
                { label: 'Year', value: coin.year },
                { label: 'Weight', value: `${coin.weight} g` },
                { label: 'Price', value: `${coin.price}$` },
            ])
        }
    }, [coin])
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td className={styles.label}>{row.label}</td>
                            <td className={styles.value}>{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CoinTable;
