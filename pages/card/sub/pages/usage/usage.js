//import busService from '/pages/card/service/busService';
import { autoErrorPage, autoMiniErrorPage } from '/pages/card/utils/ErrorHandler';
let busService = getApp().busService
Page({
  data: {
    excludeExpand: true,

    lastIndex: -1,
    faqs: [],
  },
  onShow() {

    busService.getConfig('ioc.ebuscard.city.faq').then(autoErrorPage(({data}) => {
      console.log('>>>> 使用帮助: ', data);
      if (data) {
        const faqs = data.list.map(item => {
          return { ...item, expanded: false };
        });
        this.setData({ faqs });
      }
    }));
  },

  onTitleTap(e) {
    console.log('?????????    ', this.data, e);
    const { index } = e.target.dataset;

    const faqsSetting = { lastIndex: index };

    faqsSetting[`faqs[${index}].expanded`] = !this.data.faqs[index].expanded;

    if (this.data.lastIndex !== index && this.data.lastIndex >= 0 && this.data.excludeExpand) {
      faqsSetting[`faqs[${this.data.lastIndex}].expanded`] = false;
    }

    console.log('setttt    ', faqsSetting);

    this.setData(faqsSetting);
  },
});
