import { useState, useCallback } from 'react'
import type { TablePaginationConfig } from 'antd'
import type { Dayjs } from 'dayjs'

import { TABLE_PAGE_SIZE } from '@constants'
import { transactionService } from '@services'
import type { Transaction } from '@/types'

interface UseTransactionsReturn {
  loading: boolean
  error: string | null
  filteredTransactions: Transaction[]
  pagination: {
    current: number
    pageSize: number
    total: number
  }
  fetchTransactions: (page?: number, pageSize?: number) => Promise<void>
  handleDateRangeChange: (dates: [Dayjs, Dayjs] | null) => Promise<void>
  handleTableChange: (newPagination: TablePaginationConfig) => Promise<void>
}

export const useTransactions = (): UseTransactionsReturn => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: TABLE_PAGE_SIZE,
    total: 0,
  })

  const fetchTransactions = useCallback(async (page = 1, pageSize = TABLE_PAGE_SIZE) => {
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
  }, [])

  const handleDateRangeChange = useCallback(
    async (dates: [Dayjs, Dayjs] | null) => {
      if (!dates) {
        await fetchTransactions(1)
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
    },
    [fetchTransactions],
  )

  const handleTableChange = useCallback(
    async (newPagination: TablePaginationConfig) => {
      const { current, pageSize } = newPagination
      if (current) {
        await fetchTransactions(current, pageSize)
      }
    },
    [fetchTransactions],
  )

  return {
    loading,
    error,
    filteredTransactions,
    pagination,
    fetchTransactions,
    handleDateRangeChange,
    handleTableChange,
  }
}
