import { Icon, IconProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { LoaderCircle } from 'lucide-react'

// Extend IconProps to include any additional props we need
interface LoaderProps extends IconProps {}

// Create a motion component for the Chakra Icon
const MotionIcon = motion(Icon)

function Loader({ ...props }: LoaderProps) {
  return (
    <MotionIcon
      as={LoaderCircle}
      {...props}
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
