import { Table } from 'antd'
import { Transaction } from '@/types'
import { TableColumns } from './_TableColumns'

interface TransactionsTableProps {
  data: Transaction[]
}

const TransactionsTable = ({ data }: TransactionsTableProps) => (
  <Table columns={TableColumns} dataSource={data} />
)

export default TransactionsTable
