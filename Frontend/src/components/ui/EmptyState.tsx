import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {icon && <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-dark/30 mb-4">{icon}</div>}
    <h3 className="text-lg font-bold text-dark mb-2">{title}</h3>
    {description && <p className="text-dark/50 text-sm max-w-sm mb-6">{description}</p>}
    {action}
  </div>
)
