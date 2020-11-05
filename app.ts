import '@tklc/miniapp-tracker-sdk'
import { getUserId, config ,request} from './utils/TinyAppHttp'
import { MyTracert}  from './utils/mytracert'
//@ts-ignore
import { setEnv } from './utils/env'
//@ts-ignore
import life from './services/life'
//@ts-ignore
import busService from './pages/card/service/busService'
import common from './utils/common'
import appVersion from './version.json'
import GlobalData from './utils/globalData'
//@ts-ignore
import herculex from 'herculex'
import serviceplugin from "./utils/serviceplugin"
import servicesCreactor from "./utils/serviceCreator"
import Store from './store'
const Tracert = new MyTracert({
spmAPos: 'a56', // spma位，必填 
spmBPos: 'b23056', // spmb位，必填
system:"a1001",
subsystem:"b1001",
bizType: 'common', // 业务类型，必填
logLevel: 2, // 默认是2
chInfo: '', // 渠道
debug:false,
mdata: { // 通⽤的数据，可不传，传了所有的埋点均会带该额外参数
 },
})
App(
  Store({
    herculex,  
    Tracert,
    serviceplugin,
    servicesCreactor,
    busService, 
    request,
    isNewUser: true,
    env: null,
    redirectPage: null,
    type: 'normal',
    config: {},
    homePage: {},
    replaceConfig: {
     //   ...  extJson.cityInfo,
     //   miniAppName: extJson.cityInfo.title
    },
    channel: 'tkalipay2', // 市民卡的渠道参数
    token: '', // 市民卡token
    specialUrl: null,
    alipayId: null,
    account: null, // 账户余额
    appId: null,  
    msg: {},
    mtrConfig:{ 
        //server: [extJson.apiHost['webtrack'] || 'https://webtrack.allcitygo.com:8088/event/upload'],//https://sit-webtrack-api.allcitygo.com/event/upload
        version: appVersion.version + '@' + appVersion.date,       
        stat_auto_click: true,
        stat_auto_expo:true,       
        stat_reach_bottom:true,
        stat_batch_send:true,
       // appName: extJson.cityInfo.title,
        //appId: extJson.cityInfo.appid,      
       // mtrDebug: env=='sit'
     },
    globalData:new GlobalData({version:appVersion.version,
     // extJson,...extJson.cityInfo,publicId:extJson.publicId
    }),
    async onShow(options: { referrerInfo?: any; query?: any; scene?: any }) {
      const { query, scene } = options
      this.type = (query && query.type) || 'normal'
      if (query) {
        this.msg = query
        if(query._preview  ) {
          let reg = new RegExp('\{.*\}')
          if(reg.test(query._preview )) {
            try{
              let  preview = JSON.parse(query._preview)
              if(preview && preview.exp) {
                if(+Date.now()>preview.exp) {
                   console.warn("预览码过期")
                   preview=null
                   my.showToast({content:"亲，你扫的预览码已过期"})
                }
              }
              this.preview = preview
            }catch(err){

            }
             console.log("_preview",query,this.preview)
          }          
         
        }
        if(query.clear) {
           setTimeout(() => {
              my.clearStorageSync()  
               my.confirm({
            title: '缓存清除提示',
            content: '缓存已经清除，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                 my.reLaunch({url:'/pages/index/index'})
              }
            }
          })
           }, 3000);          
        }
        
      }
      scene && (this.scene = scene)
      console.log('onShow', options)
      if (options.referrerInfo && options.referrerInfo.extraData && options.referrerInfo.extraData.navigateOuter) {
        judgeNavigate(options.referrerInfo.extraData,this)
      }
    },

    async onLaunch(options: { query: any; scene: any; referrerInfo: any }) {
      console.time("time-onLaunch")
      const { query, scene, referrerInfo } = options     
      if (query) {
        this.msg = query
        if(query.clear) {  
           this.globalData.clear()        
           my.clearStorageSync() 
        }       
      }
      this.scene = scene
      //@ts-ignore
      const extJson = my.getExtConfigSync()
      const env = extJson.env
      this.replaceConfig =  {
         ... this.replaceConfig ,
        ...  extJson.cityInfo,
       miniAppName: extJson.cityInfo.title
      },
      Object.assign(this.globalData,{
       extJson,...extJson.cityInfo,publicId:extJson.publicId
      })      
      setEnv(extJson.env)
      if(this.Tracker && this.Tracker.App && this.Tracker.App.config) {
        this.Tracker.App.config({  
          server: [extJson.apiHost['webtrack'] || 'https://webtrack.allcitygo.com:8088/event/upload'],//https://sit-webtrack-api.allcitygo.com/event/upload
          appName: extJson.cityInfo.title,
          appId: extJson.cityInfo.appid,      
          mtrDebug: env=='sit'
      })
      }
      config({
        env,
        autoLogin: false,
        appId: extJson.cityInfo.appid,
        hostBaseUrl: env === 'sit' ? 'https://sit-basic-ug.allcitygo.com' : 'https://ztmanage.allcitygo.com:8192'
      })

      // const extJson = my.getExtConfigSync() // ext.ext // my.getExtConfigSync()   //
      //console.log('小程序配置信息', extJson)
      this.extJson = extJson
      this.env = extJson.env
      this.appId = extJson.cityInfo.appid
      this.cityInfo = extJson.cityInfo
      this.pageInfo = extJson.pageInfo
      this.cardList = extJson.cardList
      this.cityName = this.cityInfo.cityName
      this.cityCode = this.cityInfo.cityCode      
      this.CONFIG = {
        normal: {
          cardType: extJson.cardList.length && extJson.cardList[0].cardType,
          balanceMode: extJson.cardList.length && extJson.cardList[0].balanceMode
        },
        month: {
          cardType: (extJson.cardList && extJson.cardList.length >= 2) ? extJson.cardList[1].cardType : null
        }
      }
      
      this.cardType = extJson.cardList.length && extJson.cardList[0].cardType
      this.cardAppType = extJson.cardList.length && extJson.cardList[0].appType
      let  balanceMode = this.cardList && this.cardList.length && this.cardList[0]?.balanceMode
      this.ech5Disabled = (!balanceMode) ||  balanceMode === 'ALIPAY' ||  balanceMode === 'NONE'
      this.replaceConfig = {
        cardType: this.cardType,
        cityName: this.cityName,
        cityCode: this.cityCode,
        appId: this.appId,
        appName: extJson.cityInfo.title,
        cityNamePy: extJson.cityInfo.cityNamePy || this.cityCode,
        miniAppName: extJson.cityInfo.title,
        env
      }
      extJson.replaceConfig && (this.replaceConfig = Object.assign(this.replaceConfig, extJson.replaceConfig))     
      Object.assign(this.globalData,this.replaceConfig)
      this.host = extJson.apiHost.ech5 || "https://ech5.allcitygo.com"// getDomain('cardManageDomain')
      let {model,platform} = this.systemInfo || {} 
      const si = {
        app:this.cardAppType|| 'alipay_mini',//"appType":"alipay"
        model,
        platform,
      }
      busService.init(this.host, this.cityCode, this.appId, '', si)
      
      this.globalData.configLoad= true
      console.timeEnd("time-onLaunch")

      await this.globalData.reday()
      updateSystemInfo().then((res)=>{
          this.systemInfo =   res
          let {model,platform} = this.systemInfo || {} 
          busService.systemInfo ={model,platform} 
      })  
      if(this.ech5Disabled) {
        console.log("ech5Disabled")
      } else {
        await busService.loadToken(this.globalData) 
      }
       
   
    
      console.log("CONFIG", this)
     
      this.loadUserId() 
     
      my.reportAnalytics("v"+appVersion.version + '_' + appVersion.date,appVersion);
    },
    loadEch5Config(){
      if(this.ech5Disabled) {
        console.log("ech5Disabled")
        return
      }
      if(  (this.config && this.config.cityCode) ) {// 有cityCode 已经执行过了 ALIPAY 支付宝发卡
        return
      }
       if( this.cityCode !== '330100' ){
        busService.getConfig('ioc.ebuscard.city.config').then((res: { data: any })=>{
               console.log('ioc.ebuscard.city.config',res.data)
               this.config = res.data  || {}
      })
     }
    },
    onHide(){
      console.log("app hide")
      //common.setStorageSync({key:"globalData",data:this.globalData})
      this.globalData.store()
    },
    onError(error: any) {
      console.error('APP onError',error)
    },
    onTrackerError(tag: any,err: any){
      this.Tracker.err(tag,err)  
    },


 
    async loadUserId() {      
      if (!this.alipayId) {
        let userId = await getUserId()
        this.alipayId = userId
        this.globalData.userId =userId
        this.replaceConfig.userId = userId
        return { success: userId || false }
      }
      return { success: this.alipayId }
    },
  
    async getToken(alipayId: any) {
      // 获取token
      const { data } = await life.getAccessToken({ alipayId: alipayId, channel: this.channel })
      this.token = data
      console.log('token', this.token)
    },

   
    onSubmit(e: { detail: { formId: any } }) {
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId = e.detail.formId
      }
    },
    async getFormId() {
      if (this.formId) {
        return this.formId
      } else {
        await common.sleep(100)
        return this.formId
      }
    },
    handleIconClick(e: { currentTarget: { dataset: { obj: any; seedName: any } }; detail: { formId: any } }) {
      console.log('handleClick', e.currentTarget.dataset)
      this.loadEch5Config()//一些卡业务icon 需要拿ech5 config
      if (e.detail && e.detail.formId) {
        console.log("formId", e.detail.formId)
        this.formId =   this.globalData.formId = e.detail.formId
      }
      let obj = e.currentTarget.dataset.obj
      if (!obj) {
        console.warn('handleClick dataset obj is undefine')
        return
      }    
     
      common.handleNavigate(obj, this)
    },
    async handleNavigate(options: { redirectTo?: any; url_type: string; url_path: string; url_data: any; appId?: string | undefined; url_remark: string; publicBizType?: string | undefined; publicId?: string | undefined }) {
      common.handleNavigate(options, this)
    }
  }),
)




