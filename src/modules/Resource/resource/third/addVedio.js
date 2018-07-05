import { Form, Input, Modal, Radio, Button, message } from 'antd'
import React, { Component } from 'react'
import styles from './styles.less'
import { isEmpty, trim } from 'Utils/lang'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

class AddVedio extends Component {

  // 生成具体实体
  _genMedia = (values) => {
    return {
      sort: values.mediaType === '1' ? trim(values.sort) : '',
      title: values.mediaType === '1' ? '' : trim(values.sort),
      videoList: [
        {
          url: values['1'],
          assetBitrate: '1',
        },
        {
          url: values['2'],
          assetBitrate: '2',
        },
        {
          url: values['3'],
          assetBitrate: '3',
        },
        {
          url: values['4'],
          assetBitrate: '4',
        }
      ],
    }
  }

  // 重名校验
  _validDuplicate = (list, fieldName, target) => {
    if (isEmpty(list)) return false
    return list.some(item => item[fieldName] === target)
  }

  // 弹层确认
  _handleOk = (originType) => {
    const { mediaList, highlightList, form, setMediaList, mediaIndex, delMediaIds, delHighlightIds } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const media = this._genMedia(values)
        // 剧集、花絮重名校验
        let isDuplicate = false
        if (values.mediaType === '1') {
          isDuplicate = this._validDuplicate(mediaList, 'sort', media.sort)
        } else {
          isDuplicate = this._validDuplicate(highlightList, 'title', media.title)
        }
        if (isDuplicate) {
          message.error('剧集或花絮已存在！')
          return
        }
        // 剧集、花絮增删改处理
        if (values.mediaType === '1') {
          if (mediaIndex >= 0) {
            if (originType === values.mediaType) {
              media.episodeId = mediaList[mediaIndex].episodeId
              mediaList[mediaIndex] = media
            } else {
              const delHighLlight = highlightList.splice(mediaIndex, 1)
              delHighlightIds.push(delHighLlight[0].highlightId)
              mediaList.push(media)
            }
          } else {
            mediaList.push(media)
          }
        } else {
          if (mediaIndex >= 0) {
            if (originType === values.mediaType) {
              media.highlightId = highlightList[mediaIndex].highlightId
              highlightList[mediaIndex] = media
            } else {
              const delMedia = mediaList.splice(mediaIndex, 1)
              delMediaIds.push(delMedia[0].episodeId)
              highlightList.push(media)
            }
          } else {
            highlightList.push(media)
          }
        }
        setMediaList({
          delMediaIds,
          delHighlightIds,
          mediaList,
          highlightList,
          mediaType: '',
          showMediaModal: false,
          media: {},
          mediaIndex: '',
        })
        form.resetFields()
      }
    })
  }

  // 弹层取消
  _handleCancel = () => {
    const { setMediaList, form } = this.props
    form.resetFields()
    setMediaList({
      mediaType: '',
      showMediaModal: false,
      media: {},
      mediaIndex: '',
    })
  }

  _changeMediaType = (e) => {
    const { setMediaList, form } = this.props
    form.setFieldsValue({ sort: undefined })
    setMediaList({
      mediaType: e.target.value,
    })
  }

    // 获取集数
  _getMediaSort = (mediaType) => {
    if (mediaType === '2') {
      return (
        <Input
          maxLength='50'
          placeholder='请输入花絮标题'
        />
      )
    } else {
      return (
        <Input
          maxLength='50'
          addonBefore='第'
          addonAfter='集'
          placeholder='请输入集数'
        />
      )
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showMediaModal, media, mediaType, getVideoByAssert } = this.props
    const key = mediaType === '1' ? 'sort' : 'title'
    const originType = isEmpty(media) ? '' : media.mediaType
    return (
      <Modal
        title={!isEmpty(media) ? '编辑剧集' : '添加剧集'}
        maskClosable={false}
        footer={null}
        visible={showMediaModal}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='类型：'
          >
            {getFieldDecorator('mediaType', {
              initialValue: media && media.mediaType ? media.mediaType : '1',
            })(
              <RadioGroup onChange={this._changeMediaType} disabled={media.episodeId || media.highlightId}>
                <Radio
                  key={'1'}
                  value={'1'}
                >
                  剧集
                </Radio>
                <Radio
                  key={'2'}
                  value={'2'}
                >
                  花絮
                </Radio>
              </RadioGroup>
                  )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='标题：'
          >
            {getFieldDecorator('sort', {
              initialValue: (media && media[key]) ? media[key] : undefined,
              rules: mediaType === '1' ? [{
                required: true, message: '请输入标题',
              }, {
                pattern: /^[0-9]*$/,
                message: '请输入整数！',
              }] : [{
                required: true, message: '请输入标题',
              }],
            })(
              this._getMediaSort(mediaType)
            )}
          </FormItem>
          <FormItem>
            <span style={{ marginLeft: '40px', fontWeight: 'bold' }}>
              请添加不同分辨率的URL文件
            </span>
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='240：'
          >
            {getFieldDecorator('1', {
              initialValue: isEmpty(media) ? undefined : getVideoByAssert(media, '1'),
              rules: [{
                required: true, message: '请输入源文件!',
              }],
            })(
              <Input
                maxLength='500'
                placeholder='请输入源文件'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='480：'
          >
            {getFieldDecorator('2', {
              initialValue: isEmpty(media) ? undefined : getVideoByAssert(media, '2'),
              rules: [{
                required: true, message: '请输入源文件!',
              }],
            })(
              <Input
                maxLength='500'
                placeholder='请输入源文件'
              />
                  )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='720：'
          >
            {getFieldDecorator('3', {
              initialValue: isEmpty(media) ? undefined : getVideoByAssert(media, '3'),
              rules: [{
                required: true, message: '请输入源文件!',
              }],
            })(
              <Input
                maxLength='500'
                placeholder='请输入源文件'
              />
                  )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='1080：'
          >
            {getFieldDecorator('4', {
              initialValue: isEmpty(media) ? undefined : getVideoByAssert(media, '4'),
              rules: [{
                required: true, message: '请输入源文件!',
              }],
            })(
              <Input
                maxLength='500'
                placeholder='请输入源文件'
              />
                  )}
          </FormItem>
          <FormItem className={styles['jc-modal-form-footer']}>
            <Button onClick={this._handleCancel}>取消</Button>
            <Button type='primary' onClick={() => { this._handleOk(originType) }}>提交</Button>
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(AddVedio)
