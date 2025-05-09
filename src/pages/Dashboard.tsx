import { useEffect } from 'react'
import { Alert, Flex, Typography } from 'antd'

import { DateRangeFilter, TransactionsTable } from '@components'
import { useTransactions } from '@/hooks/useTransactions'

const { Text } = Typography

const Dashboard = () => {
  const {
    loading,
    error,
    filteredTransactions,
    pagination,
    fetchTransactions,
    handleDateRangeChange,
    handleTableChange,
  } = useTransactions()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

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
