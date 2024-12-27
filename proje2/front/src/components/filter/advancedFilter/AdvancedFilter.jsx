import React, { useEffect, useState } from "react";
import styles from "./AdvancedFilter.module.css";
import { useSelector } from "react-redux";

const AdvancedFilter = ({ formData, setFormData }) => {
    const { coins } = useSelector(state => state.coin)
    const [countries, setCountries] = useState([])
    const [compositions, setCompositions] = useState([])
    const [qualities, setQualities] = useState([])

    const changeFormData = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };


    useEffect(() => {
        if (coins.length) {
            const uniqueCountries = [...new Set(coins.map((coin) => coin.country))];
            setCountries(uniqueCountries);

            const uniqueCompositions = [...new Set(coins.map((coin) => coin.composition))];
            setCompositions(uniqueCompositions)

            const uniqueQualities = [...new Set(coins.map((coin) => coin.quality))];
            setQualities(uniqueQualities)
        }
    }, [coins]);



    return (
        <div className={styles.advancedFilter}>
            <div className={styles.row}>
                <div className={styles.filterGroup}>
                    <label htmlFor="country">Issuing country</label>
                    <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => changeFormData("country", e.target.value)}
                    >
                        <option value="">Select</option>
                        {
                            countries.length
                                ?
                                countries.map((country, key) => (
                                    <option value={country} key={key}>{country}</option>
                                ))
                                :
                                <></>
                        }
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="metal">Metal</label>
                    <select
                        id="metal"
                        value={formData.metal}
                        onChange={(e) => changeFormData("metal", e.target.value)}
                    >
                        <option value="">Select</option>
                        {
                            compositions.length
                                ?
                                compositions.map((composition, key) => (
                                    <option value={composition} key={key}>{composition}</option>
                                ))
                                :
                                <></>
                        }
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="quality">Quality of the coin</label>
                    <select
                        id="quality"
                        value={formData.quality}
                        onChange={(e) => changeFormData("quality", e.target.value)}
                    >
                        <option value="">Select</option>
                        {
                            qualities.length
                                ?
                                qualities.map((quality, key) => (
                                    <option value={quality} key={key}>{quality}</option>
                                ))
                                :
                                <></>
                        }
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.filterGroup}>
                    <label htmlFor="priceFrom">Price</label>
                    <div className={styles.rangeInputs}>
                        <div className="flex a-center g10">
                            <label htmlFor="priceFrom">from</label>

                            <input
                                type="number"
                                id="priceFrom"
                                placeholder="from"
                                value={formData.priceFrom}
                                onChange={(e) => changeFormData("priceFrom", e.target.value)}
                            />
                        </div>
                        <div className="flex a-center g10">
                            <label htmlFor="priceTo">to</label>

                            <input
                                type="number"
                                id="priceTo"
                                placeholder="to"
                                value={formData.priceTo}
                                onChange={(e) => changeFormData("priceTo", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="yearFrom">Year of issue</label>
                    <div className={styles.rangeInputs}>
                        <div className="flex a-center g10">
                            <label htmlFor="yearFrom">from</label>
                            <input
                                type="number"
                                id="yearFrom"
                                placeholder="from"
                                value={formData.yearFrom}
                                onChange={(e) => changeFormData("yearFrom", e.target.value)}
                            />
                        </div>
                        <div className="flex a-center g10">
                            <label htmlFor="yearTo">to</label>
                            <input
                                type="number"
                                id="yearTo"
                                placeholder="to"
                                value={formData.yearTo}
                                onChange={(e) => changeFormData("yearTo", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilter;
