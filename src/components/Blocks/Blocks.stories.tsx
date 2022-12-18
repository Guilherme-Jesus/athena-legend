import { ComponentMeta, ComponentStory } from '@storybook/react'
import Blocks from './Blocks'

export default {
  title: 'Card/Blocks',
  component: Blocks,
} as ComponentMeta<typeof Blocks>

export const Template: ComponentStory<typeof Blocks> = (args) => (
  <Blocks {...args} />
)

export const BlocoCompleto = Template.bind({})
BlocoCompleto.args = {
  blocks: [
    {
      blockId: 'C19',
      name: 'Pedro Merola - Santa Fé (P) (S)',
      abrv: 'Ped',
      blockParent: '0',
      leafParent: false,
      date: '2022-12-05T07:41:43.87814486-03:00',
      data: {
        windSpeed: 1.068869,
        solarIrradiation: 46.787574,
        temperature: 21.420706,
        rain: 0.018211,
        relativeHumidity: 96.907494,
      },
    },
  ],
}
