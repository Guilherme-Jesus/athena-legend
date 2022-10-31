export interface IBlocks {
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
