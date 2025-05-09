import { vi, describe, it, expect, beforeEach } from 'vitest'
import dayjs from 'dayjs'
import { renderHook, act } from '@testing-library/react'

import { useTransactions } from '@hooks'
import { transactionService } from '@services'
import { mockTransactions } from '@mocks/mockTransactions'

// Mock the transaction service
vi.mock('@services', () => ({
  transactionService: {
    getTransactions: vi.fn(),
    getTransactionsByDateRange: vi.fn(),
  },
}))

describe('useTransactions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch transactions on initial load', async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValueOnce({
      data: mockTransactions.slice(0, 10),
      page: 1,
      pageSize: 10,
      total: mockTransactions.length,
      hasMore: true,
    })

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.fetchTransactions()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.filteredTransactions).toEqual(mockTransactions.slice(0, 10))
    expect(result.current.pagination).toEqual({
      current: 1,
      pageSize: 10,
      total: mockTransactions.length,
    })
  })

  it('should handle errors when fetching transactions with Error instance', async () => {
    const error = new Error('Failed to fetch')
    vi.mocked(transactionService.getTransactions).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.fetchTransactions()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Failed to fetch. Please try again.')
    expect(result.current.filteredTransactions).toEqual([])
  })

  it('should handle errors when fetching transactions with non-Error instance', async () => {
    vi.mocked(transactionService.getTransactions).mockRejectedValueOnce('Unknown error')

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.fetchTransactions()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('An error occurred. Please try again.')
    expect(result.current.filteredTransactions).toEqual([])
  })

  it('should handle date range filtering', async () => {
    const startDate = dayjs('2025-01-01')
    const endDate = dayjs('2025-05-05')
    const filteredTransactions = mockTransactions.filter(
      (t) => t.date >= '2025-01-01' && t.date <= '2025-05-05',
    )

    vi.mocked(transactionService.getTransactionsByDateRange).mockResolvedValueOnce({
      data: filteredTransactions,
      page: 1,
      pageSize: 10,
      total: filteredTransactions.length,
      hasMore: false,
    })

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.handleDateRangeChange([startDate, endDate])
    })

    expect(transactionService.getTransactionsByDateRange).toHaveBeenCalledWith(
      '2025-01-01',
      '2025-05-05',
      1,
      10,
    )
    expect(result.current.filteredTransactions).toEqual(filteredTransactions)
    expect(result.current.error).toBeNull()
  })

  it('should handle errors in date range filtering with Error instance', async () => {
    const startDate = dayjs('2025-01-01')
    const endDate = dayjs('2025-05-05')
    const error = new Error('Date range fetch failed')

    vi.mocked(transactionService.getTransactionsByDateRange).mockRejectedValueOnce(error)

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.handleDateRangeChange([startDate, endDate])
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Date range fetch failed. Please try again.')
    expect(result.current.filteredTransactions).toEqual([])
  })

  it('should handle errors in date range filtering with non-Error instance', async () => {
    const startDate = dayjs('2025-01-01')
    const endDate = dayjs('2025-05-05')

    vi.mocked(transactionService.getTransactionsByDateRange).mockRejectedValueOnce('Unknown error')

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.handleDateRangeChange([startDate, endDate])
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('An error occurred. Please try again.')
    expect(result.current.filteredTransactions).toEqual([])
  })

  it('should reset to initial state when date range is cleared', async () => {
    vi.mocked(transactionService.getTransactions).mockResolvedValueOnce({
      data: mockTransactions.slice(0, 10),
      page: 1,
      pageSize: 10,
      total: mockTransactions.length,
      hasMore: true,
    })

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.handleDateRangeChange(null)
    })

    expect(transactionService.getTransactions).toHaveBeenCalledWith(1, 10)
    expect(result.current.filteredTransactions).toEqual(mockTransactions.slice(0, 10))
  })

  it('should handle table pagination changes', async () => {
    const page2Transactions = mockTransactions.slice(10, 20)
    vi.mocked(transactionService.getTransactions).mockResolvedValueOnce({
      data: page2Transactions,
      page: 2,
      pageSize: 10,
      total: mockTransactions.length,
      hasMore: true,
    })

    const { result } = renderHook(() => useTransactions())

    await act(async () => {
      await result.current.handleTableChange({ current: 2, pageSize: 10 })
    })

    expect(transactionService.getTransactions).toHaveBeenCalledWith(2, 10)
    expect(result.current.pagination).toEqual({
      current: 2,
      pageSize: 10,
      total: mockTransactions.length,
    })
    expect(result.current.filteredTransactions).toEqual(page2Transactions)
  })
})
