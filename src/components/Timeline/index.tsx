import 'swiper/css'
import 'swiper/css/navigation'
import './timeline.scss'

import React, { memo, useCallback, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { format, isAfter, isBefore, isSameDay, isToday } from 'date-fns'

import { apiFake } from '../../hooks/useRequestData'
import { ILine } from '../../types'
import { dataUnit, displayData } from '../utils'

export const Timeline = (): React.ReactElement => {
  const [timelineData, setTimelineData] = useState<ILine[]>([])
  const [card, setCard] = useState<Date | string>('')

  useEffect(() => {
    apiFake
      .get('/timeline')
      .then((response) => setTimelineData(response.data[0].line))
      .catch((error: any) => console.log(error))
  }, [])

  const handleClick = useCallback(
    (date: Date | string): void => setCard(card !== date ? date : ''),
    [card],
  )

  const dayContainerClasses = useCallback((item: ILine): string => {
    let classes = 'rounded-1 d-flex flex-column p-2'
    const checkIsToday: boolean = isToday(new Date(item.date))
    const checkIsPast: boolean =
      isBefore(new Date(item.date), new Date()) &&
      !isSameDay(new Date(item.date), new Date())
    const checkIsFuture: boolean = isAfter(new Date(item.date), new Date())

    if (checkIsToday) classes += ' day-today'
    if (checkIsPast) classes += ' day-before'
    if (checkIsFuture) classes += ' day-after'
    if (item.alerts) classes += ' has-alerts'

    return classes
  }, [])

  const formatDate = useCallback(
    (item: ILine): string => format(new Date(item.date), 'dd/MM'),
    [],
  )

  const displayRain = useCallback((item: ILine): React.ReactElement => {
    const isPast: boolean =
      isBefore(new Date(item.date), new Date()) ||
      isSameDay(new Date(item.date), new Date())
    const isFuture: boolean = isAfter(new Date(item.date), new Date())
    const hasRain: boolean = item.rain >= 0.2
    const icoRain: React.ReactElement = (
      <svg
        className="ico-sensor ico-rain"
        viewBox="0 0 64 64"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <path d="M53.2,38H10.8C4.8,38,0,33.3,0,27.6c0-4.8,3.4-8.9,8.1-10.1c1.7-6.9,8.3-11.7,15.8-11.4c3.5-3.9,8.6-6.2,14-6.2 c5.4,0,10.5,2.2,14,6.1c3,3.3,4.5,7.3,4.6,11.6c4.4,1.4,7.5,5.3,7.5,9.9C64,33.3,59.2,38,53.2,38z M23.1,10.1 c-5.6,0-10.6,4-11.3,9.4l-0.2,1.6l-1.6,0.2C6.6,21.6,4,24.3,4,27.6c0,3.5,3.1,6.4,6.8,6.4h42.4c3.7,0,6.8-2.9,6.8-6.4 c0-3.2-2.5-5.9-5.8-6.3L52.3,21l0.2-1.9c0.4-3.8-0.9-7.4-3.5-10.3C46.2,5.8,42.2,4,37.9,4c-4.6,0-8.8,2-11.6,5.5l-0.7,0.9l-1.1-0.1 C24,10.2,23.6,10.1,23.1,10.1z" />
        <path d="M33.7,40.6c-1-0.4-2,0.2-2.4,1.1l-6.1,16.6c-0.4,1,0.1,2.1,1.1,2.4c1,0.4,2-0.2,2.4-1.1L34.8,43C35.2,42,34.7,41,33.7,40.6z" />
        <path d="M23.9,40.6c-1-0.4-2,0.2-2.4,1.1l-2.2,6c-0.4,1,0.1,2.1,1.1,2.4c1,0.4,2-0.2,2.4-1.1l2.2-6C25.4,42,24.9,41,23.9,40.6z" />
        <path d="M38.9,53.4c-1-0.4-2,0.2-2.4,1.1l-2.5,7c-0.3,1,0.2,2.1,1.1,2.4s2-0.2,2.4-1.1l2.5-7C40.3,54.8,39.8,53.7,38.9,53.4z" />
        <path d="M43.5,40.6c-1-0.4-2,0.2-2.4,1.1L39,47.5c-0.3,1,0.2,2.1,1.1,2.4s2-0.2,2.4-1.1l2.1-5.7C45,42,44.5,41,43.5,40.6z" />
      </svg>
    )
    const icoProbRain: React.ReactElement = (
      <svg
        className="ico-sensor ico-prob-rain"
        viewBox="0 0 512 512"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <path d="M409.9,205.8L256,0L102.2,205.9c-24.8,33.2-37.9,72.8-37.9,114.4C64.3,426,150.3,512,256,512 s191.7-86,191.7-191.7C447.7,278.6,434.6,239.2,409.9,205.8z M256,480.3c-88.2,0-160-71.8-160-160c0-34.7,11-67.8,31.6-95.4 L256,52.9l128.4,171.9c20.7,27.8,31.6,60.8,31.6,95.5C416,408.5,344.2,480.3,256,480.3z" />
      </svg>
    )
    const icoProbNoRain: React.ReactElement = (
      <svg
        className="ico-sensor ico-prob-norain"
        viewBox="0 0 512 512"
        aria-hidden="true"
        style={{ opacity: 0.6 }}
      >
        <path d="M461.7,119.6l-78.7,50L256.3,0L102.5,205.9c-24.8,33.2-37.9,72.8-37.9,114.4c0,15.3,1.8,30.1,5.2,44.3 l-68,38.6l22.5,36.1l460-283.6L461.7,119.6z M96.3,320.2c0-34.7,11-67.8,31.6-95.4L256.3,52.9l99.7,133.5L98.6,346.8 C97.1,338.2,96.3,329.3,96.3,320.2z" />
        <path d="M394.5,239.5c14.4,24.4,21.8,52,21.8,80.8c0,88.2-71.8,160-160,160c-55.6,0-104.7-28.5-133.4-71.8L96,425.3 c34.3,52.1,93.3,86.7,160.2,86.7c105.7,0,191.7-86,191.7-191.7c0-34.7-9.2-68.1-26.6-97.5L394.5,239.5z" />
      </svg>
    )
    const displayValue: React.ReactElement = (
      <div className="text-left text-nowrap">
        <span className="h5 fw-bold mb-0">{displayData(item.rain, 1)}</span>
        <span style={{ opacity: 0.6 }}>{dataUnit.rain}</span>
      </div>
    )

    return (
      <div className="d-flex justify-content-center align-items-center gap-2 py-2">
        {isPast && hasRain && icoRain}
        {isFuture && hasRain && icoProbRain}
        {isFuture && !hasRain && icoProbNoRain}
        {(isPast || (isFuture && hasRain)) && displayValue}
      </div>
    )
  }, [])

  const displayTemperatureAverage = useCallback(
    (temperature: number): React.ReactElement => {
      return (
        <div className="d-flex gap-2">
          <svg
            className="ico-sensor"
            viewBox="0 0 290 290"
            aria-hidden="true"
            style={{ opacity: 0.6 }}
          >
            <path d="M144.998,0.004 c-4.318,0-8.636,1.117-12.5,3.348c-7.728,4.462-12.5,12.727-12.5,21.65l0.164,182.652c-15.904,10.584-23.605,30.141-18.674,48.826 c5.195,19.686,23.025,33.461,43.385,33.518c20.359,0.056,38.266-13.619,43.57-33.275c5.038-18.669-2.549-38.364-18.418-49.051 l-0.025-182.676c-0.001-8.923-4.773-17.187-12.5-21.648C153.637,1.117,149.319,0,145.001,0L144.998,0.004z M144.998,10.002 c2.588,0,5.176,0.672,7.5,2.014c4.648,2.684,7.5,7.623,7.5,12.99v5h-5c-6.762-0.096-6.762,10.096,0,10H160v10h-5.004 c-6.762-0.096-6.762,10.096,0,10h5.006v10h-5.006c-6.762-0.096-6.762,10.096,0,10h5.008l0.019,130.264 c0,1.785,0.952,3.435,2.498,4.328c13.729,7.941,20.402,24.203,16.266,39.527c-4.137,15.33-18.01,25.925-33.889,25.881 c-15.878-0.044-29.692-10.718-33.744-26.07c-4.052-15.353,2.697-31.451,16.486-39.324c1.56-0.891,2.523-2.549,2.521-4.346 l-0.166-185.264c0-5.365,2.853-10.303,7.5-12.986c2.324-1.342,4.912-2.014,7.5-2.014H144.998z M144.922,91.498 c-2.759,0.042-4.963,2.311-4.924,5.07v129.098c-8.821,2.278-14.989,10.229-15,19.34c0,11.046,8.954,20,20,20l0,0 c11.046,0,20-8.954,20-20l0,0c-0.007-9.114-6.175-17.071-15-19.35V96.568c0.039-2.761-2.168-5.031-4.93-5.07 C145.02,91.497,144.971,91.497,144.922,91.498z" />
          </svg>
          <div>
            <span className="h6 fw-bold mb-0">
              {displayData(temperature, 1)}
            </span>
            <small style={{ opacity: 0.6 }}>{dataUnit.temperature}</small>
          </div>
        </div>
      )
    },
    [],
  )

  const displayRelativeHumidity = useCallback(
    (relativeHumidity: number): React.ReactElement => (
      <div className="d-flex gap-2">
        <svg
          className="ico-sensor"
          viewBox="0 0 512 512"
          aria-hidden="true"
          style={{ opacity: 0.6 }}
        >
          <path d="M409.9,205.8L256,0L102.2,205.9c-24.8,33.2-37.9,72.8-37.9,114.4C64.3,426,150.3,512,256,512s191.7-86,191.7-191.7 C447.7,278.6,434.6,239.2,409.9,205.8z M256,480.3c-88.2,0-160-71.8-160-160c0-34.7,11-67.8,31.6-95.4L256,52.9l128.4,171.9 c20.7,27.8,31.6,60.8,31.6,95.5C416,408.5,344.2,480.3,256,480.3z" />
          <path d="M135,271.8c0-17.6,5.7-32.3,17-44c11.4-11.7,25.8-17.5,43.5-17.5c14.2,0,25.2,3.6,32.8,10.9c7.6,7.3,11.4,17.8,11.4,31.5 c0,7.5-1.5,15.6-4.6,24.4c-3,8.8-7.2,16.4-12.5,22.9c-5.6,7-12.2,12.2-19.7,15.6c-7.5,3.5-16,5.2-25.3,5.2 c-13.7,0-24.3-4.4-31.6-13.1C138.7,299.1,135,287.1,135,271.8z M197.5,262.4c0-9-0.8-15.8-2.3-20.5c-1.5-4.7-3.7-7-6.6-7 c-3.9,0-7,2.8-9.2,8.5c-2.2,5.7-3.3,13.3-3.3,23c0,8.3,0.9,15.3,2.8,21.1c1.9,5.8,4.4,8.6,7.6,8.6c3.6,0,6.3-3,8.1-8.9 C196.6,281.4,197.5,273.1,197.5,262.4z M279.4,205.7c6.3,1,12.6,3.3,19.1,6.7c6.4,3.5,12.1,7.8,17,12.8 c-13.6,31.5-28.4,62.8-44.6,93.8c-16.2,31-35.4,64.7-57.6,101.2c-5.4-1.2-10.4-2.9-15-5.2c-4.6-2.3-9.2-5.4-14-9.3 c20.3-34.6,39.1-69.8,56.2-105.7C257.6,264.1,270.6,232.7,279.4,205.7z M272.3,365.9c0-17.6,5.7-32.3,17-44 c11.4-11.7,25.8-17.5,43.5-17.5c14.2,0,25.2,3.6,32.8,10.9c7.6,7.3,11.4,17.8,11.4,31.5c0,7.5-1.5,15.6-4.6,24.4 c-3,8.8-7.2,16.4-12.5,22.9c-5.6,7-12.2,12.2-19.7,15.6c-7.5,3.5-16,5.2-25.3,5.2c-13.7,0-24.3-4.4-31.6-13.1 C276,393.1,272.3,381.1,272.3,365.9z M334.8,356.5c0-9-0.8-15.8-2.3-20.5c-1.5-4.7-3.7-7-6.6-7c-3.9,0-7,2.8-9.2,8.5 c-2.2,5.7-3.3,13.3-3.3,23c0,8.3,0.9,15.3,2.8,21.1c1.9,5.8,4.4,8.6,7.6,8.6c3.6,0,6.3-3,8.1-8.9 C333.9,375.5,334.8,367.1,334.8,356.5z" />
        </svg>
        <div>
          <span className="h6 fw-bold mb-0">
            {displayData(relativeHumidity)}
          </span>
          <small style={{ opacity: 0.6 }}>{dataUnit.relativeHumidity}</small>
        </div>
      </div>
    ),
    [],
  )

  /* const displayAtmosphericPressure = useCallback(
    (atmosphericPressure?: number): React.ReactElement => {
      return (
        <div className="d-flex gap-2">
          <svg className="ico-sensor" viewBox="0 0 512 512" aria-hidden="true">
            <g transform="translate(256,256)">
              <path d="M-217.9,130c-4.1,0-8.1-2.3-10-6.2c-21.7-45-31.1-94.5-27.4-143c3.9-50.4,22.1-97.4,52.5-136 c33.3-42.2,75.8-71.9,126.4-88.2c25.2-8.1,52.2-12.6,76-12.6c90.4,0,180.8,53.1,224.9,132.1C252.4-74.3,262-16.8,252.4,42.2 c-7.5,46.2-24.3,78.4-26.1,82c-2.9,5.4-9.6,7.4-14.9,4.5c-5.4-2.9-7.4-9.5-4.5-14.9c2.5-4.7,60.7-115.9-1.4-227 C164.9-185.5,82.3-234-0.3-234c-26.3,0-117.5,6.7-185.1,92.3c-55,69.7-63.8,170.2-22.6,255.9c2.6,5.5,0.3,12.1-5.2,14.7 C-214.6,129.7-216.3,130-217.9,130z" />
              <use xlinkHref="#barometerTick" transform="rotate(-115)" />
              <use xlinkHref="#barometerTick" transform="rotate(-76.666)" />
              <use xlinkHref="#barometerTick" transform="rotate(-38.333)" />
              <path
                id="barometerTick"
                d="M0-170c-6.1,0-11-4.9-11-11v-22c0-6.1,4.9-11,11-11s11,4.9,11,11v22C11-174.9,6.1-170,0-170z"
              />
              <use xlinkHref="#barometerTick" transform="rotate(38.333)" />
              <use xlinkHref="#barometerTick" transform="rotate(76.666)" />
              <use xlinkHref="#barometerTick" transform="rotate(115)" />
              <path d="M0.9,171c-0.9,0-1.7,0-2.3-0.1c-0.2,0-0.5-0.1-0.7-0.1c-0.4-0.1-1.2-0.2-1.9-0.3c-5.1-0.7-14.6-2-23.7-9.8 c-5.7-4.9-8.3-10.4-10.1-14.1c-0.4-0.8-0.7-1.5-1-1.9c-0.2-0.4-0.4-0.7-0.5-1.1c-0.3-0.7-0.5-1.5-0.7-2.2c-2.3-9-1.9-18.7,1.3-27.3 c1.3-3.4,3-6.7,5.1-9.7c1.8-2.6,2.9-5.7,3.2-8.8L-11-117.5c0.5-5.7,5.3-10,11-10s10.4,4.3,11,10L30.3,93.2c0.3,3.8,1.9,7.3,4.3,10.3 c1.8,2.2,3.7,5,5.5,8.7c5.4,11.5,3.1,26.4,1.2,31.9c-1.8,5.4-8,14-14.7,18.9C18.3,169,7,171,0.9,171z" />
            </g>
          </svg>
          <div>
            <span className="h6 fw-bold mb-0">
              {displayData(atmosphericPressure, 1)}
            </span>
            {atmosphericPressure !== undefined && (
              <small style={{ opacity: 0.6 }}>
                {dataUnit.atmosphericPressure}
              </small>
            )}
          </div>
        </div>
      )
    },
    [],
  ) */

  const displayWindSpeed = useCallback(
    (windSpeed?: number): React.ReactElement => {
      const hasSpeed: boolean = windSpeed !== undefined && windSpeed >= 0.3

      return (
        <div className="d-flex gap-2">
          {/* <svg
            className="ico-sensor has-stroke"
            viewBox="0 0 64 64"
            aria-hidden="true"
            style={{ opacity: 0.6 }}
          >
            <path
              d="M43.64,20a5,5,0,1,1,3.61,8.46H11.75"
              fill="none"
              strokeDasharray="35 22"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={3}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="-57; 57"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M29.14,44a5,5,0,1,0,3.61-8.46h-21"
              fill="none"
              strokeDasharray="24 15"
              strokeLinecap="round"
              strokeMiterlimit={10}
              strokeWidth={3}
            >
              <animate
                attributeName="stroke-dashoffset"
                values="-39; 39"
                dur="2s"
                begin="-1.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg> */}
          <svg
            className="ico-sensor"
            viewBox="0 0 512 512"
            aria-hidden="true"
            style={{ opacity: 0.6 }}
          >
            <path d="M193,449.5c16.3,13,36.6,20.2,57.4,20.2c50.5,0,91.7-41.2,91.7-91.7c0-50.5-41-91.7-91.7-91.7H15c-8.3,0-15,6.6-15,15 c0,8.3,6.6,15,15,15h235.4c34,0,61.7,27.6,61.7,61.7c0,34-27.6,61.7-61.7,61.7c-14,0-27.7-4.8-38.6-13.6 c-6.5-5.2-15.8-4.2-21.1,2.3C185.5,435,186.5,444.3,193,449.5z" />
            <path d="M196.1,361c0-8.3-6.6-15-15-15H91c-8.3,0-15,6.6-15,15c0,8.3,6.6,15,15,15h90.1C189.4,376,196.1,369.3,196.1,361z" />
            <path d="M79.2,181.3c0,8.3,6.6,15,15,15h160.3c8.3,0,15-6.6,15-15c0-8.3-6.6-15-15-15H94.2C86,166.3,79.2,173,79.2,181.3z" />
            <path d="M405,42.2c-24.2,0-48,8.5-66.9,23.6c-6.4,5.2-7.5,14.6-2.3,21.1c5.2,6.4,14.6,7.5,21.1,2.3c13.7-10.9,30.8-17,48.2-17 c42.4,0,77,34.5,77,77s-34.5,77-77,77H123.1c-8.3,0-15,6.6-15,15c0,8.3,6.6,15,15,15h282.1c59,0,107-48,106.8-107 C512,90.2,464,42.2,405,42.2z" />
            <path d="M0,181.3c0,8.3,6.6,15,15,15h20.2c8.3,0,15-6.6,15-15c0-8.3-6.6-15-15-15H15C6.6,166.3,0,173,0,181.3z" />
          </svg>

          <div>
            <span className="h6 fw-bold mb-0">
              {hasSpeed ? displayData(windSpeed, 1) : '--'}
            </span>
            {hasSpeed && (
              <small style={{ opacity: 0.6 }}>{dataUnit.windSpeed}</small>
            )}
          </div>
        </div>
      )
    },
    [],
  )

  const displaySolarIrradiation = useCallback(
    (solarIrradiation?: number): React.ReactElement => (
      <div className="d-flex gap-2">
        {/* <svg
          className="ico-sensor"
          viewBox="0 0 64 64"
          aria-hidden="true"
          style={{ opacity: 0.6 }}
        >
          <circle r={10.5} transform="translate(32,32)" />
          <path
            className="has-stroke"
            d="M32,15.71V9.5m0,45V48.29M43.52,20.48l4.39-4.39M16.09,47.91l4.39-4.39m0-23-4.39-4.39M47.91,47.91l-4.39-4.39M15.71,32H9.5m45,0H48.29"
            fill="none"
            strokeLinecap="round"
            strokeMiterlimit={10}
            strokeWidth={3}
          >
            <animateTransform
              attributeName="transform"
              dur="45s"
              values="0 32 32; 360 32 32"
              repeatCount="indefinite"
              type="rotate"
            />
          </path>
        </svg> */}
        <svg
          className="ico-sensor"
          viewBox="0 0 512 512"
          aria-hidden="true"
          style={{ opacity: 0.6 }}
        >
          <path d="M256,388.7c-75.9,0-132.7-56.9-132.7-132.7S180.1,123.3,256,123.3S388.7,180.1,388.7,256S331.9,388.7,256,388.7z M256,170.7 c-47.4,0-85.3,37.9-85.3,85.3s37.9,85.3,85.3,85.3s85.3-37.9,85.3-85.3S303.4,170.7,256,170.7z" />
          <g transform="translate(256,256)">
            <rect id="sunShine" x="-19" y="-256" width="38" height="86" />
            <use xlinkHref="#sunShine" transform="rotate(45)" />
            <use xlinkHref="#sunShine" transform="rotate(90)" />
            <use xlinkHref="#sunShine" transform="rotate(135)" />
            <use xlinkHref="#sunShine" transform="rotate(180)" />
            <use xlinkHref="#sunShine" transform="rotate(225)" />
            <use xlinkHref="#sunShine" transform="rotate(270)" />
            <use xlinkHref="#sunShine" transform="rotate(315)" />
          </g>
        </svg>

        <div>
          <span className="h6 fw-bold mb-0">
            {displayData(solarIrradiation)}
          </span>
          {solarIrradiation !== undefined && (
            <small style={{ opacity: 0.6 }}>{dataUnit.solarRadiation}</small>
          )}
        </div>
      </div>
    ),
    [],
  )

  return (
    <div className="timeline-container">
      <Swiper
        navigation={true}
        initialSlide={14}
        modules={[Navigation]}
        slidesPerView={'auto'}
        spaceBetween={16}
        className="px-5 py-3"
      >
        {timelineData.map((day, index) => (
          <SwiperSlide
            key={index}
            className={dayContainerClasses(day)}
            onClick={() => handleClick(day.date)}
          >
            <h3 className="day--header h6 fw-bold mb-0">{formatDate(day)}</h3>
            {displayRain(day)}
            <div className="d-flex justify-content-center">
              <div className="d-flex flex-column">
                {displayTemperatureAverage(day.temperatureAverage)}
                {displayRelativeHumidity(day.relativeHumidity)}
                {/* {displayAtmosphericPressure(day.atmosphericPressure)} */}
                {displayWindSpeed(day.windSpeed)}
                {displaySolarIrradiation(day.solarIrradiation)}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default memo(Timeline)
