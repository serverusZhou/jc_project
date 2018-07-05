import React, { Component } from 'react'
import { connect } from 'react-redux'
import { oTTChanneDetail, oTTChannelDetailUpdate, oTTChanneCardslSort } from '../reduck'
import { Button, Modal, Spin } from 'antd'
import LayoutContainer from './layoutContainer'
import ModuleForm from './ModuleForm'
import VideoForm from './VideoForm'
import AddAudit from '../AddAudit'
import styles from './styles.less'

const generateEmptyVideos = function(layoytID) {
  const layoutVideosMap = { 1: 4, 2: 4, 3: 6, 4: 9, 5: 2, 6: 3, 7: 6 } // 每种模板对应的video数量
  const videoArray = []
  for (let i = 0; i < layoutVideosMap[layoytID]; i++) {
    videoArray.push({ subName: '', name: '', videoId: '', url: '' })
  }
  return videoArray
}

class OTTChannelDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAddModal: false,
      showEditModal: false,
      showEditVideoModal: false,
      showAuditModal: false,
      editIndex: 0, // 模块编辑
      editVideoIndex: {
        moduleIndex: 0,
        videoIndex: 0,
      },
      id: this.props.match.params.id,
      detail: {}
    }
  }

  _getDetail = (args) => {
    this.props.dispatch(oTTChanneDetail(args, this.state.id))
  }
  _addModule = (values) => {
    this.setState({ showAddModal: false })
    this.state.detail.cards.push({
      ...values,
      videos: generateEmptyVideos(values.layoutId),
      sort: this.state.detail.cards.length + 1
    })
    this.props.dispatch(oTTChannelDetailUpdate({ channelId: this.state.id, json: JSON.stringify({ cards: this.state.detail.cards }) }, this.state.id))
  }
  _editModule = (values) => {
    this.setState({ showEditModal: false })
    this.state.detail.cards[this.state.editIndex] = {
      ...this.state.detail.cards[this.state.editIndex],
      ...values
    }
    this.props.dispatch(oTTChannelDetailUpdate({ channelId: this.state.id, json: JSON.stringify({ cards: this.state.detail.cards }) }, this.state.id))
  }
  _deleteModule = (index) => {
    this.props.dispatch(oTTChannelDetailUpdate({ channelId: this.state.id, json: JSON.stringify({ cards: this.state.detail.cards.filter((card, i) => i !== index).map((card, ind) => ({ ...card, sort: ind + 1 })) }) }, this.state.id))
  }
  _showEditModule = (index) => {
    this.setState({ showEditModal: true, editIndex: index })
  }

  _showEditVideo = (moduleIndex) => {
    return (videoIndex) => {
      this.setState({
        editVideoIndex: { moduleIndex, videoIndex },
        showEditVideoModal: true
      })
    }
  }
  _editVideo = (values) => {
    this.setState({ showEditVideoModal: false })
    const { moduleIndex, videoIndex } = this.state.editVideoIndex
    this.state.detail.cards[moduleIndex].videos[videoIndex] = {
      ...this.state.detail.cards[moduleIndex].videos[videoIndex],
      ...values
    }
    this.props.dispatch(oTTChannelDetailUpdate({ channelId: this.state.id, json: JSON.stringify({ cards: this.state.detail.cards }) }, this.state.id))
  }
  _moduleSort = (oldIndex, newIndex) => {
    const oldModule = this.state.detail.cards[oldIndex]
    this.state.detail.cards[oldIndex] = this.state.detail.cards[newIndex]
    this.state.detail.cards[newIndex] = oldModule
    this.props.dispatch(oTTChanneCardslSort({ channelId: this.state.id, json: JSON.stringify({ cards: this.state.detail.cards.map((card, index) => ({ ...card, sort: index + 1 })) }) }, this.state.id))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      detail: nextProps.detail || {}
    })
  }
  componentDidMount() {
    this._getDetail()
  }

  render() {
    const { showAddModal, showEditModal, showEditVideoModal, showAuditModal, detail, editVideoIndex } = this.state
    const { moduleIndex, videoIndex } = editVideoIndex
    console.info('detail', detail)
    return (
      <div>
        <Spin spinning={this.props.loading}>
          <div className={styles.rightButtons}>
            {/* <Button type='primary' onClick={() => this.setState({ showAuditModal: true })} >上传过审图</Button> */}
            <Button type='primary' onClick={() => this.setState({ showAddModal: true })}>新增模板</Button>
          </div>
          <LayoutContainer
            dataSource={this.state.detail.cards || []} editModule={this._showEditModule} deleteModule={this._deleteModule}
            sort = {this._moduleSort}
            editVideo={this._showEditVideo}
          />
        </Spin>
        <Modal
          title='新增'
          width={800}
          visible={showAddModal}
          onCancel={() => this.setState({ showAddModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <ModuleForm onOk={this._addModule} onClose={() => this.setState({ showAddModal: false })} />
        </Modal>
        <Modal
          title='编辑'
          width={800}
          visible={showEditModal}
          onCancel={() => this.setState({ showEditModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <ModuleForm
            isEdit = {true}
            onOk={this._editModule}
            initData={this.state.detail.cards ? this.state.detail.cards[this.state.editIndex] : null}
            onClose={() => this.setState({ showEditModal: false })}
          />
        </Modal>
        <Modal
          title='编辑'
          width={800}
          visible={showEditVideoModal}
          closable={false}
          maskClosable={false}
          onCancel={() => this.setState({ showEditVideoModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <VideoForm
            onOk={this._editVideo}
            initData={(detail.cards && detail.cards[moduleIndex] && detail.cards[moduleIndex].videos) ? detail.cards[moduleIndex].videos[videoIndex] : null}
            onClose={() => this.setState({ showEditVideoModal: false })}
          />
        </Modal>
        <Modal
          width={'800px'}
          title='提交审核'
          visible={showAuditModal}
          onOk={() => this.setState({ showAuditModal: false })}
          onCancel={() => this.setState({ showAuditModal: false })}
          footer={null}
          maskClosable={false}
        >
          <AddAudit
            handlerAdd={this._handleAudit}
            onClose={() => this.setState({ showAuditModal: false })}
          />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    detail: state.oTTResource.oTTChannel.detail,
    loading: state.oTTResource.oTTChannel.channelListLoading,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(OTTChannelDetail)
