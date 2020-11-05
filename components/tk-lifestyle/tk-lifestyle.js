Component({
  mixins: [],
  data: {
    publicId: '',
    showLife: ''
  },
  props: {
    publicId: '',
    hideLife: ''
  },
  didMount() {
    let publicId = this.props.publicId
    let showLife = this.props.hideLife ? '3' : '1'
    console.log(this.props.hideLife,showLife,'showlife')
    this.setData({
      publicId: publicId,
      showLife: showLife
    })
    console.log('didMount====', publicId)
  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    closeLife() {
      this.setData({
        showLife: '3'
      })
    },
    openLife() {
      this.setData({
        showLife: '1'
      })
    },
    onFollow() {
      console.log("onFollow")
    },
    onAppear(e) {
      //type "appear"
      console.log("onAppear", e)
    }

  },


});
