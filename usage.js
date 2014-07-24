(function(global, factory) {
    if (typeof module === 'object') {
        module.exports = factory(require('umd-logger'), require('./lib/scionx'));
    } else if (typeof define === 'function' && define.amd) {
        define(['umd-logger', 'scionx'], factory);
    } else {
        factory(umd_logger, scionx);
    }
})(this, function(console, scion) {
    var url = (typeof module === 'object') 
        ? 'http://localhost:9989/telcoPortal-scxmlFromMultirep.xml' 
        : 'http://localhost:5959/scxml/telcoPortal-scxmlFromMultirep.xml'; 
    scion({
        doc: url,
        evalScript: false,
        scionListener: {
            statesActive: [],
            onEntry: function(stateName) {
                this.statesActive.push(stateName);
                console.debug('SCXML State Entry: "' + stateName + '"');
            },
            onExit: function(stateName) {
                this.statesActive.pop();
                console.debug('SCXML State Exit: "' + stateName + '"');
            },
            onTransition: function(sourceState, targetStatesArray) {
                console.debug('SCXML State Transition: "' + sourceState + '"->"' + targetStatesArray + '"');
                if (targetStatesArray && targetStatesArray.length > 1) {
                    console.warn('SCXML State Transition: multiple target states!');
                }
            }
        },
        onraise: function(e) {
            console.debug('current state:', this.getStates());
            console.debug('active states:', this.getActiveStates());
            console.debug('active events:', this.getActiveEvents());
            console.debug('active transitions:', this.getStates() + ":" + JSON.stringify(this.getActiveTransitions()));
        }
    }).init(function(_engine) {
        console.debug('engine:', _engine);
        _engine.start();
    });
});
