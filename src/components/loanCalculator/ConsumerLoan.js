import React, { useEffect, useState } from 'react'
import { RadioButton } from 'primereact/radiobutton'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { Calendar } from 'primereact/calendar'
import ProductCard from '../common/ProductCard'
import { cardServiceProvider } from '@/gateway/modules/card-service/cardServiceList.atom.js'
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable
} from 'recoil'
import {
  getConsumerLoanCalc,
  LoanCalculate
} from '@/gateway/modules/calculator/_selectors/calculate.selector'

const ConsumerLoan = ({
  data,
  categories,
  selectedCategory,
  setSelectedCategory,
  amount,
  setAmount,
  duration,
  setDuration,
  durationSkip,
  setDurationSkip,
  annualRate,
  setAnnualRate,
  date,
  setDate,
  monthlyPayment,
  totalPayment,
  dataTable
}) => {
  const [lists] = useRecoilState(cardServiceProvider)
  const [see, setSee] = useState(false)

  const currencyFormat = (num) => {
    return (
      parseFloat(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + '₮'
    )
  }

  const currencyTableFormat = (num) => {
    return parseFloat(num)
      .toFixed(0)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const dateFormat = (dataTable) => {
    const d = new Date(dataTable)
    const monthName = d.getFullYear() + '.' + d.getMonth() + '.' + d.getDate()
    return monthName
  }

  const interestTablePayment = (dataTable) => {
    return `${currencyTableFormat(dataTable.interest)}`
  }

  const totalTablePayment = (dataTable) => {
    return `${currencyTableFormat(dataTable.totalPayment)}`
  }

  const mainTablePayment = (dataTable) => {
    return `${currencyTableFormat(dataTable.mainPayment)}`
  }

  const balanceTablePayment = (dataTable) => {
    return `${currencyTableFormat(dataTable.balance)}`
  }

  const dateF = (dataTable) => {
    return `${dateFormat(dataTable.date)}`
  }

  return (
    <div>
      <div className='loan-calculator-option'>
        {categories.map((category) => (
          <div key={category.key} className='field-radiobutton'>
            <RadioButton
              inputId={category.key}
              className='loan-calculator-option-icon'
              name='category'
              value={category}
              onChange={(e) => setSelectedCategory(e.value)}
              checked={selectedCategory.key === category.key}
              // disabled={category.key === 'C'}
            />
            <label
              className='loan-calculator-option-txt'
              htmlFor={category.key}
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>

      <div className='loan-calculator-content'>
        <div className='grid p-fluid calculator-content-grid'>
          <div className='field col-12 md:col-6 '>
            <label htmlFor='horizontal'>Зээлийн хэмжээ(₮)</label>
            <InputNumber
              inputId='horizontal'
              value={amount}
              onValueChange={(e) => setAmount(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={10000}
              suffix={amount > 0 && '₮'}
              max={data && data.max_limit_price}
              min={data && data.min_limit_price}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6 '>
            <label htmlFor='horizontal'>Зээлийн хүү(сар)</label>
            <InputNumber
              inputId='horizontal'
              value={annualRate}
              onValueChange={(e) => setAnnualRate(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={0.1}
              max={data && data.max_limit_rate}
              min={data && data.min_limit_rate}
              suffix={annualRate > 0 && '%'}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Зээлийн хугацаа(сар)</label>
            <InputNumber
              inputId='horizontal'
              value={duration}
              onValueChange={(e) => setDuration(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              suffix={duration > 0 && 'сар'}
              max={data && data.max_limit_month}
              min={data && data.min_limit_month}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
          <div className='field col-12 md:col-6'>
            <label htmlFor='horizontal'>Хөнгөлөлттэй хугацаа(сар)</label>
            <InputNumber
              inputId='horizontal'
              value={durationSkip}
              onValueChange={(e) => setDurationSkip(e.value)}
              showButtons
              buttonLayout='horizontal'
              step={1}
              suffix={durationSkip > 0 && 'сар'}
              max={data && data.max_limit_discount_month}
              min={data && data.min_limit_discount_month}
              decrementButtonClassName='p-button-danger'
              incrementButtonClassName='p-button-success'
              incrementButtonIcon='pi pi-plus'
              decrementButtonIcon='pi pi-minus'
            />
          </div>
        </div>
        <div className='loan-calculator-content-amount'>
          <div className='loan-calculator-content-amount-date'>
            <label
              className='loan-calculator-content-amount-date-title'
              htmlFor='horizontal'
            >
              Зээл эхлэх огноо
            </label>
            <Calendar
              dateFormat='yy.mm.dd'
              id='icon'
              value={date}
              onChange={(e) => setDate(e.value)}
              showIcon
              className='loan-calculator-content-amount-date-input'
            />
          </div>

          <div className='loan-calculator-content-amount-payment'>
            <div className='loan-calculator-content-amount-payment-loanPayment'>
              <label>Зээлийн сарын төлбөр</label>
              <p>{currencyFormat(monthlyPayment)}</p>
            </div>
            <div className='loan-calculator-content-amount-payment-line'></div>
            <div className='loan-calculator-content-amount-payment-balancePayment'>
              <label htmlFor='horizontal'>Төлбөл зохих нийт хэмжээ</label>
              <p>{currencyFormat(totalPayment)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='loan-calculator-table'>
        <h1 className='loan-calculator-table-title'>
          Эргэн төлөлтийн хуваарилалт
        </h1>
        <DataTable
          value={
            // see == true
            dataTable.length > 4 ? dataTable.slice(0, 5) : dataTable
            // : // : dataTable.length > 4
            // dataTable.splice(0, 4)
            // : dataTable
          }
          resizableColumns
          columnResizeMode='fit'
          showGridlines
          className='loan-calculator-table-body'
        >
          <Column
            field='date'
            dateFormat='yy.mm.dd'
            header='Огноо'
            body={dateF}
            style={{ width: '20%' }}
          />
          <Column
            field='number'
            header='Төлөлтийн дугаар'
            style={{ width: '20%' }}
            className='loan-calculator-table-body-header'
          />
          <Column
            field='days'
            header='Хүү тооцсон хоног'
            style={{ width: '20%' }}
            className='loan-calculator-table-body-header'
          />
          <Column
            field='interest'
            header='Зээлийн хүү'
            style={{ width: '20%' }}
            body={interestTablePayment}
            className='loan-calculator-table-body-header'
          />
          <Column
            field='mainPayment'
            header='Үндсэн төлбөр'
            style={{ width: '20%' }}
            body={mainTablePayment}
            className='loan-calculator-table-body-header'
          />
          <Column
            field='totalPayment'
            header='Нийт төлбөр'
            style={{ width: '20%' }}
            body={totalTablePayment}
            className='loan-calculator-table-body-header'
          />
          <Column
            field='balance'
            header='Зээлийн үлдэгдэл'
            style={{ width: '20%' }}
            body={balanceTablePayment}
            className='loan-calculator-table-body-header'
          />
        </DataTable>

        <div className='loan-calculator-table-click'>
          <Button
            label='Хүснэгтийг бүтнээр харах'
            className='loan-calculator-table-click-btn'
            onClick={() => {
              setSee(!see)
              console.log(see)
            }}
          />
        </div>
      </div>

      <div className='loan-calculator-product'>
        <h1 className='loan-calculator-product-title'>
          Танд санал болгож буй бүтээгдэхүүн
        </h1>
        {lists &&
          lists.map((item, index) => (
            <div className='loan-calculator-product-content'>
              <ProductCard
                list={item.content}
                isLoan
                subMenu={index}
                sendRequest
              />
            </div>
          ))}
      </div>
    </div>
  )
}

export default ConsumerLoan
