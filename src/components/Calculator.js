import React, {useState, useEffect} from 'react';
import LoanCalculator from './LoanCalculator'
// import SavingCalculator from './SavingCalculator'

const MARKET_STACK_QUOTE_URL = `${process.env.REACT_APP_KB_API_BASE_URL}/api/back/rates`;
const assets = `${process.env.REACT_APP_KB_ASSETS_URL}`;

function Calculator(props) {

    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <div className='calculator-section '>
            <div className='calculator-section-tabList '>
                <div
                    className={`calculator-section-tabList-tabHead ${
                        activeIndex === 0 ? 'active' : null
                    } `}
                    onClick={() => {
                        setActiveIndex(0)
                    }}
                >
                    <h1>Зээлийн тооцоолуур</h1>
                </div>
                <div
                    className={`calculator-section-tabList-tabHead ${
                        activeIndex === 1 ? 'active' : null
                    } `}
                    onClick={() => {
                        setActiveIndex(1)
                    }}
                >
                    <h1>Хадгаламжийн тооцоолуур</h1>
                </div>
            </div>
            <div className='tabContent' hidden={activeIndex != 0}>
                <LoanCalculator />
            </div>
            <div className='tabContent' hidden={activeIndex != 1}>
                {/*<SavingCalculator />*/}
            </div>
        </div>
    );
}

export default Calculator;
