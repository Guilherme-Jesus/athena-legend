import './blocks.scss'

import React, { memo, useCallback, useEffect, useState } from 'react'

import { Scrollbars as ScrollContainer } from 'react-custom-scrollbars-2'

import { IListBlocks } from '../../types'
import { dataUnit, displayData } from '../utils'
import PartlyCloud from '../../assets/images/partyCloud.svg'
import Wind from '../../assets/icons/wind.svg'
import Irradiation from '../../assets/icons/sunIrr.svg'
import Thermometer from '../../assets/icons/thermometer.svg'
import Humidity from '../../assets/icons/humidity.svg'
import Arrow from '../../assets/icons/arrowRight.svg'
import { Button } from 'react-bootstrap'

type BlocksProps = {
  blocks: IListBlocks[]
  currentBlockId: string
  handleBlockClick(id: string, leaf: boolean): void
}

const Blocks: React.FC<BlocksProps> = ({
  blocks,
  currentBlockId,
  handleBlockClick,
}): React.ReactElement => {
  const [isLoadingBlocks, setIsLoadingBlocks] = useState<boolean>(false)

  useEffect(() => setIsLoadingBlocks(blocks.length === 0), [blocks.length])

  return (
    <ScrollContainer
      autoHide
      style={{ height: '88vh', width: '52rem', marginLeft: '24px' }}
    >
      <div>
        {isLoadingBlocks ? (
          <div
            className="d-flex flex-column gap-3"
            tabIndex={0}
            role="progressbar"
            aria-busy="true"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuetext="Carregando..."
          >
            <span
              className="skeleton-box rounded-1 w-100"
              style={{ height: '13.75rem' }}
            />
            {[...Array(5).keys()].map((skeleton) => (
              <span
                key={skeleton}
                className="skeleton-box rounded-1 w-100"
                style={{ height: '3.75rem' }}
              />
            ))}
          </div>
        ) : (
          blocks
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((block) => (
              <div
                key={block.blockId}
                role="button"
                className={`block${
                  block.blockId === currentBlockId ? ' activeCard' : ''
                }`}
                onClick={() =>
                  handleBlockClick(block.blockId, block.leafParent)
                }
              >
                {block.blockId === currentBlockId ? (
                  <div>
                    <div className="headerCardOpen">
                      <div>
                        <img src={PartlyCloud} alt="" className="iconCards" />
                      </div>
                      <div>
                        <p className="nameFarm">{block.name}</p>
                        <span className="itemsHeader">{block.data.rain}mm</span>
                      </div>
                    </div>

                    <div className="itemsContainer">
                      <div className="itemsWeather">
                        <div className="itensCards">
                          <span>Temperatura</span>
                        </div>
                        <div className="itemCardInside">
                          <img
                            src={Thermometer}
                            alt=""
                            style={{ width: '18px', marginRight: '4px' }}
                          />
                          <span style={{ fontSize: '18px' }}>
                            {block.data.temperature.toFixed(0)}
                          </span>
                          <span style={{ fontSize: '10px', marginLeft: '2px' }}>
                            ºC
                          </span>
                        </div>
                      </div>
                      <hr className="separator" />

                      <div className="itemsWeather">
                        <div className="itensCards">
                          <span>Umidade</span>
                        </div>
                        <div className="itemCardInside">
                          <img
                            src={Humidity}
                            alt=""
                            style={{ width: '18px', marginRight: '4px' }}
                          />
                          <span style={{ fontSize: '18px' }}>
                            {block.data.relativeHumidity.toFixed(0)}
                          </span>
                          <span style={{ fontSize: '10px', marginLeft: '2px' }}>
                            %
                          </span>
                        </div>
                      </div>
                      <hr className="separator" />
                      <div className="itemsWeather">
                        <div className="itensCards">
                          <span>Vento</span>
                        </div>
                        <div className="itemCardInside">
                          <img
                            src={Wind}
                            alt=""
                            style={{ width: '18px', marginRight: '4px' }}
                          />
                          <span style={{ fontSize: '18px' }}>
                            {block.data.windSpeed.toFixed(0)}
                          </span>
                          <span style={{ fontSize: '10px', marginLeft: '2px' }}>
                            Km/h
                          </span>
                        </div>
                      </div>
                      <hr className="separator" />

                      <div className="itemsWeather">
                        <div className="itensCards">
                          <span>Radiação Solar</span>
                        </div>
                        <div className="itemCardInside">
                          <img
                            src={Irradiation}
                            alt=""
                            style={{ width: '18px', marginRight: '4px' }}
                          />
                          <span style={{ fontSize: '18px' }}>
                            {block.data.solarIrradiation.toFixed(0)}
                          </span>
                          <span style={{ fontSize: '10px', marginLeft: '2px' }}>
                            Wh/m²
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="blockAreas">
                      <span>VER ÁREAS</span>
                      <img src={Arrow} alt="" />
                    </div>
                  </div>
                ) : (
                  <div className="headerCardClosed">
                    <div>
                      <img src={PartlyCloud} alt="" className="iconCards" />
                    </div>
                    <div>
                      <span className="headerCardClosedInside">
                        {block.name}
                      </span>
                      <span className="infoCardClosed">
                        {block.data.rain}mm
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
        )}
      </div>
    </ScrollContainer>
  )
}

export default memo(Blocks)
