---
title: Simple way to get wordpress going in vagrant
author: Adam Stokes
layout: post
permalink: /simple-way-to-get-wordpress-going-in-vagrant/
categories:
  - "What's New"
---
Im working on some wordpress stuff recently and realized how much I dislike  
setting up php development environments. Specifically anything prior to php 5.4  
because of the lack of a built in web server.

I decided at this point it is a good time to invest some time into <a href="http://vagrantup.com">vagrant</a> and  
attempt to get a more tolerable way of hacking on anything php. I managed to  
come across a <a href="https://github.com/chad-thompson/vagrantpress">github project</a> that allows me to setup a vagrant session and have  
wordpress installed and configured with no fuss.

Fortunately, the developer is receptive to pull requests and merged a few of my  
additions to make this project a great way to get started with wordpress  
easily.

Here are the simple steps to getting a wordpress development environment setup  
in Ubuntu Precise (12.04) and on your way to hacking a new exciting plugin <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" />

First install VirtualBox<pre class="prettyprint"> $ sudo apt-get install virtualbox </pre> 

Install <a href="http://vagrantup.com">vagrant</a> from their site. Once that is done follow the next steps to  
get up and running.<pre class="prettyprint"> $ git clone https://github.com/chad-thompson/vagrantpress.git $ cd vagrantpress $ vagrant up </pre> 

You can view your wordpress installation at <pre class="prettyprint"> http://localhost:8080/wordpress # or for a more fqdn approach http://lvh.me:8080/wordpress </pre>