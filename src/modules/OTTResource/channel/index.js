import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import * as commonActions from '../reduck'
import { oTTChannelList, oTTChannelDelete, oTTChannelAdd, oTTChannelEdit, oTTChanneCardslSort, oTTChannelMainDetailUpdate } from './reduck'
import { Button, List, Icon, Card, Tabs, message, Modal, Divider } from 'antd'
import { MainChannelModuleTable, ChildChannelTable } from './Tables'
import AddAudit from './AddAudit'
import Forms from './Forms'
import styles from './style.less'

const TabPane = Tabs.TabPane
class OTTChannel extends Component {

  constructor (props) {
    super(props)
    this.state = {
      editChannel: {},
      channelCreateChild: {},
      channelEditChild: {},
      showAddModal: false,
      showAddChildModal: false,
      showEditModal: false,
      showEditChildModal: false,
      showAuditModal: false,
      auditChannel: {}
    }
  }

  _getList = (args) => {
    this.props.dispatch(oTTChannelList(args))
  }
  _handelDelete = (channelData) => {
    let { id: channelId, pid: channelPid, enable } = channelData
    let canDelete = Number(enable) === 0
    if (!channelPid) { // channelPid = 0 的为一级菜单
      // 删除的如果是一节菜单，需要判断其二级菜单的启用情况
      // 只有一级和二级菜单都不启用时才能删除
      let secoundChannels = channelData.secoundChannels || []
      canDelete = channelData.enable === 0 && secoundChannels.every(secoundChannel => secoundChannel.enable !== 1)
    }
    if (!canDelete) {
      return message.error('该菜单处于启用状态，不能删除!')
    }
    // 根据删除的是一级还是二级频道来确定提示文字
    let content = Number(channelPid) === 0 ? '一级菜单删除后，对应的二级菜单和所作的配置也将被删除，确定要删除吗？' : '删除后用户将不再能看到该视频，且删除后不可恢复，确认删除么？'
    Modal.confirm({
      title: '提示',
      content,
      onOk: () => {
        this.props.dispatch(oTTChannelDelete({ id: channelId }))
      }
    })
  }
  _handleAdd = (values) => {
    this.setState({ showAddModal: false })
    this.props.dispatch(oTTChannelAdd({
      ...values,
      enable: Number(values.enable),
      pid: 0,
      sort: this.props.list.length + 1
    }))
  }
  _handleAddChild = (values) => {
    this.setState({ showAddChildModal: false })
    this.props.dispatch(oTTChannelAdd({
      ...values,
      enable: Number(values.enable),
      pid: Number(this.state.channelCreateChild.id),
      sort: this.state.channelCreateChild.secondChannels ? this.state.channelCreateChild.secondChannels.length + 1 : 1
    }))
  }
  _handleEdit = (values) => {
    this.setState({ showEditModal: false, showEditChildModal: false })
    this.props.dispatch(oTTChannelEdit({
      ...this.state.editChannel,
      ...values,
      enable: Number(values.enable),
    }))
  }
  _handleDeleteModule = (item) => {
    return (index) => {
      const cardArray = item.cards.filter((obj, i) => i !== index)
      this.props.dispatch(oTTChannelMainDetailUpdate({
        channelId: item.id,
        json: JSON.stringify({ cards: cardArray }),
      }))
    }
  }
  _handleSortModule = (item) => {
    return (source, target) => {
      const cardArray = item.cards.map((obj, i) => {
        if (i === source.index) {
          const values = Object.assign({}, target)
          delete values.index
          return {
            ...values,
            sort: source.sort,
          }
        }
        if (i === target.index) {
          const values = Object.assign({}, source)
          delete values.index
          return {
            ...values,
            sort: target.sort
          }
        }
        return obj
      })
      this.props.dispatch(oTTChanneCardslSort({
        channelId: item.id,
        json: JSON.stringify({ cards: cardArray }),
      }))
    }
  }
  _handleAudit = (data) => {
    const { dispatch } = this.props
    const { auditChannel } = this.state
    const snapData = {
      channelId: auditChannel.channelId,
      name: auditChannel.name,
      id: auditChannel.id,
      sort: auditChannel.sort,
      enable: auditChannel.enable,
    }
    const arg = {
      serviceId: auditChannel.channelId,
      status: 1,
      type: 10,
      ...snapData,
      // 保存快照信息
      snapShot: JSON.stringify({ ...snapData, ...data })
    }
    dispatch(commonActions.auditConfirm(arg)).then((arg) => {
      if (arg.status === 'success') {
        this._getList()
      }
    })
  }
  componentDidMount() {
    this._getList()
  }

