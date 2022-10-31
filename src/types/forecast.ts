export interface IPast {
  date: string
  temperatureAverage: number
  temperatureMin: number
  temperatureMax: number
  relativeHumidity: number
  solarIrradiation: number
  rain: number
  windSpeed: number
}
export interface IPresent {
  date: string
  temperatureAverage: number
  temperatureMin: number
  temperatureMax: number
  relativeHumidity: number
  solarIrradiation: number
  rain: number
  windSpeed: number
}
export interface IFuture {
  date: string
  temperatureMin: number
  temperatureMax: number
  rain: number
  rainProbability: number
  rainPrediction: string
}
export interface IForecast {
  blockId?: string
  name: string
  past?: IPast[]
  present?: IPresent
  forecast?: IFuture[]
}
