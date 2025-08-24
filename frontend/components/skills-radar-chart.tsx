"use client"

import React from 'react'

interface Skill {
  name: string;
  progress: number;
  Goal: number;
}

interface SkillsRadarChartProps {
  skills?: Skill[];
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const defaultSkills: Skill[] = [
  { name: "alphabet", progress: 85, Goal: 80 },
  { name: "sightWords", progress: 60, Goal: 75 },
  { name: "vocabulary", progress: 72, Goal: 70 },
  { name: "phonemicAwareness", progress: 79, Goal: 75 },
  { name: "pointAndRead", progress: 91, Goal: 85 },
]

export function SkillsRadarChart({ 
  skills = defaultSkills, 
  size = 'medium',
  className = '' 
}: SkillsRadarChartProps) {
  // Static skill translations to avoid hydration issues
  const skillNames = {
    alphabet: "字母",
    sightWords: "常見詞彙", 
    vocabulary: "詞彙",
    phonemicAwareness: "語音意識",
    pointAndRead: "指讀"
  }

  // Size configurations
  const sizeConfig = {
    small: { 
      width: 280, 
      height: 200, 
      centerX: 140, 
      centerY: 120, 
      maxRadius: 50,
      labelRadius: 35,
      fontSize: '8px',
      fontSizePercent: '8px'
    },
    medium: { 
      width: 360, 
      height: 280, 
      centerX: 180, 
      centerY: 170, 
      maxRadius: 70,
      labelRadius: 55,
      fontSize: '10px',
      fontSizePercent: '10px'
    },
    large: { 
      width: 440, 
      height: 340, 
      centerX: 220, 
      centerY: 210, 
      maxRadius: 90,
      labelRadius: 70,
      fontSize: '12px',
      fontSizePercent: '12px'
    }
  }

  const config = sizeConfig[size]

  // Calculate radar chart points for pentagon (Apple iOS style - mobile optimized)
  const calculateRadarPoints = () => {
    return skills.map((skill, index) => {
      const angle = (index * 72 - 90) * (Math.PI / 180) // Pentagon angles (starting from top)
      const currentRadius = (skill.progress / 100) * config.maxRadius
      const goalRadius = (skill.Goal / 100) * config.maxRadius
      
      // Data points
      const currentX = config.centerX + currentRadius * Math.cos(angle)
      const currentY = config.centerY + currentRadius * Math.sin(angle)
      const goalX = config.centerX + goalRadius * Math.cos(angle)
      const goalY = config.centerY + goalRadius * Math.sin(angle)
      
      // Grid line endpoints
      const gridX = config.centerX + config.maxRadius * Math.cos(angle)
      const gridY = config.centerY + config.maxRadius * Math.sin(angle)
      
      // Label positions with generous spacing for mobile
      const labelX = config.centerX + (config.maxRadius + config.labelRadius) * Math.cos(angle)
      const labelY = config.centerY + (config.maxRadius + config.labelRadius) * Math.sin(angle)
      
      return { 
        current: { x: currentX, y: currentY }, 
        goal: { x: goalX, y: goalY },
        grid: { x: gridX, y: gridY },
        label: { x: labelX, y: labelY },
        skill,
        angle: angle * (180 / Math.PI),
        index
      }
    })
  }

  const radarPoints = calculateRadarPoints()
  const currentPathData = radarPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.current.x} ${point.current.y}`
  ).join(' ') + ' Z'
  
  const goalPathData = radarPoints.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.goal.x} ${point.goal.y}`
  ).join(' ') + ' Z'

  // Get anchor for text positioning
  const getTextAnchor = (angle: number) => {
    if (angle > -45 && angle < 45) return 'start'
    if (angle > 135 || angle < -135) return 'end'
    return 'middle'
  }

  return (
    <div className={`flex justify-center w-full ${className}`}>
      <svg 
        width="100%" 
        height={config.height} 
        viewBox={`0 0 ${config.width} ${config.height}`} 
        className="max-w-sm mx-auto"
      >
        {/* Definitions for Apple-style effects */}
        <defs>
          <filter id={`chartShadow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
            <feOffset dx="0" dy="1" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.08"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid (iOS style) */}
        {[0.3, 0.6, 1.0].map((ratio, i) => {
          const radius = config.maxRadius * ratio
          const points = radarPoints.map((_, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180)
            const x = config.centerX + radius * Math.cos(angle)
            const y = config.centerY + radius * Math.sin(angle)
            return `${x},${y}`
          }).join(' ')
          
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="#f8fafc"
              strokeWidth="1"
              opacity={0.6 - i * 0.2}
            />
          )
        })}

        {/* Grid lines from center */}
        {radarPoints.map((point, index) => (
          <line
            key={index}
            x1={config.centerX}
            y1={config.centerY}
            x2={point.grid.x}
            y2={point.grid.y}
            stroke="#f8fafc"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Goal path (dashed) */}
        <path
          d={goalPathData}
          fill="none"
          stroke="#d1d5db"
          strokeWidth="1.5"
          strokeDasharray="3,3"
          opacity="0.6"
        />

        {/* Current performance path (filled) */}
        <path
          d={currentPathData}
          fill="rgba(34, 197, 94, 0.10)"
          stroke="#22c55e"
          strokeWidth="2.5"
          filter={`url(#chartShadow-${size})`}
        />

        {/* Data points with Apple-style shadow */}
        {radarPoints.map((point, index) => (
          <circle
            key={index}
            cx={point.current.x}
            cy={point.current.y}
            r="3.5"
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth="2"
            filter={`url(#chartShadow-${size})`}
          />
        ))}

        {/* Labels and percentages */}
        {radarPoints.map((point, index) => (
          <g key={index}>
            {/* Skill name */}
            <text
              x={point.label.x}
              y={point.label.y - 8}
              textAnchor={getTextAnchor(point.angle)}
              className="fill-gray-700 select-none"
              style={{ 
                fontSize: config.fontSize, 
                fontWeight: '600',
                fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
              }}
            >
              {skillNames[point.skill.name as keyof typeof skillNames] || point.skill.name}
            </text>
            
            {/* Percentage */}
            <text
              x={point.label.x}
              y={point.label.y + 5}
              textAnchor={getTextAnchor(point.angle)}
              className="fill-green-500 select-none"
              style={{ 
                fontSize: config.fontSizePercent, 
                fontWeight: '700',
                fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
              }}
            >
              {point.skill.progress}%
            </text>
          </g>
        ))}

        {/* Legend */}
        <g>
          {/* Current level indicator */}
          <line x1="20" y1={config.height - 20} x2="35" y2={config.height - 20} stroke="#22c55e" strokeWidth="2.5" />
          <text 
            x="40" 
            y={config.height - 16} 
            className="fill-gray-600 select-none" 
            style={{ 
              fontSize: config.fontSize, 
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
            }}
          >
            目前水平
          </text>
          
          {/* Goal level indicator */}
          <line x1="140" y1={config.height - 20} x2="155" y2={config.height - 20} stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="3,3" />
          <text 
            x="160" 
            y={config.height - 16} 
            className="fill-gray-600 select-none" 
            style={{ 
              fontSize: config.fontSize, 
              fontWeight: '500',
              fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif'
            }}
          >
            目標水平
          </text>
        </g>
      </svg>
    </div>
  )
}

export default SkillsRadarChart

