export type Duration = {
  hours: number,
  minutes: number
}

export function toDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time}`)
}

export function computeDuration(from: Date, to: Date): Duration {
  let hours: number
  let minutes: number
  let seconds: number

  [hours, minutes] = divRem(diffInSeconds(from, to), 3600);
  [minutes, seconds] = divRem(minutes, 60)

  if (seconds >= 30) {
    minutes += 1
  }

  return {
    hours,
    minutes
  }
}

export function formatDuration({ hours, minutes }: Duration): string {
  return [
    hours && `${hours}h`,
    minutes && `${minutes}m`
  ]
    .filter(Boolean)
    .join(' ')
}

export function formatDate(d: Date): string {
  const dateString = [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')

  const timeString = [
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  ]
    .map(n => String(n).padStart(2, '0'))
    .join(':')

  return `${dateString} ${timeString}`
}

export function diffInSeconds(a: Date, b: Date): number {
  const diff = Math.abs(a.getTime() - b.getTime())
  return Math.round(diff / 1000)
}

export function divRem(n: number, d: number): [number, number] {
  return [
    ~~(n / d),
    n % d
  ]
}
