# install
npm install @tklc/miniapp-tracker-sdk --registry=http://10.0.0.122:7001

# 接口文档
见API-DOC.md

#webview 跳转url带userId方法

例子:
url='/pages/webview/webview?url='+encodeURIComponent('https://www.taobao.com/#test?userId={userId}&appId={appId}')
   
   
/pages/webview/webview?url=https%3A%2F%2Fwww.taobao.com%2F%23test%3FuserId%3D%7BuserId%7D%26appId%3D%7BappId%7D
 self
{userId} 会被替换



# 埋点说明
页面加载埋点自动，需每个page init

点击埋点 xml配置
~~~
<view class="service-item" a:for="{{my_service_icon.ele_icons}}" >
                <image class="icon-logo" src="{{item.icon_img}}" mode="widthFix"  
                data-group="卡面" data-index="{{index}}"
                data-obj="{{item}}" 
                onTap="handleIconClick"/>
                <text class="text">{{item.icon_name}}</text>
            </view>
~~~
 data-obj  里要带 icon_name ，url_path，url_type，url_data，url_remark， 点击事件会传过去

data-group="卡面" data-index="{{index}}"

page js 方法
~~~
const app = getApp()
createPage({
....
,
  async onLoad() {
      页面onShow事件
    ,
  handleIconClick(e){
    app.handleIconClick(e)
  },
  ....
~~~

app.js 统一封装
~~~
 handleIconClick(e) {
      console.log('handleClick', e.currentTarget.dataset)

      this.handleNavigate(obj)
    },
    async handleNavigate(options) { //跳转
 ....
    }
   

~~~

组件里面:

didMount() {
    getApp().Tracker.Component.init(this)
    ....





# 产品原型
移动端
https://xjcd0y.axshare.com
后管
https://org.modao.cc/app/76dd7183eadc9391805baf150dceeab9f5616cc4#screen=s299959EEA91557866670096

电商
https://doc.allcitygo.com/pages/viewpage.action?pageId=27492370

# UI
https://lanhuapp.com/web/#/item/project/board?type=share_mark&pid=32a9c90a-4095-4f3e-8c69-ed4da7e79197&activeSectionId=afb9a0e6-9d31-4517-8ea5-d9407211b82c&teamId=0da775f3-40b6-4f37-8282-30de9881f3de&param=a807d070-f2ea-489d-9aab-02c670f64965




# milestone

h5 链接过长会存在问题
跳转至退卡增加userId

## 2019-05-23

郑州小程序开发

## 2019-05-05

type 是 切换月卡、普通卡
category 是跳转类型
增加外跳转至h5
增加h5Out smkOut 跳转两种形式

## 2019-04-04

小程序userId 数据缓存

## 2019-03-20

适配全面屏
加入市民卡的乘车数据

## 2019-03-01

增加类型 startApp

{
  "type": "startApp",
  "publicBizType": "LIFE_APP",
  "publicId": "2018031602390999",
  "chInfo": "ch_2018121562519951",
  "imgUrl": "http://front-h5.oss-cn-hangzhou.aliyuncs.com/img/chuxing@3x.png",
  "text": "绿色出行"
}

## 2018-12-25

添加跳转至h5 webview
跳转type
balanceSmk 在小程序打开市民卡h5充值页面
smk 在小程序里打开市民卡h5页面
balanceSmkOut 跳转到杭州市民卡h5页面
smkOut 跳出小程序跳转到市民卡h5
startApp  打开生活号链接
self 小程序页面
none 和 空 为不跳转
alipay 跳转至支付宝h5页面
miniapp 跳转至其他小程序

## 添加至桌面图 尺寸

1:3.672

## 2019-01-16

删除残存的.git文件夹

## 2018-12-20

增加配置文件，支持多城市
支付宝卡组件最低支持 10.1.32
基础版本小程序

## 2018-12-10

海口小程序列表
appid 2018120662481627
cardType T0460100
测试请求域名 sit-operation.allcitygo.com
城市码  "pageId": 8, "zoneId": 1

## 2018-12-06

新开城市需要联系支付宝开启城市权限

## 项目初始化

npm ainstall




# 杭州卡链接
月卡未领取
        jump('https://gjyp.96225.com/qrCodeMTichet/applyCard.html')
普通卡未领取	
		 jump('https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2017011104993459&auth_skip=false&scope=auth_base&redirect_uri=https%3A%2F%2Fcitysvc.96225.com%2Fexthtml%2FalipayCard%2Fsrc%2Fpages%2Findex.html%3Ftype%3Dindex%26source%3Dalipay%26sence%3Dopen')
		 
公交服务月卡、
卡片余额	
	smkout https://gjyp.96225.com/qrCodeMTichet/hasMoney.html
卡片充值 smkout	 https://gjyp.96225.com/qrCodeMTichet/recharge.html
关于卡片 smkout		 https://gjyp.96225.com/qrCodeMTichet/hasMoney.html
乘车记录 alipay		 alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22T2330100%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95
		 
		 
公交服务普通卡
卡片余额
smkout https://citysvc.96225.com/exthtml/alipayBusCard/index.html#/balance?status=${app.account.status}&money=${app.account.wmoney}
卡片充值
smkout https://citysvc.96225.com/exthtml/alipayCard/src/pages/index.html?type=recharge
		 
关于卡片（跳转退卡）
smkout https://citysvc.96225.com/exthtml/alipayBusCard/index.html#/aboutCard?userId=${app.alipayId}
		 
乘车记录
alipay alipays://platformapi/startapp?appId=20000076&returnHome=NO&extReq=%7B%22cardType%22%3A%20%22T0330100%22%7D&bizSubType=75%3b107&showSearch=false&title=%E4%B9%98%E8%BD%A6%E8%AE%B0%E5%BD%95



<form  report-submit onSubmit="onSubmit"  >
                   <button class="form-btn" hover-class="none" form-type="submit">
				   
	 </button>
 </form>

活动模板消息外跳

page字段传：
pages/launch/index?type=navigateOuter&url=活动链接(比如https://money.allcitygo.com/shopping,需要urlEncode)




## my://

my://miniapp?appId=&path=&extraData=  
my://alipaypage?path=  
my://startapp?appId=&param=  
my://navigate?url=  
my://redirect?url=  


## 卡详情
杭州月卡
https://gjyp.96225.com/qrCodeMTichet/hasMoney.html

my://startapp?appId=20000067&param={"url":"https://gjyp.96225.com/qrCodeMTichet/hasMoney.html"}  
my://startapp?appId=20000067&param=%7B%22url%22%3A%22https%3A%2F%2Fgjyp.96225.com%2FqrCodeMTichet%2FhasMoney.html%22%7D%20%20
郑州
https://render.alipay.com/p/s/activate-card/www/cardDetail.html?cardType=T0410100

my://alipaypage?path=https%3A%2F%2Frender.alipay.com%2Fp%2Fs%2Factivate-card%2Fwww%2FcardDetail.html%3FcardType%3DT0410100
兰州
https://render.alipay.com/p/s/activate-card/www/cardDetail.html?cardType=T0620100

my://alipaypage?path=encodeURIComponent("https://render.alipay.com/p/s/activate-card/www/cardDetail.html?cardType=T0620100") 
台州
alipays://platformapi/startapp?appId=77700120&page=pages%2Findex%2Findex%3FcardType%3DM0331000%26cardNo%3D{cardNo}

my://alipaypage?path=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D77700120%26page%3Dpages%252Findex%252Findex%253FcardType%253DM0331000%2526cardNo%253D%7BcardNo%7D
瑞安
alipays://platformapi/startapp?appId=77700120&page=pages%2Findex%2Findex%3FcardType%3DT0330381%26cardNo%3D{cardNo}

my://alipaypage?path=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D77700120%26page%3Dpages%252Findex%252Findex%253FcardType%253DT0330381%2526cardNo%253D%7BcardNo%7D




## plugin-usage
https://opendocs.alipay.com/mini/plugin/plugin-usage
