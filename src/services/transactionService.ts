import { mockTransactions } from '@mocks/mockTransactions'
import type { Transaction } from '@/types'
import { delay } from '@/utils'
import type { PaginatedResponse } from '@/api'
import { TABLE_PAGE_SIZE } from '@/constants'

/**
 * Mock calls to the transactions endpoint
 */
export const transactionService = {
  /**
   * Mock a GET request to the transactions endpoint. Simulates a delay and optionally can simulate a failure
   * @param page - The page number to fetch
   * @param pageSize - The number of transactions per page (default: 10)
   * @returns A promise that resolves to a PaginatedResponse<Transaction>
   */
  async getTransactions(
    page = 1,
    pageSize = TABLE_PAGE_SIZE,
  ): Promise<PaginatedResponse<Transaction>> {
    // Simulate API failure (uncomment to test)
    // await delay(1000)
    // throw new Error('Failed to fetch transactions')

    // Simulate network delay
    await delay(800)

    // Calculate pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = mockTransactions.slice(start, end)
    const total = mockTransactions.length
    console.log('total', total)
    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      hasMore: end < total,
    }
  },

  /**
   * Mock a GET request to the transactions endpoint simulating a delay. Optionally can simulate a failure
   * @param startDate - The start date to filter transactions by
   * @param endDate - The end date to filter transactions by
   * @param page - The page number to fetch
   * @param pageSize - The number of transactions per page (default: 10)
   * @returns A promise that resolves to a PaginatedResponse<Transaction>
   */
  async getTransactionsByDateRange(
    startDate: string,
    endDate: string,
    page = 1,
    pageSize = TABLE_PAGE_SIZE,
  ): Promise<PaginatedResponse<Transaction>> {
    // Filter transactions by date range
    const filteredTransactions = mockTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate)
    })

    // Simulate API failure (uncomment to test)
    await delay(1000)
    throw new Error('Failed to fetch transactions')

    // Simulate network delay
    await delay(800)

    // Calculate pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedData = filteredTransactions.slice(start, end)
    const total = filteredTransactions.length

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      hasMore: end < total,
    }
  },
}
