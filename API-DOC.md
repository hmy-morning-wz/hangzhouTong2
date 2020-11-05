# 商城接口（商品详情，秒杀活动）
http://192.168.1.117:9234/operation-mall/swagger-ui.html#!/
http://sit-operation.allcitygo.com/operation-mall/swagger-ui.html#!/h-5-goods-controller/getGoodsListBySkuIdUsingPOST
# 站点活动接口
https://doc.allcitygo.com/pages/viewpage.action?pageId=27492985

# 投放系统json接口
测试环境：
http://sit-operation.allcitygo.com/market/#/

POST http://sit-operation.allcitygo.com/operation-push/push/page

POST data:
{
  "aliUserId": "2088702267429045",
  "appId": "111111111111111",
  "locationId": "2",
  "templateId": "41"
}

# 乘车跳战
https://doc.allcitygo.com/pages/viewpage.action?pageId=27492844




# 获取用户对应的订单数量（全部：orderStatusList不传；待付款：传1,6,7；待发货：传2,3；待收货：传4；已完成：传5）
http://sit-operation.allcitygo.com/operation-order/swagger-ui.html#!/mall-order-controller/getUserOrderCountUsingPOST
https://doc.allcitygo.com/pages/viewpage.action?pageId=27492866


# 免费乘车赏金

https://sit-operation.allcitygo.com/operation-free-bus/account/getUserPoint?accountId=oa20190319184021085255


# 我的页面
### 消息
http://sit-operation.allcitygo.com/operation-site/swagger-ui.html#/mail-controller


# 券到期提醒

https://doc.allcitygo.com/pages/viewpage.action?pageId=30015562


# 新手活动
http://sit-credit-card.allcitygo.com


# 更换卡面

http://sit-operation.allcitygo.com/operation-site/swagger-ui.html#!/hang-zhou-tong-controller/gethztcustomlistUsingPOST


https://doc.allcitygo.com/pages/viewpage.action?pageId=32145418


# 邀你赚钱列表展示
http://yapi.unservice.net/project/24/interface/api/1370

接口名称：邀你赚钱列表展示创 建 人：张嘉杭
状  态：未完成更新时间：2019-10-23 16:08:10
接口路径：GET/api/inviteTask/getInviteTask
Mock地址：http://yapi.unservice.net/mock/24/api/inviteTask/getInviteTask