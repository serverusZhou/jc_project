import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Tabs } from 'antd'
import { JcContent } from '../../../components/styleComponents'
import PendingAudit from './pendingAudit'
import IsAudit from './isAudit'
import * as actions from './reduck'

const TabPane = Tabs.TabPane
class AuditAttributeList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeKey: '0'
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const args = {
      audit: 0
    }
    dispatch(actions.getlistAuditing(args))
  }

  _callback = key => {
    const { dispatch } = this.props
    const args = {
      audit: key
    }
    this.setState({ activeKey: key }, () => {
      dispatch(actions.getlistAuditing(args))
    })
  }

  render() {
    return (
      <JcContent>
        <Tabs
          defaultActiveKey={this.state.activeKey}
          onChange={this._callback}
          type='line'
        >
          <TabPane
            tab='待审'
            key='0'
          >
            <PendingAudit />
          </TabPane>
          <TabPane
            tab='已审'
            key='1'
          >
            <IsAudit />
          </TabPane>
        </Tabs>
      </JcContent>
    )
  }
}

const mapDispatchToProps = dispatch => ({ dispatch })
const mapStateToProps = state => {
  return {
    cardData: state.auditAttributeData.cardData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AuditAttributeList))
