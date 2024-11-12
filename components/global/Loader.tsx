import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

// Create a motion component for the Loader icon
const MotionLoader = motion(LoaderCircle)

function Loader() {
  return (
    <MotionLoader
      size={24}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: 'linear',
      }}
    />
  )
}

export default Loader
