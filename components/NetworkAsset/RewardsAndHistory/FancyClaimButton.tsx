import { TokenIcon } from '@/components/config/tokenIcons'
import { TokenKey } from '@/types/TokenKey'
import { Button, ButtonProps, Flex, Text } from '@chakra-ui/react'

interface FancyClaimButtonProps extends ButtonProps {
  networkAssetKey: TokenKey | null
  networkAssetName: string | null
  onClick: () => void
  isLoading?: boolean
}

export function FancyClaimButton({
  networkAssetKey,
  networkAssetName,
  onClick,
  isLoading,
  ...buttonProps
}: FancyClaimButtonProps) {
  return (
    <Button
      sx={{
        background:
          'linear-gradient(113.03deg, #FFF3C7 14.91%, #FFF6DB 40.18%, #FFF9E6 40.88%, #FFF9E6 55.61%, #FFF1BD 57.72%, #FFE78F 85.09%)',
      }}
      border="1px solid"
      borderColor="claimButtonBorder"
      _hover={{
        filter: 'brightness(0.9)',
      }}
      _active={{
        filter: 'brightness(0.8)',
      }}
      onClick={onClick}
      isLoading={isLoading}
      {...buttonProps}
    >
      <Flex align="center" gap={2}>
        <TokenIcon tokenKey={networkAssetKey} fontSize="24px" />
        <Text variant="paragraph" color="claimButtonText" mb="4px">
          Claim {networkAssetName} Rewards
        </Text>
      </Flex>
    </Button>
  )
}
