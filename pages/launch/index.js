import store from './store'

const app = getApp()
const createPage = function(options) {
  return Page(store.register(options))
};
createPage({
  data: {
   
  },
  async onLoad(options) { 
    await app.loadUserId()
    let {id,url,type,u,t,e} = options
    let myUrl =url || u ||  app.msg && app.msg.url    
     let myType = type || t
    if(myUrl || myType || id){
     
      if(myType){
        if(myType==='voucher'){
          myUrl = 'https://money.allcitygo.com/shopping/#/redCardVoucher?userId={userId}'
        }else if(myType === 'order'){
           myUrl = 'https://money.allcitygo.com/shopping/#/orderList?userId={userId}'
        }else if(myType ==='o' && myUrl){   
           console.log("myType navigateOuter ")
          if(myUrl.indexOf('http')==-1){
              if(e=='p')
                myUrl = 'https://money.allcitygo.com/' + myUrl
              else if(e=='s'){
                myUrl = 'https://sit-operation.allcitygo.com/' + myUrl
             }
          }      
          console.log("navigateOuter myUrl ",myUrl)
           if(app.appId==='2019031163539131'){
                 app.handleNavigate({url_type:'h5Out',url_path:myUrl})
           }else {
              app.handleNavigate({url_type:'miniapp',url_path:'/pages/index/index', 
              url_data:{url:myUrl,type:'h5Out',navigateOuter:true},
              url_remark:'2019031163539131'})
           }
           
             my.redirectTo({
             url: '/pages/index/index'
        })
          return
        } else  {
          console.log("undefine type")
        }
        if(myUrl){
         let goUrl='/pages/webview/webview?url='+encodeURIComponent(myUrl)
         my.redirectTo({
           url:goUrl
         }) 
         return
        }
      }
      if(myUrl){
        let goUrl='/pages/webview/webview?url='+encodeURIComponent(myUrl)
         my.redirectTo({
           url:goUrl
         })    
         return
      }
       {
        await this.dispatch('$global:getPageJSON','pages/launch/index')
      }
        my.reLaunch({
      url: '/pages/index/index'
    })
    }else {
      my.reLaunch({
      url: '/pages/index/index'
    })
    }

  },
  async onShow() {

  },

  
})
