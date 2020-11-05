Component({
  data: {
    show: false,
    close: false
  },
  props: {
    msg: {},
    onShow: (e) => {

      console.log('props onShow')
    },
    onClose: (e) => {
      console.log('props onClose')
    }
  },
  didMount() {
  
    let msg = this.props.msg
    this.setData({
      msg: msg,
      show: true,
      close: false
    })
    console.log('弹框 didMount', msg)
  },
  didUpdate() {
    let msg = this.props.msg
    this.setData({
      msg: msg,
      show: !this.data.close
    })
    // console.log('弹框 update', voucher)
  },
  methods: {
    onBtnMsg() {
      this.setData({
        msg: false,
        close: true,
        show: false
      })
      this.props.onClose()
    }
  }
});
