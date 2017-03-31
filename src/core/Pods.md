**Pods** are hooks for different services which you string together to do really interesting things.  

A single pod is responsible for carrying out all of the functionality of a given service. For example, sending/receiving _email_ would be part of the '_email pod_'.  Everything _Facebook_ related would be in the '_facebook pod_'. All things _Twitter_ are in the '_twitter pod_', etc.  Pods handle authentication (OAuth or 3rd party API Tokens),  manage data flows, process files and can generally facilitate anything else you can do with that service.    

By stringing pods together, in essence daisy-chaining services, you can easily create complex automated workflows which allow you to accomplish what would otherwise take many individual manual steps or would otherwise be impossible.   Have a look at what others are automating [here!](http://www.bip.io)


### Contents

* [Installing Pods](https://github.com/bipio-server/bipio/wiki/Pods#installing-pods)
* [Using Pods](https://github.com/bipio-server/bipio/wiki/Pods#using-pods)
  * [Authentication](https://github.com/bipio-server/bipio/wiki/Pods#authentication)
* [Creating Pods](https://github.com/bipio-server/bipio/wiki/Pods#creating-pods)
  * [Index](https://github.com/bipio-server/bipio/wiki/Pods#indexjs-explained)
  * [Manifest](https://github.com/bipio-server/bipio/wiki/Pods#manifestjson)
  * [Adding Actions](https://github.com/bipio-server/bipio/wiki/Pods#adding-an-action)
    * [Constructor](https://github.com/bipio-server/bipio/wiki/Pods#constructor)
    * [Setup](https://github.com/bipio-server/bipio/wiki/Pods#setup)
    * [Teardown](https://github.com/bipio-server/bipio/wiki/Pods#teardown)
    * [RPC](https://github.com/bipio-server/bipio/wiki/Pods#rpcs)
    * [Triggers](https://github.com/bipio-server/bipio/wiki/Pods#triggers)
    * [Invoke](https://github.com/bipio-server/bipio/wiki/Pods#invoke)






## Installing Pods

From the server root directory :

```
npm install bip-pod-{pod name}
./tools/pod-install -a {pod name}
```

Pods are installed in BipIO automatically by taking the `config` template section in the pod's `index.js` file and creating an entry in the `pods` section of your `config/{environment}.json` file.  Depending on the pod you're installing, it may require further configuration, such as oAuth application keys etc.

Restart the server at your convenience.

You can then confirm the Pod has installed correctly by calling : 

`GET /rpc/pod/describe/{pod name}`  
  
    


## Using Pods

Pods are a collection of grouped actions and each action has its own 'schema'.  Schemas tell you about the capabilities of a pod and describe the attributes, imports, exports and configs any of its channels have.

To determine which actions are available for a pod, use the RPC  

`GET /rpc/pod/describe/{pod name}`



### Authentication

  To use a Pod with a 3rd party provider, and in particular with the case of OAuth, you will need to register your application with the provider so that users can authenticate their accounts for use in your system.  ClientID's/Secrets and Callbacks for apps are defined in the config file under the appropriate config section for a pod.

#### OAuth

To start the server side oAuth process for a Pod at the Account level for an OAuth enabled pod, the client must call :

`/rpc/oauth/{pod name}/auth`

Its best to start this process from within a browser.  This will negotiate the token for the API authenticated user.

**App Registration**

Pods requiring OAuth will need to be registered as an 'App' with their target web service. As part of this process, you may be asked to provide a callback URL, which should be :

`/rpc/oauth/{pod name}/cb`

eg :

`http://localhost:5000/rpc/oauth/facebook/cb`

#### Issuer Tokens

'Issuer Tokens' are an abstraction which take a username and/or password for storage and re-use against a single account.  It is up to the Pod to implement and the authentication URI will be raised in the Pod schema description (`/rpc/describe/pod/{pod name}`).  The `authMap` in this structure will label the required fields in the same nomenclature as the Pods provider site.  For example, if `authMap` is :

```
"authMap" : {
  "password" : "API Token"
}
```

... for 'Zoho', then `password` is what should be added to `_href` to set auth for the user.

eg: `http://dev-local.bip.io:5000/rpc/issuer_token/zoho/set?password=abc123`



## Creating Pods

The <a href="https://github.com/bipio-server/bip-pod">Pod repository</a> contains a boilerplate structure which you can use as the basis for creating new Pods. To use this scaffolding,  from the BipIO server root enter init-boilerplate followed by the name of the pod.  In this example, we'll call our pod 'tutorial` :

    cd /path/to/bipio
    ./tools/init-boilerplate.sh tutorial

Calling the boilerplate initializer will create a new directory with the name of our pod in `node_modules`, prepended with `bip-pod-` :

    cd node_modules/bip-pod-tutorial
    ls

What you should find in this directory are files like :

```
README.md          Simple service description, installation instructions
boilerplate.png    32x32 service icon
gpl-3.0.txt        GPLv3 license
index.js           Pod entry point
manifest.json      definition for how to assemble a pod programmatically
package.json       npm package definition and dependencies
simple.js          A simple action
```

Let's have a look at each file individually:

### index.js 

`index.js` is the entry point for a pod and sets up some functionality that is common to all pods : 

```
var Pod = require('bip-pod'),
    Boilerplate = new Pod();

module.exports = Boilerplate;
```



### manifest.json 
The `manifest.json` file describes how to assemble and use a Pod programmatically, and has a number of parameters to set which describe what the pod does and how it should be used.



##### General Information

* **title** (string, required)  short, human readable version of `name`
* **description** (string, required) a description of the pod
* **url**  (string, optional) URL to service provider
* **version** (string) Provider API version
* **trackDuplicates** (boolean, optional default `false`) Pod requires a de-duplication resource
* **dataSources** array, list of included schemas, eg: `dataSources : [ require('./models/tracker') ]`
* **model** (object) Model Object, keyed by the name of the model
* **keys** (array) Unique Key (all keys in array create a compound key
* **config** (object) anything here is persisted to server config (`default.json`) when the pod is installed
* **oauth** (object) if your pod uses oAuth, store the [node-passport](passportjs.org) strategy configs here.

##### Authentication
* **auth** (object, optional) User Authentication Strategy
* **strategy** (string) one of
  * `none` (default) no authentication required
  * `oauth` User must negotiate oAuth credentials
  * `issuer_token` User must supply authentication tokens
  
* **passport** (object, optional) when `strategy : oauth`, sets node-passport strategy instantiation parameters
  * **provider** (string, optional, default pod name) strategy name 
  * **strategy** (string, optional, default 'Strategy') strategy function name
* **properties**  (object, optional) JSON-Schema Properties Object when strategy is not none. Describes which authentication properties are minimally required by this pod for its rpc’s and actions to be invoked.

  When strategy is oauth, properties should indicate the required oauth attributes When strategy is issuer_token, properties should be any of username|password|key

  For example, HipChat needs an access token, so properties contains password : 'API Access Token'.
* **disposition** (array) ordered list of property names, all properties are required

##### Remote Procedure Calls (RPCs)
* **rpcs** (object, optional) RPC’s implemented by this Pod
* ...    

##### Actions
* **actions** (object) Implemented Action Schemas
* ...    

##### Configuration
* **config** (object, optional) Channel Configuration Schema - channel defaults. 
* ...    

##### Imports
* **imports** (object, optional) Data Imports Schema
* ...    

##### Exports
* **exports** (object, optional) Data Exports Schema
* ...    

##### Remote Procedure Calls (RPCs) _for a given action_
* **rpcs** (object, optional) RPC’s implemented by this _action_
* ...





`manifest.json` expects [JSON schema](http://json-schema.org/)    

reference documentation also maintained [here](https://bipio-server.github.io/boilermaker/docs/manifest.html)


## Adding an Action    


Actions are responsible for carrying out a disrcete piece of functionality of a given service. Actions are named function prototypes which are automatically attached to Pods when the server bootstraps.  Every unique action should be in its own file.  

Lets take a look at each part of the `simple` action from our example above (full source can be found [here](https://github.com/bipio-server/bip-pod/blob/master/boilerplate/simple.js))




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


### RPC

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

### Triggers
pods can also be 'triggered' by some external event...   further documentation to follow.

### Invoke

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

// ---------------------------------------------------------------------
module.exports = Simple;
```










