`/rpc/bip/share/list`

Returns a collection of global shares, and acts like any other list.  Supports `page`, `page_size` and `order_by` GET parameters.

```
GET /rpc/bip/share/list

{
  "page": 1,
  "page_size": 10,
  "num_pages": 1,
  "order_by": "recent",
  "total": 7,
  "data": [
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
    "owner_name": "mjp",
    "manifest": [
    "embedly.oembed",
    "syndication.feed",
    "soundcloud.get_favorites"
    ],
    "manifest_hash": "b6975a2c0c61a5616917a5d5c065e11e",
    "hub": {
      "embedly-oembed": {
        "transforms": {
          "syndication-feed": {
            "title": "[%source#title%]",
            "description": "[%embedly.oembed#html%]",
            "summary": "[%source#description%]",
            "url": "[%source#permalink_url%]",
            "author": "[%source#artist%]",
            "image": "[%source#artwork_url%]",
            "category": "[%source#genre%]"
          }
        },
        "edges": [
        "syndication.feed"
        ]
      },
      "source": {
        "transforms": {
          "embedly-oembed": {
            "url": "[%source#permalink_url%]"
          }
        },
        "edges": [
        "embedly.oembed"
        ]
      }
    },
    "votes": 0,
    "created": "1388902005001",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/6614a02e-2b46-4568-b22a-53b40f91f62c"
  },
  {
    "id": "d98cc659-b599-4ad6-a02c-9e9f0e61623d",
    "type": "http",
    "name": "google-calendar-add",
    "note": "add to cal",
    "icon": "",
    "config": {
      "auth": "token"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "google.calendar_ev_quickadd"
    ],
    "manifest_hash": "7d5eaaa0a16557faa2c22974580664df",
    "hub": {
      "source": {
        "transforms": {
          "google-calendar_ev_quickadd": {
            "text": "[%source#title%]"
          }
        },
        "edges": [
        "google.calendar_ev_quickadd"
        ]
      }
    },
    "votes": 0,
    "created": "1388892778097",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/d98cc659-b599-4ad6-a02c-9e9f0e61623d"
  },
  {
    "id": "908f5b04-f9ea-4d55-b8fa-e51e4682edd3",
    "type": "trigger",
    "name": "Instagram crosspost to Tumblr",
    "note": "New upload to Instagram, post to Tumblr",
    "icon": "/static/img/channels/32/color/instagram.png",
    "config": {
      "channel_id": "instagram.my_media"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "tumblr.post_photo",
    "instagram.my_media"
    ],
    "manifest_hash": "3145771d84b2db324a01e1aa0fdb7b05",
    "hub": {
      "source": {
        "transforms": {
          "tumblr-post_photo": {
            "source": "[%source#media_url%]",
            "caption": "[%source#caption%]"
          }
        },
        "edges": [
        "tumblr.post_photo"
        ]
      }
    },
    "votes": 0,
    "created": "1387608932926",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/908f5b04-f9ea-4d55-b8fa-e51e4682edd3"
  },
  {
    "id": "47be8459-680f-43c4-bb14-0c3b93db3c0f",
    "type": "trigger",
    "name": "Instagram &gt; Dropbox Sync",
    "note": "Sync Your Instagram media to Dropbox",
    "icon": "/static/img/channels/32/color/instagram.png",
    "config": {
      "channel_id": "instagram.my_media"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "dropbox.save_file",
    "instagram.my_media"
    ],
    "manifest_hash": "938cc882c6e7b9a7fcef50a395d13993",
    "hub": {
      "source": {
        "transforms": {
          "dropbox-save_file": {
            "base_dir": "instagram"
          }
        },
        "edges": [
        "dropbox.save_file"
        ]
      }
    },
    "votes": 0,
    "created": "1387359762946",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/47be8459-680f-43c4-bb14-0c3b93db3c0f"
  },
  {
    "id": "2c534f8b-36c6-449c-8d89-473bf44945b9",
    "type": "trigger",
    "name": "Get MixCloud Favorites",
    "note": "Get MixCloud Favorites",
    "icon": "/static/img/channels/32/color/mixcloud.png",
    "config": {
      "channel_id": "mixcloud.get_favorites"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "mixcloud.oembed",
    "syndication.feed",
    "mixcloud.get_favorites"
    ],
    "manifest_hash": "8522c287513881ab34344762edeff8b9",
    "hub": {
      "mixcloud-oembed": {
        "edges": [
        "syndication.feed"
        ]
      },
      "source": {
        "edges": [
        "mixcloud.oembed"
        ]
      }
    },
    "votes": 0,
    "created": "1387169545860",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/2c534f8b-36c6-449c-8d89-473bf44945b9"
  },
  {
    "id": "5d1bff1d-dab7-4053-ac46-33a2dfa28cd2",
    "type": "trigger",
    "name": "favorites share install test",
    "note": "favorites share install test",
    "icon": "/static/img/channels/32/color/soundcloud.png",
    "config": {
      "channel_id": "soundcloud.get_favorites"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "embedly.oembed",
    "soundcloud.get_favorites"
    ],
    "manifest_hash": "a1b0e5a2b1d066094b6ba3cc8afc04ce",
    "hub": {
      "source": {
        "transforms": {
          "embedly-oembed": {
            "url": "[%source#permalink_url%]"
          }
        },
        "edges": [
        "embedly.oembed"
        ]
      }
    },
    "votes": 0,
    "created": "1387168828143",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/5d1bff1d-dab7-4053-ac46-33a2dfa28cd2"
  },
  {
    "id": "38b23e5e-7167-4ca1-b2e8-9392312a55e0",
    "type": "trigger",
    "name": "SC &gt; Embedly &gt; RSS",
    "note": "Convert SoundCloud Favorites to RSS oEmbed, tracked via Embedly",
    "icon": "/static/img/channels/32/color/soundcloud.png",
    "config": {
      "channel_id": "soundcloud.get_favorites"
    },
    "owner_id": "8018b34f-5587-44f9-b09f-ea1ad246fae4",
    "owner_name": "mjp",
    "manifest": [
    "embedly.oembed",
    "syndication.feed",
    "soundcloud.get_favorites"
    ],
    "manifest_hash": "b6975a2c0c61a5616917a5d5c065e11e",
    "hub": {
      "embedly-oembed": {
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
        },
        "edges": [
        "syndication.feed"
        ]
      },
      "source": {
        "transforms": {
          "embedly-oembed": {
            "url": "[%source#permalink_url%]"
          }
        },
        "edges": [
        "embedly.oembed"
        ]
      }
    },
    "votes": 0,
    "created": "1386476708224",
    "_href": "http://dev-local.bip.io:5000/rest/bip_share/38b23e5e-7167-4ca1-b2e8-9392312a55e0"
  }
  ]
}
```