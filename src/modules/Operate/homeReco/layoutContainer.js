import React from 'react'
import { createAction } from 'redux-actions'

import DraggableList from '../component/DraggableList'
import LayoutCardItem from './layoutCardItem'
import { editLayout, GET_LAYOUT_LIST } from './reduck'

class LayoutContainer extends React.Component {
  _handleUpdate = evt => {
    const { dataSource, dispatch, channelId } = this.props
    // console.log(dataSource) // tslint:disable-line
    // console.log(evt) // tslint:disable-line
    dispatch(createAction(GET_LAYOUT_LIST)({ data: { layoutDetailVOList: [] }}))
    dispatch(editLayout({ ...dataSource[evt.newIndex], sort: evt.oldIndex + 1 }, channelId))
    dispatch(editLayout({ ...dataSource[evt.oldIndex], sort: evt.newIndex + 1 }, channelId))
  }

  render() {
    const { dataSource, channelId, dispatch, bindContent, isPreview, aliToken } = this.props
    return (
      <DraggableList
        // disabled
        dataSource={dataSource}
        row={(record, index) => (
          <LayoutCardItem
            isPreview={isPreview}
            key={index}
            channelId={channelId}
            dispatch={dispatch}
            id={record.id}
            dataSource={record}
            bindContent={bindContent}
            aliToken={aliToken}
          />
        )}
        handles={false}
        // className='simple-drag'
        // rowClassName='simple-drag-row'
        onUpdate={this._handleUpdate}
      />
    )
  }
}

export default LayoutContainer
