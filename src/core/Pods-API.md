## $resource API

The parent pod of any action will provide an object structure called $resource.  $resource is a collection of methods which are generally useful in working with API's.  To retrieve the resource collection from an action, just reference `this.pod.$resource`

* **log** function(message, channel, level) - Log a system message
  * **message** (required) message string
  * **channel** (required) source channel
  * **level**  string, log level.  'error', 'warning', 'info' or null (default: info)
* **dupFilter**
* **getDataSourceName** function(dsName)
  * **dsName** string (required) data source name
* **getDataDir**
* **getCDNDir**
* **expireCDNDir**
* **_httpGet**
* **_httpPost**
* **_httpPut**
* **_httpStreamToFile**
* **_isVisibleHost**

