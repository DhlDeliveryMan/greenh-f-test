export const flattenSettings = (obj: Record<string, any>, prefix = ''): Record<string, any> =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key
      if (value && typeof value === 'object' && !Array.isArray(value)) Object.assign(acc, flattenSettings(value, path))
      else acc[path] = value
      return acc
    },
    {} as Record<string, any>
  )

export const unflattenKey = (key: string, value: any): Record<string, any> => {
  const keys = key.split('.')
  return keys.reduceRight((acc, cur) => ({ [cur]: acc }), value)
}
