---
title: 'Ubuntu Openstack Installer &#8211; upcoming ui enhancements'
author: Adam Stokes
layout: post
permalink: /ubuntu-openstack-installer-upcoming-ui-enhancements/
external_references:
  - 
internal_research_notes:
  - 
dsq_thread_id:
  - 2890799795
categories:
  - Installer
  - juju
  - maas
  - Openstack
  - python
  - "What's New"
---
In our next release of the Openstack Installer we concentrated on some visual improvements. Here are a few screenshots of some of those changes:

We&#8217;ve enhanced feedback of what&#8217;s happening during the installation phase:

[<img src="http://i0.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-015843-300x16.png?fit=300%2C16" alt="Statusbar updates" class="aligncenter size-medium wp-image-556" data-recalc-dims="1" />][1]

Services are now being displayed as deployment occurs rather than waiting until completion:

[<img src="http://i0.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-020917-300x223.png?fit=300%2C223" alt="Mid install" class="aligncenter size-medium wp-image-559" data-recalc-dims="1" />][2]

An added help screen to provide more insight into the installer:

[<img src="http://i2.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021729-300x223.png?fit=300%2C223" alt="Help screen" class="aligncenter size-medium wp-image-562" data-recalc-dims="1" />][3]

We decided to keep it more Openstack focused when listing the running services, this is the final view with all components deployed:

[<img src="http://i1.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021507-300x223.png?fit=300%2C223" alt="Final deploy screen" class="aligncenter size-medium wp-image-561" data-recalc-dims="1" />][4]

And if you don&#8217;t care about the UI (why wouldn&#8217;t you?!?) there is an added option to run the entire deployment in your console:

[<img src="http://i2.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-022056-300x196.png?fit=300%2C196" alt="Console Install" class="aligncenter size-medium wp-image-564" data-recalc-dims="1" />][5]

We&#8217;ve still got some more polishing to do and a few more enhancements to add, so keep your eye out for a future announcement!

If you are interested in helping us out head over to [the installer github page][6] and have a look, the experimental branch is the code used when generating these screenshots. Some of our immediate needs are end to end testing of the single and multi installer, extending the guides, and feedback on the UI itself.

 [1]: http://i1.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-015843.png
 [2]: http://i1.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-020917.png
 [3]: http://i0.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021729.png
 [4]: http://i1.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-021507.png
 [5]: http://i0.wp.com/astokes.org/wp-content/uploads/2014/08/Screenshot-from-2014-08-01-022056.png
 [6]: https://github.com/Ubuntu-Solutions-Engineering/cloud-installer