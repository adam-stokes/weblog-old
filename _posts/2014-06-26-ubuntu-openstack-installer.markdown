---
layout: post
status: publish
published: true
title: Ubuntu Openstack Installer
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 524
wordpress_url: http://astokes.org/?p=524
date: '2014-06-26 20:40:50 -0400'
date_gmt: '2014-06-27 00:40:50 -0400'
categories:
- What's New
- Ubuntu
- Openstack
- Installer
- SUPER
tags: []
---
<p>As the title suggests this little gem is an OpenStack installer tailored specifically to get you from zero to hero in just a short amount of time.</p>
<p>There are a few options available today for deploying an OpenStack cloud. For instance, <a href="http://pythonhosted.org/juju-deployer/">juju-deployer</a> with an OpenStack specific bundle or that other thing called <a href="http://devstack.org/">devstack</a>. While these technologies work we wanted to take our existing technologies and go a step further. A lot of people may not have 10 systems laying around to utilize juju-deployer or you may be wanting to demonstrate to the powers that be that implementing Ubuntu, Juju, MAAS, and OpenStack within your company is a great idea. Of course you could bring one of those shiny orange boxes or a handful of Intel NUCS into the conference room <em>or</em> ..</p>
<p>.. install the Ubuntu OpenStack Installer and get a cloud to play with on a single machine. Getting started is ez-pz.</p>
<h2>Requirements</h2>
<ul>
<li>Decent machine, tested on a machine with 8 cores, 12G ram, and 100G HDD.</li>
<li>Ubuntu Trusty 14.04</li>
<li>Juju 1.20.x (includes support for lxc fast cloning for multiple providers)</li>
<li>About 30 minutes of your time.</li>
</ul>
<h2>First</h2>
<p>Add the <strong>ppa</strong> and install the software.</p>
<pre><code>$ sudo apt-add-repository ppa:cloud-installer/testing
$ sudo apt-get update
$ sudo apt-get install openstack
</code></pre>
<h2>Second</h2>
<p>Run it.</p>
<pre><code>$ sudo openstack-install
</code></pre>
<p>You'll first be asked for an OpenStack password, this can be anything of your choosing and will be the password used throughout the rest of the install and also the password used for logging into various services (Horizon, Juju GUI, Landscape)</p>
<p>[caption id="attachment_655" align="aligncenter" width="281"]<a href="http://astokes.org/wp-content/uploads/2014/06/enter_openstack_password.png"><img class="size-medium wp-image-655" src="http://astokes.org/wp-content/uploads/2014/06/enter_openstack_password-281x300.png" alt="Enter your openstack password" width="281" height="300" /></a> Enter your openstack password[/caption]</p>
<h2>Third</h2>
<p>You're presented with 3 options, a <strong>Single</strong>, <strong>Multi</strong>, and <strong>Landscape OpenStack Autopilot</strong>. Select <strong>Single</strong>.</p>
<p>[caption id="attachment_656" align="aligncenter" width="281"]<a href="http://astokes.org/wp-content/uploads/2014/06/select_install_type.png"><img class="size-medium wp-image-656" src="http://astokes.org/wp-content/uploads/2014/06/select_install_type-281x300.png" alt="Select the installation type" width="281" height="300" /></a> Select the installation type[/caption]</p>
<h2>Post</h2>
<p>The installer will go through its little routine of installing necessary packages and setting up configuration. Once this is complete you'll be dropped into a <em>status screen</em> which will then begin the magical journey of getting you setup with a fully functioning OpenStack cloud.</p>
<h1>Is that all?</h1>
<p>Yep, to elaborate a bit I'll explain what's happening:</p>
<p>The entire stack is running off a single machine in a single <strong>LXC</strong> container. Having the deployment within a container allows for an undestructive way to test out a new OpenStack deployment as cleaning up is a matter of removing the container or uninstalling the <em>openstack</em> package. Juju is heavily utilized for its ability to deploy services, setup relations, and configure those services. Similar to what juju-deployer does. What juju-deployer doesn't do is automatically sync boot images via simplestreams or automatically configure neutron to have all deployed instances within nova-compute available on the same network as the host machine all while using a single network card. We even throw in <strong>juju-gui</strong> for good measure :D.</p>
<p>The experience we are trying to achieve is that any one person can sit down at a machine and have a complete end to end working Openstack environment. All while keeping your gray hair at a minimum and your budget intact. Heres a screenshot of our nifty console ui:</p>
<p>[caption id="attachment_662" align="aligncenter" width="282"]<a href="http://astokes.org/wp-content/uploads/2014/06/openstack_status_screen.png"><img class="size-medium wp-image-662" src="http://astokes.org/wp-content/uploads/2014/06/openstack_status_screen-282x300.png" alt="Fully deployed OpenStack cloud" width="282" height="300" /></a> Fully deployed OpenStack cloud[/caption]</p>
<h2>Verify</h2>
<p>Verifying your cloud is easy, just go through the process of deploying an instance via Horizon (Openstack Dashboard), associating a floating IP (already created for you just need to select one) and ssh into the newly created instance to deploy your software stack. Depending on bandwidth some images may not be immediately available and may require you to wait a little longer.</p>
<h2>What about those other install options?</h2>
<p>Well, as I stated before we have a lot of cool technologies out there like MAAS. That is what the <strong>Multi Install</strong> is for. The cool thing about this is you install it the same way you would a <strong>Single Install</strong>. Fast-forward past the package installing and to the status screen you'll be presented with a dialog stating to PXE boot a machine to act as the controller. Our installer tries to do everything for you but some things are left up to you. In this case you'd commission a machine in the MAAS environment and get it into a ready state. From there the Installer will pick up that machine and continue on its merry way as it did during the single installation.</p>
<p>One thing to note is you'll want to have a few machines whether it be bare metal or virtual registered in MAAS to make use of all the installer has to offer. I was able to get a full cloud deployed on 3 machines, 1 bare metal (the host machine running maas), 2 virtual machines registered in MAAS. Keep in mind there were no additional network devices added as the installer can configure neutron on a single NIC :)</p>
<h1>Where to go from here?</h1>
<p>If you need swift storage for your glance images hit <strong>(F6)</strong> in the status screen and select <strong>Swift storage</strong>. This will deploy the necessary bits for swift-storage to be integrated into your Openstack cloud. Swift storage requires at least 3 nodes (in the single install this would be 3 VMs) so make sure you've got the hardware for this. Otherwise, for developing/toying around with Openstack leaving the defaults works just as good.</p>
<p>[caption id="attachment_661" align="aligncenter" width="282"]<a href="http://astokes.org/wp-content/uploads/2014/06/add_units.png"><img class="size-medium wp-image-661" src="http://astokes.org/wp-content/uploads/2014/06/add_units-282x300.png" alt="Add units to your OpenStack Deployment" width="282" height="300" /></a> Add units to your OpenStack Deployment[/caption]</p>
<p>Want to deploy additional instances on your compute nodes? Add additional machines to your MAAS environment or if running on a single machine and you have the hardware add a few more nova-compute nodes (via <strong>F6</strong> in the status screen) to allow for more instances to be deployed within OpenStack.</p>
<p><strong>Additional screenshots</strong></p>
<p>[gallery type="slideshow" link="file" columns="2" ids="660,659,668,669,670,671,672,674,675"]</p>
<p>This is just an intro into the installer more documentation can be found @ <a href="http://ubuntu-cloud-installer.readthedocs.org/en/latest/index.html">ReadTheDocs</a>. The project is hosted @ <a href="https://github.com/Ubuntu-Solutions-Engineering/cloud-installer">GitHub</a> and we definitely encourage you to star it, fork it, file issues, and contribute back to make this a truly enjoyable experience. If you need help please come talk to us on IRC @ freenode.net/#ubuntu-solutions.</p>
