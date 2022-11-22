type SensorData = {
  atmosphericPressure: number
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperature: number
  windSpeed: number
}

export type IListBlocks = {
  abrv: string
  blockId: string
  blockParent: string
  data: SensorData
  date: Date
  leafParent: boolean
  name: string
}

export type IListBlocksLeaf = IListBlocks & {
  bounds: number[]
  centroid: number[]
}

type IPastAndPresent = {
  date: Date
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperatureAverage: number
  temperatureMax: number
  temperatureMin: number
  windSpeed: number
}

type IFuture = {
  date: Date
  rain: number
  rainPrediction: string
  rainProbability: number
  temperatureMax: number
  temperatureMin: number
}

export type IForecast = {
  blockId?: string
  forecast?: IFuture[]
  name: string
  past?: IPastAndPresent[]
  present?: IPastAndPresent
}

type ILineAlerts = {
  finish: Date
  info: string
  level: number
  start: Date
  type: string
}

export type ILine = IPastAndPresent & {
  alerts: ILineAlerts[] | null
}

export type ITimeline = {
  blockId: string
  line: ILine[]
  name: string
}

export type IUsers = {
  displayName: string
  email: string
  id: string
  phone: string
  photoURL: string
}
