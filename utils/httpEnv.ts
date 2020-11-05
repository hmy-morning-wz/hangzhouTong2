
var env:string|undefined = undefined

const cardManageDomain = 'https://ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const cardDatailH5Domain = 'https://ech5.allcitygo.com'
const DefaultDomain =''//  'https://operation.allcitygo.com'
const hangzhouCardTest = 'http://192.168.36.192:9234' // 获取token
const citizens = 'https://life.96225.com' // http://smktest.allcitygo.com
const busdata = 'https://dataly.allcitygo.com:8087'
const map = 'https://restapi.amap.com'
const bus_changer = 'https://challenge-mimi.allcitygo.com'
const credit_card = 'https://credit-card.allcitygo.com'

const sit_cardManageDomain = 'https://sit-ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const sit_cardDatailH5Domain = 'https://sit-ech5.allcitygo.com'
const sit_DefaultDomain =''// 'https://sit-operation.allcitygo.com'
const sit_credit_card = 'https://sit-credit-card.allcitygo.com'


const prdDomain:{[k:string]:string} = {
  "default":DefaultDomain,
  "cardManageDomain":cardManageDomain,
  'hangzhouCardTest':hangzhouCardTest,
  'citizens':citizens,
  'busdata':busdata,
  'smk':'https://citysvc.96225.com',
  'map':map,
  'token':DefaultDomain,
  'bus_changer':bus_changer,
  'cardDatailH5Domain':cardDatailH5Domain,
  'credit_card':credit_card,
  "push":"https://operation.allcitygo.com",
  "activity":"https://operation.allcitygo.com",
  "operation":'https://operation.allcitygo.com',
  "preview":"https://operation.allcitygo.com"
}
const sitDomain:{[k:string]:string} = {
  "default":sit_DefaultDomain,
  "cardManageDomain":sit_cardManageDomain,
  'hangzhouCardTest':hangzhouCardTest,
  'citizens':citizens,
  'busdata':busdata,
  'smk':'https://citysvc.96225.com',
  'map':map,
  'token':sit_DefaultDomain,
  'bus_changer':bus_changer,
  'cardDatailH5Domain':sit_cardDatailH5Domain,
  'credit_card':sit_credit_card,
  "activity":'https://sit-operation.allcitygo.com',
  "push":'https://sit-operation.allcitygo.com',
  "operation":'https://sit-operation.allcitygo.com',
  "preview":"http://sit-operation.allcitygo.com"
}

const prdPrefix:{[k:string]:string} = {
 "default":"",
 "activity":"/operation-activity",
 "push":"/operation-push",
 "preview":"/operation-activity",
 "game":"operation-activity",
}
const sitPrefix:{[k:string]:string} = {
 "default":"",
 "activity":"/operation-activity",
 "push":"/operation-push",
 "preview":"/operation-activity",
 "game":"operation-activity",
}

export function setEnv(newEnv:any):void {
    newEnv && (env = newEnv)
}

export default function getDomain(urlType:string|undefined):string {
    if(env=='sit')   {
        return (sitDomain[urlType||'default'] || '')+ (sitPrefix[urlType||'default'] || "")
    }
    else {
        return (prdDomain[urlType||'default']||'' )+ (prdPrefix[urlType||'default'] || "")
    }
}
