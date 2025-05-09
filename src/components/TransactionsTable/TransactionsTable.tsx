import { Table } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table'

import type { Transaction } from '@/types'

import { TableColumns } from './_TableColumns'
import { Footer } from './_Footer'

interface TransactionsTableProps {
  data: Transaction[]
  loading: boolean
  onChange: (newPagination: TablePaginationConfig) => void
  pagination: TablePaginationConfig
}

const TransactionsTable = ({ data, loading, pagination, onChange }: TransactionsTableProps) => {
  const totalTransactions = pagination.total || 0
  const totalAmount = data.reduce((acc, transaction) => acc + transaction.amount, 0)
  return (
    <Table
      columns={TableColumns}
      dataSource={data}
      rowKey="id"
      pagination={pagination}
      onChange={onChange}
      footer={() => <Footer totalTransactions={totalTransactions} totalAmount={totalAmount} />}
      loading={loading}
    />
  )
}

export default TransactionsTable
