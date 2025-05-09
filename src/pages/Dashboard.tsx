import { useState, useEffect } from 'react'
import { Alert, Flex, TablePaginationConfig, Typography } from 'antd'
import type { Dayjs } from 'dayjs'

import { DateRangeFilter, TransactionsTable } from '@components'
import { TABLE_PAGE_SIZE } from '@constants'
import { transactionService } from '@services'
import { Transaction } from '@/types'

const { Text } = Typography

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: TABLE_PAGE_SIZE,
    total: 0,
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async (page = 1, pageSize = TABLE_PAGE_SIZE) => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionService.getTransactions(page, pageSize)
      setFilteredTransactions(response.data)
      setPagination({
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message}. Please try again.`
          : 'An error occurred. Please try again.',
      )
      setFilteredTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = async (dates: [Dayjs, Dayjs] | null) => {
    if (!dates) {
      fetchTransactions(1)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const [start, end] = dates
      const response = await transactionService.getTransactionsByDateRange(
        start.format('YYYY-MM-DD'),
        end.format('YYYY-MM-DD'),
        1,
        TABLE_PAGE_SIZE,
      )
      setFilteredTransactions(response.data)

      setPagination({
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      })
    } catch (err) {
      setFilteredTransactions([])
      setError(
        err instanceof Error
          ? `${err.message}. Please try again.`
          : 'An error occurred. Please try again.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = async (newPagination: TablePaginationConfig) => {
    const { current, pageSize } = newPagination
    if (current) {
      await fetchTransactions(current, pageSize)
    }
  }

  return (
    <Flex vertical gap={8}>
      <Text>Filter by Date</Text>
      <DateRangeFilter onDateRangeChange={handleDateRangeChange} />
      {error && <Alert message="Error" description={error} type="error" showIcon />}
      <TransactionsTable
        data={filteredTransactions}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </Flex>
  )
}

export default Dashboard
