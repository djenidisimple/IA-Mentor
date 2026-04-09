import React from 'react'

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string
  size?: number | string
}

export const AppIcon: React.FC<IconProps> = ({ className, size = 24, ...props }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .52 8.125A5 5 0 0 0 14 18a5 5 0 0 0 4-8c0-1.1-.45-2.1-1.17-2.83" />
      <path d="M12 13V5" />
      <path d="M16 13a4 4 0 0 1-8 0" />
      <path d="M12 15h.01" />
    </svg>
  )
}

export default AppIcon;
