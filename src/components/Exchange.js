import React, {useState, useEffect} from 'react';
import { Chart } from 'primereact/chart'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'

import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import 'primeicons/primeicons.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.css'
import 'primeflex/primeflex.css'


import axiosInstance from './../index';
// import moment from "moment";

const MARKET_STACK_QUOTE_URL = `${process.env.REACT_APP_KB_API_BASE_URL}/api/back/rates`;
const assets = `${process.env.REACT_APP_KB_ASSETS_URL}`;

function Exchange(props) {

    const [calender, setCalendar] = useState(Date())
    const [selectType, setSelectType] = useState(0)
    const [data, setData] = useState([])
    const [value1, setValue1] = useState()
    const [value2, setValue2] = useState()
    const [basicData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'First Dataset',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                borderColor: '#9F824E',
                tension: 0
            },
            {
                label: 'Second Dataset',
                data: [100, 48, 40, 19, 86, 27, 90],
                fill: false,
                borderColor: '#024E31',
                tension: 0
            }
        ]
    })
    const [selectedCountry1, setSelectedCountry1] = useState()
    const [selectedCountry2, setSelectedCountry2] = useState()
    const [selectedExchange2, setSelectedExchange2] = useState()

    useEffect(() => {
        axiosInstance.get(MARKET_STACK_QUOTE_URL, {  params: {
                date: calender,
            }}).then((result) => {
            console.log(result)
            if (!result.data) {
                return;
            }
            else {
                setData(result.data)
            }
        });
    },[calender]);
    useEffect(() => {
        setSelectedCountry1(data[0])
        setSelectedCountry2(data[data.length - 1])
        setSelectedExchange2(data[0])
    }, [data])
    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            }
            //   scales: {
            //     x: {
            //       ticks: {
            //         color: '#495057'
            //         // borderColor: '#ccc'
            //       },
            //       grid: {
            //         color: '#ebedef'
            //       }
            //     },
            //     y: {
            //       ticks: {
            //         color: '#495057'
            //       },
            //       grid: {
            //         color: '#ebedef'
            //       }
            //     }
            //   }
        }

        return {
            basicOptions
        }
    }
    const { basicOptions } = getLightTheme()
    const type = [
        'Бэлэн авах',
        'Бэлэн бус авах',
        'Бэлэн зарах',
        'Бэлэн бус зарах'
    ]

    let headerGroup = (
        <ColumnGroup>
            <Row>
                {/*<Column header={moment(calendar).format('YYYY-MM-DD')} colSpan={3} />*/}
                <Column header="2022.02.03" colSpan={3} />
                <Column header='Бэлэн' colSpan={2} />
                <Column header='Бэлэн бус' colSpan={2} />
            </Row>
            <Row>
                <Column header='Валют' />
                <Column header='Валютын нэр' />
                <Column header='Албан ханш' />
                <Column header='авах' />
                <Column header='зарах' />
                <Column header='авах' />
                <Column header='зарах' />
            </Row>
        </ColumnGroup>
    )
    let headerMobileGroup = (
        <ColumnGroup>
            <Row>
                <Column header='Валют' />
                <Column header='Албан ханш' />
                <Column header='Бэлэн' />
                <Column header='Бэлэн бус' />
            </Row>
        </ColumnGroup>
    )

    const Currency = (rowData) => {
        return (
            <div className='exchangeCalculator-currency'>
                <div
                    className='exchangeCalculator-currency-flag'
                    style={{
                        // backgroundImage: `url(${assets}${rowData.flag})`,

                        backgroundImage: rowData.flag
                            ? 'url(' + assets + rowData.flag + ')'
                            : `url(/assets/images/flags/us.png)`
                    }}
                />
                <h1 className='exchangeCalculator-currency-text'>{rowData.currency}</h1>
            </div>
        )
    }
    const MobileCurrency = (rowData) => {
        return (
            <div className='exchangeCalculator-currencyMobile'>
                <div
                    className='exchangeCalculator-currencyMobile-flag'
                    style={{
                        // backgroundImage: `url(${assets}${rowData.flag})`,

                        backgroundImage: rowData.flag
                            ? 'url(' + assets + rowData.flag + ')'
                            : `url(/assets/images/flags/us.png)`
                    }}
                />
                <div className='exchangeCalculator-currencyMobile-description'>
                    <h1 className='exchangeCalculator-currencyMobile-text'>
                        {rowData.currency}
                    </h1>
                    <p className='exchangeCalculator-currencyMobile-shortName'>
                        {rowData.shortName}
                    </p>
                </div>
            </div>
        )
    }
    const Rate = (rowData) => {
        return (
            <div className='exchangeCalculator-rate'>
                <div className='exchangeCalculator-rate-header'>
                    <p className='exchangeCalculator-table-title'>Авах</p>
                    <p className='exchangeCalculator-table-title'>Зарах</p>
                </div>
                <div className='exchangeCalculator-rate-description'>
                    <p className='exchangeCalculator-table-midRate'>
                        {currencyFormat(rowData.buyRate)}
                    </p>
                    <p className='exchangeCalculator-table-midRate'>
                        {currencyFormat(rowData.sellRate)}
                    </p>
                </div>
            </div>
        )
    }
    const midRateTemplate = (rowData) => {
        return currencyFormat(rowData.midRate)
    }
    const sellRateTemplate = (rowData) => {
        return currencyFormat(rowData.sellRate)
    }
    const buyRateTemplate = (rowData) => {
        return currencyFormat(rowData.buyRate)
    }
    const cashBuyRateTemplate = (rowData) => {
        return currencyFormat(rowData.cashBuyRate)
    }
    const cashSellRateTemplate = (rowData) => {
        return currencyFormat(rowData.cashSellRate)
    }

    const rowClass = (data) => {
        return data.number % 2 === 1
            ? 'exchangeCalculator-table-backgroundWhite'
            : 'exchangeCalculator-table-backgroundGrey'
    }
    useEffect(() => {
        selectedCountry1 && selectedCountry2 && changeValue(value1)
    }, [selectType, selectedCountry2, selectedCountry1])

    function currencyFormat(num) {
        return parseFloat(num)
            .toFixed(2)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    const changeValue = (value) => {
        let check
        switch (selectType) {
            case 0:
                check = selectedCountry1.buyRate / selectedCountry2.buyRate
                return setValue2(value * check)
            case 1:
                check = selectedCountry1.sellRate / selectedCountry2.sellRate
                return setValue2(value * check)
            case 2:
                check = selectedCountry1.cashBuyRate / selectedCountry2.cashBuyRate
                return setValue2(value * check)
            case 3:
                check = selectedCountry1.cashSellRate / selectedCountry2.cashSellRate
                return setValue2(value * check)
            default: return setValue2(0)
        }
    }
    const changeRate = () => {
        let temp1 = selectedCountry1
        let temp2 = selectedCountry2
        setSelectedCountry1(temp2)
        setSelectedCountry2(temp1)
    }

    return (
        <div className='exchangeCalculator'>
            <div className='exchangeCalculator-header'>
                <h2 className='exchangeCalculator-title'>
                    Ханшийн Мэдээ
                </h2>

                <Calendar
                    className='exchangeCalculator-header-calendar'
                    value={calender ? calender : Date()}
                    onChange={(e) => {
                        setCalendar(e.value)
                    }}
                    showIcon
                    dateFormat='yy.mm.dd'
                ></Calendar>
            </div>
            <div className='exchangeCalculator-table-web'>
                <DataTable
                    value={data}
                    headerColumnGroup={headerGroup}
                    responsiveLayout='scroll'
                    className='exchangeCalculator-table'
                    rowClassName={rowClass}
                >
                    <Column field='currency' body={Currency} />
                    <Column field='shortName' />
                    <Column field='midRate' body={midRateTemplate} />
                    <Column field='buyRate' body={buyRateTemplate} />
                    <Column field='sellRate' body={sellRateTemplate} />
                    <Column field='cashBuyRate' body={cashBuyRateTemplate} />
                    <Column field='cashSellRate' body={cashSellRateTemplate} />
                </DataTable>
            </div>
            <div className='exchangeCalculator-table-mobile'>
                <DataTable
                    value={data}
                    headerColumnGroup={headerMobileGroup}
                    responsiveLayout='scroll'
                    className='exchangeCalculator-table'
                    stripedRows
                    rowClassName={rowClass}
                >
                    <Column field='currency' body={MobileCurrency} />
                    <Column
                        field='midRate'
                        className='exchangeCalculator-table-midRate'
                        body={midRateTemplate}
                    />
                    <Column body={Rate} />
                    <Column body={Rate} />
                </DataTable>
            </div>
            <p className='exchangeCalculator-description'>
                Энэхүү вэб дээрх ханш нь зөвхөн мэдээллийн зорилготой бөгөөд валют арилжааны гүйлгээ хийхэд, салбар болон интернет банкны тухайн үеийн ханш мөрдөгдөхийг анхаарна уу. Валютын ханш болон валют арилжааны хэлцэлтэй холбоотой асуудлаар дараах хаягаар холбогдоно уу.
            </p>
            <p className='exchangeCalculator-email'>
               Утас: 75101111 И-мэйл: forex@khanbank.com
            </p>
            <div className='exchangeCalculator-container'>
                <div className='grid grid-nogutter'>
                    <h2 className='col-12 sm:col-5 exchangeCalculator-title'>
                        Ханш хөрвүүлэгч
                    </h2>
                    <div className='col-12 sm:col-7 grid grid-nogutter '>
                        {type.map((data, index) => (
                            <div
                                key={index}
                                className='col-6 sm:col-3  flex align-items-center justify-content-left exchangeCalculator-typeContainer'
                            >
                                <div
                                    className={
                                        index === selectType
                                            ? ' exchangeCalculator-typeCheck exchangeCalculator-typeCheck-active'
                                            : 'exchangeCalculator-typeCheck '
                                    }
                                    onClick={() => setSelectType(index)}
                                />
                                <p className='exchangeCalculator-type'>{data}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='grid grid-nogutter exchangeCalculator-transaction'>
                    <div className='col exchangeCalculator-input'>
                        <InputNumber
                            value={value1}
                            onChange={(e) => {
                                setValue1(e.value)
                                changeValue(e.value)
                                // setValue2(e.value * selectedCountry1.buyRate)
                                // console.log(selectType)
                            }}
                            format='0.00'
                            placeholder='0.00'
                            // type={number}
                            className='exchangeCalculator-input-value'
                        />
                        <div className='exchangeCalculator-input-line' />
                        <Dropdown
                            className='exchangeCalculator-input-currency'
                            value={selectedCountry1}
                            options={data}
                            onChange={(e) => {
                                setSelectedCountry1(e.value)
                            }}
                            optionLabel='currency'
                        />
                    </div>
                    <div className='col-12 sm:col-1 flex justify-content-center align-items-center'>
                        <div
                            className='exchangeCalculator-arrow'
                            onClick={() => changeRate()}
                        >
                            <i className="pi pi-code"></i>
                        </div>
                    </div>
                    <div className='col exchangeCalculator-input'>
                        <InputNumber
                            value={value2}
                            disabled
                            onChange={(e) => {
                                setValue2(e.value)
                                // setValue1(e.value * selectedCountry2.midRate)
                            }}
                            placeholder='0.00'
                            className='exchangeCalculator-input-value'
                        />
                        <div className='exchangeCalculator-input-line' />
                        <Dropdown
                            className='exchangeCalculator-input-currency'
                            value={selectedCountry2}
                            options={data}
                            onChange={(e) => {
                                setSelectedCountry2(e.value)
                            }}
                            optionLabel='currency'
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className='grid grid-nogutter exchangeCalculator-indicator'>
                    <h2 className='col-8 exchangeCalculator-title'>
                        Ханшийн үзүүлэлт
                    </h2>
                    <div className='col-4 flex justify-content-end'>
                        <Dropdown
                            className='exchangeCalculator-input-currency'
                            value={selectedExchange2}
                            options={data}
                            onChange={(e) => {
                                setSelectedExchange2(e.value)
                            }}
                            optionLabel='currency'
                        />
                    </div>
                </div>
                <div className='flex flex-row justify-content-between exchangeCalculator-onlineRate grid grid-nogutter'>
                    <p className='exchangeCalculator-onlineRate-text col-12 sm:col-9'>
                        Purchase foreign curency with Online and get your cash at a bank
                        branch
                    </p>
                    <Button
                        className='exchangeCalculator-onlineRate-button col-12 sm:col-3'
                        label='Онлайн валют солилцох'
                    />
                </div>
                <Chart type='line' data={basicData} options={basicOptions} />
            </div>
        </div>
    );
}

export default Exchange;
