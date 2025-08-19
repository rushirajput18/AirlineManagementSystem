import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={`bg-white rounded-xl shadow-sm ${className}`}>{children}</div>
)

export default Card


