export interface ICurrentTimeline {
  present: string | null
  forecast: string | null
}

export interface IPastTimeline {
  date: string
  temperatureAverage: string
  temperatureMin: string
  temperatureMax: string
  relativeHumidity: string
  solarRadiation: string
  rain: string
  windSpeed: string
  alerts?: string | null
  currentTimeline: ICurrentTimeline[]
}
