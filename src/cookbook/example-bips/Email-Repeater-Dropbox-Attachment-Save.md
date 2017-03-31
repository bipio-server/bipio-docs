#### Save any incoming attachment to an email to my dropbox account under /email/attachments/{email address}/{subject}

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
 id : "d8c35967-d9f4-427b-9aaf-bd542d5e2931"
}
```

Create a Dropbox Save File Channel :
```
POST /rest/channel
{
 action : "dropbox.save_file",
 name : "Attachments Store"
 config : {
   base_dir : "email"
 }
}

RESPONSE
{
 id : "891dcd45-792f-4af4-85dd-ca10f5a8bb8a"
}
```

Create a SMTP bip with a source edge pointing to "Helo FuBa" :
```
POST /rest/bip
{
  "type": "smtp",
  "config": {        
  },
  "hub": {
    "source": {
      "transforms": {
        "891dcd45-792f-4af4-85dd-ca10f5a8bb8a": {
          "base_dir": "attachments/[%source#reply_to%]/[%source#subject%]"
        },
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931": {
          "reply_to": "[%source#reply_to%]",
          "body_text": "[%source#body_text%]",
          "body_html": "[%source#body_html%]",
          "subject": "[%source#subject%]"
        }
      },
      "edges": [
        "d8c35967-d9f4-427b-9aaf-bd542d5e2931",
        "891dcd45-792f-4af4-85dd-ca10f5a8bb8a"
      ]
    }
  }
}

RESPONSE
{
 name : "J9wy1RA" // auto generated
 _repr : "J9wy1RA@yourdomain.net"
}
```