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

const source = {
  '1': '运营图', '2': '轮播位图'
}

class AuditedOperatePic extends Component {
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
            <FormItem {...formItemLayout} label='图片'>
              <img
                style={{ width: '300px' }}
                className={style['icon-style']}
                src={detail.operaterPic}
                alt='图片'
                onClick={() => this.handlePreview(detail.operaterPic)}
              />
            </FormItem>
            <FormItem {...formItemLayout} label='分类'>
              {source[detail.source]}
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
export default connect(mapStateToProps, mapDispatchToProps)(AuditedOperatePic)

