import { useState, useEffect } from 'react'
import API from '../config'

const cardStyle = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 16,
  padding: '20px',
  marginBottom: 16,
}

const labelStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: 16,
}

export function WeatherCard({ plantId }) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/weather/${plantId}`)
      .then(r => r.json())
      .then(setWeather)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [plantId])

  if (loading) return (
    <div style={cardStyle}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Loading weather...</div>
    </div>
  )

  if (!weather || weather.detail) return null

  const sunrise = new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const sunset = new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const cloudImpact = weather.cloud_cover > 70
    ? 'High cloud cover — expect lower generation today'
    : weather.cloud_cover > 40
    ? 'Partly cloudy — moderate generation expected'
    : 'Clear skies — great day for solar generation! ☀️'

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={labelStyle}>🌤 Live Weather</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{weather.city}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        {weather.icon && (
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            style={{ width: 56, height: 56 }}
          />
        )}
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
            {weather.temp}°C
          </div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 }}>
            {weather.description}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {[
          ['☁️ Cloud Cover', `${weather.cloud_cover}%`],
          ['💧 Humidity', `${weather.humidity}%`],
          ['🌅 Sunrise', sunrise],
          ['🌇 Sunset', sunset],
          ['🌬 Wind', `${weather.wind_speed} km/h`],
          ['🌡 Feels Like', `${weather.feels_like}°C`],
        ].map(([label, value]) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>{label}</div>
            <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{
        background: weather.cloud_cover > 70 ? 'rgba(255,87,87,0.1)' : weather.cloud_cover > 40 ? 'rgba(245,200,66,0.1)' : 'rgba(52,211,153,0.1)',
        border: `1px solid ${weather.cloud_cover > 70 ? 'rgba(255,87,87,0.3)' : weather.cloud_cover > 40 ? 'rgba(245,200,66,0.3)' : 'rgba(52,211,153,0.3)'}`,
        borderRadius: 8, padding: '10px 12px', fontSize: 12,
        color: weather.cloud_cover > 70 ? '#ff8a8a' : weather.cloud_cover > 40 ? '#f5c842' : '#34d399',
      }}>
        {cloudImpact}
      </div>
    </div>
  )
}

export function CarbonCard({ annualKwh }) {
  if (!annualKwh) return null
  const co2Saved = (annualKwh * 0.82 / 1000).toFixed(2)
  const trees = Math.round(annualKwh * 0.82 / 21.77)
  const cars = (annualKwh * 0.82 / 1000 / 4.6).toFixed(1)

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>🌱 Carbon Impact</div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(52,211,153,0.1), rgba(16,185,129,0.05))',
        border: '1px solid rgba(52,211,153,0.2)',
        borderRadius: 12, padding: '20px', textAlign: 'center', marginBottom: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 800, color: '#34d399', lineHeight: 1 }}>
          {co2Saved}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 6 }}>
          tonnes of CO₂ saved this year
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          ['🌳', trees, 'trees planted equivalent'],
          ['🚗', cars, 'cars off road for a year'],
        ].map(([icon, val, label]) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 24 }}>{icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', marginTop: 4 }}>{val}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SavingsCard({ annualKwh }) {
  const [rate, setRate] = useState(8)
  if (!annualKwh) return null
  const savings = Math.round(annualKwh * rate)
  const monthly = Math.round(savings / 12)
  const daily = Math.round(savings / 365)

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={labelStyle}>💰 Savings Calculator</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>₹/kWh:</span>
          <input
            type="number"
            value={rate}
            onChange={e => setRate(Number(e.target.value))}
            min={1} max={20}
            style={{
              width: 48, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 6, color: '#fff', fontSize: 12,
              padding: '3px 6px', textAlign: 'center', outline: 'none',
            }}
          />
        </div>
      </div>
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,200,66,0.15), rgba(255,159,28,0.08))',
        border: '1px solid rgba(245,200,66,0.25)',
        borderRadius: 12, padding: '20px', textAlign: 'center', marginBottom: 16,
      }}>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Annual Savings</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800, color: '#f5c842', lineHeight: 1 }}>
          ₹{savings.toLocaleString('en-IN')}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[['Monthly', monthly], ['Daily', daily]].map(([label, val]) => (
          <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff' }}>
              ₹{val.toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center' }}>
        Based on {annualKwh.toLocaleString()} kWh × ₹{rate}/kWh
      </div>
    </div>
  )
}
