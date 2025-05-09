import { TransactionsTable } from '@components'
import { mockTransactions } from '@mocks'

const Dashboard = () => {
  return (
    <>
      <TransactionsTable data={mockTransactions} />
    </>
  )
}

export default Dashboard
