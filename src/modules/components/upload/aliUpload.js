import React, { Component } from 'react'
import { message } from 'antd'
import PropTypes from 'prop-types'
import Upload from './index'
import { generateUUID } from './utils'

class AliUpload extends Component {

  static propTypes = {
    aliToken: PropTypes.object.isRequired,
    bucket: PropTypes.string,
    dealResult: PropTypes.func.isRequired,
    beforeUpload: PropTypes.func,
    rootPath: PropTypes.string,
  }

  static defaultProps = {
    aliToken: {},
    bucket: '',
    dealResult: () => {},
    rootPath: 'default'
  }

  getClient = () => {
    const token = this.props.aliToken
    return new OSS.Wrapper({
      accessKeyId: token.accessKeyId,
      accessKeySecret: token.accessKeySecret,
      stsToken: token.securityToken,
      region: token.region,
      bucket: token.bucket,
    })
  }

  uploadPath = (file) => {
    return `${this.props.rootPath}/${generateUUID()}.${file.type.split('/')[1]}`
  }

  UploadToOss = (self, file, onError, onProgress) => {
    const url = this.uploadPath(file)
    const client = this.getClient()
    return new Promise((resolve, reject) => {
      client.put(url, file, {
        progress: function (p) {
          return function (done) {
            onProgress({ percent: p * 100 }, file)
            done()
          }
        }
      }).then(data => {
        resolve(data)
      }).catch(error => {
        onError(error)
        reject(error)
      })
    })
  }

  render() {
    return (
      <Upload
        {...this.props}
        customRequest={({ file, onSuccess, onError, onProgress }) => {
          // file.name = generateUUID()
          this.UploadToOss(this, file, onError, onProgress).then(data => {
            if (data.res.status === 200) {
              onSuccess(data.res)
            } else {
              onError(data.error)
              message.error('上传失败！')
            }
          })
        }}
      >
        {this.props.children}
      </Upload>
    )
  }
}

export default AliUpload
