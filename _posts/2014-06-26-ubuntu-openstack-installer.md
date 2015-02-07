---
title: Ubuntu Openstack Installer
author: Adam Stokes
layout: post
permalink: /ubuntu-openstack-installer/
external_references:
  - 
internal_research_notes:
  - 
dsq_thread_id:
  - 2798259513
categories:
  - Installer
  - Openstack
  - SUPER
  - Ubuntu
  - "What's New"
---
As the title suggests this little gem is an OpenStack installer tailored specifically to get you from zero to hero in just a short amount of time.

There are a few options available today for deploying an OpenStack cloud. For instance, [juju-deployer][1] with an OpenStack specific bundle or that other thing called [devstack][2]. While these technologies work we wanted to take our existing technologies and go a step further. A lot of people may not have 10 systems laying around to utilize juju-deployer or you may be wanting to demonstrate to the powers that be that implementing Ubuntu, Juju, MAAS, and OpenStack within your company is a great idea. Of course you could bring one of those shiny orange boxes or a handful of Intel NUCS into the conference room *or* ..

.. install the Ubuntu OpenStack Installer and get a cloud to play with on a single machine. Getting started is ez-pz.

## Requirements

  * Decent machine, tested on a machine with 8 cores, 12G ram, and 100G HDD.
  * Ubuntu Trusty 14.04
  * Juju 1.20.x (includes support for lxc fast cloning for multiple providers)
  * About 30 minutes of your time.

## First

Add the **ppa** and install the software.

    $ sudo apt-add-repository ppa:cloud-installer/testing
    $ sudo apt-get update
    $ sudo apt-get install openstack
    

## Second

Run it.

    $ sudo openstack-install
    

You&#8217;ll first be asked for an OpenStack password, this can be anything of your choosing and will be the password used throughout the rest of the install and also the password used for logging into various services (Horizon, Juju GUI, Landscape)

<div id="attachment_655" style="width: 291px" class="wp-caption aligncenter">
  <a href="http://i0.wp.com/astokes.org/wp-content/uploads/2014/06/enter_openstack_password.png"><img class="size-medium wp-image-655" src="http://i2.wp.com/astokes.org/wp-content/uploads/2014/06/enter_openstack_password-281x300.png?fit=281%2C300" alt="Enter your openstack password" data-recalc-dims="1" /></a>
  
  <p class="wp-caption-text">
    Enter your openstack password
  </p>
</div>

## Third

You&#8217;re presented with 3 options, a **Single**, **Multi**, and **Landscape OpenStack Autopilot**. Select **Single**.

<div id="attachment_656" style="width: 291px" class="wp-caption aligncenter">
  <a href="http://i2.wp.com/astokes.org/wp-content/uploads/2014/06/select_install_type.png"><img class="size-medium wp-image-656" src="http://i2.wp.com/astokes.org/wp-content/uploads/2014/06/select_install_type-281x300.png?fit=281%2C300" alt="Select the installation type" data-recalc-dims="1" /></a>
  
  <p class="wp-caption-text">
    Select the installation type
  </p>
</div>

## Post

The installer will go through its little routine of installing necessary packages and setting up configuration. Once this is complete you&#8217;ll be dropped into a *status screen* which will then begin the magical journey of getting you setup with a fully functioning OpenStack cloud.

# Is that all?

Yep, to elaborate a bit I&#8217;ll explain what&#8217;s happening:

The entire stack is running off a single machine in a single **LXC** container. Having the deployment within a container allows for an undestructive way to test out a new OpenStack deployment as cleaning up is a matter of removing the container or uninstalling the *openstack* package. Juju is heavily utilized for its ability to deploy services, setup relations, and configure those services. Similar to what juju-deployer does. What juju-deployer doesn&#8217;t do is automatically sync boot images via simplestreams or automatically configure neutron to have all deployed instances within nova-compute available on the same network as the host machine all while using a single network card. We even throw in **juju-gui** for good measure :D.

The experience we are trying to achieve is that any one person can sit down at a machine and have a complete end to end working Openstack environment. All while keeping your gray hair at a minimum and your budget intact. Heres a screenshot of our nifty console ui:

<div id="attachment_662" style="width: 292px" class="wp-caption aligncenter">
  <a href="http://i2.wp.com/astokes.org/wp-content/uploads/2014/06/openstack_status_screen.png"><img class="size-medium wp-image-662" src="http://i2.wp.com/astokes.org/wp-content/uploads/2014/06/openstack_status_screen-282x300.png?fit=282%2C300" alt="Fully deployed OpenStack cloud" data-recalc-dims="1" /></a>
  
  <p class="wp-caption-text">
    Fully deployed OpenStack cloud
  </p>
</div>

## Verify

