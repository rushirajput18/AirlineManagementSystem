import React from 'react'
import Card from '../../../components/common/Card'

interface StatItem {
  title: string
  value: string
  icon: string
  color: string
}

interface StaffStatsProps {
  stats: StatItem[]
}

const StaffStats: React.FC<StaffStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, index) => (
      <Card key={index} className="p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl`}>
            {stat.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </div>
        </div>
      </Card>
    ))}
  </div>
)

export default StaffStats


