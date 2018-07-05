// 专题管理首页
import React, { Component } from 'react'
import { connect } from 'react-redux'
import style from './style.module.less'
import { Button, Table, Modal, message, Divider } from 'antd'
import AddAudit from './addAudit'
import * as commonActions from '../reduck'
import fetchOtt from 'Utils/fetch'
import apis from '../apis'
import ConfigVideo from './form'

class LiveOTT extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      selectedRowKeys: [], // 多选选中数据
      cards: [], // 列表数据
      currentEditIndex: 0, // 当前编辑的卡片的数组顺序
      currentEditCard: {}, // 当前编辑的卡片
      configAppear: false,
      cardState: 0, // 1代表增加，0代表修改
      type: 1, // 1：点播2：资讯3：推荐
      channelId: '',
    }

    this.sortCard.bind(this)

    this.channelInfo = {} // 频道信息，不包含cards
    this.columns = [{
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
    }, {
      title: '视频名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record, index) => {
        text = text || '直播'
        return text
      }
    }, {
      key: 'url',
      title: '封面图',
      align: 'center',
      className: style['table-image-column'],
      dataIndex: 'url',
      render: (text, record, index) =>
        (
          record.url && <img src={record.url} className={style['interphase-preview']} />
        )
    }, {
      title: '状态',
      dataIndex: 'isEnable',
      key: 'isEnable',
      render: (text, card, index) => {
        return (
          <span style={{ color: text ? 'green' : 'grey' }} >{text ? '已启用' : '未启用'}</span>
        )
      }
    }, {
      title: '操作',
      render: (text, card, index) => {
        return (
          <div>
            {
              index === 0 ? (
                <a style={{ color: 'grey' }}>上移</a>
              ) : (
                <a onClick={() => { this.sortCard(1, index) }}>上移</a>
                )
            }
            <Divider type='vertical' />
            {
              index === (this.state.cards.length - 1) ? (
                <a style={{ color: 'grey' }}>下移</a>
              ) : (
                <a onClick={() => { this.sortCard(-1, index) }}>下移</a>
                )
            }
            <Divider type='vertical' />
            <a
              onClick={() => {
                this.editCard(card, index)
              }}
            >编辑</a>
            <Divider type='vertical' />
            {
              card.isEnable ? (
                <a onClick={() => { this.updateEnable(card, index) }} style={{ color: 'grey' }}>禁用</a>
              ) : (
                <a onClick={() => { this.updateEnable(card, index) }} style={{ color: 'green' }}>启用</a>
                )
            }
            <Divider type='vertical' />
            <a onClick={() => { this.deleteCards([card.sort]) }}>删除</a>
          </div>
        )
      }
    }]
  }

  componentDidMount() {
    // let type = this.props.match.location.search.replace(/\?/g, '')
    let type = location.search.replace(/\?/g, '')
    type = Number(type)
    this.setState({
      type: type,
    })
    this.initData(type) // 初始化数据
    this.getChannelInfo(type)
  }

  componentWillReceiveProps(newtProps) {
    if (newtProps.match.location && newtProps.match.location.search && newtProps.match.location.search !== this.props.match.location.search) {
      let type = newtProps.match.location.search.replace(/\?/g, '')
      type = Number(type)
      this.setState({
        type: type,
      })
      this.initData(type) // 初始化数据
      this.setState({
        configAppear: false,
      })
    }
  }

  // 调整顺序
  sortCard(type, index) {
    let cards = this.state.cards
    if (type === 1 && index > 0) { // 上移
      cards[index].sort = cards[index].sort - 1
      cards[index - 1].sort = cards[index - 1].sort + 1
    } else if (type === -1 && index < cards.length - 1) {
      cards[index].sort = cards[index].sort + 1
      cards[index + 1].sort = cards[index + 1].sort - 1
    } else {
      return
    }
    this.modifyReqData(cards)
  }

  // 修改单个视频启用状态
  updateEnable(card, index) {
    let cards = this.state.cards
    cards[index].isEnable = card.isEnable ? 0 : 1
    this.modifyReqData(cards)
  }

  // 更新sort，防止删除后断层
  updateSortNum(cards) {
    for (let i = 0; i < cards.length - 1; i++) {
      for (let j = 0; j < cards.length - 1 - i; j++) {
        if (cards[j].sort > cards[j + 1].sort) {
          let temp = cards[j]
          cards[j] = cards[j + 1]
          cards[j + 1] = temp
        }
      }
    }

    let m = 0
    cards = cards.map((card) => {
      m = m + 1
      return {
        ...card,
        sort: m
      }
    })
    return cards
  }
  // 初始获取cards数据
  async getChannelInfo(type) {
    let res = await fetchOtt(apis.media.channel, { type: type })
    if (res.code === 0) {
      this.setState({
        channelId: res.data[0].channelId,
      })
    } else {
      console.error(res.errmsg)
    }
  }
  // 初始获取cards数据
  async initData(type) {
    let res = await fetchOtt(apis.media.list, { id: type })
    if (res.code === 0) {
      let cards = this.updateSortNum(res.data.cards)
      delete res.data.cards
      this.channelInfo = res.data

      this.setState({
        cards: cards,
      })
    } else {
      console.error(res.errmsg)
    }
  }

  // 删除提示框
  deleteCards(sorts) {
    if (sorts.length === 0) {
      message.error('请选择要删除的视频！')
      return false
    }
    let isWarn = sorts.length > 1 ? '选中的' : sorts
    Modal.confirm({
      title: '',
      content: `确认删除"${isWarn}"视频"？`,
      onOk: () => { this.deletePage(sorts) },
      onCancel() { },
    })
  }

  // 删除接口
  deletePage(sorts) {
    this.setState({ selectedRowKeys: [] })

    let cards = this.state.cards
    cards = cards.filter((card) => {
      sorts.forEach((sort) => {
        if (card.sort === sort) {
          card = false
        }
      })
      return card
    })

    this.modifyReqData(cards)
  }

  // 数据修改完毕，更新本地cards
  saveVideoData(data) {
    let cards = this.state.cards
    if (this.state.cardState === 1) {
      data.sort = cards.length + 1
      cards.push(data)
    } else if (this.state.cardState === 0) {
      cards[this.state.currentEditIndex] = data
    }

    this.modifyReqData(cards)
  }

  // 选择的视频标志
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRowKeys })
  }

  // 增加单个视频
  addCard() {
    this.setState({
      configAppear: true,
      cardState: 1,
    })
  }

  // 编辑视频
  editCard(card, index) {
    this.setState({
      currentEditIndex: index,
      currentEditCard: card,
      configAppear: true,
      cardState: 0,
    })
  }

  // 返回列表页
  backToList() {
    this.setState({
      configAppear: false,
    })
  }

  // 请求更新数据
  async modifyReqData(cards) {
    cards = this.updateSortNum(cards)
    this.setState({
      cards: cards,
    })

    let res = await fetchOtt(apis.media.update, {
      channelId: this.state.type,
      json: JSON.stringify({
        cards: cards
      })
    })
    if (res.code === 0) {
      this.setState({
        configAppear: false,
      })
      message.success('更新成功')
    } else {
      message.error('更新失败功')
    }
  }

  async publish() {
    let res = await fetchOtt(REQ_URL.OTT_OTHER_PUBLISH, {
      channelId: this.channelInfo.id,
      version: '1.0.0',
    })
    if (res.code === 0) {
      message.success('发布成功')
    } else {
      message.error('发布失败')
    }
  }
  // 提交审核
  _handlerLayoutAudit = (data) => {
    const { dispatch } = this.props
    let type = 11
    switch (this.state.type) {
      case 1: type = 11; break
      case 2: type = 12; break
      case 3: type = 13; break
    }
    const arg = {
      serviceId: this.state.channelId,
      status: 1,
      type: type,
      snapShot: JSON.stringify(data)
    }
    dispatch(commonActions.auditConfirm(arg)).then((arg) => {
      if (arg.status === 'success') {
        this.initData(this.state.type)
      }
    })
  }
  _handleCancel = () => {
    this.setState({
      showModal: false
    })
  }
  // 配置多个路由
  render() {
    const { showModal } = this.state
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange.bind(this),
    }
    return (
      <div className={style.liveOtt}>
        {
          this.state.configAppear ? (null) : (
            <div>
              {/* <Button type='primary' onClick={this.publish.bind(this)}>发布更新</Button> */}
              <Button type='primary' onClick={this.addCard.bind(this)}>新增视频</Button>
              <Button type='primary' onClick={this.deleteCards.bind(this, this.state.selectedRowKeys)}>删除</Button>
              <Button type='primary' onClick={() => this.setState({ showModal: true })}>提交审核</Button>
            </div>
          )
        }
        {
          this.state.configAppear ? (
            <ConfigVideo
              card={this.state.cardState === 1 ? {} : this.state.currentEditCard}
              imgType={1}
              saveVideoData={this.saveVideoData.bind(this)}
              backToList={this.backToList.bind(this)}
              searchType={this.state.type}
            />
          ) : (
            <Table
              rowSelection={rowSelection}
              dataSource={this.state.cards}
              columns={this.columns}
              pagination={false}
              rowKey={'sort'}
            />
            )
        }
        <Modal
          width={'800px'}
          title='提交审核'
          visible={showModal}
          onOk={this._handleSelect}
          onCancel={this._handleCancel}
          footer={null}
          maskClosable={false}
        >
          <AddAudit
            handlerAdd={this._handlerLayoutAudit}
            onClose={this._handleCancel}
          />
        </Modal>
      </div>
    )
  }
}

export default connect()(LiveOTT)
