---
title: 'blagger &#8211; perl blogging software'
author: Adam Stokes
layout: post
permalink: /blagger-perl-blogging-software/
categories:
  - Coder
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - library
---
I was using octopress for awhile but I still have mixed feelings about  
ruby. There isn't anything wrong with ruby, but, as the creator of  
ruby said "its how you feel when writing in a language" and I don't  
think me and ruby are on the same page.

I started looking around for a simple one file blogging system with  
minimal dependencies and could be extended easily. I attempted to  
write my own with using a cpan package called fatpacker. The idea  
behind it is cool, however, I couldn't get it to fully work with the  
modules I needed. I scratched that project the first day and just  
happened to stumble across <a href="https://github.com/avenj/blagger">blagger</a>. It is relatively new and  
doesn't have a lot of features (which I believe was the authors  
point).

What got me interested was it is written in Perl, easy to hack on, and  
has a small amount of dependencies. It uses Mojolicious as a web  
framework which allowed me to put all code and templates within the  
blagger file. The code itself is well written and allowed me to get up  
to speed on the design quickly.

I've converted my current blog to <a href="https://github.com/battlemidget/blagger">blagger with my own  
modifications</a>. Some additional features include:

  * Categories
  * RSS Feeds for /*/:category/atom.xml and the root path for all  
    articles.
  * Generates posts with YYYY/MM/DD prepended (keeps everything in a  
    good order)
  * Gravatar support (elementary, could stand to use something other  
    than hard coded urls :))

Some things I plan on adding

  * gist support
  * syntax highlighter

I don't plan on adding much more than the bare minimum for someone who  
writes about coding projects and an occasional rant. Patches are  
definately welcomed.