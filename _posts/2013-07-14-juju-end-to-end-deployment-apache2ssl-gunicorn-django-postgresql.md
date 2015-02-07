---
title: 'Juju end to end deployment: Apache2+SSL, Gunicorn, Django, Postgresql'
author: Adam Stokes
layout: post
permalink: /juju-end-to-end-deployment-apache2ssl-gunicorn-django-postgresql/
cpr_mtb_plg:
  - 'a:27:{s:14:"aboutme-widget";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:12:"nginx-helper";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
internal_research_notes:
  - 
categories:
  - Cloud
  - juju
  - Ubuntu
tags:
  - django
  - juju
  - linux
  - python
  - shellscript
  - Ubuntu
---
Goal of this document is to explain how [Chris Arges][1] and I managed to get Apache w/SSL proxy to gunicorn which is serving up a django application with postgresql as the database and everything be deployable through Juju.

As an added bonus I&#8217;ll also show you how to utilize Launchpad.net&#8217;s SSO to enable authentication to your web application.

I will also break this document up into 2 parts with the first part concentrating on configuring your django application for deployment and the other doing the actual bootstrapping and deployment. Make sure you read the document in its entirety since they rely on each other to properly work.

# Pre-requisites

  * Ubuntu 12.04
  * Juju 0.7
  * You&#8217;ll want to have an existing django project created which uses postgresql as the database backend. I won&#8217;t go into details on setting that up since this focuses purely on deploying with Juju, but, [Django][2] documentation is excellent in getting up and running.

The rest of the necessary bits are handled by Juju.

# The environment

In this document I use LXC as the containers for juju deployment. You could easily use AWS or any other supported cloud technologies. The directory layout for this tutorial looks like this:

      - /home/adam/deployer
        - djangoapp/
          - settings.py
          - manage.py
          - urls.py
          - mydjangoapp/
            - models.py
            - views.py
            - urls.py
        - charms/precise/django-deploy-charm
          - hooks/
          - files/
          - templates/
          - config.yaml
          - metadata.yaml
          - README
          - revision
    

The **djangoapp** directory houses my django application and **charms/precise/django-deploy-charm** is my local charm that handles all of the Juju hooks necessary to get my environment up.

# PART UNO: Configuring your Django application

## Enable importing of database overrides from Juju

Edit **settings.py** and append the following:

      # Import juju_settings.py for DB overrides in juju environments
      try:
          from djangoapp.juju_settings import *
      except ImportError:
          pass
    

This will override the default database so you can choose to ignore the current databases stanza in the **settings.py** file.

## Enable Django to properly prefix URLS if coming from an SSL Referer

This is the first part of telling Django to expect requests from the Apache reverse proxy over HTTPS.

Edit **settings.py** and add the following somewhere after the python import statements. (location of this is probably optional, but, im cautious so we add it at the beginning)

      # Make sure that if we have an SSL referer in the headers that DJANGO
      # prefixes all urls with HTTPS
    
      SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    

Remember that added bonus? Go ahead and define the necessary Launchpad.net bits

For Django to work with Launchpad&#8217;s SSO service you&#8217;ll want to make sure that **django-openid-auth** is installed. This will be handled by Juju and I&#8217;ll show you that in **PART DOS**.