async function  judgeNavigate(options:any,app:any){
    //@ts-ignore
    await app.loadUserId()
     //@ts-ignore
    let globalData = app.globalData || {}
   
    // console.log('直接跳转出去', `https://life.96225.com/city/index.html?from=singlemessage&isappinstalled=0#/activeDetial?id=${options.id}&token=${app.token}&channel=${app.channel}`)
    switch (options.type) {
      case 'h5Out': {
        let url_path = options.url
        if (url_path.indexOf('{userId}') > -1) {
          url_path = url_path.replace('{userId}', globalData.alipayId)
        }
        if (url_path.indexOf('{appId}') > -1) {
          url_path = url_path.replace('{appId}', globalData.appId)
        }

        if (globalData.formId && url_path.indexOf('{formId}') > -1) {
          url_path = url_path.replace('{formId}', globalData.formId)
        }
        if (url_path.indexOf('{cityCode}') > -1) {
          url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode)
        }
        if (url_path.indexOf('{cityName}') > -1) {
          url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName)
        }        
        my.call('startApp', {
          appId: '20000067',
          param: {
            url: url_path,
            chInfo: 'ch_2019031163539131',            
          },   
          success:()=>{     
            let close = options.close
            if (options.close == undefined) {
              close = true
            }
            if (!close) {
              return
            }
            if (my.canIUse('onAppShow')) {
              // @ts-ignore
              my.onAppShow(() => {
                my.navigateBackMiniProgram({
                  extraData: {
                    "h5Out": "success"
                  },
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
                });
              })
            } else {
              setTimeout(() => {
                my.navigateBackMiniProgram({
                  extraData: {
                    "h5Out": "success"
                  },
                  success: (res) => {
                    console.log(JSON.stringify(res))
                  },
                  fail: (res) => {
                    console.log(JSON.stringify(res))
                  }
                });
              }, 500)
            }
           
          }
        })
      }
        break
      case 'smkOut':
        if (!globalData.token) globalData.token = 'null'
        my.call('startApp', {
          appId: '20000067',
          param: {
            url: `https://life.96225.com/city/index.html?from=singlemessage&isappinstalled=0#/activeDetial?id=${options.id}&token=${globalData.token}&channel=${globalData.channel}`,
            chInfo: 'ch_2019031163539131'
          }
        })
        break
      case 'startApp':
        my.call('startApp', {
          appId: (options.appId || '20000042'),
          param: {
            publicBizType: options.publicBizType,
            publicId: options.publicId,
            chInfo: options.chInfo
          }
        })
        break
      case 'alipay':
        console.log(options.url)
        my.ap.navigateToAlipayPage({
          path: options.url,
          fail: (err) => {
            my.alert({
              content: JSON.stringify(err)
            })
          }
        })
        break
      case 'miniapp':
        my.navigateToMiniProgram({
          appId: options.remark,
          path: options.url,
          extraData: options.data || {},
          fail:(res)=>{
            my.reportAnalytics("jsapi_fail",{
              api:"navigateToMiniProgram",
              file:"app.ts/judgeNavigate",
              timestamp:+Date.now(),
              extra:JSON.stringify(options),
              userId:globalData.userId,
              err:JSON.stringify(res)})
          }
        })
        break
      default:
        break
    }
  }

  async  function updateSystemInfo() {      
      let res = await common.getSystemInfoSync() 
      let versionCodes = res.version.split(".").map((t:string)=>parseInt(t))
      let version = versionCodes[0]*10000 + versionCodes[1]*100 + versionCodes[2]
      if (version < 100170) {//10.1.70
        my.showToast({
          type: 'success',
          content: '您当前支付宝版本过低，须更新'
        })
        //@ts-ignore
        my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()        
        
      } else {
       let sdkVersionCodes = my.SDKVersion.split(".").map((t:string)=>parseInt(t))
       let sdkVersion =sdkVersionCodes[0]*10000 + sdkVersionCodes[1]*100 + sdkVersionCodes[2] // my.SDKVersion.replace('.', '').replace('.', '')
        if (sdkVersion < 11100) {// 1.11.0
          my.showToast({
            type: 'success',
            content: '您当前支付宝基础库版本过低，须更新'
          })
          //@ts-ignore
          my.canIUse('ap.updateAlipayClient') && my.ap.updateAlipayClient()
        }
      }
      // console.log('成功获取系统信息', res)
   

   try {
      if (my.canIUse('getUpdateManager')) {
         // @ts-ignore
        const updateManager = my.getUpdateManager()
        updateManager.onCheckForUpdate(function(res: { hasUpdate: any }) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate)
        })
        updateManager.onUpdateReady(function() {
          my.confirm({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function(res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function() {
          // 新版本下载失败
        })
      }
    } catch (err) {
      console.error(err)
    }
      return res
    }