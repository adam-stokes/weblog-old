---
layout: post
status: publish
published: true
title: Configuring VLANs in MAAS node deployment
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 366
wordpress_url: http://astokes.org/?p=366
date: '2013-10-07 22:55:26 -0400'
date_gmt: '2013-10-08 02:55:26 -0400'
categories:
- What's New
- Ubuntu
- Cloud
- maas
- Debian
- Installer
tags:
- Ubuntu
- maas
- preseed
- di
- debian installer
- bare metal
- fastpath
---
<p>Since Debian installer doesn't have the ability to configure <a href="http://en.wikipedia.org/wiki/Virtual_LAN">vlans</a> we need to make any additional network modifications within the <code>preseed/late_command</code> stage. If you aren't familiar with vlan or would like some more details on setting it up take a look at <a href="https://wiki.ubuntu.com/vlan">Ubuntu vlan wiki page</a>. Also I don't have the hardware to test the actual switching so hopefully someone will read this and let me know what I've missed. I checked into <a href="http://www.gns3.net/">gns3</a> but it is my understanding it would be impossible to emulate the switching that Cisco hardware would.</p>
<h2>Assumptions</h2>
<p>Yea assumptions are baad, however, this article assumes you have an interface <code>eth0</code> that supports vlan tagging (802.1q) and that a hardware switch exists that has been configured for vlans.</p>
<h2>Preseed naming conventions in MAAS</h2>
<p>The order in which <a href="http://maas.ubuntu.com">MAAS</a> loads a preseed file is seen below:</p>
<pre><code>{prefix}_{node_architecture}_{node_subarchitecture}_{release}_{node_name}
{prefix}_{node_architecture}_{node_subarchitecture}_{release}
{prefix}_{node_architecture}_{node_subarchitecture}
{prefix}_{node_architecture}
{prefix}
'generic'
</code></pre>
<blockquote>
<h3>Note:</h3>
<p>If you wish to keep your distro provided preseeds in-tact and use an alternative you could always name a new preseed with something like <code>amd64_generic_precise</code> and when deploying your nodes with the precise image it would pick up that preseed instead of <code>generic</code>. More information at <strong><a href="http://maas.ubuntu.com/docs/development/preseeds.html">How preseeds work</a></strong></p>
</blockquote>
<h2>Modifying the preseeds for vlan support</h2>
<p>The preseeds are located within <code>/etc/maas/preseeds</code>. For now the only preseed files we are concerned with is <code>preseed_master</code> and <code>generic</code>.</p>
<p>Opening up <code>preseed_master</code> we see a typical preseed configuration and scrolling to the bottom you'll see:</p>
<pre><code># Post scripts.
{{self.post_scripts}}
</code></pre>
<p>This method is exposed as part of the <a href="http://pythonpaste.org/tempita/">Tempita</a> template engine which we'll see defined in our <code>generic</code> template next.</p>
<p>Opening <code>generic</code> template we'll see something like the below:</p>
<pre><code>{{inherit "preseed_master"}}

{{def proxy}}
d-i     mirror/country string manual
d-i     mirror/http/hostname string {{ports_archive_hostname}}
d-i     mirror/http/directory string {{ports_archive_directory}}
{{if http_proxy }}
d-i     mirror/http/proxy string {{http_proxy}}
{{else}}
d-i     mirror/http/proxy string http://{{server_host}}:8000/
{{endif}}
{{enddef}}

{{def client_packages}}
d-i     pkgsel/include string cloud-init openssh-server python-software-properties vim avahi-daemon server^
{{enddef}}

{{def preseed}}
{{preseed_data}}
{{enddef}}

