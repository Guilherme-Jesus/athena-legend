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
export interface IHistorical {
  blockId?: string
  name: string
  abrv: string
  blockParent: string
  bounds: number[]
  centroid: number[]
  leafParent: boolean
  date: string
  data: {
    solarIrradiation: number
    temperature: number
    rain: number
    relativeHumidity: number
  }
}
