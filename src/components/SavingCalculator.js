import React, { useEffect, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { TabView, TabPanel } from 'primereact/tabview'
import CalendarSvg from '@/assets/images/calendar.svg'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import ProductList from '../common/ProductCard'
import { useRecoilState } from 'recoil'
import { cardServiceProvider } from '@/gateway/modules/card-service/cardServiceList.atom.js'
import { useRouter } from 'next/router'
import { Chart } from 'primereact/chart'
import TimeLimitDeposit from './savingCalculator/TimeLimitDeposit'
import Retirement from './savingCalculator/Retirement'
import Education from './savingCalculator/Education'
import GoalSaving from './savingCalculator/GoalSavings'

const SavingCalculator = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lists] = useRecoilState(cardServiceProvider)
  const router = useRouter()
  const { tabIndex, index } = router.query
  const categories = [
    { id: 0, name: 'Энгийн тооцоолуур', key: 'A' },
    { id: 1, name: 'Хүүнээс хүү тооцох тооцоолуур', key: 'M' }
  ]
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  useEffect(() => {
    console.log(8.3 / 100)
  }, [])

  //result
  const [totalAmount, setTotalAmount] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalSaving, setTotalSaving] = useState(0)
  const [totalRate, setTotalRate] = useState(0)
  const [dataTable, setDataTable] = useState([])

  //selection
  const [firstSaving, setFirstSaving] = useState(1000000)
  const [duration, setDuration] = useState(12)
  const [monthlySaving, setMonthlySaving] = useState(100000)
  const [annualRate, setAnnualRate] = useState(12)
  const [date, setDate] = useState(new Date())
  const detail = [
    'Хугацаатай хадгаламж',
    'Тэтгэвэрийн хуримтлал',
    'Сургалтын төлбөрийн хадгаламж',
    'Зорилтот хадгаламж'
  ]

  useEffect(() => {
    if (selectedCategory.key === 'A') {
      standartSaving()
    } else if (selectedCategory.key === 'M') {
      interestFromInterestSaving()
    }
  }, [firstSaving, duration, monthlySaving, annualRate, date, selectedCategory])

  const [basicData] = useState({
    labels: [
      '1 жил',
      '2 жил',
      '3 жил',
      '4 жил',
      '5 жил',
      '6 жил',
      '7 жил',
      '8 жил',
      '9 жил',
      '10 жил'
    ],
    datasets: [
      {
        label: 'Хүүгийн орлого',
        backgroundcolor: '#DBC187',
        data: [65, 59, 80, 81, 56, 55, 40, 20, 40, 60, 50]
      },
      {
        label: 'Нийт мөнгө',
        backgroundcolor: '#024E31',
        data: [28, 48, 40, 19, 86, 27, 90, 30, 60, 50, 30]
      }
    ]
  })
  const getLightTheme = () => {
    let basicOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    }
    return {
      basicOptions
    }
  }
  const { basicOptions, horizontalOptions, multiAxisOptions, stackedOptions } =
    getLightTheme()

  const standartSaving = () => {
    setTotalAmount(0)
    setTotalSaving(0)
    setTotalRate(0)

    let dailyRate = annualRate / 36500

    let row = {
      number: 0,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      days: 0,
      interest: 0,
      saving: firstSaving,
      totalSaving: firstSaving
    }
    let total = 0
    let table = []

    table.push(Object.assign({}, row))
    for (let i = 0; i < duration; i++) {
      row.number++
      let date = nextMonth(row.date)
      row.days = countDays(date, row.date)
      row.date = date

      row.interest = row.saving * dailyRate * row.days
      total += row.interest

      row.saving += monthlySaving
      row.totalSaving += row.interest + monthlySaving

      table.push(Object.assign({}, row))
    }

    setTotalInterest(total)
    setTotalAmount(row.totalSaving)
    setTotalSaving(row.saving)
    setDataTable(table)
  }

  const interestFromInterestSaving = () => {
    setTotalAmount(0)
    setTotalSaving(0)
    setTotalRate(0)

    let dailyRate = annualRate / 36500

    let row = {
      number: 0,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      days: 0,
      interest: 0,
      saving: firstSaving,
      totalSaving: firstSaving
    }

    let total = 0
    let table = []

    table.push(Object.assign({}, row))
    for (let i = 0; i < duration; i++) {
      row.number++
      let date = nextMonth(row.date)
      row.days = countDays(date, row.date)
      row.date = date

      row.interest = row.totalSaving * dailyRate * row.days
      total += row.interest

      row.saving += monthlySaving
      row.totalSaving += row.interest + monthlySaving

      table.push(Object.assign({}, row))
    }
    setTotalInterest(total)
    setTotalAmount(row.totalSaving)
    setTotalSaving(row.saving)
    setTotalRate((Math.pow(1 + annualRate / 1200, 12) - 1) * 100)
    setDataTable(table)
  }

  const nextMonth = (nextdate) => {
    let month = nextdate.getMonth()
    let year = nextdate.getFullYear()
    let lastDayOfNextMonth = new Date(year, month + 2, 0).getDate()
    let day = date.getDate()
    if (day > lastDayOfNextMonth) {
      day = lastDayOfNextMonth
    }
    return new Date(year, month + 1, day)
  }

  const countDays = (date1, date2) => {
    return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24)
  }

  const currencyFormat = (num) => {
    return (
      parseFloat(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '₮'
    )
  }

  return (
    <div className='saving-calculator'>
      <div className='saving-calculator-header'>
        <div className='loan-calculator'>
          <div className='loan-calculator-header'>
            <div className='loan-tabList'>
              {detail &&
                detail.map((data, index) => (
                  <div
                    className={`loan-tabList-tabHead ${
                      activeIndex === index && 'active'
                    } `}
                    onClick={() => {
                      setActiveIndex(index)
                      // setData(data)
                    }}
                  >
                    <h1>{data}</h1>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {activeIndex === 0 && <TimeLimitDeposit />}
        {activeIndex === 1 && <Retirement />}
        {activeIndex === 2 && <Education />}
        {activeIndex === 3 && <GoalSaving />}

        <div className='saving-calculator-product'>
          <h1 className='saving-calculator-product-title'>
            Танд санал болгож буй бүтээгдэхүүн
          </h1>
          {lists.map((item, index) => (
            <div className='saving-calculator-product-content'>
              <ProductList
                list={item.content}
                issaving
                subMenu={index}
                sendRequest
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SavingCalculator
