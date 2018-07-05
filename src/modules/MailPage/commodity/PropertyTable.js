import React, { Component } from 'react'
import { message, Table, Button, Card, Alert } from 'antd'
import PropertySelector from '../../components/PropertySelector'
import EditableCell from '../../components/PropertySelector/EditableCell'
import * as action from './propertyReduck'
import { connect } from 'react-redux'

class PropertyTable extends Component {

  _addPropertySelector = () => {
    this.props.dispatch(action.addPropertySelector({ groupId: '' }))
  }

  _selectGroup = (groupId, index) => {
    const { dispatch, groupIds } = this.props
    const isHas = groupIds.includes(groupId)
    if (isHas) {
      message.warn('该属性组已选择，不能重复哦！', 2)
    } else {
      dispatch(action.getPropertyList({ groupId, index }))
      this._selectProperty([], index)
    }
  }

  _selectProperty = (value, index) => {
    const newProperty = this.props.property.slice()
    newProperty[index] = value
    // if (this.state.table) {
    //   const arrr = []
    //   let propertyValueId = ''
    //   if (index === 0) {
    //     propertyValueId = 'property1'
    //   }
    //   if (index === 1) {
    //     propertyValueId = 'property2'
    //   }
    //   if (index === 2) {
    //     propertyValueId = 'property3'
    //   }
    //   this.props.propertyRows.map((rowItem, rowIndex) => {
    //     newProperty[index].some((item, index) => {
    //       if (rowItem[propertyValueId] && rowItem[propertyValueId].id === item) {
    //         arrr.push(item)
    //         return true
    //       }
    //     })
    //   })
    //   newProperty[index] = [...new Set([...arrr, ...newProperty[index]])]
    // }
    this.props.dispatch(action.setPropertys({ property: newProperty }))
  }

  _handleConfirm = () => {
    this.props.dispatch(action.getPropertyTable(this.props.property))
  }

  _deletePropertyGroup = index => {
    const { propertyPull, property, groupIds } = this.props
    const afterDelete = propertyPull.filter((item, i) => {
      if (i !== index) {
        return item
      }
    })
    const afterProperty = property.filter((item, i) => {
      if (i !== index) {
        return item
      }
    })
    const nextGroupIds = groupIds.slice().filter((m, i) => {
      if (i !== index) {
        return m
      }
    })
    this.props.dispatch(action.tableAfterDelete(afterProperty)).then(res => {
      if (res && res.code === 0) {
        this.props.dispatch(action.setPropertys({
          propertyPull: afterDelete,
          property: afterProperty,
          groupIds: nextGroupIds,
        }))
      }
    })
  }

  _getColumns = () => {
    const { dispatch, mode, propertyColumns } = this.props

    if (mode === 'view') {
      return propertyColumns.map(column => {
        delete column.render
        return column
      })
    } else {
      return propertyColumns.map(column => {
        column.width = 100
        let step = 1
        let min = 0
        let precision = 0
        if (column.dataIndex === 'price') {
          step = 0.01
          min = 0.01
          precision = 2
        }
        if (column.dataIndex === 'price') {
          column.width = 80
          column.render = (text, record, index) => {
            return (
              <EditableCell
                componentType={'InputNumber'}
                key={index}
                value={text}
                index={index}
                name={column.dataIndex}
                dispatch={dispatch}
                min={min}
                step={step}
                precision={precision}
                onChange={value => this._onCellChange(value, index, column.dataIndex)}
              />
            )
          }
        }
        if (column.dataIndex === 'stock') {
          column.width = 80
          column.render = (text, record, index) => {
            return (
              <EditableCell
                componentType={'InputNumber'}
                key={index}
                value={text}
                index={index}
                name={column.dataIndex}
                dispatch={dispatch}
                step={step}
                precision={precision}
                onChange={value => this._onCellChange(value, index, column.dataIndex)}
              />
            )
          }
        }
        return column
      })
    }
  }

  _getData = () => {
    if (this.props.mode === 'edit') {
      return this.props.propertyRows.map((row, index) => {
        return {
          key: index,
          property1: row.property1 && row.property1.value,
          property2: row.property2 && row.property2.value,
          property3: row.property3 && row.property3.value,
          price: row.price,
          stock: row.stock
        }
      })
    } else {
      return this.props.propertyRows.map((row, index) => {
        return {
          key: index,
          property1: row.property1 && row.property1.value,
          property2: row.property2 && row.property2.value,
          property3: row.property3 && row.property3.value,
          price: row.price && row.price.toFixed(2),
          stock: row.stock
        }
      })
    }
  }

  _onCellChange = (value, index, key) => {
    const newTableRows = this.props.propertyRows.slice()
    newTableRows[index][key] = value
    this.props.dispatch(action.setPropertys({ propertyRows: newTableRows }))
  }

  render() {
    const { maxRow, mode, propertyPull, property, propertyColumns } = this.props
    return (
      <Card
        title='规格属性'
        style={{ marginBottom: 24 }}
        bordered={false}
        extra={
          <div>
            {propertyPull &&
              propertyPull.length < maxRow &&
              mode === 'edit' && (
                <Button type='primary' style={{ marginRight: 8 }} onClick={this._addPropertySelector}>
                  添加属性
                </Button>
              )}
            {mode === 'edit' && <Button onClick={this._handleConfirm}>确认</Button>}
          </div>
        }
      >
        {mode === 'edit' && (
          <PropertySelector
            mode={mode}
            property={property}
            propertyPull={propertyPull}
            selectGroup={this._selectGroup}
            selectProperty={this._selectProperty}
            deletPropertyGroup={this._deletePropertyGroup}
          />
        )}
        {mode === 'edit' && propertyColumns.length > 0 && (
          <Alert message='编辑时库存为增量库存，请注意' type='warning' showIcon closable style={{ margin: '8px 0' }} />
        )}
        <Table size='middle' bordered columns={this._getColumns()} dataSource={this._getData()} pagination={false} />
      </Card>
    )
  }
}

const mapStateToProps = ({ property }) => {
  return {
    property: property.property,
    propertyPull: property.propertyPull,
    propertyRows: property.propertyRows,
    propertyColumns: property.propertyColumns,
    groupIds: property.groupIds,
  }
}
export default connect(mapStateToProps)(PropertyTable)
