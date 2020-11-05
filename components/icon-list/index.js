const app = getApp()

Component({
  mixins: [],
  data: {

  },
  props: {
    service_icon: [],   
    mode:null,
  },

  async didMount() {
  

  },
  didUpdate(prevProps, prevData) {

  },
  didUnmount() { },
  methods: {
    toService(e) {
      let onService = this.props.onService
      if (onService) {
         //console.log('onService',onService)
         onService(e)
      } else {
        app.handleIconClick(e)
      }
    },


  },
});