  render() {
    const { list } = this.props
    const { showAddModal, showEditModal, showAddChildModal, showAuditModal, showEditChildModal } = this.state
    return (
      <div>
        <div className={styles.cardList}>
          <List
            rowKey='id'
            loading={this.props.loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list || [], '']}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable className={styles.card}
                    title={item.name}
                    actions={[
                      <Link key='1' to={`${urls.OTT_CHANNEL}/edit/${item.id}`}>进入模块</Link>,
                      <a key='2' onClick={() => this.setState({ editChannel: item, showEditModal: true })}>频道配置</a>,
                      <a key='3' onClick={() => this._handelDelete(item)}>删除频道</a>
                    ]}
                    extra={(() => {
                      if (Number(item.auditStatus) === 0) {
                        return [
                          <Link key='1' to={`${urls.OTT_CHANNEL}/edit/${item.id}`}>预览</Link>,
                          <Divider key='2' type='vertical' />,
                          <a key='2' onClick={() => this.setState({ showAuditModal: true, auditChannel: item })}>提交审核</a>,
                        ]
                      }
                      if (Number(item.auditStatus) === 2) {
                        return [
                          <Link key='1' to={`${urls.OTT_CHANNEL}/edit/${item.id}`}>预览</Link>,
                          <Divider key='2' type='vertical' />,
                          <a key='3' onClick={() => this.setState({ showAuditModal: true, auditChannel: item })}>查看原因</a>,
                          <Divider key='2' type='vertical' />,
                          <a key='2' onClick={() => this.setState({ showAuditModal: true, auditChannel: item })}>重新审核</a>,
                        ]
                      }
                      if (Number(item.auditStatus) === 3) {
                        return [
                          <Link key='1' to={`${urls.OTT_CHANNEL}/edit/${item.id}`}>预览</Link>,
                        ]
                      }
                    })()
                    }
                  >
                    <Card.Meta
                      description={
                        <div className={styles.item}>
                          <Tabs defaultActiveKey='1'>
                            <TabPane tab='模块' key='1' forceRender={true}>
                              <MainChannelModuleTable dataSource={item.cards} deleteModule = {this._handleDeleteModule(item)} sort={this._handleSortModule(item)} />
                            </TabPane>
                            <TabPane tab='子频道' key='2' forceRender={true}>
                              <ChildChannelTable
                                dataSource={item.secondChannels}
                                editMehod={(record) => this.setState({ channelEditChild: record, showEditChildModal: true })}
                                deleteMethod={this._handelDelete}
                                addMethod={() => { this.setState({ channelCreateChild: item, showAddChildModal: true }) }}
                              />
                            </TabPane>
                          </Tabs>
                        </div>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button type='dashed' className={styles.newButton} onClick={() => this.setState({ showAddModal: true })}>
                    <Icon type='plus' /> 新增频道
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Modal
          title='新增频道'
          visible={showAddModal}
          onCancel={() => this.setState({ showAddModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <Forms
            values={[
              { type: 'Input', label: '名称', field: 'name', rules: [{
                required: true,
                message: '请输入名称',
                max: 20
              }] },
              { type: 'Switch', label: '启用', field: 'enable', rules: [{ required: true }], initialValue: false }
            ]}
            onClose={() => this.setState({ showAddModal: false })}
            callBack={(values) => this._handleAdd(values)}
          />
        </Modal>
        <Modal
          title='编辑频道'
          visible={showEditModal}
          onCancel={() => this.setState({ showEditModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <Forms
            values={[
              { type: 'Input', label: '名称', field: 'name', rules: [{ required: true, message: '请输入名称', max: 20 }], initialValue: this.state.editChannel.name },
              { type: 'Switch', label: '启用', field: 'enable', rules: [{ required: true }], initialValue: !!(Number(this.state.editChannel.enable)) }
            ]}
            onClose={() => this.setState({ showEditModal: false })}
            callBack={(values) => this._handleEdit(values)}
          />
        </Modal>
        <Modal
          title='新增子频道'
          visible={showAddChildModal}
          onCancel={() => this.setState({ showAddChildModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <Forms
            values={[
              { type: 'Input', label: '名称', field: 'name', rules: [{
                required: true,
                message: '请输入名称',
                max: 20
              }] },
              { type: 'Switch', label: '启用', field: 'enable', rules: [{ required: true }], initialValue: false }
            ]}
            onClose={() => this.setState({ showAddChildModal: false })}
            callBack={(values) => this._handleAddChild(values)}
          />
        </Modal>
        <Modal
          title='编辑子频道'
          visible={showEditChildModal}
          onCancel={() => this.setState({ showEditChildModal: false })}
          destroyOnClose={true}
          footer={null}
        >
          <Forms
            values={[
              { type: 'Input', label: '名称', field: 'name', rules: [{ required: true, message: '请输入名称', max: 20 }], initialValue: this.state.channelEditChild.name },
              { type: 'Switch', label: '启用', field: 'enable', rules: [{ required: true }], initialValue: !!(Number(this.state.channelEditChild.enable)) }
            ]}
            onClose={() => this.setState({ showEditModal: false })}
            callBack={(values) => this._handleEdit({ ...values, id: this.state.channelEditChild.id })}
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
    list: state.oTTResource.oTTChannel.list,
    loading: state.oTTResource.oTTChannel.channelListLoading,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(OTTChannel)
