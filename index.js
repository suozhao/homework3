const $ = require('jquery')


class request {
	constructor(url){
		this.url = url;
		this.params = {};
		this.doneCbs = [];
		this.failCbs = [];
		this.catchCbs = [];
	}
	get(params){
		this.params = params || {}
		return this;
	}
	done(fn){
		this.doneCbs.push(fn)
		this.cache()
		return this;
	}
	fail(fn){
		this.failCbs.push(fn)
		return this;
	}
	catch(fn){
		this.catchCbs.push(fn)
		return this;
	}
	callback(fns,res,flag){
		fns.forEach((fn) => {
            fn.call(this,res,flag);
        })
	}
	cache(){
		if(localStorage.getItem(this.url)){
			var res = JSON.parse(localStorage.getItem(this.url))
			var now = new Date().getTime()
			if(res.res.retcode == 0){
				this.callback(this.doneCbs,res.res,true)
			}else{
				this.callback(this.failCbs,res,true)
			}
			
			if( this.params.maxAge && now - res.time < this.params.maxAge ){
				return this;
			}
			this.ajax(this.url,this.params)
			return this;
		}
		this.ajax(this.url,this.params)
	}
	ajax(url,params){
		var that = this;
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'json',
			data: params,
		})
		.done(function(res) {
			var time = new Date().getTime();
			if(!localStorage.getItem(that.url) || !that.params.lazy){
				if(res.retcode == 0){
					that.callback(that.doneCbs,res,false)
				}else{
					that.callback(that.failCbs,res,false)
				}
			}
			localStorage.setItem(that.url, JSON.stringify({ res: res, time: time }));
		})
		.fail(function() {
			that.callback(that.catchCbs,res)
		})
	}
}
exports.module = request;