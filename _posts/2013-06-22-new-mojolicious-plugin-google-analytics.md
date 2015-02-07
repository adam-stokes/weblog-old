---
title: 'New Mojolicious plugin: Google Analytics'
author: Adam Stokes
layout: post
permalink: /new-mojolicious-plugin-google-analytics/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
A new plugin up on cpan for making it easy to add your Google Analytics  
tracking code. 

To get started just include the plugin in your Mojolicious web application and  
use the builtin helper.<h3 id="installation">Installation</h3> 

      $ cpanm Mojolicious::Plugin::GoogleAnalytics
    <h3 id="example">Example</h3> 

      # Mojolicious
      $self-&#38;gt;plugin(&#39;GoogleAnalytics&#39;);
    
      # Mojolicious::Lite
      plugin &#39;GoogleAnalytics&#39;;
    
      # In your layout template just before closing head tag
      &#38;lt;%= analytics_inc &#39;UA-32432-1&#39; %&#38;gt;
    

Hopefully, that'll save some few extra lines of typing <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_biggrin.gif?w=720" alt=":D" class="wp-smiley" data-recalc-dims="1" />