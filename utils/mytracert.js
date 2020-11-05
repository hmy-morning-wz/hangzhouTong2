export class MyTracert {
    constructor(option) {
        this.option = {
            spmAPos: '',
            spmBPos: '',
            system: "",
            subsystem: "",
            bizType: 'common',
            logLevel: 2,
            chInfo: '',
            debug: false,
            mdata: {}
        };
        this.spmAPos = '';
        this.spmBPos = '';
        this.system = '';
        this.subsystem = '';
        this.bizType = '';
        this.logLevel = 2;
        this.chInfo = '';
        this.debug = false;
        this.mdata = {};
        this.option = Object.assign(Object.assign({}, this.option), option);
        Object.assign(this, this.option);
    }
    clickContent(spmId, scm, newChinfo, params) {
        my.reportAnalytics("click." + spmId, Object.assign(Object.assign({}, this.mdata), { scm, newChinfo, params }));
        if (this.debug) {
            console.log('[MyTracert]clickContent', spmId, scm, newChinfo, params);
        }
    }
    expoContent(spmId, scm, newChinfo, params) {
        my.reportAnalytics("expo." + spmId, Object.assign(Object.assign({}, this.mdata), { scm, newChinfo, params }));
        if (this.debug) {
            console.log('[MyTracert]expoContent', spmId, scm, newChinfo, params);
        }
    }
    logPv(params) {
        params = params || "";
        my.reportAnalytics('logpv', Object.assign({}, this.mdata));
        if (this.debug) {
            console.log('[MyTracert]logPv', params);
        }
    }
}
