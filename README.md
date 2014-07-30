# scion-x

Simple extension of SCION by Jacob Beard

## Documentation
This SCION wrapper provides some additional functionalities with respect to the original implementation.

Those includes:

- UMD enabled 
- Loader uses jQuery Deferreds 
- Convenient getter functions such as `getActiveEvents()` which returns all accepted events at a current configuration including those subsumed by valid parent states
- The SCION interpreter takes account for the attribute "name" of the state that can be obtained by the function `getStateName()`
- The SCION interpreter takes account for the attribute "type" of the state that can be obtained by the function `getStateType()`
- Additional tweaks during runtime behavior such as a toggle switching on/off script execution inside SCXML: `ignoreScript()` and `evaluateScript()`

## Getting Started
Install the module with: `npm install scion-x`

##### Define the configuration:
```javascript
var config = {
        doc: 'http://localhost:9995/scxml.xml', // url locates the SCXML document
        evalScript: true, // default value for script execution
        // using SCION inbuilt listener to report engine activities
        scionListener: {
            statesActive: [],
            onEntry: function(stateName) {               
                console.debug('entry', stateName);
                // some additional code
            },
            onExit: function(stateName) {∂
                console.debug('exit', stateName);
                // some additional code
            },
            onTransition: function(sourceState, targetStates) {
                console.debug(sourceState, 'transits to', targetStates);
                // some additional code
            }
        },
        // using scion-x to report engine activities
        onraise: function(e) {
            console.debug('current state:', this.getState());
            console.debug('active states:', this.getActiveStates());
            console.debug('active events:', this.getActiveEvents());
        }
    };
```

##### Start the SCION interpreter using known UMD pattern: 
```javascript
(function(global, factory) {
    if (typeof module === 'object') {
        module.exports = factory(require('scionx'));
    } else if (typeof define === 'function' && define.amd) {
        define(['scionx'], factory);
    } else {
        factory(scionx);
    }
})(this, function(scion) {
    scion(config).init(function(_engine) {
        _engine.start();
        // some additional code
    });
});

```

##### To test the implementation using node
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Start the file server that serves the SCXML document. Go to the folder scxml and type in your terminal: `node file-server`
3. `grunt`

##### To test the implementation using globals
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Adapt comment as below
3. `grunt serve:browser`

```html
<script type="text/javascript" src="lib/scionWrapper.js"></script>
<script type="text/javascript" src="node_modules/umd-logger/lib/umd-logger.js"></script>
<script type="text/javascript" src="usage.js"></script>
```

##### To test the implementation using AMD
1. Set the path to your node_modules containing the required grunt plugins (see package.json) inside Gruntfile.js
2. Adapt index.html as below 
3. `grunt serve:browser`

```HTML
<script type="text/javascript">
  var require = {
    paths: {
        'umd-logger': './node_modules/umd-logger/lib/umd-logger',
        'scionx': './lib/scionLoader',
        'scionWrapper': './lib/scionWrapper',
        'scion': './node_modules/scion/dist/scion'
    },
    deps: ['usage']
  }
</script>
<script type="text/javascript" src="require.js"></script>
```
## License
Copyright (c) 2014 Christian H. Schulz  
Licensed under the MIT license.

<!--
## Examples
```
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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
-->

