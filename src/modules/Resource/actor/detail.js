import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col, Button, Tabs } from 'antd'
import {
  getActorDetail,
  resetActorDetail,
} from './reduck'
import styles from './styles.less'
import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}

class ActorDetail extends Component {

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetActorDetail())
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    if (match.params && match.params.actorId) {
      dispatch(getActorDetail({ actorId: match.params.actorId }))
    }
  }

  // 生成显示项
  _generateInfo = () => {
    const { info } = this.props
    const emptyStr = '-'
    return (
      <div>
        <Row>
          <Col span={12}>
            <Row>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='所属分类'
                >
                  <span className='ant-form-txt'>{!isEmpty(info) ? info.typeName : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='演员姓名'
                >
                  <span className='ant-form-txt'>{!isEmpty(info) ? info.name : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='外文名'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.foreignName) ? info.foreignName : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='别名'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.aliasName) ? info.aliasName : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='国籍'
                >
                  <span className='ant-form-txt'>{ (!isEmpty(info) && info.country) ? info.country : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='身高'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.height) ? `${info.height}CM` : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='体重'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.weight) ? `${info.weight}` : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='出生地'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.birthplace) ? info.birthplace : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='出生日期'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.birthday) ? moment(info.birthday).format('YYYY-MM-DD') : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='职业'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.profession) ? info.profession : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='毕业院校'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.graduate) ? info.graduate : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='学历'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.education) ? info.education : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  {...formItemLayout}
                  label='主要成就'
                >
                  <span className={styles['tip']}>{(!isEmpty(info) && info.achievement) ? info.achievement : emptyStr}</span>
                </FormItem>
              </Col>
              <Col span={24} >
                <FormItem
                  {...formItemLayout}
                  label='语言'
                >
                  <span className='ant-form-txt'>{(!isEmpty(info) && info.language) ? info.language : emptyStr}</span>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  // 生成作品
  _generateWorks = () => {
    const { info } = this.props
    return (
      <ul className={styles['pic-list']}>
        {
        !isEmpty(info.actorEpisodeMap) && info.actorEpisodeMap.map(actorEpisode => {
          return (
            <li key={actorEpisode.episodeid}>
              <a target='_blank' href={actorEpisode.conver34url}>
                <img src={actorEpisode.conver34url} alt={actorEpisode.episodecnname} />
              </a>
              <p>{actorEpisode.episodecnname}</p>
            </li>
          )
        })
      }
      </ul>
    )
  }

  // 返回
  _handleBack = () => {
    const { history } = this.props
    history.push(urls.RESOURCE_ACTOR)
  }
  
  render() {
    const { info } = this.props
    const worksCount = (!isEmpty(info) && !isEmpty(info.actorEpisodeMap)) ? info.actorEpisodeMap.length : 0
    return (
      <Form>
        <FormItem className={styles['operate-btn']}>
          <Button
            title='点击返回'
            onClick={this._handleBack}
          >
            返回
          </Button>
        </FormItem>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='基本信息' key='1'>{this._generateInfo()}</TabPane>
          {
            worksCount > 0 && <TabPane tab={`${worksCount}部影视作品`} key='2'>{this._generateWorks()}</TabPane>
          }
        </Tabs>
      </Form>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    info: state.resource.actor.actorInfo,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(ActorDetail)
