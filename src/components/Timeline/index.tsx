import { memo, useState } from 'react'
import styles from './timeline.module.scss'

import Open from '../../assets/icons/back.png'
import { CardsTimeline } from './CardsTimeline'

export function TryAnother() {
  const [open, setOpen] = useState(false)

  return (
    <div className={open ? styles.sidebarOpen : styles.sidebar}>
      <img
        src={Open}
        alt=""
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
      />
      <CardsTimeline />
    </div>
  )
}

export default memo(TryAnother)
