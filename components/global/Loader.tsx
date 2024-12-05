// import { Icon, IconProps } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { LoaderCircle, LucideProps } from 'lucide-react'

// Extend IconProps to include any additional props we need
interface LoaderProps extends LucideProps {}

function Loader({ ...props }: LoaderProps) {
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
      <LoaderCircle {...props} />
    </Box>
  )
}

export default Loader
