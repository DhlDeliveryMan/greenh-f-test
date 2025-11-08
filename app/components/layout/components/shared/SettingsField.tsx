import React from 'react'

export const SettingField = ({ field, value, onChange }: any) => {
  switch (field.type) {
    case 'text':
    case 'password':
    case 'number':
      return (
        <label className="flex flex-col mb-3">
          <span className="font-semibold mb-1">{field.label}</span>
          <input
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className="rounded px-3 py-2 border-[#a9885c] border-2 text-white"
          />
        </label>
      )

    case 'boolean':
      return (
        <label className="flex items-center gap-2 mb-3">
          <input type="checkbox" checked={value || false} onChange={(e) => onChange(field.id, e.target.checked)} />
          <span className="font-semibold">{field.label}</span>
        </label>
      )

    case 'select':
      return (
        <label className="flex flex-col mb-3">
          <span className="font-semibold mb-1">{field.label}</span>
          <select
            value={value || field.options[0]}
            onChange={(e) => onChange(field.id, e.target.value)}
            className="rounded px-3 py-2 bg-secondary border-[#a9885c] border-2 text-white"
          >
            {field.options.map((opt: string) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </label>
      )

    default:
      return null
  }
}
