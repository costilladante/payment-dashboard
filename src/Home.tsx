import { App, Flex, Typography } from 'antd'
import { Dashboard } from '@pages'

const { Title } = Typography

import styles from './Home.module.scss'

const Home = () => {
  return (
    <App>
      <Flex className={styles['home']} vertical>
        <Title>Transactions</Title>
        <Dashboard />
      </Flex>
    </App>
  )
}

export default Home
