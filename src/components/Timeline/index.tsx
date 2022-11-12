import { memo, useCallback, useState } from 'react'
import styles from './timeline.module.scss'

import Open from '../../assets/icons/back.png'
import { CardsTimeline } from './CardsTimeline'

import Image from 'react-bootstrap/Image'

export function TryAnother() {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = useCallback((): void => setOpen(!open), [open])

  return (
    <div className={open ? styles.sidebarOpen : styles.sidebar}>
      <Image
        src={Open}
        className={styles.hamburger}
        alt=""
        onClick={() => handleOpen()}
      />
      <CardsTimeline />
    </div>
  )
}

export default memo(TryAnother)
