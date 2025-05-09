import { type ColumnType } from 'antd/es/table'
import { Transaction } from '@/types'
import FilterDropdown from './_FilterDrodown'

export const TableColumns: ColumnType<Transaction>[] = [
  {
    title: 'Transaction ID',
    dataIndex: 'id',
    key: 'id',
    sorter: (a, b) => a.id.localeCompare(b.id),
    onFilter: (value, record) => record.id.toLowerCase().includes((value as string).toLowerCase()),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <FilterDropdown
        placeholder="Search ID"
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        confirm={confirm}
      />
    ),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    defaultSortOrder: 'descend',
    align: 'center',
    width: 150,
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    render: (date: string) => {
      return <span>{new Date(date).toLocaleDateString()}</span>
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    sorter: (a, b) => a.description.localeCompare(b.description),
    ellipsis: true,
    onFilter: (value, record) =>
      record.description.toLowerCase().includes((value as string).toLowerCase()),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <FilterDropdown
        placeholder="Search description"
        setSelectedKeys={setSelectedKeys}
        selectedKeys={selectedKeys}
        confirm={confirm}
      />
    ),
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    sorter: (a, b) => a.amount - b.amount,
    render: (amount: number) => {
      return <span>${amount.toFixed(2)}</span>
    },
  },
]
