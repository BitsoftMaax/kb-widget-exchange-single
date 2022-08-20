import React, { useEffect, useState } from 'react'
import ConsumerLoan from './loanCalculator/ConsumerLoan'
import { LoanCalculate } from '@/gateway/modules/calculator/_selectors/calculate.selector'
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable
} from 'recoil'

const LoanCalculator = () => {
  const [loanCalculator, setLoanCalculator] =
    useRecoilStateLoadable(LoanCalculate)
  const [detail, setDetails] = useState()
  const [activeIndex, setActiveIndex] = useState(0)
  //selection Зээлийн хэмжээ:
  const [amount, setAmount] = useState(1000000)
  //Зээлийн хугацаа:
  const [duration, setDuration] = useState(3)
  //Хөнгөлөлттэй хугацаа:
  const [durationSkip, setDurationSkip] = useState(0)
  //Зээлийн хүү (сар)
  const [annualRate, setAnnualRate] = useState(1)
  //Зээл эхлэх огноо:
  const [date, setDate] = useState(new Date())
  //result Зээлийн сарын төлбөр
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  //Төлбөл зохих нийт хэмжээ
  const [totalPayment, setTotalPayment] = useState(0)
  const [dataTable, setDataTable] = useState([])

  const categories = [
    { name: 'Тэнцүү төлбөрийн аргачлал', key: 'A' },
    { name: 'Үндсэн зээл төлбөрийн аргачлал', key: 'M' }
  ]
  const [selectedCategory, setSelectedCategory] = useState(categories[0])
  const [data, setData] = useState()

  useEffect(() => {
    setLoanCalculator(1)
    loadData()
  }, [LoanCalculate, detail, loanCalculator])
  const loadData = () => {
    switch (loanCalculator.state) {
      case 'hasValue':
        setDetails(loanCalculator.contents)
        setData(loanCalculator.contents[0])
      case 'loading':
        return
    }
  }
  useEffect(() => {
    if (duration < 2) {
      setDurationSkip(0)
    }

    if (selectedCategory.key == 'A') {
      equalPrincipalPayment()
    } else if (selectedCategory.key == 'M') {
      standartPayment()
    }
  }, [amount, duration, durationSkip, annualRate, date, selectedCategory])

  //Үндсэн зээл төлбөрийн аргачлал тооцоолуур
  const standartPayment = () => {
    let equalMonthlyPayment = amount / (duration - durationSkip)

    setMonthlyPayment(equalMonthlyPayment)
    setTotalPayment(0)

    let dailyRate = (annualRate * 12) / 36500
    let row = {
      number: 0,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      days: 0,
      interest: 0,
      mainPayment: 0,
      totalPayment: 0,
      balance: amount
    }
    let total = 0
    let table = []

    table.push(Object.assign({}, row))
    for (let i = 0; i < duration; i++) {
      row.number++
      let date = nextMonth(row.date)
      row.days = countDays(date, row.date)
      row.date = date
      row.interest = row.balance * dailyRate * row.days

      if (i < durationSkip) {
        total += row.interest
        row.totalPayment = row.interest
        row.mainPayment = 0
      } else {
        row.totalPayment = equalMonthlyPayment + row.interest
        row.mainPayment = equalMonthlyPayment
        row.balance -= equalMonthlyPayment
        total += row.totalPayment
      }

      if (row.balance < 0) row.balance = 0

      table.push(Object.assign({}, row))
    }
    setTotalPayment(total)

    setDataTable(table)
  }

  //Тэнцүү төлбөрийн аргачлал тооцоолуур
  const equalPrincipalPayment = () => {
    let sum = 0
    let p = 1
    let thisMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    for (let i = 0; i < duration; i++) {
      let _nextMonth = nextMonth(thisMonth)
      let days = countDays(_nextMonth, thisMonth)
      thisMonth = _nextMonth
      if (i < durationSkip) continue
      p = p / ((annualRate * 12 * days) / 36500 + 1)
      sum += p
    }

    let equalMonthlyPayments = Math.ceil((amount * 100) / sum) / 100

    setMonthlyPayment(equalMonthlyPayments)

    setTotalPayment(0)

    let dailyRate = (annualRate * 12) / 36500

    let row = {
      number: 0,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      days: 0,
      interest: 0,
      mainPayment: 0,
      totalPayment: 0,
      balance: amount
    }
    let total = 0
    let table = []

    table.push(Object.assign({}, row))
    for (let i = 0; i < duration; i++) {
      row.number++
      let dateTemp = nextMonth(row.date)
      row.days = countDays(dateTemp, row.date)
      row.date = dateTemp
      row.interest = row.balance * dailyRate * row.days

      if (i < durationSkip) {
        total += row.interest
        row.totalPayment = row.interest
        row.mainPayment = 0
      } else {
        total += equalMonthlyPayments
        row.totalPayment = equalMonthlyPayments
        row.mainPayment = equalMonthlyPayments - row.interest
        row.balance -= row.mainPayment
      }

      if (row.balance < 0) row.balance = 0

      table.push(Object.assign({}, row))
    }
    setTotalPayment(total)
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
                  setData(data)
                }}
              >
                <h1>{data.title}</h1>
              </div>
            ))}
        </div>

        <ConsumerLoan
          data={data}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={(value) => {
            setSelectedCategory(value)
          }}
          amount={amount}
          setAmount={(value) => {
            setAmount(value)
          }}
          duration={duration}
          setDuration={(value) => {
            setDuration(value)
          }}
          durationSkip={durationSkip}
          setDurationSkip={(value) => {
            setDurationSkip(value)
          }}
          annualRate={annualRate}
          setAnnualRate={(value) => {
            setAnnualRate(value)
          }}
          date={date}
          setDate={(value) => {
            setDate(value)
          }}
          monthlyPayment={monthlyPayment}
          totalPayment={totalPayment}
          dataTable={dataTable}
        />
      </div>
    </div>
  )
}

export default LoanCalculator
