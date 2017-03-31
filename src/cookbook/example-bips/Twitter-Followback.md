#### Automatically Follow back a Twitter User who has Followed Me

Create a Twitter New Follower Channel (singleton) :
```
POST /rest/channel
{
 action : "twitter.new_follower",
 name : "New Twitter Follower"
 config : {
 }
}

RESPONSE
{
 id : "new_follower channel id"
}
```

Create a Twitter Follow User channel (singleton)
```
POST /rest/channel
{
 action : "twitter.follow_user",
 name : "Follow Twitter User"
 config : {
 }
}

RESPONSE
{
 id : "follow_user channel id"
}
```

Create a new_follower Trigger bip with an edge pointing to "follow_user" :
```
POST /rest/bip
{
 name : "Twitter Followback",
 type : "trigger",
 config : {
   channel_id : "new_follower channel id"
 }
 hub : {
   "source" : {
      edges : [ "follow_user channel id" ],
      transforms : {
        "follow_user channel id" : {
          user_id : "[%new_follower channel id#user_id%]"
        }
      }
   }
 }
}

RESPONSE
{
 name : "Twitter Followback" 
 _repr : "Twitter Followback"
}
```