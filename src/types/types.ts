export interface IListBlocksLeaf {
  blockId: string
  bounds: number[]
  centroid: number[]
  name: string
  abrv: string
  blockParent: string
  leafParent: boolean
  date: string
  data: {
    windSpeed: number
    solarIrradiation: number
    temperature: number
    rain: number
    relativeHumidity: number
  }
}

export interface IListBlocks {
  blockId: string
  name: string
  abrv: string
  blockParent: string
  leafParent: boolean
  date: string
  data: {
    windSpeed: number
    solarIrradiation: number
    temperature: number
    rain: number
    relativeHumidity: number
  }
}

export interface IListUsers {
  id: string
  email: string
  phone: string
  displayName: string
  photoURL: string
}
export interface IDelUsers {
  id: string
  email: string
  phone: string
  displayName: string
  photoURL: string
}
export interface ICreateUsers {
  id: string
  email: string
  phone: string
  displayName: string
  photoURL: string
}
export type IPast = {
  date: string
  temperatureAverage: string
  temperatureMin: string
  temperatureMax: string
  relativeHumidity: string
  solarIrradiation: string
  rain: string
  windSpeed: string
  alerts: null
}
export type IForecast = {
  date: string
  temperatureAverage: string
  temperatureMin: string
  temperatureMax: string
  relativeHumidity: string
  solarIrradiation: string
  rain: string
  windSpeed: string
  alerts: null
}

export type IAlert = {
  type: string
  info: string
  level: number
  start: Date
  finish: Date
}

export type ICurrent = {
  date: string
  temperatureAverage: string
  temperatureMin: string
  temperatureMax: string
  relativeHumidity: string
  solarIrradiation: string
  rain: string
  windSpeed: string
  alerts: IAlert[]
}

export type ITimeline = {
  blockId: string
  name: string
  line: IForecast[]
}
