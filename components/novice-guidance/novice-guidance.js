const app = getApp()
Component({
  data: {
    showFirstGuidance: false,
    showSecondGuidance: false,
    showThirdGuidance: false,
    currentStep: 1,
    praiseDesc: "",
    healthGoldDesc: "",
    welfareDesc: "",


    viewData: {
      style: ""
    }
  },
  props: {
    first: true,
    second: true,
    third: true,
    guidanceDesc: "",
    healthGoldtyle: "",
    welfareStyle: "",
    thirdStyle: "",
  },
  async didMount() {
    let guidanceRes = my.getStorageSync({ key: 'showGuidance' });
    console.log("didMount  showGuidance ===", guidanceRes)
    if (!guidanceRes.data) {
      console.log("guidanceRes====", guidanceRes +"===first==="+this.props.first+"===second==="+this.props.second+"===third==="+this.props.third)
      my.hideTabBar({
        animation: false
      })
      if (!this.props.first) {
        if (this.props.second) {

          await this.onSecondGuidance()

          this.setData({
            currentStep: 2,
            showFirstGuidance: false,
            showSecondGuidance: true,
            showThirdGuidance: false,

          })

        } else if (this.props.third) {
          await this.onThridGuidance()

          this.setData({
            currentStep: 3,
            showFirstGuidance: false,
            showSecondGuidance: false,
            showThirdGuidance: true,

          })



        } else {
          this.setData({
            currentStep: 1,
            show: false,
            showFirstGuidance: false,
            showSecondGuidance: false,
            showThirdGuidance: false,
          })
        }
      } else {
        await this.onFirstGuidance()
        console.log("=====", 1111)
        this.setData({
          currentStep: 1,
          showFirstGuidance: true,
          showSecondGuidance: false,
          showThirdGuidance: false,
        })


      }
    }else {
      console.log("222=====", guidanceRes)
      this.setData({
            currentStep: 1,
            show: false,
            showFirstGuidance: false,
            showSecondGuidance: false,
            showThirdGuidance: false,
          })
    }


  },
  didUpdate() {

  },
  methods: {
    // 点击跳过按钮
    onHandleJump() {
      this.setData({
        show: false
      })
    },
    // 点击蒙层
    async onHandleNext() {
      if (this.data.currentStep === 1) {
        if (this.props.second) {
          await this.onSecondGuidance()
          this.setData({
            currentStep: 2,
            showFirstGuidance: false,
            showSecondGuidance: true,
            showThirdGuidance: false,
          })

        } else if (this.props.third) {
          await this.onThridGuidance()
          this.setData({
            currentStep: 3,
            showFirstGuidance: false,
            showSecondGuidance: false,
            showThirdGuidance: true,
          })
        }

      } else if (this.data.currentStep === 2) {
        console.log("currentStep2:", this.data.currentStep)
        if (this.props.third) {
          await this.onThridGuidance()
          this.setData({
            currentStep: 3,
            showFirstGuidance: false,
            showSecondGuidance: false,
            showThirdGuidance: true,
          })

        }

      }
      console.log("currentStep:", this.data.currentStep)
    },
    onHandleStart() {
      //my.showTabBar is not a function(版本:4.3.1，文件:components/novice-guidance/novice-guidance.js，行：133，列：7，变量名：showTabBar，源代码：my.showTabBar({)
      my.showTabBar && my.showTabBar({ //为了云后端不要报这个js错误，用户端不支持的话就不管他了
        animation: false
      })
      this.setData({
        show: false
      })
      var onStartExperience = this.props.onStartExperience

      if (onStartExperience) {
        onStartExperience()
      }
    },
    onThridGuidance() {

      return new Promise((resolve, reject) => {

        var onThridGuidance = this.props.onThridGuidance

        if (onThridGuidance) {
          onThridGuidance(resolve, reject)
        }

      })

    },
    onSecondGuidance() {

      return new Promise((resolve, reject) => {

        var onSecondGuidance = this.props.onSecondGuidance

        if (onSecondGuidance) {
          onSecondGuidance(resolve, reject)
        }

      })


    },
    onFirstGuidance() {
      return new Promise((resolve, reject) => {

        var onFirstGuidance = this.props.onFirstGuidance

        if (onFirstGuidance) {
          onFirstGuidance(resolve, reject)
        }

      })

    },
    onAppearFirst() { },
    onAppearSecond() { },
    onAppearThird() { },
  }
});