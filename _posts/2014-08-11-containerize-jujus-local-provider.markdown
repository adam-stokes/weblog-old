---
layout: post
status: publish
published: true
title: Containerize juju's local provider
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 573
wordpress_url: http://astokes.org/?p=573
date: '2014-08-11 19:05:40 -0400'
date_gmt: '2014-08-11 23:05:40 -0400'
categories:
- What's New
- Ubuntu
- Software
- juju
- Openstack
tags: []
---
<h2>Current approach</h2>
<p>Juju's existing providers(except manual) do not allow you to containerize the bootstrap node. However, in the manual provider this is possible using something like this in your <strong>environments.yaml</strong> file and setting the <strong>boostrap-host</strong> appropriately:</p>
<pre><code>## https://juju.ubuntu.com/docs/config-manual.html
manual:
    type: manual
    # bootstrap-host holds the host name of the machine where the
    # bootstrap machine agent will be started.org
    bootstrap-host: somehost.example.com
    # bootstrap-user specifies the user to authenticate as when
    # connecting to the bootstrap machine. If defaults to
    # the current user.
    # bootstrap-user: joebloggs
    # storage-listen-ip specifies the IP address that the
    # bootstrap machine's Juju storage server will listen
    # on. By default, storage will be served on all
    # network interfaces.
    # storage-listen-ip:
    # storage-port specifes the TCP port that the
    # bootstrap machine's Juju storage server will listen
    # on. It defaults to 8040
    # storage-port: 8040
</code></pre>
<p>Cool, that will allow me to bootstrap juju on something other than my host machine. But, that machine needs to be configured appropriately for a non-interactive deployment (setting ssh keys, passwordless sudo, etc).</p>
<h2>A different approach</h2>
<p>In my particular case we wanted our Openstack Installer to be fully containerized from juju bootstrap to deploying of compute nodes. In order to achieve this we need to configure an existing container to be our bootstrap agent <strong>and</strong> still allow for our mixture of kvm/lxc environments for use within the Openstack deployment.</p>
<h3>Walkthrough</h3>
<p>Create a container named <strong>joojoo</strong> that will be used as our Juju bootstrap agent:</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-create -t ubuntu -n joojoo
</code></pre>
<p>Update the container's <strong>lxcbr0</strong> to be on its own network:</p>
<pre><code>ubuntu@fluffy:~$ cat >>-EOF | sudo tee /var/lib/lxc/joojoo/rootfs/etc/default/lxc-net
USE_LXC_BRIDGE="true"
LXC_BRIDGE="lxcbr0"
LXC_ADDR="10.0.4.1"
LXC_NETMASK="255.255.255.0"
LXC_NETWORK="10.0.4.0/24"
LXC_DHCP_RANGE="10.0.4.2,10.0.4.254"
LXC_DHCP_MAX="253"
EOF
</code></pre>
<p>Create the necessary character files for kvm support within lxc via <code>mknod</code>, also persist them through reboots.</p>
<pre><code>ubuntu@fluffy:~$ cat >>-EOF | sudo tee /var/lib/lxc/joojoo/rootfs/etc/rc.local
#!/bin/sh
mkdir -p /dev/net || true
mknod /dev/kvm c 10 232
mknod /dev/net/tun c 10 200
exit 0
EOF
</code></pre>
<p>Start the container</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-start -n joojoo -d
</code></pre>
<p>Pre-install libvirt and uvtools</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- apt-get update
ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- apt-get install -qyf \
    libvirt-bin uvtool uvtool-libvirt software-properties-common
</code></pre>
<p>Make sure our <strong>ubuntu</strong> user has the correct <code>libvirtd</code> group associated</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-attach -n joojoo -- usermod -a -G libvirtd ubuntu
</code></pre>
<h3>Now that you have a containerized environment ready for Juju, lets test!</h3>
<p>The LXC container should now be ready for a juju deployment. Lets use our Openstack Cloud Installer to test this setup. I want to make sure everything deploys into its appropriate containers/kvm instances and that I can still access the Horizon dashboard to deploy a compute instance.</p>
<p>First, ssh into your container, you can get the IP with the <code>lxc-ls -f</code> command:</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-ls -f joojoo
NAME    STATE    IPV4       IPV6  AUTOSTART
-------------------------------------------
joojoo  RUNNING  10.0.3.3   -     NO

ubuntu@fluffy:~$ ssh ubuntu@10.0.3.3
</code></pre>
<p>Within the container add our PPA and perform the installation:</p>
<pre><code>ubuntu@joojoo:~$ sudo apt-add-repository ppa:cloud-installer/experimental
ubuntu@joojoo:~$ sudo apt-add-repository ppa:juju/stable
ubuntu@joojoo:~$ sudo apt update && sudo apt install cloud-installer
ubuntu@joojoo:~$ sudo cloud-install
</code></pre>
<p><strong>Note</strong> I'm using our experimental PPA for Openstack Cloud Installer which will be our next major release and will automate the previous steps for putting juju within a container.</p>
<p>This test I'm using the <strong>Single Install</strong> method, so select that and enter a Openstack password of your choice. Now sit back and wait for the installation to finish.</p>
<h3>Recap</h3>
<p>First we created a LXC container to be used as our <strong>entry point</strong> for juju to bootstrap itself too. This required some configuration changes to how the container will handle bridged connections along with making sure the character devices required by KVM are available.</p>
<p>Next we installed some pre-requisites for libvirt and uvtools.</p>
<p>From there we login to the newly created container, install, and run the Openstack Cloud Installer. This will install juju-core and lxc as dependencies along with automatically configuring lxc-net with our predefined <code>lxc-net</code> template, seen in the latest <code>lxc-ls</code> output (showing eth0, lxcbr0, and virbr0):</p>
<pre><code>ubuntu@fluffy:~$ sudo lxc-ls -f
NAME    STATE    IPV4                               IPV6  AUTOSTART  
-------------------------------------------------------------------
joojoo  RUNNING  10.0.3.3, 10.0.4.1, 192.168.122.1  -     NO
</code></pre>
<p>Once the installer is finished we verify that our LXC container was able to facilitate the deployment of services in both LXC (nested) and KVM (also nested within LXC).</p>
<p>It's a long list so here is the <a href="http://paste.ubuntu.com/8021230/">pastebin</a>. What you'll notice is that all machines/services are now bound to the 10.0.4.x network which is what was defined in the <code>lxc-net</code> configuration above. We have KVM's running within our host container which also houses containers for the Openstack deployment.</p>
<p>Just to give a more visual representation of the setup:</p>
<pre><code>Baremetal Machine
- LXC Container
  - Runs juju bootstrap agent
  - KVM (machine 1)
    - Houses a bunch of LXC's for the openstack services
  - KVM (machine 2)
    - Houses nova-compute
  - KVM (machine 3)
    - Houses quantum-gateway
</code></pre>
<h3>Why is this a good thing?</h3>
<pre><code>ubuntu@fluffy:~$ sudo lxc-stop -n joojoo
ubuntu@fluffy:~$ sudo lxc-destroy -n joojoo
</code></pre>
<p>And it's like it never happened ...</p>
<h2>Acknowledgements</h2>
<p>Thanks to a colleague, <a href="http://voices.canonical.com/robert.ayres/">Robert Ayres</a>, who provided the necessary information for getting KVM to run within an LXC container.</p>
