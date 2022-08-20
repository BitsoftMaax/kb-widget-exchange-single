import { RadioButton } from 'primereact/radiobutton'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import CalendarSvg from '@/assets/images/calendar.svg'
import { Chart } from 'primereact/chart'
import React, { useState, useEffect } from 'react'
import { cardServiceProvider } from '@/gateway/modules/card-service/cardServiceList.atom.js'
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable
} from 'recoil'

import { savingCalculate } from '@/gateway/modules/calculator/_selectors/calculate.selector'

const TimeLimitDeposit = () => {
  const categories = [
    { id: 0, name: 'Энгийн тооцоолуур', key: 'A' },
    { id: 1, name: 'Хүүнээс хүү тооцох тооцоолуур', key: 'M' }
  ]
  const [selectedCategory, setSelectedCategory] = useState(categories[0])

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

  useEffect(() => {
    if (selectedCategory.key === 'A') {
      standartSaving()
    } else if (selectedCategory.key === 'M') {
      interestFromInterestSaving()
    }
  }, [firstSaving, duration, monthlySaving, annualRate, date, selectedCategory])

  const [saving, setSaving] = useRecoilStateLoadable(savingCalculate)
  const [savingList, setSavingList] = useState()

  useEffect(() => {
    setSaving(11)
    savingLimit()
  }, [savingCalculate, saving, savingList])

  const savingLimit = () => {
    switch (saving.state) {
      case 'hasValue':
        setSavingList(saving.contents[0])
      case 'hasError':
        return null
      case 'loading':
        return saving.contents
    }
  }

  const currencyFormat = (num) => {
    return (
      parseFloat(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '₮'
    )
  }
  const totalFormat = (num) => {
    return parseFloat(num)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  const [basicData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Хүүгийн орлого',
        backgroundcolor: '#DBC187',
        data: []
      },
      {
        label: 'Нийт мөнгө',
        backgroundcolor: '#024E31',
        data: []
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
          // min: 0,
          // max: 5
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

  const { basicOptions } = getLightTheme()

  const standartSaving = () => {
    basicData.labels = []
    basicData.datasets[0].data = []
    basicData.datasets[1].data = []
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
      if (row.number > 0) {
        basicData.labels.push(`${row.number} сар`)
        basicData.datasets[0].data.push(total)
        basicData.datasets[1].data.push(row.totalSaving)
      }

      table.push(Object.assign({}, row))
    }

    setTotalInterest(total)
    setTotalAmount(row.totalSaving)
    setTotalSaving(row.saving)
    setDataTable(table)
  }

  const interestFromInterestSaving = () => {
    basicData.labels = []
    basicData.datasets[0].data = []
    basicData.datasets[1].data = []
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

      if (row.number > 0) {
        basicData.labels.push(`${row.number} сар`)
        basicData.datasets[0].data.push(total)
        basicData.datasets[1].data.push(row.totalSaving)
      }

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

  return (
    <div>
      <div className='saving-calculator-option'>
        {categories.map((category) => {
          return (
            <div key={category.key} className='field-radiobutton'>
              <RadioButton
                inputId={category.key}
                className='saving-calculator-option-icon'
                name='category'
                value={category}
                onChange={(e) => setSelectedCategory(e.value)}
                checked={selectedCategory.key === category.key}
              />
              <label
                className='saving-calculator-option-txt'
                htmlFor={category.key}
              >
                {category.name}
              </label>
            </div>
          )
        })}
      </div>
      <div className='saving-calculator-content'>
        <div className='grid p-fluid calculator-content-grid'>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Эхний орлого</label>
            <InputNumber
              inputId='horizontal'
              value={firstSaving}
              suffix={firstSaving > 0 && '₮'}
              onValueChange={(e) => setFirstSaving(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={10000}
              max={savingList && savingList.max_firts_income_price}
              min={savingList && savingList.min_firts_income_price}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Хугацаа</label>
            <InputNumber
              inputId='horizontal'
              value={duration}
              suffix={duration > 0 && 'сар'}
              onValueChange={(e) => setDuration(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              max={savingList && savingList.max_limit_month}
              min={savingList && savingList.min_limit_month}
              format
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Сар бүр хийх орлого</label>
            <InputNumber
              inputId='horizontal'
              value={monthlySaving}
              suffix={monthlySaving > 0 && '₮'}
              onValueChange={(e) => setMonthlySaving(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={10000}
              max={savingList && savingList.max_limit_every_month_income}
              min={savingList && savingList.min_limit_every_month_income}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>

          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Жилийн хүү</label>
            <InputNumber
              inputId='horizontal'
              value={annualRate}
              suffix={annualRate > 0 && '%'}
              onValueChange={(e) => setAnnualRate(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={0.1}
              max={savingList && savingList.max_limit_rate}
              min={savingList && savingList.min_limit_rate}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='col-12 sm:col-6'>
            <div className='saving-calculator-content-open-date'>
              <label
                className='saving-calculator-content-open-date-title'
                htmlFor='horizontal'
              >
                Нээлгэх огноо
              </label>
              <Calendar
                dateFormat='yy.mm.dd'
                id='icon'
                value={date}
                onChange={(e) => setDate(e.value)}
                showIcon
                icon={<CalendarSvg />}
                className='saving-calculator-content-open-date-input'
              />
            </div>
          </div>

          <div className='saving-calculator-content-amount'>
            <div className='saving-calculator-content-amount-desc'>
              <p>
                Та {totalFormat(firstSaving)} хэмжээний төгрөгийг сар бүр{' '}
                {totalFormat(monthlySaving)} төгрөг дансанд нэмэгдэх орлоготой,
                жилийн {annualRate}%-ийн хүүтэйгээр хадгалуулснаар, {duration}{' '}
                сарын дараа таны хадгаламж {totalFormat(totalAmount)} болж өснө.
              </p>
            </div>
            <div className='saving-calculator-content-amount-saving'>
              <label htmlFor='horizontal'>Таны хуримтлуулах мөнгө</label>
              <p>{currencyFormat(totalSaving)}</p>
            </div>
            <div className='saving-calculator-content-amount-interest'>
              <label htmlFor='horizontal'>Цуглуулах хүү дангаараа</label>
              <p>{currencyFormat(totalInterest)}</p>
            </div>
            <div className='saving-calculator-content-amount-balance'>
              <label htmlFor='horizontal'>Нийт мөнгөн дүн</label>
              <p>{currencyFormat(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='saving-calculator-chart'>
        <h1 className='saving-calculator-chart-title'>Тооцоолол</h1>
        <div className='saving-calculator-chart-body'>
          <Chart
            className='saving-calculator-chart-body-content'
            type='bar'
            data={basicData}
            options={basicOptions}
          />
        </div>
      </div>
    </div>
  )
}
export default TimeLimitDeposit
