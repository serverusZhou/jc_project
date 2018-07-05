import React from 'react'
import { connect } from 'react-redux'
import DraggableList from '../../component/DraggableList'
import LayoutCardItem from './layoutCardItem'

class LayoutContainer extends React.Component {
  _handleUpdate = evt => {
    this.props.sort(evt.oldIndex, evt.newIndex)
  }

  render() {
    const { dataSource, moduleSortLoading } = this.props
    return (
      !moduleSortLoading ? <DraggableList
        dataSource={dataSource.filter((item) => !!item)}
        row={(record, index) => (<LayoutCardItem
          isPreview={false} item={record} editModule={() => this.props.editModule(index)}
          editVideo={this.props.editVideo(index)}
          deleteModule={() => this.props.deleteModule(index)}
                                 />)}
        handles={false}
        onUpdate={this._handleUpdate}
                           /> : ''
    )
  }
}

const mapStateToProps = (state) => {
  return {
    moduleSortLoading: state.oTTResource.oTTChannel.moduleSortLoading,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(LayoutContainer)
