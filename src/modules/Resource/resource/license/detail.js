import React from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import { Tag, Card, Tabs } from 'antd'
import style from './styles.less'
import { isEmpty } from 'Utils/lang'
import {
  AuditStatusKeyMap
} from '../../audit/dict'

const sourceList = {
  'self': '自有源',
  'wasu': '华数'
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
  pass: 'green',
  fail: 'red'
}

const TabPane = Tabs.TabPane

class Detail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      episodeId: '',
      isAudit: false
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
  }

  _handleAuditStatus = (auditStatus) => {
    auditStatus = String(auditStatus)
    return (auditStatus === AuditStatusKeyMap.FAIL.INIT &&
      statusColor.init) ||
      (auditStatus === AuditStatusKeyMap.FAIL.value &&
        statusColor.fail) ||
      (auditStatus === AuditStatusKeyMap.WAIT.value &&
        statusColor.wait) ||
      (auditStatus === AuditStatusKeyMap.PASS.value &&
        statusColor.pass)
  }

  // 生成标题：名称、状态
  getCardTitle = () => {
    const { detail, episodeAttr } = this.props
    detail.auditStatus = detail.auditStatus + ''
    return (
      <div>
        <span className='margin-right'>
          {episodeAttr && episodeAttr.episodeCnName}
        </span>
        <Tag color={this._handleAuditStatus(detail.auditStatus)}>
          {examineStatus[detail.auditStatus]}
        </Tag>
      </div>
    )
  }

  render() {
    const { detail, subCateList, directorList, writerList, actorList, episodeAttr } = this.props
    return (
      <Card title={this.getCardTitle()}>
        <Tabs>
          <TabPane key='3' tab={<h4>介质信息</h4>}>
            <div className={style['integrate-wrapper']}>
              <div className={style['content-wrapper']}>
                <label>来源：</label>
                <span>{sourceList[episodeAttr.source]}</span>
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
              {
                episodeAttr.source === 'wasu' ? '' : <div>
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
                    <span>{detail.firstShowTime}</span>
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
                </div>
              }
              <div className={style['content-wrapper']}>
                <label>语言：</label>
                <span>{episodeAttr.language}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>国家地区：</label>
                <span>{episodeAttr.areaName}</span>
              </div>
              <div className={style['content-wrapper']}>
                <label>内容标签：</label>
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
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.license.detail,
    subCateList: state.resource.license.subCateList,
    directorList: state.resource.license.directorList,
    writerList: state.resource.license.writerList,
    actorList: state.resource.license.actorList,
    episodeAttr: state.resource.license.episodeAttr
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Detail)
