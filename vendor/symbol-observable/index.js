define('symbol-observable/index', ['symbol-observable/ponyfill'], function(pf){
	return pf(global || window || this);
})