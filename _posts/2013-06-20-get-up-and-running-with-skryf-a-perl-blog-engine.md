---
title: Get up and running with skryf a perl blog engine
author: Adam Stokes
layout: post
permalink: /get-up-and-running-with-skryf-a-perl-blog-engine/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
Another blog engine utilizing Mojolicious, Markdown, Hypnotoad, Rex, and Ubic for a more streamlined deployable approach.

## PREREQS

I like [perlbrew][1], but, whatever you&#8217;re comfortable with. I won&#8217;t judge.

## INSTALLATION (SOURCE)

    $ git clone git://github.com/battlemidget/App-skryf.git
    $ cpanm --installdeps . 
    

## SETUP

By default **skryf** will look in *dist_dir* for templates and media. To override that make sure **~/.skryf.conf** points to the locations of your templates, posts, and media. For example, this is a simple directory structure for managing your blog.

    $ mkdir -p ~/blog/{posts,templates,public}
    

Another useful reference would be to check out [my git repo][2] that hosts this site.

Edit **~/.skryf.conf** to reflect those directories in media\_directory, post\_directory, and template_directory.

    ## Available vars: ## %bindir% (path to executable's dir)
    ## %homedir% (current $HOME) 
    post_directory => '%homedir%/blog/posts', 
    template_directory => '%homedir%/blog/templates',
    media_directory => '%homedir%/blog/public', 
    

You&#8217;ll want to make sure that files exist that reflect the template configuration options.

    post_template => 'post',
    index_template => 'index',
    about_template => 'about',
    css_template => 'style',
    

So **~/blog/templates/{post.html.ep,index.html.ep,about.html.ep}** and **~/blog/public/style.css**

## DEPLOY

    $ export BLOGUSER=username
    $ export BLOGSERVER=example.com 
    

If perlbrew is installed Rex will autoload that environment to use remotely. Otherwise more tinkering is required to handle the perl environment remotely.

    $ rex deploy
    

## RUN (Development)

    $ morbo \`which skryf\`
    

## RUN (Production)

I use Ubic to manage the process

    use Ubic::Service::SimpleDaemon; 
    my $service = Ubic::Service::SimpleDaemon->new( 
              bin => "hypnotoad -f \`which skryf\`", 
              cwd => "/home/username", 
              stdout => "/tmp/blog.log", 
              stderr => "/tmp/blog.err.log", 
              ubic_log => "/tmp/blog.ubic.log", 
              user => "username" );

 [1]: http://perlbrew.pl
 [2]: https://github.com/battlemidget/stokes-blog