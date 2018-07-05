import { showModalWrapper } from '../modal/ModalWrapper'
import { message } from 'antd'

export function beforeUpload(file) {
  if (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png') {
    const isLt10M = file.size < 1024 * 5000
    if (!isLt10M) {
      message.error('图片不能大于5MB!')
    }
    return isLt10M
  } else {
    message.error('请上传图片文件！')
    return false
  }
}

export function onPreview(file) {
  const html = <img alt='preview' style={{ width: '100%' }} src={file.url} />
  showModalWrapper(html)
}

// Fix IE file.status problem
// via coping a new Object
export function fileToObject(file) {
  return {
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.filename || file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    response: file.response,
    error: file.error,
    percent: 0,
    originFileObj: file,
    status: null
  }
}

/**
 * 生成Progress percent: 0.1 -> 0.98
 *   - for ie
 */
export function genPercentAdd() {
  let k = 0.1
  const i = 0.01
  const end = 0.98
  return function(s) {
    let start = s
    if (start >= end) {
      return start
    }

    start += k
    k = k - i
    if (k < 0.001) {
      k = 0.001
    }
    return start * 100
  }
}

export function getFileItem(file, fileList) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name'
  return fileList.filter(item => item[matchKey] === file[matchKey])[0]
}

export function modifyFileItem(file, fileList, object) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name'
  return fileList.map(item => {
    if (item[matchKey] === file[matchKey]) {
      return { ...item, ...object }
    }
    return item
  })
}

const forwardIndex = (fileList, index) => {
  let temp = null
  if (index === 0 || index > fileList.length - 1) {
    return fileList
  }
  temp = fileList[index]
  fileList[index] = fileList[index - 1]
  fileList[index - 1] = temp
  return fileList
}

const backIndex = (fileList, index) => {
  let temp = null
  if (index === fileList.length - 1 || index > fileList.length - 1) {
    return fileList
  }
  temp = fileList[index]
  fileList[index] = fileList[index + 1]
  fileList[index + 1] = temp
  return fileList
}

export function changeIndex(file, fileList, value) {
  const index = fileList.indexOf(file)
  if (value === 0) {
    return forwardIndex(fileList, index)
  }
  return backIndex(fileList, index)
}

export function removeFileItem(file, fileList) {
  const matchKey = file.uid !== undefined ? 'uid' : 'name'
  const removed = fileList.filter(item => item[matchKey] !== file[matchKey])
  if (removed.length === fileList.length) {
    return null
  }
  return removed
}

export function generateUUID() {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
