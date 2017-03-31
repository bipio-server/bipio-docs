If you don't know what a Pod is in the Bipio world, [learn about it](https://github.com/bipio-server/bipio/wiki/Pods-and-Channels)

Generally the pattern for installing a pod is to manually request it via npm from the bipio server root, like so :

    $ npm install bip-pod-email
    bip-pod-email@0.0.3 node_modules/bip-pod-email
    ├── pkginfo@0.2.3
    ├── ejs@0.7.1
    └── nodemailer@0.5.2 (simplesmtp@0.3.8, mailcomposer@0.2.1)

Once installed, enable it!

    $ ./tools/pod-install.js -a email
    Wrote to config/default.json

By default, the installer will look for `bip-pod-{pod name}` under `node_modules` which satisfy the pod interface for install.  It will fall back to a literal module name if `bip-pod-{pod name}` can not be found.  ie: installing something like `my-custom-pod` will also work, if it resides under the bipio server `node_modules` directory.

The initial install of a pod will populate your environment config file with a sparse 'default' configuration.  Check in the 'pods' container and configure where necessary before restarting the server.

    $ cat config/default.json
    .....
    "pods": {
        "email": {
            "mailer": {
                "host": "localhost",
                "port": 25
            }
        }
    }

If you see an exception along the lines of 

    TypeError: OAuthStrategy requires a consumerKey option

.. when installing, it means that the environment config (`config/{environment}.json`) has not been set, so fix it by registering your application with the Pod's OAuth provider and plugging the client id+secret into the `pods` section of config before retrying the install.  Be sure to never commit your application secrets to any kind of repository!

Once the server has restarted, confirm the pod has been registered by calling the 'describe' RPC `http://localhost:5000/rpc/describe/pod/{optional pod name}` in your browser.  This will describe whether the pod has been installed, its metadata, schemas, authentication requirements and any renderers.

    {
       "email":{
          "name":"email",
          "description":"Email",
          "icon" : "/static/img/pods/email.png"
          "auth":{
             "type":"none",
             "status":"accepted"
          },
          "actions":{
             "smtp_forward":{
                "description":"Send an Email",
                "description_long":"Use to forward email messages to a chosen recipient (requires recipient verification)",
                "auth_required":false,
                "trigger":false,
                "singleton":false,
                "config":{
                   "properties":{
                      "rcpt_to":{
                         "type":"string",
                         "description":"Email Address (eg: foo@bar.com)",
                         "optional":false,
                         "unique":true,
                         "validate":[
                            {
                               "pattern":"email",
                               "msg":"Invalid Email"
                            }
                         ]
                      }
                   }
                },
                "renderers":{

                },
                "defaults":{

                },
                "exports":{
                   "properties":{
                      "response_code":{
                         "description":"SMTP Response Code"
                      },
                      "response_message":{
                         "description":"SMTP Response Message"
                      }
                   }
                },
                "imports":{
                   "properties":{
                      "subject":{
                         "description":"Message Subject"
                      },
                      "body_html":{
                         "description":"HTML Message Body"
                      },
                      "body_text":{
                         "description":"Text Message Body"
                      },
                      "reply_to":{
                         "description":"Reply To"
                      }
                   }
                }
             }
          }
       }
    }
    
