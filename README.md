# scion-x

Simple extension of SCION by Jacob Beard

## Documentation
This SCION wrapper provides some additional functionalities with respect to the original implementation.

Those includes:
<ul>
    <li> UMD enabled </li>
    <li> Loader uses jQuery Deferreds </li>
    <li> Convenient getter functions such as `getActiveEvents()` which returns all accepted events at a current configuration including those subsumed by valid parent states </li>
    <li> The SCION interpreter takes account for the attribute "name" of the state that can be obtained by the function `getStateName()`</li>
    <li> The SCION interpreter takes account for the attribute "type" of the state that can be obtained by the function `getStateType()`</li>
    <li> Additional tweaks during runtime behavior such as a toggle switching on/off script execution inside SCXML: `ignoreScript()` and `evaluateScript()`</li>
</ul>


## Getting Started
Install the module with: `npm install scion-x`

Define the configuration:
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
            onExit: function(stateName) {
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

Start the SCION interpreter using known UMD pattern: 
```javascript
(function(global, factory) {
    if (typeof module === 'object') {
        module.exports = factory(require('umd-logger'), require('./lib/scionx'));
    } else if (typeof define === 'function' && define.amd) {
        define(['umd-logger', 'scionx'], factory);
    } else {
        factory(umd_logger, scionx);
    }
})(this, function(console, scion) {
    scion(config).init(function(_engine) {
        _engine.start();
        // some additional code
    });
});

```




<!--
## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
-->
## License
Copyright (c) 2014 Christian H. Schulz  
Licensed under the MIT license.
