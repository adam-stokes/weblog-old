---
title: Configuring VLANs in MAAS node deployment
author: Adam Stokes
layout: post
permalink: /automatically-configuring-vlans-maas/
cpr_mtb_plg:
  - 'a:29:{s:14:"aboutme-widget";s:1:"1";s:10:"adminimize";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"font-uploader";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
internal_research_notes:
  - |
    Configuring maas user to power on/off via virsh
    http://askubuntu.com/questions/292061/how-to-configure-maas-to-be-able-to-boot-virtual-machines/295976#295976
categories:
  - Cloud
  - Debian
  - Installer
  - maas
  - Ubuntu
  - "What's New"
tags:
  - bare metal
  - debian installer
  - di
  - fastpath
  - maas
  - preseed
  - Ubuntu
---
Since Debian installer doesn&#8217;t have the ability to configure [vlans][1] we need to make any additional network modifications within the `preseed/late_command` stage. If you aren&#8217;t familiar with vlan or would like some more details on setting it up take a look at [Ubuntu vlan wiki page][2]. Also I don&#8217;t have the hardware to test the actual switching so hopefully someone will read this and let me know what I&#8217;ve missed. I checked into [gns3][3] but it is my understanding it would be impossible to emulate the switching that Cisco hardware would.

## Assumptions

Yea assumptions are baad, however, this article assumes you have an interface `eth0` that supports vlan tagging (802.1q) and that a hardware switch exists that has been configured for vlans.

## Preseed naming conventions in MAAS

The order in which [MAAS][4] loads a preseed file is seen below:

    {prefix}_{node_architecture}_{node_subarchitecture}_{release}_{node_name}
    {prefix}_{node_architecture}_{node_subarchitecture}_{release}
    {prefix}_{node_architecture}_{node_subarchitecture}
    {prefix}_{node_architecture}
    {prefix}
    'generic'
    

> ### Note:
> 
> If you wish to keep your distro provided preseeds in-tact and use an alternative you could always name a new preseed with something like `amd64_generic_precise` and when deploying your nodes with the precise image it would pick up that preseed instead of `generic`. More information at **[How preseeds work][5]**

## Modifying the preseeds for vlan support

The preseeds are located within `/etc/maas/preseeds`. For now the only preseed files we are concerned with is `preseed_master` and `generic`.

Opening up `preseed_master` we see a typical preseed configuration and scrolling to the bottom you&#8217;ll see:

    # Post scripts.
    {{self.post_scripts}}
    

This method is exposed as part of the [Tempita][6] template engine which we&#8217;ll see defined in our `generic` template next.

Opening `generic` template we&#8217;ll see something like the below:

    {{inherit "preseed_master"}}
    
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
    d-i     preseed/late_command string true && \
        in-target sh -c 'f=$1; shift; echo $0 > $f && chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas && \
        in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null && \
        true
    {{enddef}}
    

Most of this should be self explanatory as this basically outlines the typical usage of most template engines. We `inherit 'preseed_master'` which calls `self` and we provide our method definitions with `{{def <method>}}`. Scroll down your `generic` preseed file and locate `{{def post_scripts}}`.

This definition is what&#8217;s called from our `preseed_master` configuration and where we&#8217;ll add our vlan options. We&#8217;ll make a call out to a `vlansetup` file hosted on the same server as maas, usually found in `/var/www/`.

    {{def post_scripts}}
    # Executes late command and disables PXE.
    d-i     preseed/late_command string true && \
        in-target sh -c 'f=$1; shift; echo $0 > $f && chmod 0440 $f $*' 'ubuntu ALL=(ALL) NOPASSWD: ALL' /etc/sudoers.d/maas && \
        in-target wget --no-proxy "{{node_disable_pxe_url|escape.shell}}" --post-data "{{node_disable_pxe_data|escape.shell}}" -O /dev/null && \
        wget -O /tmp/vlansetup http://192.168.122.206/vlansetup && \
        chmod +x /tmp/vlansetup && \
        sh -x /tmp/vlansetup && \
        rm -f /tmp/vlansetup && \
        true
    {{enddef}}
    

Our `vlansetup` file would look something like

    #!/bin/sh
    /bin/apt-install vlan
    echo "8021q" >> /target/etc/modules
    cat >>/target/etc/network/interfaces<<EOF
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
    

After the node is deployed you should see something like the following in your syslog output.

    Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
    Added VLAN with VID == 5 to IF -:eth0:-
    Set name-type for VLAN subsystem. Should be visible in /proc/net/vlan/config
    Added VLAN with VID == 100 to IF -:eth0:-
    

And `/proc/net/vlan/config` should look like

    ubuntu@node1:~$ sudo cat /proc/net/vlan/config 
    VLAN Dev name    | VLAN ID
    Name-Type: VLAN_NAME_TYPE_PLUS_VID_NO_PAD
    vlan5          | 5  | eth0
    vlan100        | 100  | eth0
    

Last but not least `ifconfig` reports

    eth0      Link encap:Ethernet  HWaddr 52:54:00:2a:37:ac  
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
    

## Thoughts

Of course this could be seen as a hindrance if you have an environment more complex than just assigning vlan tags to `eth0`. Automating the assignment of vlan&#8217;s is probably best done within the installer, however, that feature doesn&#8217;t exist. Some things that could be done to lessen the administrative burden would be making use of puppet on the MAAS server and pre-populating the `/etc/maas/preseeds/generic` file.

## Cool tips

If you are running your MAAS instance and nodes within KVM/VirtualBox/etc you could easily pull the IP from the virtual machine if you know the MAC address using something like `arp -an`. Then either setup puppet to keep your preseeds updated or utilize something like [libguestfs][7] to make changes directly within the VM.

## Troubleshooting

Installing this on a desktop image with NetworkManager running (first ask yourself why)? Then [see this post][8] for a solution to configuring NetworkManager and vlan&#8217;s.

 [1]: http://en.wikipedia.org/wiki/Virtual_LAN
 [2]: https://wiki.ubuntu.com/vlan
 [3]: http://www.gns3.net/
 [4]: http://maas.ubuntu.com
 [5]: http://maas.ubuntu.com/docs/development/preseeds.html
 [6]: http://pythonpaste.org/tempita/
 [7]: http://libguestfs.org/
 [8]: http://askubuntu.com/questions/199254/802-1q-vlan-interface-configuration-on-ubuntu-12-04-desktop