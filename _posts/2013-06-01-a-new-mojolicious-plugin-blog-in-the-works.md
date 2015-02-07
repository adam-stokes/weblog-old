---
title: A new Mojolicious Plugin Blog in the works
author: Adam Stokes
layout: post
permalink: /a-new-mojolicious-plugin-blog-in-the-works/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
New plugin in the works to integrate a simple blogging system as a plugin for  
<a href="http://mojolicio.us">Mojolicious</a>.

So far it supports most relational databases through DBIx::Connector and  
support for some social networks are coming soon.

Getting it going is straightforward a simple Mojolicious lite_app with a blog  
can be done in as a little as a few lines.<h3 id="example">Example</h3> <pre class="prettyprint"> # Set authentication condition my $conditions = { authenticated => sub { my $self = shift; unless ($self->session('authenticated')) { $self->flash( class => 'alert alert-info', message => 'Please log in first!' ); $self->redirect_to('/login'); return; } return 1; }, }; # Mojolicious full $self->plugin('Blog' => { authCondition => $conditions dsn => "dbi:Pg:dbname=myblog", dbuser => 'zef', dbpass => 'letmein', } ); # Mojolicious::Lite plugin 'Blog' => { authCondition => $conditions, dsn => "dbi:Pg:dbname=myblog", dbuser => 'zef', dbpass => 'letmein', }; </pre> 

Support for user authentication is handled through an **authCondition** and  
a routing bridge. Community contributions is always welcomed and you can visit  
the <a href="https://github.com/battlemidget/Mojolicious-Plugin-Blog">Project Page</a> to  
find out more.

Some immediate future plans are to integrate disqus comments, twitter activity,  
and cross posting to sites like <a href="https://coderwall.com">coderwall</a> and gravatar  
support.