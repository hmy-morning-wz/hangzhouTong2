/**
 * 
 * 此文件弃用，配置地址请在httpEnv.ts里配置
 * 
 */
const devDomain = 'https://ech5.allcitygo.com'
const cardManageDomain = 'https://ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const cardDatailH5Domain = 'https://ech5.allcitygo.com'
const DefaultDomain =''//  'https://operation.allcitygo.com'
const hangzhouCardTest = 'http://192.168.36.192:9234' // 获取token
const citizens = 'https://life.96225.com' // http://smktest.allcitygo.com
const busdata = 'https://dataly.allcitygo.com:8087'
const map = 'https://restapi.amap.com'
const bus_changer = 'https://challenge-mimi.allcitygo.com'
const credit_card = 'https://credit-card.allcitygo.com'

const sit_devDomain = 'https://sit-ech5.allcitygo.com'
const sit_cardManageDomain = 'https://sit-ech5.allcitygo.com' // https://sitsit-ech5.allcitygo.com  https://ech5.allcitygo.com
const sit_cardDatailH5Domain = 'https://sit-ech5.allcitygo.com'
const sit_DefaultDomain =''// 'https://sit-operation.allcitygo.com'
const sit_credit_card = 'https://sit-credit-card.allcitygo.com'

var env = undefined

export function setEnv(newEnv) {
    newEnv && (env = newEnv)
}

export default function getDomain(urlType) {
    let domain = devDomain
    //////测试
    if (env && env === 'sit') {
        domain = sit_devDomain
        if (urlType === 'default') {
            domain = sit_DefaultDomain
        } else if (urlType === 'cardManageDomain') {
            domain = sit_cardManageDomain
        } else if (urlType === 'hangzhouCardTest') {
            domain = hangzhouCardTest
        } else if (urlType === 'citizens') {
            domain = citizens
        } else if (urlType === 'busdata') {
            domain = busdata
        } else if (urlType === 'smk') {
            domain = 'https://citysvc.96225.com'
        } else if (urlType === 'map') {
            domain = map
        } else if (urlType === 'token') {
            domain = sit_DefaultDomain
        } else if (urlType === 'bus_changer') {
            domain = bus_changer
        } else if (urlType === 'cardDatailH5Domain') {
            domain = sit_cardDatailH5Domain
        }else if(urlType ==='credit_card'){
           domain = sit_credit_card
        }

    } else
    //////正式
    {
        if (urlType === 'default') {
            domain = DefaultDomain
        } else if (urlType === 'cardManageDomain') {
            domain = cardManageDomain
        } else if (urlType === 'hangzhouCardTest') {
            domain = hangzhouCardTest
        } else if (urlType === 'citizens') {
            domain = citizens
        } else if (urlType === 'busdata') {
            domain = busdata
        } else if (urlType === 'smk') {
            domain = 'https://citysvc.96225.com'
        } else if (urlType === 'map') {
            domain = map
        } else if (urlType === 'token') {
            domain = DefaultDomain
        } else if (urlType === 'bus_changer') {
            domain = bus_changer
        } else if (urlType === 'cardDatailH5Domain') {
            domain = cardDatailH5Domain
        }else if(urlType ==='credit_card'){
           domain = credit_card
        }
    }
    return domain
}
