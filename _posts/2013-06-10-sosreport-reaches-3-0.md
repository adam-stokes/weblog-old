---
title: SOSreport reaches 3.0
author: Adam Stokes
layout: post
permalink: /sosreport-reaches-3-0/
categories:
  - Coder
  - python
  - Ubuntu
  - "What's New"
tags:
  - linux
  - sosreport
  - Ubuntu
---
<h2 id="newrelease">New release!</h2> 

After what seems like the longest development cycle ever we've finally released  
sosreport 3.0.

Because of the lengthy development cycle I am just going to point you to the  
<a href="https://github.com/sosreport/sosreport/commits/master">commits</a> to see what  
changes were made. The most notable changes are:

  * Mult-distribution (Debian, Ubuntu, Fedora, RHEL)
  * Increase speed, roughly 2-3s for an average of 61 plugins tested against.
  * Cloud technologies included (but not limited too): 
      * openstack
      * juju
      * maas
      * openshift
      * azure
      * cloudforms
  * Cleaner codebase.

I've also uploaded sosreport to Debian archive and now just waiting on  
ftpmaster approval. Until then keep an eye out on my  
<a href="https://launchpad.net/~debugmonkeys/+archive/sosreport">ppa</a> for updates.

Thanks to everyone involved!