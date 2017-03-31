Create an Instagram 'My Media' Channel :
```
POST /rest/channel
{
 action : "instagram.my_media",
 name : "Instagrams I've posted"
}

RESPONSE
{
 id : "12569f08-f503-405e-aae3-80476dd4e21b"
}
```


Create a Dropbox Save File Channel :
```
POST /rest/channel
{
 action : "dropbox.save_file",
 name : "Instagram Backup"
 config : {
   base_dir : "instagram"
 }
}

RESPONSE
{
 id : "891dcd45-792f-4af4-85dd-ca10f5a8bb8a"
}
```


Create a Trigger bip with a source edge pointing to "Instagrams I've posted" :
```
{
    "name": "My Instagram Media (Retrieve Your Media)",
    "type": "trigger",
    "config": {
        "channel_id": "12569f08-f503-405e-aae3-80476dd4e21b"
    },
    "hub": {
        "source": {
            "transforms": {
                "891dcd45-792f-4af4-85dd-ca10f5a8bb8a": {
                    "base_dir": "instagram"
                }
            },
            "edges": [
                "891dcd45-792f-4af4-85dd-ca10f5a8bb8a"
            ]
        }
    }
}
```