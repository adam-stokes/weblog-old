---
layout: post
status: publish
published: true
title: Ubuntu Openstack Installer - upcoming ui enhancements
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 553
wordpress_url: http://astokes.org/?p=553
date: '2014-08-01 02:34:43 -0400'
date_gmt: '2014-08-01 06:34:43 -0400'
categories:
- What's New
- python
- juju
- maas
- Openstack
- Installer
tags: []
---
<p>In our next release of the Openstack Installer we concentrated on some visual improvements. Here are a few screenshots of some of those changes:</p>
<p>We've enhanced feedback of what's happening during the installation phase:</p>
<p><a href="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-015843.png"><img src="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-015843-300x16.png" alt="Statusbar updates" width="300" height="16" class="aligncenter size-medium wp-image-556" /></a></p>
<p>Services are now being displayed as deployment occurs rather than waiting until completion:</p>
<p><a href="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-020917.png"><img src="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-020917-300x223.png" alt="Mid install" width="300" height="223" class="aligncenter size-medium wp-image-559" /></a></p>
<p>An added help screen to provide more insight into the installer:</p>
<p><a href="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021729.png"><img src="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021729-300x223.png" alt="Help screen" width="300" height="223" class="aligncenter size-medium wp-image-562" /></a></p>
<p>We decided to keep it more Openstack focused when listing the running services, this is the final view with all components deployed:</p>
<p><a href="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021507.png"><img src="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021507-300x223.png" alt="Final deploy screen" width="300" height="223" class="aligncenter size-medium wp-image-561" /></a></p>
<p>And if you don't care about the UI (why wouldn't you?!?) there is an added option to run the entire deployment in your console:</p>
<p><a href="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-022056.png"><img src="http://astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-022056-300x196.png" alt="Console Install" width="300" height="196" class="aligncenter size-medium wp-image-564" /></a></p>
<p>We've still got some more polishing to do and a few more enhancements to add, so keep your eye out for a future announcement!</p>
<p>If you are interested in helping us out head over to <a href="https://github.com/Ubuntu-Solutions-Engineering/cloud-installer">the installer github page</a> and have a look, the experimental branch is the code used when generating these screenshots. Some of our immediate needs are end to end testing of the single and multi installer, extending the guides, and feedback on the UI itself.</p>