Verifying your cloud is easy, just go through the process of deploying an instance via Horizon (Openstack Dashboard), associating a floating IP (already created for you just need to select one) and ssh into the newly created instance to deploy your software stack. Depending on bandwidth some images may not be immediately available and may require you to wait a little longer.

## What about those other install options?

Well, as I stated before we have a lot of cool technologies out there like MAAS. That is what the **Multi Install** is for. The cool thing about this is you install it the same way you would a **Single Install**. Fast-forward past the package installing and to the status screen you&#8217;ll be presented with a dialog stating to PXE boot a machine to act as the controller. Our installer tries to do everything for you but some things are left up to you. In this case you&#8217;d commission a machine in the MAAS environment and get it into a ready state. From there the Installer will pick up that machine and continue on its merry way as it did during the single installation.

One thing to note is you&#8217;ll want to have a few machines whether it be bare metal or virtual registered in MAAS to make use of all the installer has to offer. I was able to get a full cloud deployed on 3 machines, 1 bare metal (the host machine running maas), 2 virtual machines registered in MAAS. Keep in mind there were no additional network devices added as the installer can configure neutron on a single NIC <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" />

# Where to go from here?

If you need swift storage for your glance images hit **(F6)** in the status screen and select **Swift storage**. This will deploy the necessary bits for swift-storage to be integrated into your Openstack cloud. Swift storage requires at least 3 nodes (in the single install this would be 3 VMs) so make sure you&#8217;ve got the hardware for this. Otherwise, for developing/toying around with Openstack leaving the defaults works just as good.

<div id="attachment_661" style="width: 292px" class="wp-caption aligncenter">
  <a href="http://i0.wp.com/astokes.org/wp-content/uploads/2014/06/add_units.png"><img class="size-medium wp-image-661" src="http://i0.wp.com/astokes.org/wp-content/uploads/2014/06/add_units-282x300.png?fit=282%2C300" alt="Add units to your OpenStack Deployment" data-recalc-dims="1" /></a>
  
  <p class="wp-caption-text">
    Add units to your OpenStack Deployment
  </p>
</div>

Want to deploy additional instances on your compute nodes? Add additional machines to your MAAS environment or if running on a single machine and you have the hardware add a few more nova-compute nodes (via **F6** in the status screen) to allow for more instances to be deployed within OpenStack.

**Additional screenshots**

<p class="jetpack-slideshow-noscript robots-nocontent">
  This slideshow requires JavaScript.
</p>

<div id="gallery-524-1-slideshow" class="slideshow-window jetpack-slideshow slideshow-black" data-width="680" data-height="410" data-trans="fade" data-gallery="[{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/juju_gui_machines.png&quot;,&quot;id&quot;:&quot;660&quot;,&quot;title&quot;:&quot;juju_gui_machines&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Juju GUI Machines&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/juju_gui_services.png&quot;,&quot;id&quot;:&quot;659&quot;,&quot;title&quot;:&quot;juju_gui_services&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Juju GUI Services&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_1.png&quot;,&quot;id&quot;:&quot;668&quot;,&quot;title&quot;:&quot;horizon_instance_1&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Glance Image&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_5.png&quot;,&quot;id&quot;:&quot;669&quot;,&quot;title&quot;:&quot;horizon_instance_5&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Compute Instance&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_4.png&quot;,&quot;id&quot;:&quot;670&quot;,&quot;title&quot;:&quot;horizon_instance_4&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Associate Floating IP&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_3.png&quot;,&quot;id&quot;:&quot;671&quot;,&quot;title&quot;:&quot;horizon_instance_3&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Compute network association&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_2.png&quot;,&quot;id&quot;:&quot;672&quot;,&quot;title&quot;:&quot;horizon_instance_2&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Compute Security&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_6.png&quot;,&quot;id&quot;:&quot;674&quot;,&quot;title&quot;:&quot;horizon_instance_6&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Compute Log&quot;},{&quot;src&quot;:&quot;http:\/\/astokes.org\/wp-content\/uploads\/2014\/06\/horizon_instance_7.png&quot;,&quot;id&quot;:&quot;675&quot;,&quot;title&quot;:&quot;horizon_instance_7&quot;,&quot;alt&quot;:&quot;&quot;,&quot;caption&quot;:&quot;Compute Dashboard&quot;}]">
</div>

This is just an intro into the installer more documentation can be found @ [ReadTheDocs][3]. The project is hosted @ [GitHub][4] and we definitely encourage you to star it, fork it, file issues, and contribute back to make this a truly enjoyable experience. If you need help please come talk to us on IRC @ freenode.net/#ubuntu-solutions.

 [1]: http://pythonhosted.org/juju-deployer/
 [2]: http://devstack.org/
 [3]: http://ubuntu-cloud-installer.readthedocs.org/en/latest/index.html
 [4]: https://github.com/Ubuntu-Solutions-Engineering/cloud-installer