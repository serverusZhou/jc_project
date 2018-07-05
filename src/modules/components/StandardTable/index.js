import React, { PureComponent } from 'react'
import { Table, Alert } from 'antd'
import styles from './index.less'

class StandardTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      })
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows, selectedRowKeys)
    }
    this.setState({ selectedRowKeys })
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter)
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], [])
  }

  render() {
    const { selectedRowKeys } = this.state
    const { data: { list, pagination }, columns, rowKey, scroll } = this.props

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled
      })
    }

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={
              <span>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 12 }}>
                  清空
                </a>
                <span style={{ marginLeft: 24 }} >
                  {this.props.message}
                </span>
              </span>
            }
            type={this.props.message ? 'warning' : 'info'}
            showIcon
          />
        </div>
        <Table
          scroll={scroll}
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={pagination}
          // onChange={this.handleTableChange}
        />
      </div>
    )
  }
}

export default StandardTable
