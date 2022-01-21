export default class ResModel {
  code: number
  msg: string | object
  data: any
  constructor(code, msg, data) {
    if (code) {
      this.code = code
    }
    if (msg) {
      this.msg = msg
    }
    if (data) {
      this.data = data
    }
  }
}
