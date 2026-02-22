'use client'

import React, { useEffect, useState } from 'react'
import { PositioningRadar as PositioningRadarType } from '@/types'

interface PositioningRadarProps {
    radar: PositioningRadarType
}

export function PositioningRadar({ radar }: PositioningRadarProps) {
    const [RechartsLoaded, setRechartsLoaded] = useState(false)
    const [RechartsComponents, setRechartsComponents] = useState<any>(null)

    useEffect(() => {
        import('recharts').then(mod => {
            setRechartsComponents(mod)
            setRechartsLoaded(true)
        })
    }, [])

    const data = radar.dimensions.map(d => ({
        dimension: d.name,
        'Your Score': d.your_score,
        'Competitor Avg': d.competitor_avg,
        'Market Leader': d.leader_score,
    }))

    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                Positioning Radar
            </h2>
            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6">
                <div className="w-full h-[400px]">
                    {RechartsLoaded && RechartsComponents ? (
                        <RechartsComponents.ResponsiveContainer width="100%" height="100%">
                            <RechartsComponents.RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
                                <RechartsComponents.PolarGrid stroke="var(--ink-700)" />
                                <RechartsComponents.PolarAngleAxis
                                    dataKey="dimension"
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                />
                                <RechartsComponents.PolarRadiusAxis
                                    angle={30}
                                    domain={[0, 10]}
                                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                />
                                <RechartsComponents.Radar
                                    name="Your Score"
                                    dataKey="Your Score"
                                    stroke="#c9a84c"
                                    fill="#c9a84c"
                                    fillOpacity={0.2}
                                    strokeWidth={2}
                                />
                                <RechartsComponents.Radar
                                    name="Competitor Avg"
                                    dataKey="Competitor Avg"
                                    stroke="#6b8cba"
                                    fill="#6b8cba"
                                    fillOpacity={0.1}
                                    strokeWidth={2}
                                />
                                <RechartsComponents.Radar
                                    name="Market Leader"
                                    dataKey="Market Leader"
                                    stroke="rgba(240,237,232,0.4)"
                                    fill="rgba(240,237,232,0.05)"
                                    fillOpacity={0.05}
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                />
                                <RechartsComponents.Legend
                                    wrapperStyle={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '12px',
                                    }}
                                />
                            </RechartsComponents.RadarChart>
                        </RechartsComponents.ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                        </div>
                    )}
                </div>

                {radar.white_space && (
                    <div className="mt-4 p-4 bg-gold-muted border border-gold/20 rounded-xl">
                        <h4 className="text-sm font-semibold text-gold mb-1">White Space Opportunity</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{radar.white_space}</p>
                    </div>
                )}
            </div>
        </section>
    )
}
