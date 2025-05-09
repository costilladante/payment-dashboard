import { Flex, Typography } from 'antd'

const { Text } = Typography

interface FooterProps {
  totalTransactions: number
  totalAmount: number
}

export const Footer = ({ totalTransactions, totalAmount }: FooterProps) => {
  const isPositive = totalAmount >= 0
  return (
    <Flex justify="space-between" align="center">
      <Text>Total Transactions: {totalTransactions}</Text>
      <Text type={isPositive ? 'success' : 'danger'}>Total Amount: {totalAmount}</Text>
    </Flex>
  )
}
