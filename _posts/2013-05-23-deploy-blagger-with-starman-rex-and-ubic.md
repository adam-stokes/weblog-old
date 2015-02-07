---
title: Deploy blagger with starman, rex and ubic
author: Adam Stokes
layout: post
permalink: /deploy-blagger-with-starman-rex-and-ubic/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
If you come from a python or ruby background and are used to services  
such as virtualenv, rbenv then this document should be easy to  
follow. If not, no problem it is still easy <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" /><h2 id="pre-reqs">Pre-reqs</h2> 

Youll want to install perlbrew which is perl's equivalent to virtualenv and rbenv.<pre class="prettyprint"> $ curl -kL http://install.perlbrew.pl | bash </pre> 

Follow the on screen instructions and install your desired perl version (this doc uses 5.18.1)<pre class="prettyprint"> $ perlbrew install perl-5.18.1 $ perlbrew switch perl-5.18.1 </pre> 

Install cpanm<pre class="prettyprint"> $ perlbrew install-cpanm </pre> <h2 id="setup">Setup</h2> <h3 id="checkoutsourcelocallyandonremoteserver">Checkout source locally and on remote server</h3> 

It is best to fork the code into your github account since you'll be  
storing your own posts. This is for demonstration only.<pre class="prettyprint"> $ git clone git://github.com/battlemidget/ztunzeed.git </pre> <h3 id="installdependencieslocallyandonremoteserver">Install dependencies locally and on remote server</h3> 

This is equivalent to python's pip or ruby's gem.<pre class="prettyprint"> $ cpanm --installdeps . </pre> <h3 id="setupnginxonremoteserver">Setup nginx on remote server</h3> <pre class="prettyprint"> $ cp blog.nginx.conf /etc/nginx/sites-enabled/blog.conf </pre> 

Edit the configuration to match your hostname and root directory for this application.<h3 id="setupubicontheremoteserverwhereyouhostyourblog">Setup <a href="https://metacpan.org/release/Ubic">Ubic</a> on the remote server where you host your blog</h3> 

You can install this right in your home directory to keep your application self-contained.<pre class="prettyprint"> $ ubic-admin setup </pre> 

Place the following in your $HOME/ubic/service/blog<pre class="prettyprint"> use Ubic::Service::Plack; return Ubic::Service::Plack->new({ server => "Starman", server\_args => { env => 'production', host => '127.0.0.1', workers => 5, port => 9001, }, app => '/home/blagger/blagger', app\_name => 'blagger', }); </pre> 

Start the service monitor<pre class="prettyprint"> $ ubic start blog </pre> <h2 id="writeablogpost">Write a blog post</h2> <pre class="prettyprint"> $ ./blagger blag a-new-blog-post </pre> <h2 id="commitanddeploy">Commit and deploy</h2> <pre class="prettyprint"> $ git commit -asm 'new blog post' && git push -q $ rex deploy </pre> 

This will deploy and checkout your source remotely via <a href="http://rexify.org">Rex</a> and restart the gaurdian service for the blog.

Once you've done the first deployment any future posts only require you to commit to git and deploy.