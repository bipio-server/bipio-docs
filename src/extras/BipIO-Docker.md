If you'd like to get up and running quickly with a BipIO server, another option is to use [Docker](https://www.docker.com/whatisdocker/).   From docker's website, docker "is an open platform for developers and sysadmins to build, ship, and run distributed applications."   In other words, docker makes it super easy to setup & run applications.

If you're familiar with docker and just want to get rollin' with an automated build, go ahead and type:
    
    docker pull wotio/bipio
    docker run -i -p 5000:5000 wotio/bipio


The first time you run the bipio docker, you'll be prompted through a series of configuration settings.  They are:

    1) Hostname:  ( defaults to localhost:5000 )

    2) API TCP Port: ( defaults to port 5000 )

    3) Data Directory ( defaults to <bipio install directory>/data )

    4) CDN Directory ( defaults to <bipio install directory>/data/cdn )

    5) AES Key Generation ( defaults to yes. )

    6) API Username ( defaults to 'admin' )

    7) API Password ( a basic auth password will be generated.  Copy & Save the generated password, as you may need it later.)

    8) Administrator Email ( defaults to 'root@localhost' )

    9) Mongo Connect String ( defaults to "localhost/bipio" )

Once these settings have been configured, they will be written to the ../config/default.json file and the server will start up.

Browse to (defined hostname, or the default) : 
    http://localhost:5000


The next step is to connect your running server with the Bip.IO frontend:

First, you'll want to login to [Bip.IO](http://www.bip.io)
After you've successfully logged in, click on your username in the upper right corner -> "My Account".
From there you should see a top-menu item called 'Mounts' -> Click to enter your credentials.
Enter a label for your site, the URL of your Bip.IO server install, your username and the 'API Password' token which was generated during the install process. 

Click 'Create Mount' and start setting up your workflows.




The alternative approach is to set things up manually.
Here's the steps needed to get your own BipIO server up and running smoothly.  Note, this guide assumes you have a working installation of Docker. To check your Docker install, run the following command:

    # Check that you have a working install
    $ sudo docker info

From here you will need to [get the files directly here on the Docker Hub Registry.](https://registry.hub.docker.com/u/wotio/bipio/)  and follow the instructions from there.
