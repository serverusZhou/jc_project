import * as React from 'react'
import classNames from 'classnames'
import Sortable from 'sortablejs'

export default class DraggableList extends React.Component {
  static defaultProps = {
    disabled: false,
    handles: true,
    animation: 150,
    prefixCls: 'rc-draggable-list',
  }

  _sortableGroupDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      const { animation, onUpdate, prefixCls, ghostClass, chosenClass, dragClass, disabled } = this.props
      const options = {
        disabled,
        animation,
        draggable: `.${prefixCls}-draggableRow`, // Specifies which items inside the element should be sortable
        // group: "shared",
        ghostClass: ghostClass || `${prefixCls}-ghost`, // Class name for the drop placeholder
        chosenClass: chosenClass || `${prefixCls}-chosen`,  // Class name for the chosen item
        dragClass: dragClass || `${prefixCls}-drag`,  // Class name for the dragging item
        onUpdate: (evt) => {
          onUpdate && onUpdate(evt)  // tslint:disable-line
        },
      }
      Sortable.create(componentBackingInstance, options)
    }
  }

  render() {
    const { style, className, rowClassName, prefixCls, dataSource, row, handles, disabled } = this.props

    return (
      <div className={classNames(prefixCls, className)} style={style}>
        <div ref={this._sortableGroupDecorator}>
          {dataSource.map((record, index) => (
            <div
              key={index}
              className={classNames(`${prefixCls}-draggableRow`, rowClassName)}
              style={{
                cursor: disabled ? 'default' : 'move',
              }}
            >
              {(!disabled) && handles && (<span className={`${prefixCls}-handles`}>&#9776</span>)}
              {row(record, index)}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
