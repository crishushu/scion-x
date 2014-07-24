(function() {
    var newInstance = function(scion, scionWrapper, _defer, listener) {
        var _interpreter = null;
        var load = function(url) {
            var _url = url || this.doc,
                _self = this;
            if (typeof _url === 'undefined') {
                console.error('URL is missing!');
                return;
            }
            scion.urlToModel(_url, function(err, model) {
                if (err) {
                    console.error(err);
                    return;
                }
                _interpreter = new scion.SCXML(model);
                _interpreter.registerListener(listener);
                _self.onload(scionWrapper(_interpreter), _defer);
            });
            return _defer.promise();
        };
        return {
            getInstance: function() {
                return this;
            },
            load: load,
            onload: function(_scion, _defer) {
                for (var key in _scion) {
                    this[key] = _scion[key];
                }
                if (!this.evalScript) this.ignoreScript();
                delete this.evalScript;

                _defer.resolve(this);
            },
            raise: function(eventName, data) {
                if ((typeof data !== 'undefined') && (typeof data.Data === 'undefined')) {
                    data = JSON.parse('{ "Data": { "data": ' + JSON.stringify(data) + ' }}');
                }
                if (typeof data !== 'undefined' && typeof data.Data !== 'undefined' && typeof data.Data.data !== 'undefined') {
                    this._scion.gen(eventName, data.Data.data);
                } else {
                    this._scion.gen(eventName, data);
                }
                this.onraise({name: eventName, data: data});
            },
            onraise: function() {}
        };
    };
    var _config;
    if (typeof module === 'object') {
        module.exports = function(config) {
            return {
                init: function(callback) {
                    // delete config.scionListener;
                    var engine = newInstance(require('scion'), require('./scionWrapper.js'), require('jquery-deferred').Deferred(), require('umd-logger'), config.scionListener);
                    if (config) {
                        for (var property in config) {
                            engine[property] = config[property];
                        }
                    } else if (_config) {
                        config = _config;
                    } else {
                        console.error('SCION config is missing');
                        return;
                    }
                    engine.load().then(function(_engine) {
                        console.info("[Load SCION] done");
                        callback(_engine);
                    });
                }
            };
        };
    } else if (typeof define === 'function' && define.amd) {
        define(['scion', 'scionWrapper'], function(scion, scionUtil) {
            return function(config) {
                return {
                    init: function(callback) {
                        var engine = newInstance(scion, scionUtil, $.Deferred(), config.scionListener);
                        if (config) {
                            for (var property in config) {
                                engine[property] = config[property];
                            }
                        } else if (_config) {
                            config = _config;
                        } else {
                            console.error('SCION config is missing');
                            return;
                        }
                        engine.load().then(function(_engine) {
                            console.info("[Load SCION] done");
                            callback(_engine);
                        });
                    }
                };
            };
        });
    } else {
        window.scionx = function(config) {
            return {
                init: function(callback) {
                    $.when(
                        $.getScript("./node_modules/scion/dist/scion.js"),
                        $.getScript("./lib/scionWrapper.js"))
                    .done(function() {
                        var scionWrapper = window.scionWrapper;
                        // delete window.util;
                        // delete config.scionListener;
                        var engine = newInstance(require('scion'), scionWrapper, $.Deferred(), scionListener);
                        if (config) {
                            for (var property in config) {
                                engine[property] = config[property];
                            }
                        } else if (_config) {
                            config = _config;
                        } else {
                            console.error('SCION config is missing');
                            return;
                        }
                        engine.load().then(function(_engine) {
                            console.info("[Load SCION] done");
                            callback(_engine);
                        });
                    });
                }
            };
        };
    }
}).call(this);