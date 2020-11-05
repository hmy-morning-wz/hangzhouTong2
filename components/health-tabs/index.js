Component({
  mixins: [],
  data: {
    currentActive: 1,
  },
  props: {

  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    handleClick(event){
        this.setData({
          currentActive: event.currentTarget.dataset.state 
        })
    },
  hanldeDetail() {
    my.ap.navigateToAlipayPage({
      path: 'https://render.alipay.com/p/w/insgift-open/index.html?transVoucherPlanId=INSP00356735&entrance=jkj_kichi_publictrans',
      fail: (err) => {
        my.alert({
          content: JSON.stringify(err)
        });
      }
    });
  },
  },
});
