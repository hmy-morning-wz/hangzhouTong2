import store from './store'
//@ts-ignore
import { jumpToBusCode } from '../../../components/card-component/utils'
import common from '../../../utils/common';
// .js
const createPage = function (options: any) {
  return Page(store.register(options))
};
const app:any = getApp()
createPage({
  data: {
    prizeList: [ // prizeList 长度必须为8，其中须包含奖项名字 name 和图标地址 icon
     /* {
        'name': '谢谢参与1',
        'icon': 'https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png'
      },
      {
        'name': '666元红包',
        'icon': 'https://zos.alipayobjects.com/rmsportal/nxpXbcNBOmbeIOVCUsuS.png'
      },
      {
        'name': '1元红包',
        'icon': 'https://zos.alipayobjects.com/rmsportal/RxQruKQwiQCeYXhvwCfP.png'
      },
      {
        'name': '3元红包',
        'icon': 'https://zos.alipayobjects.com/rmsportal/tyMAYvTdjRFOVxqWVhsj.png'
      },
      {
        'name': '谢谢参与2',
        'icon': 'https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png'
      },
      {
        'name': '1元红包',
        'icon': 'https://zos.alipayobjects.com/rmsportal/RxQruKQwiQCeYXhvwCfP.png'
      },
      {
        'name': '谢谢参与3',
        'icon': 'https://zos.alipayobjects.com/rmsportal/dexmbhnbsLRGIZGBqTcA.png'
      },
      {
        'name': '5元红包',
        'icon': 'https://zos.alipayobjects.com/rmsportal/qanDEFeGBoiPflYxkhJY.png'
      }*/
    ],
    prizeName: '',
    disabled: true,
    currentIndex: 0,
    tipText: '',
    showGuidance: false,
    showDialog: false,  
    arrowPositions: [
      'bottom-left',
      'bottom-center',
      'bottom-right',
      'top-left',
      'top-center',
      'top-right',
      'left',
      'right',
    ],
    arrowPosIndex: 5,
    useButton: true,
    modalOpened:false,
  },
  async onLoad(query: any) {
    common.getSystemInfoSync().then((res)=>{
      this.setData({...res})
    })
    await this.dispatch('pageLoad')
    let { page_title } = this.data
    page_title && my.setNavigationBar({
      title: page_title
    })
  },
  async onShow() {
    console.log("onShow")
    /*let {activityId} = this.data
    activityId  && this.dispatch('$service:getZZLotteryMsg',{activityId}) 
    */
  },

  async onStart() {
  
    this.setData({
      tipText: '正在抽奖...'
    });
    return new Promise(async (resolve, reject) => {
      let {remainLotteryNumber,textMap} = this.data 
      if (remainLotteryNumber <= 0) {
        this.setData({
          modalOpened:true,
          prizeResult: {
            typeClass: "modal-type",
            title:(textMap && textMap["NoneTitle"]) ||  "今日次数已用完，明天再来~",//"恭喜你抽中",
            button2Action: "BusQrcode",
            button1Action: "Guidance",
            button2: (textMap && textMap["BusQrcode"])||"去乘车",
            button1: (textMap && textMap["Guidance"])||"明日快速抽奖通道",
            type: "NONE"
          }
        })
        return resolve({ success: false })
      }
      //getPrize
      let {activityId} = this.data
      await this.dispatch('$service:getPrize',{activityId}) 
       setTimeout(() => {
         //prizeResult
     // let prizeIndex = Math.floor(Math.random() * 8);
     // let prizeName = this.data.prizeList[prizeIndex].name;
     let {prizeId:prizeName,success} = this.data.prizeResult || {}
     if(!success || !prizeName) {
        my.showToast({content:"系统开小差了，请稍后再试"})
        resolve({ success:false})
     }else {
      this.setData({
        prizeName
      }, () => {       
          resolve({ prizeName ,success})
        }
      );
     }
       }, 500)
    })

  },
  onFinish({activeIndex, prizeName,resultFail}:any) {//({activeIndex,prizeName: this.props.prizeName,resultFail: this.resultFail}
    let {remainLotteryNumber} = this.data
    this.setData({
      //modalOpened:!resultFail,
      currentIndex: activeIndex,
      tipText: `抽奖结果：${prizeName}`,
      remainLotteryNumber: remainLotteryNumber>0?remainLotteryNumber-1 : 0
    });
    if ((!resultFail)) {   
      setTimeout(() => {
        this.setData({
          disabled: false,
          modalOpened: true,
        })
      }, 1000)
    }
    let {activityId} = this.data
    this.dispatch('$service:getZZLotteryMsg',{activityId}) 
  },
  onModalClick() {
    this.setData({
      modalOpened: false,
    });
  },
  onCloseTap() { 
      this.setData({showGuidance:false})

  },
  actionClick() { },
  linkActionClick() { },
  onModalClose() {
    this.setData({
      modalOpened: false,
    });
  },
  onTapNotice(){
    console.log("onTapNotice")
    my.pageScrollTo({scrollTop:0})
    this.setData({showGuidance:true})
  },
  activityTap(e:any) {    
    app.handleIconClick(e);

  },
   openVoucherListTap(e:any) {    
    my.openVoucherList();

  },
  onLinkCouponsTap(e:any) {
    console.log(e)
   // let {currentTarget:{dataset:{obj}} }= e
    app.handleIconClick(e);
        this.setData({   modalOpened: false})
  },
  onPrizeResultTap1(e:any) {
     console.log(e)
    let {currentTarget:{dataset:{obj}} }= e
    let action = obj?.button1Action 
    if(action=='BusQrcode') {
      this.setData({   modalOpened: false})
      //@ts-ignore
       jumpToBusCode(getApp().cardType)
    }else if(action=='Guidance') {
       my.pageScrollTo({scrollTop:0})
     this.setData({showGuidance:true,    modalOpened: false})
    } 
  
  },
  onPrizeResultTap2(e:any) {
    console.log(e)
    let {currentTarget:{dataset:{obj}} }= e
    let action = obj?.button2Action 
     if(action=='BusQrcode') {
      this.setData({   modalOpened: false})
        //@ts-ignore
      jumpToBusCode(getApp().cardType)
    }else if(action=='Guidance') {
       my.pageScrollTo({scrollTop:0})
     this.setData({showGuidance:true,    modalOpened: false})
    } 
  }
});
