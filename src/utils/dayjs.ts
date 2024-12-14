import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
dayjs.extend(timezone)

export const formatDate = (
  date: Date | string,
  format = 'HH:mm - DD/MM/YYYY',
  timeZone = 'Asia/Saigon',
) => {
  if (!dayjs(date).isValid || null) return undefined

  return dayjs(date).tz(timeZone).format(format)
}
