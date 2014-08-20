(function(global, factory) {
    if (typeof module === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        window.scionWrapper = factory();
    }
})(this, function() {
    // console.log("load: util.js");

    return function init(_scion) {

        var _instance = {
            _scion: _scion,
            _states: {},
            _events: {},
            _transitions: {},
            _startState: undefined,
            _id: undefined,
           

            /**
             * Start scxml interpreter
             */
            start: function() {
                _scion.start();
            },
            /**
             * Check if state equals initial state
             * @param  {String}  stateId 
             * @return {Boolean}
             */
            isInitialDefaultState: function(stateId) {
                return stateId === _instance._startState;
            },
            /**
             * Flag to ignore the execution of the content inside the script tag 
             */
            ignoreScript: function() {
                _scion.opts.retrace = true;
            },
            /**
             * Flag to evaluate the content inside the script tag
             */
            evaluateScript: function() {
                _scion.opts.retrace = false;
            },
            /**
             * Set a global variable to the scxml model
             * @param {String} name   Name of variable
             * @param {Object} object Value of the variable
             */
            setDataModel: function(name, object) {
                _scion.model.datamodel[name] = object;
            },
            /**
             * Injects code inside the script tag
             * @param {String} stateId 
             * @param {Integer} getData 
             * @param {Integer} setData 
             * @param {Object} events  
             * @param {Integer} raise   
             */
            execScript: function(stateId, data) {
                var actionId = _scion.model.states.filter(function(state) {
                    return state.id === stateId;
                })[0].onentry;
                _scion._actions[actionId](0, 0, {0: data}, 0);
            },
            /**
             * Executes a transition
             * @param  {String} event
             * @param  {Object} data  Injects data to the scxml
             */
            gen: function(event, data) {
                _scion.gen(event, data);
            },
            /**
             * Name of the state
             * @param  {String} id 
             * @return {String} name
             */
            getStateNameById: function(id){
                return _instance._states[id].name;
            },
            /**
             * Type of the state
             * @param  {String} id 
             * @return {String} type
             */
            getStateTypeById: function(id){
                return _instance._states[id].type;
            },
            /**
             * Atomic states of the current configuration
             * @return {Array} of state names
             */
            getStateName: function() {
                var names = _scion.getConfiguration().map(function(id){
                    return _instance._states[id] ? _instance._states[id].name : id;
                });
                return names[0];
            },
            /**
             * Compound states of the current configuration
             * @return {Array} of state names
             */
            getActiveStatesName: function() {
                return _scion.getFullConfiguration().map(function(id){
                    return _instance._states[id] ? _instance._states[id].name : id;
                });
            },
            /**
             * Atomic states of the current configuration
             * @return {Array} of state ids
             */
            getStateId: function() {
                return _scion.getConfiguration()[0];
            },
            /**
             * Type of the state at the current configuration
             * @return {String} of type
             */
            getStateType: function() {
                return _instance.getStateTypeById(_instance.getStateId());
            },
            /**
             * Compound states of the current configuration
             * @return {Array} of state ids
             */
            getActiveStatesId: function() {
                return _scion.getFullConfiguration();
            },
            /**
             * Accessible events contained by the atomic states
             * @return {Array}
             */
            getEvents: function() {
                var i,
                    events = [],
                    states = _scion.getConfiguration();
                for (i = 0; i < states.length; i++) {
                    events = events.concat(_instance._events[states[i]]);
                }
                return events;
            },
            /**
             * Accessible events contained by the compound states
             * @return {Array}
             */
            getActiveEvents: function() {
                var i,
                    events = [],
                    states = _scion.getFullConfiguration();
                for (i = 0; i < states.length; i++) {
                    events = events.concat(_instance._events[states[i]]);
                }
                return events;
            },
            /**
             * Accessible states from atomic states given the current configuration
             * @return {Object}
             */
            getTransitions: function() {
                var i,
                    t,
                    e,
                    transitions = {},
                    states = _scion.getConfiguration();
                for (i = 0; i < states.length; i++) {
                    t = _instance._transitions[states[i]];
                    for (e in t) {
                        transitions[e] = t[e];
                    }
                }
                return transitions;
            },
            /**
             * Accessible states from compound states given the current configuration
             * @return {Object}
             */
            getActiveTransitions: function() {
                var i,
                    t,
                    e,
                    transitions = {},
                    states = _scion.getFullConfiguration();
                for (i = 0; i < states.length; i++) {
                    t = _instance._transitions[states[i]];
                    for (e in t) {
                        transitions[e] = t[e];
                    }
                }
                return transitions;
            }
        };

        (function(){
            var events = [],
                transitions = {},
                states = _scion.model.states,
                n,
                stateObj,
                transitionObjects,
                m,
                ev,
                targets,
                targetObject,
                t;
                // startState;

            _scion.start();
            _instance._startState = _scion.getConfiguration()[0];
            _instance._id = uuid();
            // crawl all states, events and transitions             
            for (n = 0; n < states.length; n++) {
                stateObj = states[n];
                var id = stateObj.id;
                if (id.substr(0, 1) !== '$') _instance._states[id] = stateObj;
                transitionObjects = stateObj.transitions;
                for (m = 0; m < transitionObjects.length; m++) {
                    targets = transitionObjects[m].targets;
                    ev = transitionObjects[m].events;
                    events = events.concat(ev);
                    if (targets) {
                        for (t = 0; t < targets.length; t++) {
                            targetObject = targets[t];
                            if (typeof transitions[ev] === 'undefined') {
                                transitions[ev] = targetObject.id;
                            } else {
                                var tmp = transitions[ev];
                                if (typeof tmp === 'string') {
                                    var a = [];
                                    a.push(targetObject.id);
                                } else if (tmp instanceof Array) {
                                    transitions[ev].push(targetObject[ev]);
                                }
                            }
                        }
                    } else {
                        transitions[ev] = stateObj.id;
                    }
                }
                _instance._transitions[stateObj.id] = transitions;
                transitions = {};
                _instance._events[stateObj.id] = events;
                events = [];
            }

            function uuid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }
        }());
    
        return _instance;
    };
});
