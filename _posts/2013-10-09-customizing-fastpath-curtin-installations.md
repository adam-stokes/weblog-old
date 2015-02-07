---
title: Customizing fastpath (curtin) installations in MAAS
author: Adam Stokes
layout: post
permalink: /customizing-fastpath-curtin-installations/
categories:
  - maas
  - python
  - Ubuntu
  - "What's New"
tags:
  - curtin
  - fastpath
  - maas
  - python
---
Working off my previous entry about **[using fastpath installer in MAAS][1]** I decided to dig a little deeper into customizing those installations a bit. One thing to note is [fastpath(curtin/curt installer)][2] installations do not follow the same guidelines that are used in preseed files for Debian installer. Some overview documentation of [fastpath can be located here][3] and thanks to [Scott Moser][4] we were able to come up with the following example scenario.

## Example scenario

**Setting up vlans during a fastpath installation.**

On the **[MAAS][5]** server edit `/etc/maas/preseeds/curtin_userdata`
and write the following (substituting your vlan configuration):

<script src="https://gist.github.com/battlemidget/edacd7abea5446d8bcc1.js"></script>

Once your node is deployed simply ssh into the instance and verify the `8021q` module is loaded and that `ifconfig` reports your added vlans.

Our `lsmod` output shows the proper module loaded

    ubuntu@node1:~$ lsmod|grep 8021q
    8021q                  24084  0 
    garp                   14602  1 8021q
    

`/etc/network/interfaces` shows the correct vlan information

    auto lo
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
    

## Notes

`curtin_userdata` is a YAML file so any thing that applies to the YAML 1.2 specification should work here. For example, you&#8217;ll notice `&myinterfaces` and `*myinterfaces`, these are node anchors more commonly called references for repeating YAML items. See [this wikipedia page][6] for more information and the [YAML spec][7].

 [1]: http://astokes.org/using-fastpath-installer-maas/
 [2]: http://launchpad.net/curtin
 [3]: http://bazaar.launchpad.net/~curtin-dev/curtin/trunk/view/head:/doc/topics/overview.rst
 [4]: http://ubuntu-smoser.blogspot.com/
 [5]: http://maas.ubuntu.com
 [6]: http://en.wikipedia.org/wiki/YAML#References
 [7]: http://www.yaml.org/spec/1.2/spec.html