{{def post_scripts}}
# Executes late command and disables PXE.
d-i     preseed/late_command string true &amp;&amp; \
    in-target sh -c 'f=$1; shift; echo $0 &gt; $f &amp;&amp; chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas &amp;&amp; \
    in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null &amp;&amp; \
    true
{{enddef}}
</code></pre>
<p>Most of this should be self explanatory as this basically outlines the typical usage of most template engines. We <code>inherit 'preseed_master'</code> which calls <code>self</code> and we provide our method definitions with <code>{{def &lt;method&gt;}}</code>. Scroll down your <code>generic</code> preseed file and locate <code>{{def post_scripts}}</code>.</p>
<p>This definition is what's called from our <code>preseed_master</code> configuration and where we'll add our vlan options. We'll make a call out to a <code>vlansetup</code> file hosted on the same server as maas, usually found in <code>/var/www/</code>.</p>
<pre><code>{{def post_scripts}}
# Executes late command and disables PXE.
d-i     preseed/late_command string true &amp;&amp; \
    in-target sh -c 'f=$1; shift; echo $0 &gt; $f &amp;&amp; chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas &amp;&amp; \
    in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null &amp;&amp; \
    wget -O /tmp/vlansetup http://192.168.122.206/vlansetup &amp;&amp; \
    chmod +x /tmp/vlansetup &amp;&amp; \
    sh -x /tmp/vlansetup &amp;&amp; \
    rm -f /tmp/vlansetup &amp;&amp; \
    true
{{enddef}}
</code></pre>
<p>Our <code>vlansetup</code> file would look something like</p>
<pre><code>#!/bin/sh
/bin/apt-install vlan
echo "8021q" &gt;&gt; /target/etc/modules
cat &gt;&gt;/target/etc/network/interfaces&lt;&lt;EOF
auto vlan5
auto vlan100
iface vlan5 inet static
  address 10.0.0.18
  netmask 255.255.255.0
  vlan-raw-device eth0
iface vlan100 inet static
  address 192.168.66.118
  netmask 255.255.255.0
  vlan-raw-device eth0
EOF
</code></pre>
<p>After the node is deployed you should see something like the following in your syslog output.</p>
<pre><code>Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
Added VLAN with VID == 5 to IF -:eth0:-
Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
Added VLAN with VID == 100 to IF -:eth0:-
</code></pre>
<p>And <code>/proc/net/vlan/config</code> should look like</p>
<pre><code>ubuntu@node1:~$ sudo cat /proc/net/vlan/config 
VLAN Dev name    | VLAN ID
Name-Type: VLAN_NAME_TYPE_PLUS_VID_NO_PAD
vlan5          | 5  | eth0
vlan100        | 100  | eth0
</code></pre>
<p>Last but not least <code>ifconfig</code> reports</p>
<pre><code>eth0      Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:192.168.122.144  Bcast:192.168.122.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:148 errors:0 dropped:0 overruns:0 frame:0
          TX packets:227 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:20214 (20.2 KB)  TX bytes:34006 (34.0 KB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:0 (0.0 B)

vlan5     Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:10.0.0.18  Bcast:10.0.0.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:40 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:6600 (6.6 KB)

vlan100   Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
          inet addr:192.168.66.118  Bcast:192.168.66.255  Mask:255.255.255.0
          inet6 addr: fe80::5054:ff:fe2a:37ac/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:38 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 B)  TX bytes:6324 (6.3 KB)
</code></pre>
<h2>Thoughts</h2>
<p>Of course this could be seen as a hindrance if you have an environment more complex than just assigning vlan tags to <code>eth0</code>. Automating the assignment of vlan's is probably best done within the installer, however, that feature doesn't exist. Some things that could be done to lessen the administrative burden would be making use of puppet on the MAAS server and pre-populating the <code>/etc/maas/preseeds/generic</code> file.</p>
<h2>Cool tips</h2>
<p>If you are running your MAAS instance and nodes within KVM/VirtualBox/etc you could easily pull the IP from the virtual machine if you know the MAC address using something like <code>arp -an</code>. Then either setup puppet to keep your preseeds updated or utilize something like <a href="http://libguestfs.org/">libguestfs</a> to make changes directly within the VM.</p>
<h2>Troubleshooting</h2>
<p>Installing this on a desktop image with NetworkManager running (first ask yourself why)? Then <a href="http://askubuntu.com/questions/199254/802-1q-vlan-interface-configuration-on-ubuntu-12-04-desktop">see this post</a> for a solution to configuring NetworkManager and vlan's.</p>
