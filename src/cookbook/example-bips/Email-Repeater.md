An Email Repeater is the most simple graph you can define to get started.  It's a 1:1 email receiver which takes the most important SMTP atttributes (such as the message) and forwards it through via an email channel.

Create a SMTP Forwarder Channel :
```
POST /rest/channel
{
 action : "email.smtp_forward",
 name : "Helo FuBa"
 config : {
   rcpt_to : "foo@bar.net"
 }
}

RESPONSE
{
 id : "email channel id"
}
```

Create a SMTP bip with a source edge pointing to "Helo FuBa" :
```
POST /rest/bip
{
 type : "smtp",
 hub : {
   "source" : {
      edges : [ "email channel id" ]
   }
 }
}

RESPONSE
{
 name : "lcasKQosWire22" // auto generated
 _repr : "lcasKQosWire22@yourdomain.net"
}
```