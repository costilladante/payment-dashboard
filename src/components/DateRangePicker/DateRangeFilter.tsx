import { DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker

interface DateRangeFilterProps {
  onDateRangeChange: (dates: [Dayjs, Dayjs] | null) => void
}

const DateRangeFilter = ({ onDateRangeChange }: DateRangeFilterProps) => {
  return (
    <RangePicker
      onChange={(dates) => onDateRangeChange(dates as [Dayjs, Dayjs] | null)}
      style={{ width: '100%', maxWidth: 400 }}
    />
  )
}

export default DateRangeFilter
