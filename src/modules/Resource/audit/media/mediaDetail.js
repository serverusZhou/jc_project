import React, { Component } from 'react'
import { Card, Popover, Button, Form, Row, Col, Tag } from 'antd'
import { connect } from 'react-redux'
// import * as actions from './reduck'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 18
  }
}

class MediaDetail extends Component {
  getEpisodes = () => {
    const episodes = [
      {
        id: 1,
        passStatus: 1,
        title: '剧集描述',
        sort: 1,
        url: '剧集播放地址'
      },
      {
        id: 2,
        passStatus: 2,
        title: '剧集描述',
        sort: 2,
        url: '剧集播放地址'
      },
      {
        id: 3,
        passStatus: 0,
        title: '剧集描述',
        sort: 3,
        url: '剧集播放地址'
      }
    ]
    return (
      <div>
        {episodes.map(episode =>
          (<Popover key={episode.id} content={this.getEpisodeContent(episode)} title={this.getEpisodeTitle(episode)}>
            <Button type='primary'>
              {episode.sort}
            </Button>
          </Popover>)
        )}
      </div>
    )
  }

  getEpisodeContent = episode => {
    return (
      <div>
        <Row>
          <Col span={24}>
            <a href='http://www.baidu.com'>
              {episode.url}
            </a>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right', marginTop: 8 }}>
            <Button type='primary' size='small' style={{ marginRight: 8 }}>
              编辑
            </Button>
            <Button type='default' size='small'>
              删除
            </Button>
          </Col>
        </Row>
      </div>
    )
  }

  getEpisodeTitle = episode => {
    return (
      <div>
        <span style={{ marginRight: 8 }}>第{episode.sort}集</span>
        <Tag color='orange'>待审核</Tag>
      </div>
    )
  }

  render() {
    return (
      <Card title={<span>媒资详情</span>}>
        <Form>
          <FormItem {...formItemLayout} label='剧集'>
            {this.getEpisodes()}
          </FormItem>
        </Form>
      </Card>
    )
  }
}

const mapStateToProps = state => {
  return {
    showListSpin: state.common.showListSpin,
    mediaDetail: state.resource.audit.mediaDetail
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(MediaDetail)
