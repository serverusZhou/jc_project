import React from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Row, Tag, Radio, Button, Popconfirm, Card, Col, Input, Badge, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import { RESOURCE_AUDIT_VIDEO, RESOURCE_MEDIA_VIDEO } from 'Global/urls'
import AddEpisode from './addEpisode'
import EditEpisode from './editEpisode'
import style from './styles.less'
import { isEmpty } from 'Utils/lang'
import PopAudit from './popAudit'
import {
  AuditStatusMap,
  AuditStatusKeyMap,
  MediaAuditType,
  AssetBitrateMap
} from '../../audit/dict'
import moment from 'moment'

const sourceList = {
  'self': '自有源',
  'wasu': '华数',
}

const examineStatus = {
  '0': '待提审',
  '1': '待审核',
  '2': '未通过',
  '3': '审核通过'
}

const statusColor = {
  init: 'blue',
  wait: 'orange',
  pass: 'green-inverse',
  fail: 'red-inverse'
}
const assetsStatus = {
  'News': '新闻',
  'Movie': '电影',
  'Column': '栏目',
  'Series': '系列剧'
}

const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      episodeId: '',
      isAudit: false,
      videoIndex: null,
      videoList: isEmpty(this.props.mediaList) ? [] : this.props.mediaList[0].videoList,
      editId: '',
      editType: 1,
      editTitle: '',
      editAsset: '',
      editUrl: '',
      highlightIndex: null,
    }
  }

  componentDidMount() {
    const params = this.props.match.params.id.split(',')
    const { dispatch } = this.props
    this.setState({
      episodeId: params[0],
      isAudit: !!params[1]
    })
    dispatch(actions.getDetail({ episodeId: params[0] }))
    // 获取当前介质的审核信息
    dispatch(actions.getEpisodeAuditLogs({ serviceId: params[0], type: MediaAuditType.Episode }))
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.mediaList)) {
      this.setState({
        videoList: nextProps.mediaList[0].videoList,
        editTitle: '第' + nextProps.mediaList[0].sort + '集',
        videoIndex: 0,
        highlightIndex: null,
      })
    } else if (!isEmpty(nextProps.highlightList)) {
      this.setState({
        videoList: nextProps.highlightList[0].videoList,
        editTitle: nextProps.highlightList[0].title,
        highlightIndex: 0,
        videoIndex: null,
      })
    }
  }

  _handleAddProps = () => {
    const { highlightList, mediaList } = this.props
    return {
      showAddModal: this.props.showAddModal,
      episodeId: this.state.episodeId,
      dispatch: this.props.dispatch,
      highlightList,
      mediaList,
    }
  }
  _showAddRole = () => {
    const { dispatch } = this.props
    dispatch(actions.isShowModal(0, true))
  }

  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      ediUrlParams: {
        id: this.state.editId,
        type: this.state.editType,
        title: this.state.editTitle,
        asset: this.state.editAsset,
        url: this.state.editUrl
      },
      episodeId: this.state.episodeId,
      dispatch: this.props.dispatch
    }
  }
  _showEditRole = item => {
    const { dispatch } = this.props
    this.setState(
      {
        editId: item.id,
        editUrl: item.url,
        editAsset: item.assetBitrate
      },
      () => {
        dispatch(actions.isShowModal(2, true))
      }
    )
  }

  _showAuditPop = () => {
    const { dispatch } = this.props
    dispatch(actions.showAuditPop(true))
  }

  _handleMediaDetail = e => {
    const { mediaList } = this.props
    const index = e.target.value
    this.setState({
      videoIndex: index,
      highlightIndex: null,
      videoList: mediaList[index].videoList,
      editType: 1,
      editTitle: '第' + mediaList[index].sort + '集'
    })
  }

  _handleHighlightDetail = e => {
    const { highlightList } = this.props
    const index = e.target.value
    this.setState({
      videoIndex: null,
      highlightIndex: index,
      videoList: highlightList[index].videoList,
      editType: 2,
      editTitle: highlightList[index].title
    })
  }

  _handleArraignment = (item, type) => {
    const { dispatch } = this.props
    if (!type) {
      type = this.state.editType === 1 ? 4 : 5
    }
    dispatch(
      actions.arraignment({
        serviceId: item.episodeId || item.id,
        status: 1,
        type: type,
        // 提审数据的中文名称
        serviceName: item.title || (item.episodeAttr && item.episodeAttr.episodeCnName),
        // 提审数据快照
        snapShot: JSON.stringify(item)
      })
    ).then((res) => {
      if (res.status === 'success') {
        const params = this.props.match.params.id.split(',')
        dispatch(actions.getDetail({ episodeId: params[0] }))
        dispatch(actions.getEpisodeAuditLogs({ serviceId: params[0], type: MediaAuditType.Episode }))
        this.setState({ editType: 1 })
      }
    })
  }

  _handlePopAudit = () => {
    const { detail } = this.props
    return {
      showAuditModal: this.props.showAuditModal,
      episodeId: this.state.episodeId,
      detail: detail,
      dispatch: this.props.dispatch
    }
  }

  _handleAuditStatus = (auditStatus) => {
    auditStatus = String(auditStatus)
    return (auditStatus === AuditStatusKeyMap.INIT.value && statusColor.init) ||
      (auditStatus === AuditStatusKeyMap.FAIL.value && statusColor.fail) ||
      (auditStatus === AuditStatusKeyMap.WAIT.value && statusColor.wait) ||
      (auditStatus === AuditStatusKeyMap.PASS.value && statusColor.pass)
  }

  // 生成标题：名称
  getCardTitle = () => {
    const { episodeAttr } = this.props
    return (
      <div>
        <span className='margin-right'>
          {episodeAttr && episodeAttr.episodeCnName}
        </span>
      </div>
    )
  }

  getOperations = () => {
    const { detail } = this.props
    return (
      <div>
        {
          !this.state.isAudit && (detail.auditStatus === 0 || detail.auditStatus === '0') &&
          <Popconfirm title={'点击确定后，该媒资将推送至审核中心进行审核'} onConfirm={() => this._handleArraignment(detail, 3)}>
            <Button size='small' type='primary'>提审</Button>
          </Popconfirm>
        }
        {
          this.state.isAudit && (detail.auditStatus === 1 || detail.auditStatus === '1') &&
          <Button size='small' type='primary' onClick={this._showAuditPop}>审核</Button>
        }
      </div>
    )
  }

  getMediaOperations = () => {
    //  如果是审核入口，则不可以新增剧集
    if (this.state.isAudit) {
      return
    }

    return (
      <Button
        type='primary'
        onClick={this._showAddRole}
        icon='plus'
        className={style['margin-bottom']}
        size='small'
      >
        新增
      </Button>
    )
  }

  _getMediaTabTitle = () => {
    if (this.state.isAudit) {
      return (<h4>节目选集&nbsp;&nbsp;&nbsp;&nbsp;<span><Badge status='error' />待审核</span></h4>)
    } else {
      return (<h4>节目选集&nbsp;&nbsp;&nbsp;&nbsp;<span><Badge status='error' />有新的节目</span>&nbsp;&nbsp;<span><Badge status='warning' />有未提审/未通过</span></h4>)
    }
  }

  _getVideoColor = (videoList) => {
    let color = ''
    let redCount = 0
    let failCount = 0
    let waitCount = 0
    let auditColor = ''
    !isEmpty(videoList) && videoList.map((temp) => {
      temp.auditStatus = temp.auditStatus + ''
      temp.auditStatus === '0' ? redCount++ : ''
      temp.auditStatus === '2' ? failCount++ : ''
      if (temp.auditStatus === '1') waitCount++
    })

    if (redCount === 4) { color = 'red' } else if (failCount > 0 || (redCount < 4 && redCount > 0)) { color = '#faad14' } else { color = '' }
    if (waitCount > 0) {
      auditColor = 'red'
    }

    if (this.state.isAudit) {
      return auditColor
    } else {
      return color
    }
  }

  render() {
    const {
      detail,
      subCateList,
      directorList,
      writerList,
      actorList,
      episodeAttr,
      mediaList,
      highlightList,
      // episodeAuditDetail,
      auditLogs
    } = this.props

    const videoList = this.state.videoList
    // const status = !isEmpty(episodeAuditDetail) && AuditStatusMap[episodeAuditDetail.status]
    const { videoIndex, highlightIndex } = this.state
    const videoType = videoIndex !== null ? MediaAuditType.Media : MediaAuditType.Highlight
    return (
      <Card title={this.getCardTitle()}>
        <Tabs>
          <TabPane key='1' tab={<h4>播放源</h4>}>
            {videoList &&
              videoList.map((item, index) => {
                item.auditStatus = item.auditStatus + ''
                return (
                  <Row key={index} className={style['margin-bottom']}>
                    <Col span={14}>
                      <Input
                        readOnly={true}
                        addonBefore={AssetBitrateMap[item.assetBitrate] && AssetBitrateMap[item.assetBitrate].name}
                        value={item.url}
                      />
                    </Col>
                    <Col span={8}>
                      <Tag color={this._handleAuditStatus(item.auditStatus)} className={style['media-tag']}>
                        {examineStatus[item.auditStatus]}
                      </Tag>
                      <Button className={style['media-btn']} size='small'>
                        <Link to={`${RESOURCE_MEDIA_VIDEO}/${item.id},${videoType}`}>
                          预览
                        </Link>
                      </Button>
                      {
                        !this.state.isAudit &&
                        <Button
                          className={style['media-btn']}
                          size='small'
                          onClick={() => this._showEditRole(item)}
                        >
                          编辑
                        </Button>
                      }

                      {
                        !this.state.isAudit && item.auditStatus === '0' &&
                        <Popconfirm
                          title={'点击确定后，该媒资将推送至审核中心进行审核'}
                          onConfirm={() => this._handleArraignment(item, false)}
                        >
                          <Button size='small' type='primary'>提审</Button>
                        </Popconfirm>
                      }

                      {
                        this.state.isAudit && item.auditStatus === '1' &&
                        <Button type='primary' className={style['media-btn']} size='small'>
                          <Link to={`${RESOURCE_AUDIT_VIDEO}/${item.id},${videoType},true`}>
                            审核
                          </Link>
                        </Button>
                      }
                    </Col>
                  </Row>
                )
              })}
          </TabPane>
        </Tabs>

        <Tabs tabBarExtraContent={this.getMediaOperations()}>
          <TabPane key='2' tab={this._getMediaTabTitle()}>
            <div className={style['media-list']}>
              <RadioGroup value={videoIndex} onChange={this._handleMediaDetail}>
                {mediaList &&
                  mediaList.map((item, index) => {
                    const color = this._getVideoColor(item.videoList)
                    return (
                      <Badge dot={Boolean(color)} key={index} style={{ backgroundColor: color }}>
                        <RadioButton value={index}>
                          {item.sort}
                        </RadioButton>
                      </Badge>
                    )
                  })}
              </RadioGroup>
              <RadioGroup value={highlightIndex} onChange={this._handleHighlightDetail}>
                {highlightList &&
                  highlightList.map((item, index) => {
                    const color = this._getVideoColor(item.videoList)
                    return (
                      <Badge dot={Boolean(color)} key={index} style={{ backgroundColor: color }}>
                        <RadioButton value={index}>
                          {item.title}
                        </RadioButton>
                      </Badge>
                    )
                  })}
              </RadioGroup>
            </div>
          </TabPane>
        </Tabs>

        <Tabs tabBarExtraContent={this.getOperations()}>
          <TabPane key='3' tab={<h4>介质信息&nbsp;&nbsp;<Tag color={this._handleAuditStatus(detail.auditStatus)}>{examineStatus[detail.auditStatus]}</Tag></h4>}>
            <div className={style['integrate-wrapper']}>
              <div className={style['content-wrapper']}>
                <label>来源：</label>
                <span>{sourceList[episodeAttr.source]}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>所属分类：</label>
                <span>{detail.parentCateName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>二级分类：</label>
                <span>
                  {!isEmpty(subCateList) && subCateList.map((item, index) => (<Tag key={index}>{item.cateName}</Tag>))}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label>中文名称：</label>
                <span>{episodeAttr.episodeCnName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>外文名称：</label>
                <span>{episodeAttr.episodeUsName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>资产类型：</label>
                <span>{assetsStatus[episodeAttr.contentType]}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>地区：</label>
                <span>{episodeAttr.areaName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>时代：</label>
                <span>{episodeAttr.yearsName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>导演：</label>
                <span>
                  {!isEmpty(directorList) && directorList.map((item, index) => (<Tag key={index}>{item.name}</Tag>))}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label>编剧：</label>
                <span>
                  {!isEmpty(writerList) && writerList.map((item, index) => (<Tag key={index}>{item.name}</Tag>))}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label>主演：</label>
                <span>
                  {!isEmpty(actorList) && actorList.map((item, index) => (<Tag key={index}>{item.name}</Tag>))}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label>许可证号：</label>
                <span>{episodeAttr.recordNumber}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>出品时间：</label>
                <span>{episodeAttr.producedDate}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>首播时间：</label>
                <span>{episodeAttr.firstShowTime}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>首播平台：</label>
                <span>{episodeAttr.firstShowPlat}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>集数：</label>
                <span>{detail.count ? detail.count + '集' : ''}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>时长：</label>
                <span>{episodeAttr.duration ? episodeAttr.duration + '分钟' : ''}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>片头时间：</label>
                <span>{episodeAttr.startTime ? episodeAttr.startTime + '秒' : ''}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>片尾时间：</label>
                <span>{episodeAttr.endTime ? episodeAttr.endTime + '秒' : ''}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>语言：</label>
                <span>{episodeAttr.language}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>关键字：</label>
                <span>{detail.keyword}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>版权开始时间：</label>
                <span>
                  {episodeAttr.copyrightBegin && episodeAttr.copyrightBegin.slice(0, 10)}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label>版权结束时间：</label>
                <span>
                  {episodeAttr.copyrightEnd && episodeAttr.copyrightEnd.slice(0, 10)}
                </span>
              </div>
              <div className={style['content-wrapper']}>
                <label className={style['float-left']}>描述：</label>
                <div className={style['content']}>{episodeAttr.info}</div>
              </div>
              <div className={style['content-wrapper']}>
                <label className={style['float-left']}>海报：</label>
                {
                  detail.cover23Url && <img src={detail.cover23Url} alt={detail.cover23Url} className={style['poster_image_23']} />
                }
                {
                  detail.cover34Url && <img src={detail.cover34Url} alt={detail.cover34Url} className={style['poster_image_34']} />
                }
                {
                  detail.cover169Url && <img src={detail.cover169Url} alt={detail.cover169Url} className={style['poster_image_169']} />
                }
              </div>
            </div>
          </TabPane>
        </Tabs>

        {
          !isEmpty(auditLogs) ? <Tabs>
            <TabPane key='4' tab={<h4>审核记录</h4>}>
              {auditLogs &&
              auditLogs.map(log => {
                return (
                  <Row key={log.id}>
                    <Col span={6}>
                      {moment(log.createTime).format('YYYY-M-DD HH:mm')}
                    </Col>
                    <Col span={4}>
                      {AuditStatusMap[log.status] &&
                        AuditStatusMap[log.status].name}
                    </Col>
                    <Col span={14}>
                      {log.status + '' === AuditStatusKeyMap.WAIT.value ? '提审人' : '审核人'}：{log.userName}
                    </Col>
                    <Col span={18} offset={6} className={style['audit-memo']}>
                      {log.suggestion}
                    </Col>
                  </Row>
                )
              })}
            </TabPane>
          </Tabs> : ''
        }

        <AddEpisode {...this._handleAddProps()} />
        <EditEpisode {...this._handleEditProps()} />
        <PopAudit {...this._handlePopAudit()} />
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.third.detail,
    showAddModal: state.resource.third.showAddModal,
    showEditModal: state.resource.third.showEditModal,
    subCateList: state.resource.third.subCateList,
    directorList: state.resource.third.directorList,
    writerList: state.resource.third.writerList,
    actorList: state.resource.third.actorList,
    episodeAttr: state.resource.third.episodeAttr,
    mediaList: state.resource.third.mediaList,
    highlightList: state.resource.third.highlightList,
    showAuditModal: state.resource.third.showAuditModal,
    episodeAuditDetail: state.resource.third.episodeAuditDetail,
    auditLogs: state.resource.third.episodeAuditLogs,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
