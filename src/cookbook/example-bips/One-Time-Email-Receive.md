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
 end_life : {
   imp : 1
 },
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