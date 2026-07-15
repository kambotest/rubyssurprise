// Export/import every rubyssurprise_* localStorage key so data can move
// between browsers, devices, or hosting origins without loss.

const PREFIX = 'rubyssurprise_'

export function exportBackup() {
  const data: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(PREFIX)) {
      data[key] = localStorage.getItem(key) as string
    }
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `rubys-surprise-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importBackup(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string)
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Not a valid backup file')
        }
        for (const [key, value] of Object.entries(parsed)) {
          if (key.startsWith(PREFIX) && typeof value === 'string') {
            localStorage.setItem(key, value)
          }
        }
        resolve()
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}
