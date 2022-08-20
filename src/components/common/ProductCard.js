import React, { useEffect, useRef, createRef, useState } from 'react'
import ArrowRightBlack from '../assets/icons/json/arrow_right_w.json'
import ArrowRightWhite from '../assets/icons/json/arrow_right_c.json'
import { Checkbox } from 'primereact/checkbox'
import lottie from 'lottie-web'
import { useRouter } from 'next/router'
import {
  assetsUrl,
  siteTypeState,
  siteUrlAtom
} from '@/gateway/modules/common/common.atoms'
import { useRecoilValue, useRecoilState } from 'recoil'

const ProductCard = (props) => {
  console.log(props)
  const router = useRouter()
  const url = useRecoilValue(assetsUrl)
  const siteUrl = useRecoilValue(siteUrlAtom)
  let [list, setList] = useState(router.asPath.split('/'))
  let productListIcon = useRef([])
  const [checked, setChecked] = useState(false)

  console.log('product list: ', props.Compare)

  productListIcon = Array(props.list.length)
    .fill()
    .map((_, i) => productListIcon[i] || createRef())
  const siteType = useRecoilValue(siteTypeState)
  console.log('--->', siteType)

  const startLotties = (tdata) => {
    if (tdata.length > 0) {
      tdata.map((t, index) => {
        lottie.loadAnimation({
          name: t.slug + t.id.toString(),
          container: productListIcon[index].current,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          animationData:
            siteType === 'corporate' ? ArrowRightBlack : ArrowRightWhite
        })
      })
    }
  }
  useEffect(() => {
    setList(router.asPath.split('/'))
  }, [router.asPath])

  useEffect(() => {
    removeAllChildNodes()
    startLotties(props.list)
  }, [props])

  const removeAllChildNodes = () => {
    props.list.map((p) => {
      if (p.current && p.current.firstChild) {
        while (p.current.firstChild) {
          p.current.removeChild(p.current.firstChild)
        }
      }
    })
  }

  const openInNewTab = (id) => {
    const newWindow = window.open(
      `${siteUrl}/form/?id=${id}`,
      '_blank',
      'noopener,noreferrer'
    )
    if (newWindow) newWindow.opener = null
  }

  return (
    <div>
      {props.list && props.list.length > 0
        ? props.list.map((item, index) => (
            <div
              className={
                props.isLoan ? 'product-list' : 'product-list simple-product'
              }
              key={index}
            >
              <div className='grid'>
                <div className='col-12 sm:col-4 flex align-items-center'>
                  <div
                    className='product-img '
                    style={{
                      backgroundImage:
                        item.photo !== null
                          ? `url("${url}${item.photo}")`
                          : `url('/assets/images/news-grid-default.png)`
                    }}
                  />
                </div>
                <div className='product-detail col-12 sm:col-8'>
                  <div className='grid'>
                    <div className='col-12'>
                      <h3 className='product-detail-title'> {item.title} </h3>
                    </div>
                  </div>
                  <div className='grid'>
                    <div className='col-12'>
                      <p
                        className='product-detail-text'
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></p>
                    </div>
                  </div>
                  {item.Compare && item.Compare.length > 0 && (
                    <div className='grid'>
                      {item.Compare.map((item, index) => {
                        return (
                          <div className='col-6 md:col-3 detail-col'>
                            <p className='detail-title'>
                              {item.Category && item.Category.title}
                            </p>
                            <p className='detail-content'>{item.info}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <div className='product-list-bottom'>
                    <div className='product-list-btns'>
                      {item.has_request == 1 && (
                        <div
                          className='product-list-send-request'
                          onClick={() => {
                            openInNewTab(item.requestlink)
                          }}
                        >
                          <p className='see-full'>Хүсэлт илгээх</p>
                        </div>
                      )}
                      <div
                        className='product-list-read-more'
                        onMouseEnter={() =>
                          lottie.play(item.slug + item.id.toString())
                        }
                        onMouseLeave={() =>
                          lottie.stop(item.slug + item.id.toString())
                        }
                        onClick={() => {
                          router.push(
                            {
                              pathname: `/${siteType}/${list[2]}/detail/${item.id}`,
                              shallow: true
                            },
                            `/${siteType}/${list[2]}/detail/${item.id}`
                          )
                        }}
                      >
                        <p className='see-full'>
                          Цааш үзэх
                          <span
                            className='arrow-right'
                            ref={productListIcon[index]}
                          />
                        </p>
                      </div>
                    </div>

                    <div className='product-list-compare'>
                      <Checkbox
                        style={{ height: '24px', width: '24px' }}
                        inputId='binary'
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                      />
                      <label className='checkboxTxt' htmlFor='binary'>
                        Харьцуулах
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        : ''}
    </div>
  )
}

export default ProductCard
