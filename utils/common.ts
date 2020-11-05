import GlobalData from "./globalData"
/*
var mtopStorage:{[x:string]:any}|any =undefined
const localStorage = {
getItem(key:string){  
  if(!mtopStorage) {
    mtopStorage =  my.getStorageSync({key:"mtopStorage"}).data|| {}
  }
  return mtopStorage[key]// my.getStorageSync({key}).data
},
setItem(key:string,value:any){
   if(!mtopStorage) {
    mtopStorage =  my.getStorageSync({key:"mtopStorage"}).data|| {}
  }
  mtopStorage[key]=value
  my.setStorage({key :"mtopStorage",data:mtopStorage})
}
}

function mtop(apiName:string,data:any,option:{needSignIn?:boolean,v?:string}={v:'1.0'}) :Promise<any>{
  return  new Promise((resolve, reject) => {
   let timmerId=  setTimeout(()=>{
          timmerId && reject({error:1,message:"mtop timeout"})
    },5000)
     my.call('mtop', {
            apiName,
            apiVersion:option.v|| '1.0',
            data:data,
            success: (result:any) => {
                clearTimeout(timmerId)
                timmerId=0
                console.log('mtop success ', result, new Date().getTime());
                resolve(result)
              
            },
            fail: (result:any) => {
               console.log('mtop fail ', result, new Date().getTime());
               clearTimeout(timmerId)
               timmerId=0
               reject(result)
              
            }
        });
  })

}  
function isMember ({sellerId}:any,local?:boolean){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isMember'+sellerId) 
   let bindError = +(localStorage.getItem('bindError'+sellerId)  || 0)
   if(checkMember==1) {
      console.log("isMember localStorage true",sellerId)
      return  resolve({taskType:'member' ,isMember:true,bindError,sellerId,from:'localStorage'})
   }
   if(local && checkMember==0) {
       return  resolve({taskType:'member' ,isMember:false,bindError,sellerId,from:'localStorage'})
   }
   mtop('mtop.taobao.seattle.memberinfo.get', {sellerId}, { needSignIn: true }).then((result) => {
       console.log('memberinfo.get '+sellerId,result)  
       let data = result && result.data && result.data.result &&  result.data.result
       let status =data.isMember=='true'
       let buyerNick =data.buyerNick
       //let cardCover =data.cardCover
       let mobile =data.mobile
       if(status){
           localStorage.setItem('isMember'+sellerId,1) 
       }else {
          localStorage.setItem('isMember'+sellerId,0) 
       }
       resolve({taskType:'member' ,isMember:status,bindError,mobile,buyerNick,sellerId,from:'mtop'})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({taskType:'member' ,isMember:false,mobile:null,buyerNick:null,sellerId,bindError,from:'Error'})
      // reject(err)
   })
   })
}

function isFollow ({sellerId}:any,local?:boolean){
  return  new Promise((resolve, reject) => {
   let checkMember = localStorage.getItem('isFollow'+sellerId) 
   let bindError = +(localStorage.getItem('followError'+sellerId)  || 0)
   if(checkMember) {
      console.log("isFollow localStorage true",sellerId)
      return  resolve({taskType:'follow' ,isFollow:true,bindError,sellerId,from:'localStorage'})
   }
    if(local && checkMember==0) {
       return  resolve({taskType:'follow' ,isFollow:false,bindError,sellerId,from:'localStorage'})
   }
   mtop('mtop.tmall.retail.storefollow.info.get',  {query:`type=tb&id=${sellerId}&r=false&img=&back=null&pts=1564979196718&hash=A9674CCC6694A869FCC522F2B1941FBD&spm=a21123.12268209.1.d1`}, { needSignIn: true }).then((result) => {
       console.log('storefollow.info.get '+sellerId,result)  
       let data1 = result && result.data && result.data.result      
       let status =data1.items[0].status=='true'          
       if(status){
           localStorage.setItem('isFollow'+sellerId,1) 
       }else {
           localStorage.setItem('isFollow'+sellerId,0) 
       }
       resolve({taskType:'follow',isFollow:status,bindError,sellerId,from:'mtop'})
   },(err)=>{
       console.log("mtop memberinfo.get err",err)
       resolve({taskType:'follow',isFollow:false,mobile:null,buyerNick:null,sellerId,bindError,from:'Error'})
      // reject(err)
   })
   })
}
*/
const qs = {
  parse: function(str:string) {
    if (!str || str.length == 0) return {}
    let list = str.split('&')
    if (!list || list.length == 0) return {}
    let out:any = {}
    for (let index = 0; index < list.length; index++) {
      let set = list[index].split('=')
      set && set.length > 1 && (out[set[0]] = decodeURIComponent(set[1]))
    }
    return out
  },
  stringify: function(data:any) {
    if (!data) return ''
    let list = []
    for (let key in data) {
      if (data[key] instanceof Array && data[key].length) {
        data[key].forEach((t: string | number | boolean) => {
          list.push(key + '=' + encodeURIComponent(t))
        })
      }
      else {
        list.push(key + '=' + encodeURIComponent(data[key]))
      }
    }
    return list.join('&')
  }
}

