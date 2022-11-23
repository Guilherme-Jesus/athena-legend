type SensorData = {
  atmosphericPressure: number
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperature: number
  windSpeed: number
}

// BLOCKS
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

// TIMELINE
type IPastAndPresent = {
  atmosphericPressure: number
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

export type ILine = IPastAndPresent &
  IFuture & {
    alerts: ILineAlerts[] | null
  }

export type ITimeline = {
  blockId: string
  line: ILine[]
  name: string
}

// USERS
export type IUsers = {
  displayName: string
  email: string
  id: string
  phone: string
  photoURL: string
}
