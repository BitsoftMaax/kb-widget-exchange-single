import { InputNumber } from 'primereact/inputnumber'
import { Chart } from 'primereact/chart'
import React, { useState, useEffect } from 'react'
import { useRecoilState, useRecoilStateLoadable } from 'recoil'
import {
  getSavingCalc,
  savingCalculate
} from '@/gateway/modules/calculator/_selectors/calculate.selector'

const GoalSaving = () => {
  //Сар бүр хийх орлого
  const [monthly, setMontly] = useState(0.0)
  //Нийт орлого
  const [totalMontly, setTotalMontly] = useState(0.0)
  //Хүснэгт
  const [dataTable, setDataTable] = useState(0.0)
  //Нийт хүүгийн орлого
  const [totalInterest, setTotalInterest] = useState(0.0)

  // Зорилгын мөнгөн дүн
  const [totalSaving, setTotalSaving] = useState(1000000)
  // Хадгаламж нээх мөнгөн дүн
  const [firstSaving, setFirstSaving] = useState(350)
  // Хугацаа
  const [date, setDate] = useState(5)
  const [calendar, setCalendar] = useState()
  // Хадгаламжийн хүү
  const [annualRate, setAnnualRate] = useState(6.0)
  //   Тогтмол нэмэх шилжүүлгийн дүн
  const [total, setTotal] = useState(20000)

  const detail = [
    {
      count: 365,
      name: 'Өдөр бүр',
      short: 'өдөр'
    },
    { count: 52, name: '7 хоног бүр', short: '-р 7 хоног' },
    { count: 12, name: 'Сар бүр', short: 'сар' }
  ]
  const [activeIndex, setActiveIndex] = useState(2)

  const [saving, setSaving] = useRecoilStateLoadable(savingCalculate)
  const [savingList, setSavingList] = useState()

  useEffect(() => {
    calc()
  }, [totalSaving, firstSaving, date, annualRate, activeIndex])

  useEffect(() => {
    setSaving(2)
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

  const amountFormat = (num) => {
    return (
      parseFloat(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '₮'
    )
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

    let transfer = detail[activeIndex].count

    let row = {
      number: 0,
      amount: 0,
      interest: 0,
      totalSaving: firstSaving
    }
    let rate = annualRate / 100
    let yearRate = rate / transfer + 1

    let totalDate = date * transfer

    let saving = Math.pow(yearRate, totalDate)
    let monthsSaving = (firstSaving * saving - totalSaving) * (rate / transfer)

    let monthlySaving = monthsSaving / (1 - saving)

    let table = []
    let totalInterest = 0
    let totalAmount = 0

    table.push(Object.assign({}, row))
    for (let i = 0; i < totalDate; i++) {
      row.number++
      row.interest = (rate * row.totalSaving) / transfer
      totalInterest += row.interest
      totalAmount += monthlySaving
      row.totalSaving += row.interest + monthlySaving
      row.amount = monthlySaving
      if (row.number > 0) {
        basicData.labels.push(`${row.number} ${detail[activeIndex].short}`)
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
            <label htmlFor='horizontal'>Зорилгын мөнгөн дүн</label>
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
            <label htmlFor='horizontal'>Хадгаламж нээх мөнгөн дүн</label>
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
              value={date}
              suffix={date > 0 && 'жил'}
              onValueChange={(e) => setDate(e.value)}
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
            <label htmlFor='horizontal'>Хадгаламжийн хүү</label>
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
            <label htmlFor='horizontal'>Тогтмол нэмэх шилжүүлгийн дүн</label>
            <div className='loan-calculator'>
              <div
                className='loan-tabList'
                style={{
                  marginTop: '15px',
                  marginBottom: '15px'
                }}
              >
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
                      <h1>{data.name}</h1>
                    </div>
                  ))}
              </div>
            </div>
            {/* <InputNumber
              inputId='horizontal'
              value={total}
              onValueChange={(e) => setTotal(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              // max={savingList && savingList.max_limit_month}
              // min={savingList && savingList.min_limit_month}
              format
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            /> */}
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
                value={calendar}
                onChange={(e) => setCalendar(e.value)}
                showIcon
                icon={<CalendarSvg />}
                className='saving-calculator-content-open-date-input'
              />
            </div>
          </div> */}

          <div className='saving-calculator-content-amount'>
            <div className='saving-calculator-content-amount-desc'>
              <p>
                Та {detail[activeIndex].name} {amountFormat(monthly)}{' '}
                хадгалснаар ирээдүйн зорилтдоо хүрэх боломжтой байна.
              </p>
            </div>

            <div className='saving-calculator-content-amount-balance'>
              <label htmlFor='horizontal'>
                {detail[activeIndex].name} хийх орлого
              </label>
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
export default GoalSaving
