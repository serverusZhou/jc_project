import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  getAuditedDetail
} from '../reduck'
import {
  Card,
  Tag,
  Form,
  Modal,
} from 'antd'
import style from '../styles.less'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 16
  }
}

class Audited extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auditId: this.props.match.params.id,
      previewVisible: false,
      previewImage: ''
    }
  }

  getCardTitle = () => {
    const { detail } = this.props
    const status = detail.status && Number(detail.status)
    return (
      <div>
        <Tag
          color={status === 3 ? 'green-inverse' : 'red-inverse'}
        >
          {status === 3 ? '审核通过' : '审核不通过'}
        </Tag>
        {
          status === 2 && (<span className={style['title-style']}>审核意见：{detail.suggestion}</span>)
        }
        <span className={style['title-style']}>审核责任人：{detail.userName}</span>
        <span className={style['title-style']}>审核时间：{detail.auditTime}</span>
      </div>
    )
  }

  componentWillMount() {
    const { auditId } = this.state
    this.props.dispatch(
      getAuditedDetail({ auditId: auditId, type: 99 })
    )
  }

  handlePreview = url => {
    this.setState({
      previewImage: url,
      previewVisible: true
    })
  }

  // modal点击关闭
  handleCancel = () => this.setState({ previewVisible: false })

  render () {
    const { detail } = this.props
    return (
      <div>
        <Card title={this.getCardTitle()}>
          <Form>
            <FormItem {...formItemLayout} label='应用名称'>
              {detail.appName}
            </FormItem>
            <FormItem {...formItemLayout} label='应用类型'>
              {detail.cateName}
            </FormItem>
            <FormItem {...formItemLayout} label='应用评分'>
              {detail.score}
            </FormItem>
            <FormItem {...formItemLayout} label='版本号'>
              {detail.appVersion}
            </FormItem>
            <FormItem {...formItemLayout} label='排序序号'>
              {detail.sort}
            </FormItem>
            <FormItem {...formItemLayout} label='应用语言'>
              {detail.language}
            </FormItem>
            <FormItem {...formItemLayout} label='应用简介' style={{ wordBreak: 'break-all' }}>
              {detail.info}
            </FormItem>
            <FormItem {...formItemLayout} label='应用图标'>
              <img
                className={style['icon-style']}
                src={detail.appIcon}
                alt='应用图标'
                onClick={() => this.handlePreview(detail.appIcon)}
              />
            </FormItem>
            <FormItem {...formItemLayout} label='应用截图'>
              {detail.imgList && detail.imgList.map((item, index) => (
                <img
                  key={index}
                  className={style['icon-style']}
                  src={item}
                  alt='应用图标'
                  onClick={() => this.handlePreview(item)}
                />
                )
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='安装包'>
              <a href={detail.apkUrl} download='download' style={{ display: 'block' }}>
                {detail.apkUrl}&nbsp;&nbsp;
              </a>
              <span>文件大小&nbsp;&nbsp;{detail.apkSize}M</span>
            </FormItem>
            <FormItem {...formItemLayout} label='MD5'>
              {detail.md5Code}
            </FormItem>
          </Form>
        </Card>
        <Modal
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt='' style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.resource.audit.auditedDetail,
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Audited)

