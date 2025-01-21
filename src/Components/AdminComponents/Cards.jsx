import React from 'react'

export function MetricCard({ title, value, change, changeValue, bgColor, icon }) {

  
  return (
    <div className={`${bgColor} bg-opacity-90 backdrop-blur-sm rounded-xl p-4 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-sm">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center mt-1">
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${
          change === 'High' ? 'bg-green-400/20 text-green-300' : 'bg-red-400/20 text-red-300'
        }`}>
          {changeValue}
        </span>
        <span className="text-xs text-white/60 ml-1">{change === 'High' ? 'Increase' : 'Decrease'}</span>
      </div>
    </div>
  )
}

export function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white bg-opacity-5 rounded-lg p-3">
      <div className="flex items-center gap-1 mb-1">
        {icon}
        <span className="text-white text-xs">{title}</span>
      </div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  )
}

export function TopSellingItem({ name, sales }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white">{name}</span>
      <span className="text-purple-400 font-semibold">{sales} sold</span>
    </div>
  )
}

