Create a RSS Subscribe Channel :
```
POST /rest/channel
{
 action : "syndication.subscribe",
 name : "Muddy Colors"
 config : {
   feed_url : "http://muddycolors.blogspot.com/feeds/posts/default"
 }
}

RESPONSE
{
 id : "subscribe channel id"
}
```

Create an RSS Feed Channel - this will be the container the Subscribe gets pushed to. :
```
POST /rest/channel
{
 action : "syndication.feed",
 name : "Creative Feed"
}

RESPONSE
{
 id : "feed channel id"
}
```

Why two channels?  Because Subscribe is just a trigger, feed is an aggregator - 1:1 or many:1


Create a Trigger bip with an edge pointing to "Creative Feed" :
```
POST /rest/bip
{
  name : "Muddy Colors Sync",
  type : "trigger",
  config : {
    channel_id : "subscribe channel id"
  },
  hub : {
    "source" : {
      edges : [ "feed channel id" ]
    }
  }
}

RESPONSE
{
 name : "Muddy Colors Sync"
 _repr : "Muddy Colors Sync"
}
```

Bipio will invoke this trigger periodically, any new messages will be emitted across the hub to the feed container.