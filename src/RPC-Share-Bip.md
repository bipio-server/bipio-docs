`/rpc/bip/share/:bip id`

Shares a Bip by Bip ID.  Sharing a bip creates a manifest entry with which you can automate the creation of a graph.  This RPC will return an object which details the manifest.  'Manifest' basically means the action pointers that should be interpolated with your real channel id's, if they are available.

The ID in the returned resource is the Share ID, which can be used to Un-share.

```
GET /rpc/bip/share/ab7132b6-a19e-4a04-99a2-dbd99dfdd5d4

{
  "id": "6614a02e-2b46-4568-b22a-53b40f91f62c",
  "type": "trigger",
  "name": "SC > Embedly > RSS",
  "note": "Convert SoundCloud Favorites to RSS oEmbed, tracked via Embedly",
  "icon": "",
  "config": {
    "channel_id": "soundcloud.get_favorites"
  },
  "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
  "owner_name": "admin",
  "manifest": [
  "embedly.oembed",
  "syndication.feed",
  "soundcloud.get_favorites"
  ],
  "manifest_hash": "b6975a2c0c61a5616917a5d5c065e11e",
  "hub": {
    "source": {
      "edges": [
      "embedly.oembed"
      ],
      "transforms": {
        "embedly.oembed": {
          "url": "[%source#permalink_url%]"
        }
      }
    },
    "embedly.oembed": {
      "edges": [
      "syndication.feed"
      ],
      "transforms": {
        "syndication-feed": {
          "category": "[%source#genre%]",
          "image": "[%source#artwork_url%]",
          "author": "[%source#artist%]",
          "url": "[%source#permalink_url%]",
          "summary": "[%source#description%]",
          "description": "[%embedly.oembed#html%]",
          "title": "[%source#title%]"
        }
      }
    }
  },
  "votes": 0,
  "created": "1388902005001",
  "_repr": "",
  "_href": "http://admin.local:5000/rest/bip_share/6614a02e-2b46-4568-b22a-53b40f91f62c"
} 
```