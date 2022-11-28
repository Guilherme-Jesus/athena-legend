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

// type ILineAlerts = {
//   finish: Date
//   info: string
//   level: number
//   start: Date
//   type: string
// }

// export type ILine = IPastAndPresent &
//   IFuture & {
//     alerts: ILineAlerts[] | null
//   }

// export type ITimeline = {
//   blockId: string
//   line: ILine[]
//   name: string
// }
export interface Alert {
  finish: Date
  info: string
  level: number
  start: Date
  type: string
}
export interface ILine {
  date: Date
  temperatureMax: number
  temperatureMin: number
  rain: number
  rainPrediction: string
  rainProbability: number
  alerts: Alert[]
  relativeHumidity: number
  solarIrradiation: number
  temperatureAverage: number
  windSpeed: number
}
export interface ITimeline {
  blockId: string
  name: string
  line: ILine[]
}
export interface StyleMapHash {
  normal: string
  highlight: string
}

export interface Properties {
  name: string
  styleUrl: string
  styleMapHash: StyleMapHash
}

export interface Geometry {
  type: string
  coordinates: number[][][]
}

export interface Feature {
  type: string
  geometry: Geometry
  properties: Properties
  id: string
}

export interface Root {
  type: string
  features: Feature[]
}
