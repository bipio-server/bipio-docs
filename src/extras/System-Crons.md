### Crons

Periodic tasks will run from the server master instance automatically, you can find the config
in the `config/{environment}.json` file, keyed by 'cron'.  

* stats - network chord stats, every hour
* triggers - trigger channels, every 15 minutes
* expirer - bip expirer, every hour

To disable a cron, either remove it from config or set an empty string.

To have these crons handled by your system scheduler rather than the bipio server, disable the crons
in config as described.  Wrapper scripts can be found in ./tools for each of stats (`tools/generate-hub-stats.js`), 
triggers (`tools/bip-trigger.js`) and expirer (`tools/bip-expire.js`).

Here's some example wrappers.

#### Trigger Runner

Cron:
    */15 * * * * {username} /path/to/bipio/tools/trigger-runner.sh

trigger-runner.sh :

    #!/bin/bash
    # trigger-runner.sh
    export NODE_ENV=production
    export HOME="/path/to/bipio"
    cd $HOME (date && node ./tools/bip-trigger.js ) 2>&1 >> /path/to/bipio/logs/trigger.log

#### Expire Runner

Cron:
    0 * * * * {username} /path/to/bipio/tools/expire-runner.sh

expire-runner.sh :

    #!/bin/bash
    # expire-runner.sh
    export NODE_ENV=production
    export HOME="/path/to/bipio"
    cd $HOME (date && node ./tools/bip-expire.js ) 2>&1 >> /path/to/bipio/logs/cron_server.log

#### Stats Runner

Cron:
    */15 * * * * {username} /path/to/bipio/tools/stats-runner.sh

stats-runner.sh :

    #!/bin/bash
    # stats-runner.sh
    export NODE_ENV=production
    export HOME="/path/to/bipio"
    cd $HOME (date && node ./tools/generate-hub-stats.js ) 2>&1 >> /path/to/bipio/logs/stats.log