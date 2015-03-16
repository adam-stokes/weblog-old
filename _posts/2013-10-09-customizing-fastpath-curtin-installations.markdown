---
layout: post
status: publish
published: true
title: Customizing fastpath (curtin) installations in MAAS
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 424
wordpress_url: http://astokes.org/?p=424
date: '2013-10-09 18:49:09 -0400'
date_gmt: '2013-10-09 22:49:09 -0400'
categories:
- What's New
- Ubuntu
- python
- maas
tags:
- python
- maas
- fastpath
- curtin
---
<p>Working off my previous entry about <strong><a href="http://astokes.org/using-fastpath-installer-maas/">using fastpath installer in MAAS</a></strong> I decided to dig a little deeper into customizing those installations a bit. One thing to note is <a href="http://launchpad.net/curtin">fastpath(curtin/curt installer)</a> installations do not follow the same guidelines that are used in preseed files for Debian installer. Some overview documentation of <a href="http://bazaar.launchpad.net/~curtin-dev/curtin/trunk/view/head:/doc/topics/overview.rst">fastpath can be located here</a> and thanks to <a href="http://ubuntu-smoser.blogspot.com/">Scott Moser</a> we were able to come up with the following example scenario.</p>
<h2>Example scenario</h2>
<p><strong>Setting up vlans during a fastpath installation.</strong></p>
<p>On the <strong><a href="http://maas.ubuntu.com">MAAS</a></strong> server edit <code>/etc/maas/preseeds/curtin_userdata</code> and write the following (substituting your vlan configuration):</p>

```yaml
# vlan config
bucket:
  &myinterfaces |
   # This file describes the network interfaces available on your system
   # and how to activate them. For more information, see interfaces(5).

   # The loopback network interface
   auto lo
   iface lo inet loopback

   # The primary network interface
   auto eth0
   iface eth0 inet dhcp
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


#cloud-config
debconf_selections:
 maas: |
  {{for line in str(curtin_preseed).splitlines()}}
  {{line}}
  {{endfor}}
early_commands:
  update: apt-get update
  vlan: apt-get install vlan -q -y

late_commands:
  maas: [wget, '--no-proxy', '{{node_disable_pxe_url|escape.shell}}', '--post-data', '{{node_disable_pxe_data|escape.shell}}', '-O', '/dev/null']
  load_8021q: ['sh', '-c', 'echo 8021q >> $TARGET_MOUNT_POINT/etc/modules']

network_commands:
  vlans: ['sh', '-c', 'printf "$1" > "$OUTPUT_INTERFACES"', '--', *myinterfaces]

power_state:
  mode: reboot
```

{% raw %}
{{if node.architecture in {'i386/generic', 'amd64/generic'} }}
apt_mirror: http://{{main_archive_hostname}}/{{main_archive_directory}}
{{else}}
apt_mirror: http://{{ports_archive_hostname}}/{{ports_archive_directory}}
{{endif}}

{{if http_proxy }}
apt_proxy: {{http_proxy}}
{{else}}
apt_proxy: http://{{server_host}}:8000/
{{endif}}
{% end %}
</code></pre>
<p>Once your node is deployed simply ssh into the instance and verify the <code>8021q</code> module is loaded and that <code>ifconfig</code> reports your added vlans.</p>
<p>Our <code>lsmod</code> output shows the proper module loaded</p>
<pre><code>ubuntu@node1:~$ lsmod|grep 8021q
8021q                  24084  0 
garp                   14602  1 8021q
</code></pre>
<p><code>/etc/network/interfaces</code> shows the correct vlan information</p>
<pre><code>auto lo
iface lo inet loopback
auto eth0
iface eth0 inet dhcp
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
</code></pre>
<h2>Notes</h2>
<p><code>curtin_userdata</code> is a YAML file so any thing that applies to the YAML 1.2 specification should work here. For example, you'll notice <code>&amp;myinterfaces</code> and <code>*myinterfaces</code>, these are node anchors more commonly called references for repeating YAML items. See <a href="http://en.wikipedia.org/wiki/YAML#References">this wikipedia page</a> for more information and the <a href="http://www.yaml.org/spec/1.2/spec.html">YAML spec</a>.</p>