Again edit **settings.py** to include the following OpenID configuration items.

      ALLOWED_EXTERNAL_OPENID_REDIRECT_DOMAINS = [&#39;lvh.me&#39;, &#39;localhost&#39;, &#39;yourfqdn.com&#39;]
    

For development purposes I usually use lvh.me to associate a fqdn with my loopback.

Add the authorization backend to the **AUTHENTICATION_BACKENDS** tuple:

      # Add support for django-openid-auth
      AUTHENTICATION_BACKENDS = (
          &#39;django_openid_auth.auth.OpenIDBackend&#39;,
          &#39;django.contrib.auth.backends.ModelBackend&#39;,
      )
    

Add some helpful options to associating Launchpad accounts with user accounts in your django app.

      OPENID_CREATE_USERS = True
      OPENID_UPDATE_DETAILS_FROM_SREG = True
      OPENID_SSO_SERVER_URL = &#39;https://login.launchpad.net/&#39;
      OPENID_USE_AS_ADMIN_LOGIN = True
    
      # The launchpad teams and staff_teams  were manually created at launchpad.net
      OPENID_LAUNCHPAD_TEAMS_REQUIRED = [
          &#39;debugmonkeys&#39;,
          &#39;canonical&#39;,
      ]
      OPENID_LAUNCHPAD_STAFF_TEAMS = (
          &#39;debugmonkeys&#39;,
      )
      OPENID_STRICT_USERNAMES = True
      OPENID_USE_EMAIL_FOR_USERNAME = True
    

Set the **LOGIN_URL** path to where redirected users will go to login.

      LOGIN_URL = &#39;/openid/login/&#39;
      LOGIN_REDIRECT_URL = &#39;/&#39;
    <h2 id="summaryofpartuno">Summary of Part UNO</h2> 
    

This configuration will have your django application prepped for juju deployment with the ability to authenticate against launchpad.net and automatically associate the postgres database settings.

# PART DOS: Configure and deploy your juju charm

## Defining your config and metadata options

In **config.yaml** youll want to make sure the following options are defined and set:

      options:
        requirements:
          type: string
          default: &#34;requirements.txt&#34;
          description: |
            The relative path to the requirement file. Note that the charm
            won&#39;t manually upgrade packages defined in this file.
        instance_type:
          default: &#34;staging&#34;
          type: string
          description: |
            Selects if we&#39;re deploying to production or development.
            production == deploying to prodstack
            staging == local development (lxc/private cloud)
        user_code_runner:
            default: &#34;webguy&#34;
            type: string
            description: The user that runs the code
        group_code_runner:
            default: &#34;webguy&#34;
            type: string
            description: The group that runs the code
        user_code_owner:
            default: &#34;webops_deploy&#34;
            type: string
            description: The user that owns the code
        group_code_owner:
            default: &#34;webops_deploy&#34;
            type: string
            description: The group that owns the code
        app_payload:
          type: string
          description: |
            Filename to use to extract the actual django application.
            This file must be in the files/ directory.
          default: &#34;djangoapp.tar.bz2&#34;
        web_app_admin:
          type: string
          description: Web application admin email
          default: &#34;webguy@example.com&#34;
        wsgi_wsgi_file:
          type: string
          description: &#34;The name of the WSGI application.&#34;
          default: &#34;wsgi&#34;
        wsgi_worker_class:
          type: string
          default: &#34;gevent&#34;
          description: &#34;Gunicorn workers type. (eventlet|gevent|tornado)&#34;
    

In the **metadata.yaml** file we need to define the relation information, create that file with the following:

      name: django-deploy-charm
      maintainer: [Adam Stokes &#38;lt;adam.stokes@ubuntu.com&#38;gt;]
      summary: My Django project
      description: |
        Django website for My Django App
      provides:
        website:
          interface: http
        wsgi:
          interface: wsgi
          scope: container
      requires:
        db:
          interface: pgsql
    

The **revision** file keeps a positive integer to let Juju know that a new revision with changes are available. It is also recommended to add a **README** laying out the juju deploy steps for getting your charm up and running.

## Write your charm hooks

This is where the magic happens, all charm hooks will reside in the **hooks** directory and should be executable.

## A common include file

Rather than repeating the defining of variables over and over we&#8217;ll just source it from a common include file. Create a file called **common.sh** and add the following:

      #!/bin/bash
    
      UNIT_NAME=$(echo $JUJU_UNIT_NAME | cut -d/ -f1)
      UNIT_DIR=/srv/${UNIT_NAME}
    
      DJANGO_APP_PAYLOAD=$(config-get app_payload)
      INSTANCE_TYPE=$(config-get instance_type)
    
      USER_CODE_RUNNER=$(config-get user_code_runner)
      GROUP_CODE_RUNNER=$(config-get group_code_runner)
      USER_CODE_OWNER=$(config-get user_code_owner)
      GROUP_CODE_OWNER=$(config-get group_code_owner)
    
      function ctrl_service {
          # Check if there is an upstart or sysvinit service defined and issue the
          # requested command if there is. This is used to control services in a
          # friendly way when errexit is on.
          service_name=$1
          service_cmd=$2
          ( service --status-all 2&#38;gt;1 | grep -w $service_name ) &#38;amp;&#38;amp; service $service_name $service_cmd
          ( initctl list 2&#38;gt;1 | grep -w $service_name ) &#38;amp;&#38;amp; service $service_name $service_cmd
          return 0
      }
    

### The **install** hook This hook handles the extracting, package installation, and permission settings.

      #!/bin/bash
    
      source ${CHARM_DIR}/hooks/common.sh
    
      juju-log &#34;Jujuing ${UNIT_NAME}&#34;
    
      ###############################################################################
      # Directory Structure
      ###############################################################################
      function inflate {
          juju-log &#34;Creating directory structure&#34;
          mkdir -p ${UNIT_DIR}
      }
    
      ###############################################################################
      #  User / Group permissions
      ###############################################################################
      function set_perms {
          juju-log &#34;Setting permissions&#34;
    
          getent group ${GROUP_CODE_RUNNER} ${GROUP_CODE_OWNER} &#38;gt;&#38;gt; /dev/null
          if [[ $? -eq 2 ]]; then
              addgroup --quiet $GROUP_CODE_OWNER
              addgroup --quiet $GROUP_CODE_RUNNER
          fi
    
          # Check if the users already exists and create a new user if it doesn&#39;t
          if [[ ! `users` =~ ${USER_CODE_OWNER} ]]; then
        adduser --quiet --system --disabled-password --ingroup \
                  ${GROUP_CODE_OWNER} ${USER_CODE_OWNER}
          fi
          if [[ ! `users` =~ ${USER_CODE_RUNNER} ]]; then
        adduser --quiet --system --disabled-password --ingroup \
                  ${GROUP_CODE_RUNNER} ${USER_CODE_RUNNER}
          fi
    
          chown -R $USER_CODE_OWNER:$GROUP_CODE_OWNER ${UNIT_DIR}
    
          usermod -G www-data ${GROUP_CODE_RUNNER}
    
      }
    
      ###############################################################################
      # Project Install
      ###############################################################################
      function app_install {
          tar -xf ${CHARM_DIR}/files/${DJANGO_APP_PAYLOAD} -C ${UNIT_DIR}
    
          juju-log &#34;Installing required packages.&#34;
          # Additional supporting packages
          /usr/bin/apt-add-repository -y ppa:gunicorn/ppa
    
          # Common packages between instances
          common_pkgs=&#34;python-pip python-dev build-essential libpq-dev python-django python-dateutil python-psycopg2 python-jinja2 pwgen ssl-cert gunicorn&#34;
          # Silence apt-get
          export DEBIAN_FRONTEND=noninteractive
          REQUIREMENTS=$(config-get requirements)
          if [[ ${INSTANCE_TYPE} == &#39;production&#39; ]]; then
        apt-get -qq update
    
        # Install required packages
        apt-get -qq install -y python-amqplib python-anyjson \
            python-bzrlib python-celery python-cherrypy \
            python-django-celery python-django-openid-auth \
            python-django-south python-launchpadlib python-oauth python-openid \
            python-psycopg2 python-requests-oauthlib python-urllib3 python-salesforce \
            python-cheetah ${common_pkgs}
          else
        apt-get -qq update
        apt-get -qq install -y ${common_pkgs}
        pip install -q -r ${UNIT_DIR}/${REQUIREMENTS} || true
          fi
      }
    
      ###############################################################################
      # MAIN
      # Steps
      # -----
      # 1) inflate - build directory stucture
      # 2) app_install - install bits
      # 3) set_perms - finalizes permission settings
      ###############################################################################
      inflate
      app_install
      set_perms
    

One thing to notice in the **app_install** function is that we are extracting our django application from within the **files/** directory. In order to make this work you&#8217;ll want to manually tar up your django application and place it into that **files** directory.

      # Make sure we are a level above the djangoapp directory
      $ cd /home/adam/deployer
      $ tar cjf charms/precise/seg-dashboard/files/djangoapp.tar.bz2 -C djangoapp .
    <h2 id="the\_\_config-changed\_\_hook">The 
    

**config-changed** hook</h2> 

This handles the configuring and populating of the django application. Here we are just concerned with symlinking the static assets from the django application.

      ###############################################################################
      # WEB Application Config
      # 1) Setup django application specific directory
      # 2) Symlinks admin media directory
      ###############################################################################
      # 1)
      SETTINGS_PY=&#34;${UNIT_DIR}/settings.py&#34;
    
      # 2)
      PYTHON_DJANGO_LIB=`python -c &#34;import django; print(django.__path__[0])&#34;`
      mkdir -p /var/www/static
      if [ ! -L /var/www/static/admin ]; then
          ln -s ${PYTHON_DJANGO_LIB}/contrib/admin/static/admin /var/www/static/admin
      fi
    <h2 id="the\_\_db-relation-changed\_\_hook">The 
    

**db-relation-changed** hook</h2> 

This hook is where we define our Postgresql database settings to be included by the django application.

      #!/bin/bash
    
      # Update the juju_settings.py with the new database credentials
      source ${CHARM_DIR}/hooks/common.sh
    
      ###############################################################################
      # Export Database settings
      ###############################################################################
      export DBHOST=`relation-get host`
      export DBNAME=`relation-get database`
      export DBUSER=`relation-get user`
      export DBPASSWD=`relation-get password`
    
      # All values are set together, so checking on a single value is enough
      # If $db_user is not set, DB is still setting itself up, we exit awaiting 
      # next run.
      [ -z &#34;$DBUSER&#34; ] &#38;amp;&#38;amp; exit 0
    
      cheetah fill --env -p templates/juju_settings.tmpl \
          &#38;gt; ${UNIT_DIR}/juju_settings.py
    
      # Setup database
      python ${UNIT_DIR}/manage.py syncdb --noinput
    
      # Create admin fixture
      cheetah compile --env -p templates/juju_fixtures.tmpl \
          &#38;gt; templates/juju_fixtures.py
      python templates/juju_fixtures.py \
          &#38;gt; ${UNIT_DIR}/juju_fixtures.json
    
      python ${UNIT_DIR}/manage.py loaddata ./juju_fixtures.json
    
      juju-log &#34;Updating database(${DBNAME}) credentials and importing fixtures&#34;
    
      ctrl_service gunicorn restart
    

As you can see we are processing a few templates to import into the django settings and load an admin fixture into the database.

### The &#42;&#42;juju\_settings&#42;&#42; file {#the&#95;&#95;juju\_settings&#95;&#95;file}

This is the database configuration and should reside in the **templates** directory. Edit **juju_settings.tmpl** and populate with the following:

      # Generated by db-relation-changed hook
    
      # Pull in the project&#39;s default settings
      from djangoapp.settings import *
    
      # Overrite the database settings
      DATABASES[&#39;default&#39;][&#39;ENGINE&#39;] = &#39;django.db.backends.postgresql_psycopg2&#39;
      DATABASES[&#39;default&#39;][&#39;HOST&#39;] = &#39;${DBHOST}&#39;
      DATABASES[&#39;default&#39;][&#39;NAME&#39;] = &#39;${DBNAME}&#39;
      DATABASES[&#39;default&#39;][&#39;USER&#39;] = &#39;${DBUSER}&#39;
      DATABASES[&#39;default&#39;][&#39;PASSWORD&#39;] = &#39;${DBPASSWD}&#39;
    <h3 id="the\_\_juju_fixtures\_\_file">The 
    

**juju_fixtures** file</h3> 

Edit **juju_fixtures.tmpl** and add the following:

      &#38;lt;%
      import json
      from subprocess import Popen, PIPE
    
      def quickrun(cmd):
          temp = Popen(cmd, stdout=PIPE).communicate()[0]
          return temp.rstrip()
    
      adminpasswd = quickrun([&#39;pwgen&#39;, &#39;-s&#39;, &#39;64&#39;, &#39;1&#39;])
      timestamp = quickrun([&#39;date&#39;, &#39;+%F %R&#39;])
    
      fixture = { &#34;pk&#34; : 1,
                  &#34;model&#34; : &#34;auth.user&#34;,
                  &#34;fields&#34; : { &#34;username&#34; : &#34;admin&#34;,
                               &#34;password&#34; : adminpasswd,
                               &#34;email&#34; : &#34;&#34;,
                               &#34;first_name&#34; : &#34;&#34;,
                               &#34;last_name&#34; : &#34;&#34;,
                               &#34;is_active&#34; : True,
                               &#34;is_superuser&#34; : True,
                               &#34;is_staff&#34; : True,
                               &#34;last_login&#34; : &#34;now&#34;,
                               &#34;groups&#34; : [],
                               &#34;user_permissions&#34; : [],
                               &#34;date_joined&#34; : timestamp
                               }
                  }
    
      print json.dumps(fixture)
      %&#38;gt;
    <h2 id="the\_\_website-relation-joined\_\_and\_\_website-relation-changed\_\_">The 
    

**website-relation-joined** and **website-relation-changed**</h2> 

The changed hook is just a symlink to **website-relation-joined** in this case. Edit your **website-relation-joined** file and add the following:

      #!/bin/bash
    
      unit_name=${JUJU_UNIT_NAME//\//-}
    
      relation-set port=8080 hostname=`unit-get private-address`
      relation-set all_services=&#34;
        - {service_name: gunicorn, service_port: 8080}
      &#34;
    

We are making sure that apache will have access to the private IP and PORT of the gunicorn application server.

## The &#42;&#42;wsgi-relation-changed&#42;&#42; and &#42;&#42;wsgi-relation-joined&#42;&#42; {#the&#95;&#95;wsgi-relation-changed&#95;&#95;and&#95;&#95;wsgi-relation-joined&#95;&#95;}

Again the changed hook is symlinked to the joined hook. Edit **wsgi-relation-joined** and add the following:

      #!/bin/bash
    
      UNIT_NAME=`echo $JUJU_UNIT_NAME | cut -d/ -f1`
    
      relation-set working_dir=&#34;/srv/${UNIT_NAME}/&#34;
      relation-set django_settings=&#34;${UNIT_DIR}/settings.py&#34;
      relation-set python_path=`python -c &#34;import django; print(django.__path__[0])&#34;`
    
      variables=&#34;wsgi_wsgi_file wsgi_workers wsgi_worker_class wsgi_worker_connections wsgi_max_requests wsgi_timeout wsgi_backlog wsgi_keep_alive wsgi_extra wsgi_user wsgi_group wsgi_umask wsgi_log_file wsgi_log_level wsgi_access_logfile wsgi_access_logformat port&#34;
    
      declare -A VAR
      for v in $variables;do
        VAR[$v]=$(config-get $v)
        if [ ! -z &#34;${VAR[$v]}&#34; ] ; then
          relation-set &#34;$v=${VAR[$v]}&#34;
        fi
      done
    
      juju-log &#34;Set relation variables: ${VAR[@]}&#34;
    
      service gunicorn restart
    

Here the **gunicorn** charm expects a **working_dir** and a **wsgi** interface. These are set with the above relations and also a loop is provided if any other gunicorn options were to be overriden from the defaults provided in that charm.

## The &#42;&#42;apache\_vhost&#42;&#42; template {#the&#95;&#95;apache\_vhost&#95;&#95;template}

The apache2 virtualhost stanza that will ultimately provide the outside world access to your django application. Edit **apache_vhost.tmpl** and add the following:

      # Managed by juju
        &#38;lt; VirtualHost *:80 &#38;gt;
          ServerName      {{ servername }}
          Redirect permanent / https://{{ servername }}/
        &#38;lt; /VirtualHost &#38;gt;
    
        &#38;lt; VirtualHost {{ servername }}:443 &#38;gt;
          ServerName      {{ servername }}
          ServerAdmin     admin@example.com
    
          CustomLog       /var/log/djangoapp-custom.log combined
          ErrorLog        /var/log/djangoapp-error.log
    
    
          SSLEngine on
          SSLCertificateFile /etc/ssl/certs/ssl-cert-cts.pem
          SSLCertificateKeyFile /etc/ssl/private/ssl-cert-cts.key
    
          RequestHeader set X-FORWARDED-SSL &#34;on&#34;
    
          # This ensures django is seeing the https protocol
          # and prefixing all URLS with https
    
          RequestHeader set X-FORWARDED_PROTO &#34;https&#34;
    
          ProxyRequests off
          ProxyPreserveHost on
          &#38;lt;Proxy *&#38;gt;
              Order Allow,Deny
              Allow from All
          &#38;lt;/Proxy&#38;gt;
    
          ProxyPass / http://{{ djangoapp_gunicorn }}/
          ProxyPassReverse / http://{{ djangoapp_gunicorn }}/
        &#38;lt; /VirtualHost &#38;gt;
    

The items such as SSL, Header modification, and Proxy support are loaded through the apache configuration charm which is discussed below.

## Summary of the hooks {#summaryofthehooks}

These hooks provide the groundwork for making the rest of the deployment possible. I realize some of the templates aren&#8217;t making sense at the moment but read further to link the missing pieces.

## The Juju environment setup {#thejujuenvironmentsetup}

Once the hooks are done and youve compressed a tarball of your django application and have it sitting in your **files/** directory it is time to bootstrap juju and get on our way to deploying. I am assuming no pre-existing juju setup exists. In the case that you have Juju defined for other things then skip the bootstrap.

## Bootstrap your Juju environment {#bootstrapyourjujuenvironment}

      $ juju bootstrap
    

This will create a sample **~/.juju/environments.yaml** file that you can alter. Mine looks like the following for an LXC setup.

      environments:
        sample:
          type: local
          control-bucket: juju-364887954bed48b590b9b6bd112a842a
          admin-secret: fa8d276204ab4be4b3666cc5afe3bd21
          default-series: precise
          ssl-hostname-verification: true
          data-dir: /home/adam/jujuimgs
    <h2 id="deploytheapplicationcharm">Deploy the application charm</h2> 
    

From your toplevel directory, in my case **/home/adam/deployer** execute the following to get the django application deployed.

      $ juju deploy --repository ./charms local:django-deploy-charm
    <h2 id="deploytheapplicationservergunicornandsetuptherelationbetweentheapplicationandapplicationserver">Deploy the application server (gunicorn) and setup the relation between the application and application server</h2> 
    
      $ juju deploy gunicorn
      $ juju add-relation gunicorn django-deploy-charm
    <h2 id="deployapache2andaddtherelationtotheapplicationforreverseproxyingtowork">Deploy apache2 and add the relation to the application for reverse proxying to work</h2> 
    
      $ juju deploy apache2
      $ juju add-relation apache2:reverseproxy django-deploy-charm
    <h3 id="configuretheapache2charmtoloadourvirtualhostandautogeneratethenecessarycertificatesforsslsupport">Configure the Apache2 charm to load our Virtual Host and auto generate the necessary certificates for SSL support</h3> 
    
      $ juju set apache2 &#34;vhost_https_template=$(base64 &#38;lt; templates/apache_vhost.tmpl)&#34;
      $ juju set apache2 &#34;enable_modules=ssl proxy proxy_http proxy_connect rewrite headers&#34;
      $ juju set apache2 &#34;ssl_keylocation=ssl-cert-cts.key&#34;
      $ juju set apache2 &#34;ssl_certlocation=ssl-cert-cts.pem&#34;
      $ juju set apache2 &#34;ssl_cert=SELFSIGNED&#34;
    

All of these options are explained in the README of the **apache2** charm. But what this does is basically load a jinja2 supported template, enables the necessary modules in apache for proxy, ssl, and header modification support. Since we are doing a **SELFSIGNED** certificate for development and testing we set the filenames of the certificate and have the **apache2** charm generate the certificates automatically.

## Deploy postgresql and set up the database relation to our application {#deploypostgresqlandsetupthedatabaserelationtoourapplication}

      $ juju deploy postgresql
      $ juju add-relation django-deploy-charm:db postgresql:db
    <h2 id="exposeourapache2servicetotheworld">Expose our Apache2 service to the world</h2> 
    
      $ juju expose apache2
    <h1 id="tada">Tada</h1> 
    

After about 5 or 10 minutes all the services should be deployed and you can get the public facing IP of the apache server by the following:

      $ juju status apache2
    

For completeness this is what a fully deployed juju stack should look like:

      machines:
        0:
          agent-state: running
          dns-name: localhost
          instance-id: local
          instance-state: running
      services:
        apache2:
          charm: cs:precise/apache2-11
          exposed: true
          relations:
            reverseproxy:
            - django-deploy-charm
          units:
            apache2/0:
              agent-state: started
              machine: 0
              open-ports:
              - 80/tcp
              - 443/tcp
              public-address: 10.0.3.218
        gunicorn:
          charm: cs:precise/gunicorn-7
          relations:
            wsgi-file:
            - django-deploy-charm
          subordinate: true
          subordinate-to:
          - django-deploy-charm
        postgresql:
          charm: cs:precise/postgresql-30
          exposed: false
          relations:
            replication:
            - postgresql
          units:
            postgresql/0:
              agent-state: started
              machine: 0
              public-address: 10.0.3.119
        django-deploy-charm:
          charm: local:precise/django-deploy-charm-8
          relations:
            website:
            - apache2
            wsgi:
            - gunicorn
          units:
            django-deploy-charm/2:
              agent-state: started
              machine: 0
              public-address: 10.0.3.208
              relations:
                wsgi:
                - gunicorn
              subordinates:
                gunicorn/2:
                  agent-state: started
    

In this case if I go to **https://10.0.3.218** it should bring up your custom django application. If youve setup authentication with Launchpad.net like in the above example visiting **https://10.0.3.218/openid/login** should redirect your to Launchpad&#8217;s SSO service and allow you authenticate and redirect back to your django application.

## Contributors welcomed!

If you would like to checkout the source for the charm itself you can see it on [Github][3]. Would love to make this charm general enough to give people a great starting point for setting up their environments. If modifications to the document are needed please post in the comments section and Ill get those implemented.

## Things not done

  * This tutorial doesn&#8217;t cover how to setup static files as the static files live on the application server and not the apache server itself.
  * I am aware there is a **django** charm that could easily be used in place of taring up your django application, it would be worth looking into that charm to further your deployment options.
  * Not tested with Golang version of Juju since LXC support is not available **yet**

 [1]: https://wiki.ubuntu.com/christopherarges
 [2]: https://docs.djangoproject.com/en/1.4/intro/install/
 [3]: https://github.com/battlemidget/juju-apache-gunicorn-django.git