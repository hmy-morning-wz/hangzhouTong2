Component({
  mixins: [],
  data: {
    campId: '',
  },
  props: {
  },
  didMount() {
    console.log(this.props.healthSet, 99999)
    if (this.props.signList.thisWeekSignCount === 2) {
      this.setData({
        campId: this.props.healthSet.giftCpId
      })
    }else if(this.props.signList.thisWeekSignCount === 6){
      this.setData({
        campId: this.props.healthSet.otherCpId
      })
    } else {
      this.setData({
        campId: this.props.healthSet.normalCpId
      })
    }

  },
  didUpdate() { },
  didUnmount() { },
  methods: {
    handleJump() {
      my.navigateTo({
        url: `../../pages/health/index`
      })
    },
    handleSign() {
      my.navigateTo({
        url: `../../pages/health/index?campId=${this.data.campId}`
      })
    }
  },
});
