Expecting to run in conjunction with upstart, `/etc/monit/config.d/bipio.conf` should contain : 

    #!monit
    set logfile /var/log/monit.log

    check process node with pidfile "/var/run/bip.pid"
        start program = "/sbin/start bipio"
        stop program  = "/sbin/stop bipio"
        if failed port 5000 protocol HTTP
            request /
            with timeout 10 seconds
            then restart