import { memo, useCallback, useEffect, useState } from 'react'
import CloudRain from '../../../assets/icons/cloudRain.svg'
import Humidity from '../../../assets/icons/humidityLine.svg'
import WeatherLess from '../../../assets/icons/thermometer-colder.svg'
import WeatherHigh from '../../../assets/icons/thermometer-warmer.svg'
import Thermometer from '../../../assets/icons/thermometer.svg'
import Irradiation from '../../../assets/icons/uv-index.svg'
import Wind from '../../../assets/icons/wind.svg'

import { format } from 'date-fns'
import { Keyboard, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'
import { apiFake } from '../../../hooks/useRequestData'
import { ITimeline } from '../../../types/types'
import styles from './styles.module.scss'
import './swiper.scss'

export function CardsTimeline() {
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])

  const [card, setCard] = useState('')
  const test = useCallback(
    (date: string) => {
      if (card !== date) {
        setCard(date)
      } else {
        setCard('')
      }
    },
    [card],
  )

  useEffect(() => {
    apiFake
      .get('/timeline')
      .then((response) => {
        setTimelineData(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  return (
    <Swiper
      initialSlide={11}
      keyboard={{
        enabled: true,
      }}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
          centeredSlides: true,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
          centeredSlides: true,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 20,
        },
      }}
      navigation={true}
      modules={[Keyboard, Pagination, Navigation]}
      className={styles.swiperNavigation}
    >
      <div>
        {timelineData.map((timeline) => (
          <>
            {timeline.line.map((line) => {
              return (
                <SwiperSlide
                  tag="div"
                  className={styles.mySwiper}
                  key={line.date}
                >
                  <>
                    <div
                      onClick={() => test(line.date)}
                      className={styles.card}
                    >
                      <div
                        className={
                          line.alerts
                            ? styles.cardDayAlert
                            : styles.cardDayNormal
                        }
                      >
                        <span> {format(new Date(line.date), 'dd/MM')}</span>
                      </div>
                      <div className={styles.infoContainer}>
                        <div className={styles.infoHeader}>
                          <img
                            src={CloudRain}
                            alt=""
                            className={styles.iconHeader}
                          />
                          <span>{parseInt(line.rain).toFixed(0)}mm</span>
                        </div>
                        <div className={styles.infoInside}>
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span className={styles.infoWeather}>
                              <img
                                src={Wind}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.windSpeed).toFixed(0)}Km/h
                            </span>
                            <span className={styles.infoWeather}>
                              <img
                                src={Humidity}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.relativeHumidity).toFixed(0)}%
                            </span>
                            <span className={styles.infoWeather}>
                              <img
                                src={Irradiation}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.solarIrradiation)}Wh/m
                            </span>
                            <span className={styles.infoWeather}>
                              <img
                                src={Thermometer}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.temperatureAverage).toFixed(0)}ºC
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column-reverse',
                            }}
                          >
                            <span
                              className={styles.infoWeather}
                              style={{ color: '#F10808' }}
                            >
                              <img
                                src={WeatherHigh}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.temperatureMax).toFixed(0)}ºC
                            </span>
                            <span
                              className={styles.infoWeather}
                              style={{ color: '#3FA5DE' }}
                            >
                              <img
                                src={WeatherLess}
                                alt=""
                                className={styles.iconHeader}
                              />
                              {parseInt(line.temperatureMin).toFixed(0)}ºC
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </SwiperSlide>
              )
            })}
          </>
        ))}
      </div>
    </Swiper>
  )
}

export default memo(CardsTimeline)
