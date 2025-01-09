// import { Icon, IconProps } from '@chakra-ui/react'
import { Box, Icon, IconProps } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { LoaderCircle, RefreshCcw } from 'lucide-react'

// Extend IconProps to include any additional props we need
interface LoaderProps extends IconProps {
  // * variant was added for transition from v1 of the design to v2
  variant?: 'primary' | 'secondary'
}

function Loader({ variant = 'primary', ...props }: LoaderProps) {
  const spin = {
    rotate: [0, 360],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  }

  return (
    <Box as={motion.div} animate={spin} display="flex" alignItems="center" justifyContent="center">
      {variant === 'primary' ? <Icon as={LoaderCircle} {...props} /> : <Icon as={RefreshCcw} {...props} />}
    </Box>
  )
}

export default Loader
