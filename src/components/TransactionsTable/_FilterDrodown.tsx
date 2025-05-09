import { Input } from 'antd'
import { FilterDropdownProps as AntdFilterDropdownProps } from 'antd/es/table/interface'

import styles from './TransactionsTable.module.scss'

interface FilterDropdownProps
  extends Pick<AntdFilterDropdownProps, 'setSelectedKeys' | 'selectedKeys' | 'confirm'> {
  placeholder: string
}

const FilterDropdown = ({
  placeholder,
  setSelectedKeys,
  selectedKeys,
  confirm,
}: FilterDropdownProps) => (
  <div className={styles['table-filter-dropdown-container']}>
    <Input
      className={styles['table-filter-dropdown-input']}
      placeholder={placeholder}
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
    />
  </div>
)

export default FilterDropdown
