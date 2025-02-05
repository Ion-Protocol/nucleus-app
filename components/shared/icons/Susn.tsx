import React, { useMemo } from 'react'

interface SusnIconProps extends React.SVGProps<SVGSVGElement> {}

// A simple helper that returns a short random string.
function generateRandomId() {
  return Math.random().toString(36).substr(2, 9)
}

export const SusnIcon: React.FC<SusnIconProps> = (props) => {
  // Generate unique gradient IDs once per component instance.
  const { gradientId0, gradientId1, gradientId2 } = useMemo(
    () => ({
      gradientId0: `paint0_linear_${generateRandomId()}`,
      gradientId1: `paint1_linear_${generateRandomId()}`,
      gradientId2: `paint2_linear_${generateRandomId()}`,
    }),
    []
  )

  return (
    <svg viewBox="0 0 24 24" {...props}>
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill="black" />
      <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" stroke="#FFFDFA" />
      <path
        d="M12.967 5.46988V6.59616C13.6382 6.6758 14.7304 7.14224 15.5723 8.50743C16.2457 9.59958 16.0425 10.9648 15.8567 11.5108C15.8263 11.4312 15.661 11.1695 15.2423 10.76C14.8237 10.3504 14.4839 10.1419 14.3663 10.0888C14.0933 8.40504 12.6599 8.10925 12.0228 8.10925C11.3857 8.10925 9.67919 8.4733 9.67919 10.3163C9.67919 12.1593 11.5222 12.5916 12.0228 12.5916C12.4232 12.5916 12.7812 12.4627 12.9101 12.3982C13.0201 12.4475 13.2969 12.6212 13.5245 12.9215C13.752 13.2219 13.8316 13.6231 13.843 13.7862C13.6117 13.934 12.9238 14.2298 12.0228 14.2298C10.8965 14.2298 8.00684 13.4449 8.00684 10.3163C8.00684 7.81346 10.0622 6.79336 11.0899 6.59616V5.46988C11.0899 5.24235 11.2833 5.04895 11.4881 5.04895H12.5575C12.8077 5.04895 12.967 5.25373 12.967 5.46988Z"
        fill={`url(#${gradientId0})`}
      />
      <path
        d="M11.0773 18.7008V17.5745C10.4061 17.4949 9.31393 17.0284 8.47206 15.6632C7.79857 14.5711 8.00183 13.2059 8.18765 12.6598C8.21798 12.7395 8.38332 13.0011 8.80198 13.4107C9.22064 13.8202 9.56042 14.0288 9.67798 14.0819C9.95101 15.7656 11.3845 16.0614 12.0215 16.0614C12.6586 16.0614 14.3651 15.6974 14.3651 13.8544C14.3651 12.0114 12.5221 11.579 12.0215 11.579C11.6211 11.579 11.2631 11.708 11.1342 11.7724C11.0242 11.7231 10.7474 11.5495 10.5198 11.2491C10.2923 10.9488 10.2127 10.5476 10.2013 10.3845C10.4326 10.2366 11.1205 9.94082 12.0215 9.94082C13.1478 9.94082 16.0375 10.7258 16.0375 13.8544C16.0375 16.3572 13.9821 17.3773 12.9544 17.5745V18.7008C12.9544 18.9283 12.761 19.1217 12.5562 19.1217H11.4868C11.2366 19.1217 11.0773 18.9169 11.0773 18.7008Z"
        fill={`url(#${gradientId1})`}
      />
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 21.1354C17.0453 21.1354 21.1354 17.0454 21.1354 12C21.1354 6.9547 17.0453 2.86465 12 2.86465C6.95464 2.86465 2.86459 6.9547 2.86459 12C2.86459 17.0454 6.95464 21.1354 12 21.1354Z"
        fill={`url(#${gradientId2})`}
        fillRule="evenodd"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id={gradientId0}
          x1="7.93858"
          y1="9.65795"
          x2="17.6992"
          y2="9.74514"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE9C6A" />
          <stop offset="0.475" stopColor="#F5AE69" />
          <stop offset="0.565" stopColor="#E1B87E" />
          <stop offset="0.645" stopColor="#FBA770" />
          <stop offset="1" stopColor="#FE9967" />
        </linearGradient>
        <linearGradient
          id={gradientId1}
          x1="16.1057"
          y1="14.5127"
          x2="6.34509"
          y2="14.4255"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FE9C6A" />
          <stop offset="0.475" stopColor="#F5AE69" />
          <stop offset="0.565" stopColor="#E1B87E" />
          <stop offset="0.645" stopColor="#FBA770" />
          <stop offset="1" stopColor="#FE9967" />
        </linearGradient>
        <linearGradient id={gradientId2} x1="2" y1="12.0114" x2="22" y2="12.0114" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEBE99" />
          <stop offset="0.525" stopColor="#DDD0B9" />
          <stop offset="1" stopColor="#FEBF9B" />
        </linearGradient>
      </defs>
    </svg>
  )
}
