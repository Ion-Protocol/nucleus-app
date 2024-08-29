import { ChakraProps, Icon } from '@chakra-ui/react'

interface IconProps extends ChakraProps {}

export const TokenFrxtlethIcon: React.FC<IconProps> = ({ ...props }) => {
  return (
    <Icon viewBox="0 0 200 200" {...props}>
      <image href={'/assets/images/token-frxtleth.png'} x="0" y="0" width="100%" height="100%" />
    </Icon>
  )
}
