type SensorData = {
  atmosphericPressure: number
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperature: number
  windSpeed: number
}

export type IListBlocksLeaf = {
  abrv: string
  blockId: string
  blockParent: string
  bounds: number[]
  centroid: number[]
  data: SensorData
  date: Date
  leafParent: boolean
  name: string
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

// export type IListUsers = {
//   displayName: string
//   email: string
//   id: string
//   phone: string
//   photoURL: string
// }

// export type IDelUsers = {
//   displayName: string
//   email: string
//   id: string
//   phone: string
//   photoURL: string
// }

// export type ICreateUsers = {
//   displayName: string
//   email: string
//   id: string
//   phone: string
//   photoURL: string
// }

export type IUsers = {
  displayName: string
  email: string
  id: string
  phone: string
  photoURL: string
}

export type IPast = {
  date: Date
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperatureAverage: number
  temperatureMax: number
  temperatureMin: number
  windSpeed: number
}

export type IPresent = {
  date: Date
  rain: number
  relativeHumidity: number
  solarIrradiation: number
  temperatureAverage: number
  temperatureMax: number
  temperatureMin: number
  windSpeed: number
}

export type IFuture = {
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
  past?: IPast[]
  present?: IPresent
}

export type IHistorical = {
  abrv: string
  blockId?: string
  blockParent: string
  bounds: number[]
  centroid: number[]
  data: SensorData
  date: Date
  leafParent: boolean
  name: string
}
