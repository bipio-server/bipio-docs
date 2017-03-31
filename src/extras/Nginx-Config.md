```

# optional nginx worker cpu affinity (8 cores)
worker_processes 8;
worker_priority -1;
worker_rlimit_nofile 2000;
worker_cpu_affinity 00000001 00000010 00000100 00001000 00010000 00100000 01000000 10000000;

# ratelimit zone
limit_req_zone  $binary_remote_addr  zone=one:10m   rate=10r/s;

# server config
server {
  listen 80;
  server_name localhost *.localhost;

  chunkin on;

  error_page 411 = @my_411_error;
  location @my_411_error {
    chunkin_resume;
  }

  access_log /var/log/nginx/localhost.log;
  error_log /var/log/nginx/localhost.error.log;

  # drop api connections as fast as makes sense
  keepalive_timeout    5;

  # API burst/rate limit
  limit_req_log_level warn;
  limit_req   zone=one  burst=10;

  # API passthrough (skip lb)
  location / {
    proxy_pass      http://127.0.0.1:5000;
    proxy_redirect  off;

    ### disbale proxy buffering ###
    proxy_buffering off;

    add_header X-Frame-Options DENY;

    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;           
  }
}
```