function handleNavigateScheme(jump:any,option?:any):boolean{
  let url
  if (typeof jump == 'string') {
    url = jump
  } else if (jump) {
    url = jump.url
  }
  if (!url) {
    return false
  }
       let navigate:any = {}
       let i = url.indexOf("?")
       if(i==-1) {
          return  false
       }
      
       let str = url.substring(i+1)
       
       let query = qs.parse(str)
       if(url.indexOf('my://miniapp')==0) {
         let {appId,path,extraData} = query
           my.navigateToMiniProgram({
              appId,
              path,
              extraData,
              //envVersion: 'develop'
              //envVersion:options.envVersion
               fail:(res)=>{
                let {globalData} = getApp()
                my.reportAnalytics("jsapi_fail",
                {api:"navigateToMiniProgram",
                 file:"common.ts/handleNavigateScheme",
                 timestamp:+Date.now(),
                 extra:JSON.stringify(query),
                 appId,
                 path,
                 userId:globalData.userId,
                 err:JSON.stringify(res)})
              }
            })
       }
       else if(url.indexOf('my://alipaypage')==0) {
         let {path} = query
           my.ap.navigateToAlipayPage({  
            path,         
            fail: (err) => {
               console.error(err)
            }
          })
       }
       else if(url.indexOf('my://startapp')==0) {
           let {appId,param} = query
           if(typeof param==='string' && param.indexOf('{')==0) {
             param = JSON.parse(param)
           }
           param = param || {}
           let globalData = getApp().globalData
           param = {chInfo:'ch_'+globalData.appId ,...param }    
           my.call('startApp', {
            appId,
            param
            /*param: {
              publicBizType: options.publicBizType,
              publicId: options.publicId,
              chInfo: options.chInfo
            }*/
          })

       }else if(url.indexOf('my://navigate')==0) {          
           my.navigateTo({
              url:query.url
          })
       }
       else if(url.indexOf('my://redirect')==0) {          
           my.redirectTo({
              url: query.url
          })
       }
       else if(url.indexOf('https://')==0) {
          let url_path = '/pages/webview/webview?url=' + encodeURIComponent(url)
          my.navigateTo({
              url: url_path
          })
       } 
       else if(url.indexOf('alipays://')==0) {
          my.ap.navigateToAlipayPage({  
            path:url,         
            fail: (err) => {
               console.error(err)
            }
          })
       }else {   
         return false      
         /*  my.ap.navigateToAlipayPage({  
            path:url,         
            fail: (err) => {
               console.error(err)
            }
          })*/
       }

       return true    
      
  }


function intValue(num:number) {
  var MAX_VALUE = 0x7fffffff;
  var MIN_VALUE = 0x00;//-0x80000000;  
  if (num > MAX_VALUE || num < MIN_VALUE) {
    return num &= 0x7FFFFFFF;
  }
  return num;
}
function isNull(str:string|undefined|null) {
  return str === undefined || str === null || str === '' || str.length === 0
}

 function  sleep (time: any)  {

    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {

          resolve()
        }, time || 0)
      } catch (e) {
        reject(e);
      }
    });
  }

