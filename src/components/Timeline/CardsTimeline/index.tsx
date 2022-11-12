import './swiper.scss'
import 'swiper/scss'
import 'swiper/scss/navigation'
import 'swiper/scss/pagination'

import React, { memo, useCallback, useEffect, useState } from 'react'

import { format } from 'date-fns'
import { Keyboard, Navigation, Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'

import CloudRain from '../../../assets/icons/cloudRain.svg'
import Humidity from '../../../assets/icons/humidityLine.svg'
import WeatherLess from '../../../assets/icons/thermometer-colder.svg'
import WeatherHigh from '../../../assets/icons/thermometer-warmer.svg'
import Thermometer from '../../../assets/icons/thermometer.svg'
import Irradiation from '../../../assets/icons/uv-index.svg'
import Wind from '../../../assets/icons/wind.svg'

import { apiFake } from '../../../hooks/useRequestData'
import { ITimeline } from '../../../types'

import styles from './styles.module.scss'
import { dataUnit, displayData } from '../../utils'

export function CardsTimeline() {
  const [timelineData, setTimelineData] = useState<ITimeline[]>([])

  const [card, setCard] = useState<string>('')

  const test = useCallback(
    (date: Date): void => setCard(card !== date ? date : ''),
    [card],
  )

  useEffect(() => {
    apiFake
      .get('/timeline')
      .then((response: { data: ITimeline[] }) => setTimelineData(response.data))
      .catch((error: any) => console.log(error))
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
      {timelineData.map((timeline) => (
        <React.Fragment key={timeline.blockId}>
          {timeline.line.map((line, index) => (
            <SwiperSlide key={index} tag="div" className={styles.mySwiper}>
              <>
                <div
                  role="button"
                  onClick={() => test(line.date)}
                  className={styles.card}
                >
                  <div
                    className={
                      line.alerts ? styles.cardDayAlert : styles.cardDayNormal
                    }
                  >
                    <span>{format(new Date(line.date), 'dd/MM')}</span>
                  </div>
                  <div className={styles.infoContainer}>
                    <div className={styles.infoHeader}>
                      <img
                        src={CloudRain}
                        alt=""
                        className={styles.iconHeader}
                      />
                      <span>{displayData(line.rain, dataUnit.rain)}</span>
                    </div>
                    <div className={styles.infoInside}>
                      <div className="d-flex flex-column">
                        <span className={styles.infoWeather}>
                          <img
                            src={Wind}
                            alt=""
                            className={styles.iconHeader}
                          />
                          {displayData(line.windSpeed, dataUnit.windSpeed)}
                        </span>
                        <span className={styles.infoWeather}>
                          <img
                            src={Humidity}
                            alt=""
                            className={styles.iconHeader}
                          />
                          {displayData(
                            line.relativeHumidity,
                            dataUnit.relativeHumidity,
                          )}
                        </span>
                        <span className={styles.infoWeather}>
                          <img
                            src={Irradiation}
                            alt=""
                            className={styles.iconHeader}
                          />
                          {displayData(
                            line.solarIrradiation,
                            dataUnit.solarRadiation,
                          )}
                        </span>
                        <span className={styles.infoWeather}>
                          <img
                            src={Thermometer}
                            alt=""
                            className={styles.iconHeader}
                          />
                          {displayData(
                            line.temperatureAverage,
                            dataUnit.temperature,
                          )}
                        </span>
                      </div>
                      <div className="d-flex flex-column-reverse">
                        <span
                          className={styles.infoWeather}
                          style={{ color: '#F10808' }}
                        >
                          <img
                            src={WeatherHigh}
                            alt=""
                            className={styles.iconHeader}
                          />
                          {displayData(
                            line.temperatureMax,
                            dataUnit.temperature,
                          )}
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
                          {displayData(
                            line.temperatureMin,
                            dataUnit.temperature,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </SwiperSlide>
          ))}
        </React.Fragment>
      ))}
    </Swiper>
  )
}

export default memo(CardsTimeline)
