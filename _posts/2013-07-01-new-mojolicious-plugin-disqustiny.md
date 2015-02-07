---
title: 'New Mojolicious plugin &#8211; Disqus::Tiny'
author: Adam Stokes
layout: post
permalink: /new-mojolicious-plugin-disqustiny/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
Another small plugin for easing inclusion of socially enabled software. This  
plugin only concentrates on including the necessary javascript code to get  
comments enabled on your blog or web app.  
<a href="https://metacpan.org/module/Mojolicious::Plugin::Disqus">Mojolicious::Plugin::Disqus</a> gives you more control over the api if you need  
more options.

A quick example on setting up your disqus forum on a mojolicious app:

      #!/usr/bin/env perl
      use Mojolicious::Lite;
    
      plugin &#39;Disqus::Tiny&#39;;
    
      get &#39;/&#39; =&#38;gt; sub {
        my $self = shift;
        $self-&#38;gt;render(&#39;index&#39;);
      };
    
      app-&#38;gt;start;
      __DATA__
    
      @@ index.html.ep
      Welcome to the Mojolicious real-time web framework!
    
      &#38;lt;%= disqus_inc &#39;astokes&#39; %&#38;gt;
    

You can find the module on <a href="https://metacpan.org/module/Mojolicious::Plugin::Disqus::Tiny">cpan</a> and code repository on <a href="https://github.com/battlemidget/Mojolicious-Plugin-Disqus-Tiny">github</a>.