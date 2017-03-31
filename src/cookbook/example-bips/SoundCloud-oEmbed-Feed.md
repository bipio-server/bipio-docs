#### Converts SoundCloud favorites into an oEmbed translated feed using Embedly

Create SoundCloud `get_favorites` channel :
```
POST /rest/channel
{
  action : "soundcloud.get_favorites",
  name : "Get SC Favorites"
}

RESPONSE
{
 id : "ca2baf2b-52ac-4885-a6c0-b2f2ab6d3f38"
}
```

Create Embedly `oembed` channel :
```
POST /rest/channel
{
  action : "embedly.oembed",
  name : "Create oEmbed"
}

RESPONSE
{
 id : "5bc64294-7da5-44e1-903e-48ecc3c57421"
}
```

Create Syndication `feed` channel :
```
POST /rest/channel
{
  action : "syndication.feed",
  name : "Music Feed"
}

RESPONSE
{
 id : "84d78a89-c148-48e7-b41d-ba1f1d42ce87"
}
```

Now to track SoundCloud favorites and automatically push them into an RSS feed with oEmbed translation :
```
{
    "name": "SoundCloud favorites > oEmbed RSS",
    "type": "trigger",
    "config": {
        "channel_id": "ca2baf2b-52ac-4885-a6c0-b2f2ab6d3f38"
    },
    "hub": {
        "5bc64294-7da5-44e1-903e-48ecc3c57421": {
            "transforms": {
                "84d78a89-c148-48e7-b41d-ba1f1d42ce87": {
                    "category": "[%source#genre%]",
                    "image": "[%source#artwork_url%]",
                    "author": "[%source#artist%]",
                    "url": "[%source#permalink_url%]",
                    "summary": "[%source#description%]",
                    "description": "[%5bc64294-7da5-44e1-903e-48ecc3c57421#html%]",
                    "title": "[%source#title%]"
                }
            },
            "edges": [
                "84d78a89-c148-48e7-b41d-ba1f1d42ce87"
            ]
        },
        "source": {
            "transforms": {
                "5bc64294-7da5-44e1-903e-48ecc3c57421": {
                    "url": "[%source#permalink_url%]"
                }
            },
            "edges": [
                "5bc64294-7da5-44e1-903e-48ecc3c57421"
            ]
        }
    },
    "end_life": {
        "action": "pause",
        "time": 0,
        "imp": 0
    }
}

RESPONSE
{
 name : "SoundCloud favorites > oEmbed RSS"
 _repr : "SoundCloud favorites > oEmbed RSS"
}
```