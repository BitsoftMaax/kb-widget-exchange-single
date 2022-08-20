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
import {
  getSavingCalc,
  savingCalculate
} from '@/gateway/modules/calculator/_selectors/calculate.selector'

const Education = () => {
  //Сар бүр хийх орлого
  const [monthly, setMontly] = useState(0.0)
  //Нийт орлого
  const [totalMontly, setTotalMontly] = useState(0.0)
  //Хүснэгт
  const [dataTable, setDataTable] = useState(0.0)
  //Нийт хүүгийн орлого
  const [totalInterest, setTotalInterest] = useState(0.0)

  // Сургалтын төлбөр
  const [totalSaving, setTotalSaving] = useState(1000000)
  // Зориулж хадгалсан мөнгө
  const [firstSaving, setFirstSaving] = useState(350)
  // Хадгалж эхлэх жил
  const [age, setAge] = useState(2021)
  // Хадгаламжийн дундаж хүү
  const [annualRate, setAnnualRate] = useState(6.0)
  // Сургалт эхлэх жил
  const [retirementAge, setRetirementAge] = useState(2026)

  const [saving, setSaving] = useRecoilStateLoadable(savingCalculate)
  const [savingList, setSavingList] = useState()

  useEffect(() => {
    calc()
  }, [firstSaving, annualRate, totalSaving, age, retirementAge])

  useEffect(() => {
    setSaving(13)
    savingLimit()
    console.log(savingList)
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

  const amountFormat = (num) => {
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

  const calc = () => {
    basicData.labels = []
    basicData.datasets[0].data = []
    basicData.datasets[1].data = []
    let row = {
      number: 0,
      amount: 0,
      interest: 0,
      totalSaving: firstSaving
    }
    let rate = annualRate / 100
    let yearRate = rate / 12 + 1

    let totalDate = (retirementAge - age) * 12

    let saving = Math.pow(yearRate, totalDate)
    let monthsSaving = (firstSaving * saving - totalSaving) * (rate / 12)

    let monthlySaving = monthsSaving / (1 - saving)

    let table = []
    let totalInterest = 0
    let totalAmount = 0

    table.push(Object.assign({}, row))
    for (let i = 0; i < totalDate; i++) {
      row.number++
      row.interest = (rate * row.totalSaving) / 12
      totalInterest += row.interest
      totalAmount += monthlySaving
      row.totalSaving += row.interest + monthlySaving
      row.amount = monthlySaving
      if (row.number > 0) {
        basicData.labels.push(`${row.number} сар`)
        basicData.datasets[0].data.push(totalInterest)
        basicData.datasets[1].data.push(row.totalSaving)
      }
      table.push(Object.assign({}, row))
    }
    setMontly(monthlySaving)
    setTotalMontly(totalAmount + firstSaving)
    setDataTable(table)
    setTotalInterest(totalInterest)
  }

  return (
    <div>
      <div className='saving-calculator-content'>
        <div className='grid p-fluid calculator-content-grid'>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Сургалтын төлбөр</label>
            <InputNumber
              inputId='horizontal'
              value={totalSaving}
              suffix={totalSaving > 0 && '₮'}
              onValueChange={(e) => setTotalSaving(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={10000}
              max={savingList && savingList.max_limit_price}
              min={savingList && savingList.min_limit_price}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Зориулж хадгалсан мөнгө</label>
            <InputNumber
              inputId='horizontal'
              value={firstSaving}
              suffix={firstSaving > 0 && '₮'}
              onValueChange={(e) => setFirstSaving(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={10000}
              max={savingList && savingList.max_first_income_price}
              min={savingList && savingList.min_first_income_price}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Сургалт эхлэл жил</label>
            <InputNumber
              inputId='horizontal'
              value={retirementAge}
              suffix={retirementAge > 0 && 'он'}
              onValueChange={(e) => setRetirementAge(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              max={savingList && savingList.max_limit_pension_age}
              min={savingList && savingList.min_limit_pension_age}
              format
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Хадгаламжийн дундаж хүү</label>
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

          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Хадгалж эхлэх жил</label>
            <InputNumber
              inputId='horizontal'
              value={age}
              suffix={age > 0 && 'он'}
              onValueChange={(e) => setAge(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              max={savingList && savingList.max_limit_age}
              min={savingList && savingList.min_limit_age}
              format
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          {/* <div className='col-12 md:col-6'>
            <div className='saving-calculator-content-open-date '>
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
          </div> */}

          <div className='saving-calculator-content-amount'>
            <div className='saving-calculator-content-amount-desc'>
              <p>
                Та сар бүр {totalFormat(monthly)} хадгалснаар ирээдүйн сургалтын
                төлбөрийн зорилтдоо хүрэх боломжтой байна.
              </p>
            </div>

            <div className='saving-calculator-content-amount-balance'>
              <label htmlFor='horizontal'>Сар бүр хийх орлого</label>
              <p>{amountFormat(monthly)}</p>
            </div>
            <div className='saving-calculator-content-amount-balance'>
              <label htmlFor='horizontal'>Таны хуримтлуулах мөнгө</label>
              <p>{amountFormat(totalMontly)}</p>
            </div>
            <div className='saving-calculator-content-amount-balance'>
              <label htmlFor='horizontal'>Цуглуулах хүү дангаараа</label>
              <p>{amountFormat(totalInterest)}</p>
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
export default Education
