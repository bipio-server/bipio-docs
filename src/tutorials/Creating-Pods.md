
#### IMPORTANT : Pod Schema is currently under review - see [(draft) Schema Specification](https://bipio-server.github.io/boilermaker/docs/manifest.html)



Pods are service containers with definitions, capabilities and implementations for a range of related actions.  The actions you define in Pods are _instantiated_ to create 'Channels' which can be arranged on a Bip's graph (aka: hub).  Creating a Pod is actually pretty simple but there's a few concepts to keep in mind, so I'm going to take you step-by-step through how to create a basic sample pod you can mess with.

For Pods requiring OAuth, BipIO generally uses [Passport](http://passportjs.org) by Jared Hanson.  If you're considering creating a new Pod with OAuth requirements, check in with the current [Passport Providers](http://passportjs.org/guide/providers) list and consider contributing if your chosen provider does not yet exist.


### Contents

* [Getting Started](https://github.com/bipio-server/bipio/wiki/Creating-Pods#getting-started)
* [index.js](https://github.com/bipio-server/bipio/wiki/Creating-Pods#indexjs-explained)
 * [Config Options](https://github.com/bipio-server/bipio/wiki/Creating-Pods#options)
* [Adding Actions](https://github.com/bipio-server/bipio/wiki/Creating-Pods#adding-an-action)
 * [Constructor](https://github.com/bipio-server/bipio/wiki/Creating-Pods#constructor)
 * [Schema](https://github.com/bipio-server/bipio/wiki/Creating-Pods#schema)
 * [RPC's](https://github.com/bipio-server/bipio/wiki/Creating-Pods#rpcs)
 * [Setup](https://github.com/bipio-server/bipio/wiki/Creating-Pods#setup)
 * [Teardown](https://github.com/bipio-server/bipio/wiki/Creating-Pods#teardown)
 * [Channel Invoker](https://github.com/bipio-server/bipio/wiki/Creating-Pods#channel-invoker)
* [Enabling Pods](https://github.com/bipio-server/bipio/wiki/Creating-Pods#enabling-pods)

## Getting Started

The <a href="https://github.com/bipio-server/bip-pod">Pod repository</a> contains a boilerplate structure which you can use as the basis for creating new Pods.  From the BipIO server root, to use this scaffolding, call init-boilerplate :

    cd /path/to/bipio
    ./tools/init-boilerplate.sh tutorial

Calling the boilerplate initializer will create a new directory in node modules, prepended with `bip-pod` :

    cd node_modules/bip-pod-tutorial
    ls

What you should find in this directory are files like :

```
README.md          Simple service description, installation instructions
boilerplate.png    32x32 service icon
gpl-3.0.txt        GPLv3 license
index.js           Pod entry point
package.json       npm package definition and dependencies
simple.js          A simple action
```

## index.js explained

index.js is the entry point for a pod and describes its overarching service behaviors (schema), and can provide generic service methods for child actions.  Lets take a look : 

```
var Pod = require('bip-pod'),
    Boilerplate = new Pod({
        name : 'tutorial', // pod name (action prefix)
        description : 'Tutorial', // short description
        description_long : 'A basic template for creating pods of your own' // long description
    });

// Include any actions
Boilerplate.add(require('./simple.js'));

// -----------------------------------------------------------------------------
module.exports = Boilerplate;
```

### Options

The 'Pod' constructor takes an options object, possible values are 

* **name** string (required) pod name, lowercase
* **description** string (required) short description
* **description_long** string (required) verbose description
* **authType** string, client authentication method for 3rd party service. one of `issuer_token` or `oauth`.
  * `issuer_token` is a set of sessionless credentials issued by the service provider, usually a username/password pair
  * `oauth` requires an oAuth negotiation to retrieve an oauth access token.
* **authMap** object, authMap is required when `authType : 'issuer_token'` and describes a map (in english) between the internal username/password representation, and how it is described by the 3rd party service.
* **passportStrategy** Function, required when `authType : 'oauth'` and is the [node-passport](http://passportjs.org/) strategy binding for this service.  For example : `passportStrategy : require('passport-github').Strategy`
* **config** object, persistent config template used by the server.  This object is copied into the server config in the `pods` section, keyed by the Pod name.  'callBackURL' is not required, it's injected by the system automatically
 * `config.oauth` object is the set of node-passport strategy options
* **dataSources** array, list of included schemas, eg: `dataSources : [ require('./models/tracker') ]`
* **trackDuplicates** boolean (default false) notifies system that this pod has duplicate data tracking requirements via the `dupFilter` resource

## Adding an Action

Actions are named function prototypes which are attached to Pod objects when the server bootstraps.  Every unique action should be in its own file.  For example, in the prior `index.js`, the 'simple' action is added like so : 

```
Boilerplate.add(require('./simple.js'));
```

The 'add' method is provided by the Pod prototype, and is responsible for binding the action to the pod and providing it system resources.

## Action Structure

Lets take a look at the `simple` action (full source can be found [here](https://github.com/bipio-server/bip-pod/blob/master/boilerplate/simple.js))

### Constructor

Firstly, define the action constructor and its unique characteristics.  The action constructor takes one argument which is `podConfig`.  `podConfig` is the global config for the parent Pod as it appears in the server config file.  At an architectural level, the action constructor is only ever called once for each worker in the cluster, so you might be able to use `podConfig` to perform some initial system setup if needed.

```
// The Action Prototype
function Simple(podConfig) {
  this.name = 'simple'; // action name (channel action suffix - "action: boilerplate.simple")
  this.description = 'short description', // short description
  this.description_long = 'the long description', // long description
  this.trigger = false; // this action can trigger
  this.singleton = false; // 1 instance per account (can auto install)
  this.auto = false; // automatically install this action
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Simple.prototype = {};
```

Typically, the action attributes which get set in the constructor will be

* **name** Action Name, lowercase string.  Becomes a Channel's `action` suffix.
* **description** Description is a short description about the action.  Try to keep this under 64 characters long
* **description_long** Verbose Description, if you need to explain with a bit more depth
* **trigger** Is a Trigger.  Channels configured with actions marked `trigger` will be automatically invoked by the system scheduler
* **singleton** Is a Singleton.  Channels with this action have no unique configuration requirements
* **auto** Auto Installs. Tells the server that when the pod is enabled or installed on a system, a channel using this action should be installed for every account

### Schema

Schema is a JSON-Schema document which can define 4 optional attributes for system use or discovered by an API client via the RPC [/rpc/describe/pod/:pod_name](https://github.com/bipio-server/bipio/wiki/Describing-Models#pod)

```
/**
 * Returns the Schema for this action
 * @see http://json-schema.org/
 */
Simple.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "instring_override" : {
          "type" :  "string",
          "description" : "Default String goes in"
        }
      }
    },
    "imports": {
      "properties" : {
        "instring" : {
          "type" :  "string",
          "description" : "Imported String goes in"
        }
      }
    },
    "exports": {
      "properties" : {
        "outstring" : {
          "type" : "string",
          "description" : "String goes out"
        }
      }
    },
    'renderers' : {
      'hello' : {
        description : 'Hello World',
        description_long : 'Hello World',
        contentType : DEFS.CONTENTTYPE_XML
      }     
    }
  }
}
```

* **config** Configurable properties, per Channel instance.  For example, a default message, or unique setting
* **imports** Expected or available imports, required for channel invocation
* **exports** Expected result structure after an error-less channel invocation
* **renderers** Channel level renderers (RPC method names)

### RPC's

Sometimes its useful to have a Channel answer some kind of RPC request independently of being active on a Bip, for example to answer some kind of request about its internal state, or provide some additional information to an API client which can be used during configuration.

If there are `renderers` defined in the action schema, an actions `rpc` method provides the implementations. Without a `renderers` schema attribute, this method is otherwise unnecessary.

The sample renderer `hello` takes a raw expressjs request object and responds with `{ "hello" : "world" }`, like so :

```
/**
 * Channel Renderers, eg: - /rpc/render/channel/{channel id}/hello
 * 
 * @param Channel channel model being destroyed
 * @param AccountInfo accountInfo Account properties object
 * @param callback function next(error, modelName, channel)
 *
 * @param string method requested method name
 * @param object sysImports pod config, auth and user info
 * @param object options request parameters
 * @param Channel channel channel object instance
 * @param pipe req raw request
 * @param pipe res raw response
 * 
 */
Simple.prototype.rpc = function(method, sysImports, options, channel, req, res) {
  if (method === 'hello') {
    res.contentType(this.getSchema().renderers[method].contentType);
    res.send({ 'hello' : 'world' });
  } else {
    res.send(404);
  }
}
```

For more info about the request and response object, see the ExpressJS documentation for [Request](http://expressjs.com/4x/api.html#req.params) and [Response](http://expressjs.com/4x/api.html#res.status)

There is no need to authenticate users for RPC's from the `rpc` method - this is already done for you by the BipIO server when handing the request with the users API credentials (username:API token).

### Setup

The `setup` method is optional and called whenever a new channel is created which points to this action.  

Setup should contain any channel specific initialization

```
/**
 * Channel Setup
 * 
 * @param Channel channel model being destroyed
 * @param AccountInfo accountInfo Account properties object
 * @param function next callback next(error, modelName, channel)
 */
Simple.prototype.setup = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}
```

The [`syndication.subscribe`](https://github.com/bipio-server/bip-pod-syndication/blob/master/subscribe.js) action, which ships as a dependency with the server itself, has a great example of when `setup` might be useful

### Teardown

When a Channel for this action is removed, `teardown` is called to perform any cleanup.  Typically, `teardown` will undo everything which `setup` does.

```
/**
 * Channel Teardown
 * 
 * @param Channel channel model being destroyed
 * @param AccountInfo accountInfo Account properties object
 * @param function next callback next(error, modelName, channel)
 */
Simple.prototype.teardown = function(channel, accountInfo, next) {
  next(false, 'channel', channel);
}
```

### Channel Invoker

`invoke` is the method which is called when a Bip's graph pipeline is processed.  It simply takes an imported data-structure, performs some kind of work, and exports the results in a way which can be used by adjacent channels.

```
/**
 * Action Invoker - the primary function of a channel
 * 
 * @param Object imports transformed key/value input pairs
 * @param Channel channel invoking channel model
 * @param Object sysImports
 * @param Array contentParts array of File Objects, key/value objects
 * with attributes txId (transaction ID), size (bytes size), localpath (local tmp file path)
 * name (file name), type (content-type), encoding ('binary') 
 * 
 * @param Function next callback(error, exports, contentParts, transferredBytes)
 * 
 */
Simple.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  next(
    false,
    {
      "outstring" : channel.config.instring_override || imports.instring
    }
    );
}

// -----------------------------------------------------------------------------
module.exports = Simple;
```

## Enabling Pods

Provided your pod exists in the server `node_modules` directory and has a name starting with `bip-pod` - enabling the Pod for use is simple, just call :

    ./tools/pod-install.js -a {pod name}

This process takes the `config` template section in the pods `index.js` file and attaches it to the `pods` structure in your server config.  Pods which have declared they require oAuth for example may some need additional setup by specifying ClientID's, secrets, custom scopes etc. which can be edited in the server config.

Otherwise, restart the server at your convenience.

You can then confirm the Pod has installed correctly calling the RPC 
[/rpc/describe/pod/:pod_name](https://github.com/bipio-server/bipio/wiki/Describing-Models#pod)

```
{
  "tutorial": {
    "name": "tutorial",
    "description": "tutorial",
    "description_long": "A basic template for creating pods of your own",
    "icon": "http://dev-local.bip.io/static/img/cdn/pods/tutorial.png",
    "auth": {
      "type": "none",
      "status": "accepted"
    },
    "renderers": {},
    "actions": {
      "simple": {
        "description": "short description",
        "description_long": "the long description",
        "trigger": false,
        "singleton": false,
        "auto": false,
        "config": {
          "properties": {
            "instring_override": {
              "type": "string",
              "description": "String goes in"
            }
          }
        },
        "renderers": {
          "hello": {
            "description": "Hello World",
            "description_long": "Hello World",
            "contentType": "text/xml"
          }
        },
        "defaults": {},
        "exports": {
          "properties": {
            "outstring": {
              "type": "string",
              "description": "String goes out"
            }
          }
        },
        "imports": {
          "properties": {
            "instring": {
              "type": "string",
              "description": "String goes in"
            }
          }
        }
      }
    }
  }
}
```

To then create a channel using the pod and any of its actions, its just :


```
POST /rest/channel

{
  "action" : "tutorial.simple",
  "name" : "My Tutorial Channel",
  "config" : {
    "instring_override" : "A Sane Default Here"
  }
}
```




