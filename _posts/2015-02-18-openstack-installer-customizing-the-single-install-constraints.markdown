---
layout: post
status: publish
published: true
title: 'OpenStack Installer: Customizing the Single Install constraints'
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 699
wordpress_url: http://astokes.org/?p=699
date: '2015-02-18 17:42:01 -0500'
date_gmt: '2015-02-18 21:42:01 -0500'
categories:
- What's New
- Ubuntu
- Openstack
- Installer
- SUPER
tags: []
---
<p>Sometimes our default constraints for a Single Installation isn't enough. With our latest release it is possible to now configure the service placements with custom constraints.</p>
<p>Below is a fully working config example that you can modify to suit your hardware:</p>
<pre class="lang:yaml decode:true " title="config.yaml">
install_type: Single
placements:
  controller:
    assignments:
      LXC:
      - nova-cloud-controller
      - glance
      - glance-simplestreams-sync
      - openstack-dashboard
      - juju-gui
      - keystone
      - mysql
      - neutron-api
      - neutron-openvswitch
      - rabbitmq-server
      - swift-proxy
    constraints:
      cpu-cores: 2
      mem: 6144
      root-disk: 20480
  nova-compute-machine-0:
    assignments:
      BareMetal:
      - nova-compute
    constraints:
      mem: 4096
      root-disk: 40960
  quantum-gateway-machine-0:
    assignments:
      BareMetal:
      - quantum-gateway
    constraints:
      mem: 2048
      root-disk: 20480
  swift-storage-machine-0:
    assignments:
      BareMetal:
      - swift-storage
    constraints: &id001 {}
  swift-storage-machine-1:
    assignments:
      BareMetal:
      - swift-storage
    constraints: *id001
  swift-storage-machine-2:
    assignments:
      BareMetal:
      - swift-storage
    constraints: *id001
</pre>
<p>Looking under the constraints for the <strong>controller</strong> you can expand on the disk storage, memory, and cpus that will be allocated to that service during deployment.</p>
<p>To make use of this config run:</p>
<pre>
$ sudo openstack-install -c config.yaml
</pre>
<p>It'll walk you through setting a password and selecting the Single install mode. Once the installer is to the point of deployment it'll automatically pickup your placements configuration and deploy based on those updated constraints.</p>
<p>Head over to <a href="http://ubuntu-cloud-installer.readthedocs.org/en/testing/single-installer.guide.html">Single installer guide</a> for more information. Also if you find bugs or have a feature request please check out our <a href="https://github.com/Ubuntu-Solutions-Engineering/openstack-installer">GitHub project</a>!</p>