export default {
  qs,
  getSystemInfoSync: async (): Promise<any> => {
    //@ts-ignore
    let loading = (my.$mySystemInfo && my.$mySystemInfo.loading) 
    if (loading) {
      let count = 0
      do {
        await sleep(50)
        //@ts-ignore
        if (my.$mySystemInfo && my.$mySystemInfo.success) {        
          break
        }
       
      } while (count++ < 10)
    } 
     //@ts-ignore
  if( my.$mySystemInfo &&  my.$mySystemInfo.success) {
       console.log("common getSystemInfoSync from systemInfo")
        //@ts-ignore
      return Promise.resolve(my.$mySystemInfo)
  }
   //@ts-ignore
  my.$mySystemInfo =  {loading:true}
    return new Promise((resolve, reject) => {
    
      my.getSystemInfo({
        success: (res) => {
           //@ts-ignore
          my.$mySystemInfo = { success: true, ...res }
          resolve(res)
        },
        fail: () => {
           //@ts-ignore
           my.$mySystemInfo && (my.$mySystemInfo.loading = false)
          reject()
        }        
      })
    })
  },
  getStorageSync: (data:any):Promise<any> => {   
    let { key } = data     
    return new Promise((resolve, reject) => {
      //console.time("time-getStorageSync-"+key)
      my.getStorage({
        key: key,
        success: (res) => {
          //console.timeEnd("time-getStorageSync-"+key)
          resolve(res)
        },
        fail: () => {
          reject()
        }
      })
    })
  },
  setStorageSync: (d:any) => {
    let { key,data }= d
    return new Promise((resolve, reject) => {
      my.setStorage({
        key,
        data,
        success: () => {

          resolve()
        },
        fail: () => {
          reject()
        }
      })
    })
  },
  makeUrl: (url: string | string[], data: any) => {
    let index = url && url.indexOf('?')
    return index && index > -1 ? url + "&" + qs.stringify(data) : url + "?" + qs.stringify(data)
  },
  hashCode: (strKey: string | null | undefined) => {
    var hash = 0;
    if (strKey && !isNull(strKey)) {
      for (var i = 0; i < strKey.length; i++) {
        hash = hash * 31 + strKey.charCodeAt(i);
        hash = intValue(hash);
      }
    }
    return hash.toString(16);
  },


  replaceJSON: (json: any, config:any = {}) => {    
    let keys = config && Object.keys(config)
    let jsonString = typeof json === 'string' ? json : JSON.stringify(json)
    keys && keys.forEach((key) => {
      // /需要替换的字符串/g  var patt1=new RegExp("e");
      let keyName = new RegExp(`{${key}}`, 'g')
      config[key] && jsonString.indexOf(`{${key}}`) && (jsonString = jsonString.replace(keyName, config[key]))
    })
   let jsonObject = jsonString.indexOf("{") > -1 && jsonString.indexOf('}') > -1 && JSON.parse(jsonString)
    return jsonObject
  },
  

  handleNavigate: async (options: any, gd?:GlobalData) => {
   
    let globalData = gd || getApp().globalData
    if(options && typeof options =='string' && options.indexOf("{")>-1) {
      try{
      options = JSON.parse(options)
      }catch(err) {
        console.error(err)
      }
    }
    let {redirectTo,url,url_type} = options
    if(url && !url_type)
    {  
      let ret =   handleNavigateScheme(options)
       if(ret) {
         console.log('my Scheme jump',options)
         return
       }
     }
    redirectTo = redirectTo=='1' || redirectTo=='true' || redirectTo==true
    console.log('跳转', options.url_type, options.url_path)
    try {
      switch (options.url_type) {
        case 'selfWebview':
          let url_path = '/pages/webview/webview?url=' + encodeURIComponent(options.url_path)
          if (redirectTo) {
            my.redirectTo({
              url: url_path
            })
          } else {
            my.navigateTo({
              url: url_path
            })
          }
          break
        case 'self':{
          /** my.navigateTo({
      url: 'dynamic-plugin://2021001154677005/hello'
    })
     */
           let url_path = options.url_path
             if (url_path) {           
               let    globalData =  getApp().globalData
              if (url_path.indexOf('{userId}') > -1) {
                url_path = url_path.replace('{userId}', globalData.alipayId)
              }
              if (url_path.indexOf('{appId}') > -1) {
                url_path = url_path.replace('{appId}', globalData.appId)
              }
              if (url_path.indexOf('{formId}') > -1) {
                //await globalData.getFormId()
                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId))
              }
              if (url_path.indexOf('{cityCode}') > -1) {
                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode)
              }
              if (url_path.indexOf('{cityName}') > -1) {
                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName)
              } 
              if (url_path.indexOf('{cardNo}') > -1) {
                url_path = url_path.replace('{cardNo}', globalData.cardNo)
              }
              if (url_path.indexOf('{cToken}') > -1) {
                let ctoken  =await globalData.get('ech5')  
                url_path = url_path.replace('{cToken}', ctoken)
              }             
          }
          console.log("self new url",url_path)
          if( options.url_path.indexOf("dynamic-plugin://")==0) {//^dynamic-plugin://\d{16}\/
            let reg = /^dynamic-plugin:\/\/\d{16}\//
            let reg1 = /\d{16}/
            let result = options.url_path.match(reg)
            let appId=""
            if(result && result.length) {
               appId =  result[0].match(reg1)[0]
            }
            //@ts-ignore
              appId &&   my.loadPlugin({
               plugin: `${appId}@*`, // 指定要加载的插件id和版本号，为*则每次拉取最新版本
           success: async () => {
             //@ts-ignore
                /* const plugin = requirePlugin(`dynamic-plugin://${appId}`);
               plugin.setData(my)                
                plugin.setWithHold && plugin.setWithHold((data:any)=>{
                  my.paySignCenter({
                    signStr:data.signParam,
                    success:(res)=>{
                      console.log(" my.paySignCenter success",res)
                    },
                    fail:(err)=>{
                      console.warn(" my.paySignCenter fail",err)
                    }
                  })
                }); // 调用插件api*/
        

            if (redirectTo) {
            my.redirectTo({
              url: url_path
            })
          } else {
            my.navigateTo({
              url: url_path
            })
          }
      },
       });
          } else if(url_path.indexOf('plugin://')==0) {
            //@ts-ignore
           /* const myPlugin = requirePlugin('myPlugin');
            myPlugin.setData(my)
            myPlugin.setWithHold && myPlugin.setWithHold((data:any)=>{
                  my.paySignCenter({
                    signStr:data.signParam,
                    success:(res)=>{
                      console.log(" my.paySignCenter success",res)
                    },
                    fail:(err)=>{
                      console.warn(" my.paySignCenter fail",err)
                    }
                  })
                }); // 调用插件api*/
                if (redirectTo) {
            my.redirectTo({
              url: url_path
            })
          } else {
            my.navigateTo({
              url: url_path
            })
          }
            
          } else {
           if (redirectTo) {
            my.redirectTo({
              url: url_path
            })
          } else {
            my.navigateTo({
              url: url_path
            })
          }
        }
      }
          break

 

    
        case 'startApp':{
          let url_data = options.url_data || {}
            if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
              try {
                url_data = JSON.parse(url_data)
              } catch (err) {
                console.warn(err)
              }
          }
        let url_path = options.url_path
         if (url_path) {              
              if (url_path.indexOf('{userId}') > -1) {
                url_path = url_path.replace('{userId}', globalData.alipayId)
              }
              if (url_path.indexOf('{appId}') > -1) {
                url_path = url_path.replace('{appId}', globalData.appId)
              }
              if (url_path.indexOf('{formId}') > -1) {
                //await globalData.getFormId()
                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId))
              }
              if (url_path.indexOf('{cityCode}') > -1) {
                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode)
              }
              if (url_path.indexOf('{cityName}') > -1) {
                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName)
              }             
          }
          let param:any = { 
            chInfo:'ch_'+globalData.appId           
          }
          
          options.appId =   options.appId || options.url_remark || '20000042'
          if( options.appId==='20000042') {
            param.publicBizType =  options.publicBizType ||  'LIFE_APP'
            param.publicId =  options.publicId || '2018052160219015'
           
          }        
          Object.assign(param,url_data)
          url_path && (param.url = url_path)
          console.log('startApp',param)

          my.call('startApp', {
            appId: (options.appId ),
            param
            /*param: {
              publicBizType: options.publicBizType,
              publicId: options.publicId,
              chInfo: options.chInfo
            }*/
          })
        }
          break
        case 'alipay':
          console.log(options.url_path)
          if(options.url_remark =='plugin') {
            //@ts-ignore
             let plugin = requirePlugin("myPlugin");
             if(plugin && plugin.call) {
                 plugin.call("navigateToAlipayPage",{path:options.url_path})
              }
          }else {
          my.ap.navigateToAlipayPage({
            path: options.url_path,
            fail: (err) => {
              my.alert({
                content: JSON.stringify(err)
              })
            }
          })
        }
          break
        case 'miniapp':
          // console.log('跳转', options)
          {
            let url_data = options.url_data || {}
            if (typeof url_data === 'string' && url_data.indexOf('{') >= 0) {
              try {
                url_data = JSON.parse(url_data)
              } catch (err) {
                console.warn(err)
              }
            }
            if (url_data && url_data.url) {
              let url_path = url_data.url
              if (url_path.indexOf('{userId}') > -1) {
                url_path = url_path.replace('{userId}', globalData.alipayId)
              }
              if (url_path.indexOf('{appId}') > -1) {
                url_path = url_path.replace('{appId}', globalData.appId)
              }
              if (url_path.indexOf('{formId}') > -1) {
                await globalData.getFormId()
                globalData.formId && (url_path = url_path.replace('{formId}', globalData.formId))
              }
              if (url_path.indexOf('{cityCode}') > -1) {
                url_path = url_path.replace('{cityCode}', globalData.cityInfo.cityCode)
              }
              if (url_path.indexOf('{cityName}') > -1) {
                url_path = url_path.replace('{cityName}', globalData.cityInfo.cityName)
              }
              url_data.url = url_path
            }
            console.log('miniapp跳转', options.url_remark, options.url_path, url_data)
            my.navigateToMiniProgram({
              appId: options.url_remark,
              path: options.url_path,
              extraData: url_data,
              //envVersion: 'develop'
              //envVersion:options.envVersion
                fail:(res)=>{
               
                my.reportAnalytics("jsapi_fail",{
                  api:"navigateToMiniProgram",
                  file:"common.ts/handleNavigate",
                  timestamp:+Date.now(),
                  extra:JSON.stringify(options),
                  appId:options.url_remark,
                  path:options.url_path,
                  userId:globalData.userId,
                  err:JSON.stringify(res)}
                  )
              }
            })
          }
          break
        case 'smkOut ':
        case 'h5Out': {
          let url = options.url_path
          if (url.indexOf('{userId}') > -1) {
            url = url.replace('{userId}', globalData.alipayId)
          }
          if (url.indexOf('{appId}') > -1) {
            url = url.replace('{appId}', globalData.appId)
          }
          if (url.indexOf('{formId}') > -1) {
            await globalData.getFormId()
            globalData.formId && (url = url.replace('{formId}', globalData.formId))
          }
          if (url.indexOf('{cityCode}') > -1) {
            url = url.replace('{cityCode}', globalData.cityInfo.cityCode)
          }
          if (url.indexOf('{cityName}') > -1) {
            url = url.replace('{cityName}', globalData.cityInfo.cityName)
          }
          my.call('startApp', {
            appId: '20000067',
            param: {
              url: url,
             chInfo:'ch_'+globalData.appId   
            }
          })
          console.log('startApp 20000067', url)
        }
          break
        case 'none':
        case '':
          break
        default:
          break
      }
    } catch (err) {
      console.error(err)
    }

  },
  
  checkUpdate: () => {
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
  },
  makeTaskId : (sellerId:string,taskType:string)=> {     
      const taskTypeMap:any = {
        "1":"M",
        'member':"M",
        '2':"F",
        'follow':"F",
        "3":"S",
        'shop':"S"
      }
     return "_618_"+sellerId+"-" + (taskTypeMap[taskType]|| "NONE")
  },
  makeTaskName:(taskType:string)=>{
       const taskTypeMap:any = {
        "1":"入会",
        'member':"入会",
        '2':"关注",
        'follow':"关注",
        "3":"到店",
        'shop':"到店"
      }
     return  (taskTypeMap[taskType]|| "")
  },
  myTaskId:(taskType:string)=>{
       const taskTypeMap:any = {
        "1":"member",
        'member':"member",
        '2':"follow",
        'follow':"follow",
        "3":"shop",
        'shop':"shop"
      }
     return  (taskTypeMap[taskType]|| "")
  },
  getImageUrl: (url: string) => {
 
    return new Promise((r, v) => {
      my.getStorage({
        key: url, success: (res) => {
          console.log("getStorage", res)
          if (!res.data) {
          my.canIUse('downloadFile') && my.downloadFile({
              url, success: (res) => {
                console.log("downloadFile", res)
                let apFilePath = res?.apFilePath

                if (apFilePath) {
                  my.setStorage({ key: url, data: apFilePath })
                  r(url)
                  //r(apFilePath)
                } else {
                  r(url)
                }
              }
            })
          } else {
            r(url)// r(res.data)
          }
        }, fail: () => {
          console.log("getStorage fail")
          r(url)
        }
      })
    })
  },
 //isMember,
 //isFollow,
   crossImage: function(src:string,opt:any={} )  {
if (!src){
return "";
}
let {width,height,systemInfo} = opt
let distImage =src
if(src.indexOf('.webp')>-1 || src.indexOf('.svg')>-1  || src.indexOf('.gif')>-1  || src.indexOf('x-oss-process')>-1) {
  return src
}
if(src.indexOf('noOssProcess')==-1){
if (src.indexOf('aliyuncs.com')>-1 || src.indexOf('images.allcitygo.com')>-1){
  if(src.indexOf('http://')>-1 ) src = src.replace('http://','https://')  
  //@ts-ignore
  systemInfo = systemInfo || getApp().systemInfo
  if(systemInfo) {
       let pixelRatio = systemInfo.pixelRatio || 1
      let screenWidth = (systemInfo.screen && systemInfo.screen.width && (pixelRatio*systemInfo.screen.width)) ||  systemInfo.screenWidth
      if(screenWidth && screenWidth < 750 ) {
        width = Math.floor(screenWidth* width /  750)
       if(height) { 
         height =  Math.floor(screenWidth* height / 750) }
      }
  }
let  ossProcess =  width?`?x-oss-process=image/resize,m_fill,h_${height||width},w_${width}/format,webp`:'?x-oss-process=image/format,webp';
distImage  =  `${src}${ossProcess}`;
}
}
return distImage;
}
,
pageJsonFilter:function(pageUrl:string,option:any){
  //{userId:string,model:string,platform:string,version:string,miniVersion:string,brand:string}
  /**{
  "app": "alipay",
  "brand": "IPHONE",
  "currentBattery": "100%",
  "fontSizeSetting": 16,
  "language": "Chinese",
  "model": "iPhone 6",
  "pixelRatio": 2,
  "platform": "ios",
  "storage": "256G",
  "system": "iOS",
  "version": "10.1.80",
  "screenWidth": 375,
  "screenHeight": 667,
  "windowWidth": 375,
  "windowHeight": 595,
  "statusBarHeight": 24,
  "titleBarHeight": 48
} */
     return (item:any)=>{ 
       
       let b= item.pageUrl === pageUrl
       if(!b) {
         return b
       }
       if(!item.regular || item.regular.length==0)
         return b
       else if(option) {
          for(let i =0 ;i<item.regular.length ;i++) {
            try{
            let reg = new RegExp(item.regular[i])
            for (let key in option)
              { 
                if(reg.test(option[key])) 
                  { console.log("match",item.regular[i],key,option[key])
                    return b }
              }
            }catch(e) {
              console.warn(e)
            }
          }
          return false
         }
       return b   
      }
}
,sleep

}