---
title: Run MAAS in Vagrant
author: Adam Stokes
layout: post
permalink: /running-maas-vagrant/
cpr_mtb_plg:
  - 'a:28:{s:14:"aboutme-widget";s:1:"1";s:10:"adminimize";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"font-uploader";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
categories:
  - maas
  - Software
  - Ubuntu
  - vagrant
tags:
  - 12.04
  - cloud-in-a-box
  - juju
  - maas
  - metal-as-a-service
  - precise
  - python
  - vagrant
---
This article covers the steps I took to run a [MAAS][1] instance within [vagrant][2].

I think of this more like the most direct and reproducable approach I could think of. You could build off of this and automate a lot of the installation tasks with a vagrant provisioner like puppet, chef, saltstack, or ansible. In my case I like to use [Ansible][3] which is written by Michael DeHaan who wrote [func][4] back in the day. I loved func and ansible feels more at home to me.

# Installing and configuring MAAS

## Software used

  * Ubuntu Precise 12.04 (latest updates)
  * vagrant 1.3.x
  * [vagrant lxc][5]
  * maas
  * lxc

## Install lxc

    % sudo apt-get install lxc
    

## Install Vagrant

Download and install vagrant via [vagrant install link][6]

    % wget http://files.vagrantup.com/packages/0ac2a87388419b989c3c0d0318cc97df3b0ed27d/vagrant_1.3.4_x86_64.deb
    % sudo dpkg -i vagrant_1.3.4_x86_64.deb
    

## Install vagrant-lxc

    % vagrant plugin install vagrant-lxc
    

## Install a lxc supported vagrant box

    % vagrant box add precise64 http://bit.ly/vagrant-lxc-precise64-2013-09-28
    

## Create a Vagrantfile

Add the following into your **Vagrantfile**

    Vagrant.configure("2") do |config|
      config.vm.box = "precise64"
      config.vm.provider :lxc do |lxc|
        lxc.customize 'cgroup.memory.limit_in_bytes', '1024M'
        lxc.customize 'cgroup.devices.allow', 'b 7:* rwm'
        lxc.customize 'cgroup.devices.allow', 'c 10:237 rwm'
      end
    end
    

## Cache sudo password

There is a [bug][7] that prevents sudo password from being cached on sudo < 1.8.4. To get around this the vagrant-lxc [wiki page][8] suggests the following:

    # Load up visudo and append the following
    % sudo visudo
    Defaults !tty_tickets
    

## Run the vagrant box

    % vagrant up --provider=lxc
    

## SSH into the vagrant box

    % vagrant ssh
    

## Add additional repository

A **ubuntu-cloud** archive exists for providing the latest juju, maas, etc bits on precise. Enable this to get the latest MAAS versions.

    vagrant@precise-base:~$ sudo apt-get install -qy ubuntu-cloud-keyring </dev/null
    vagrant@precise-base:~$ sudo tee /etc/apt/sources.list.d/cloud-tools-precise.list <<EOF
    deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
    deb-src http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
    EOF
    

## Update the repository and install MAAS

    vagrant@precise-base:~$ sudo apt-get update 
    vagrant@precise-base:~$ sudo apt-get install maas maas-dhcp maas-dns
    

## Create your MAAS superuser

    vagrant@precise-base:~$ sudo maas createsuperuser
    

It&#8217;s a pain doing this many times over, pulled this tip from [Bojan Mihelac][9]

    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'pass')" | sudo maas shell
    

## Login to your MAAS UI

In your web browser visit the IP (something like http://10.0.3.32/MAAS) of the vagrant box to log into your MAAS instance.

## Import your boot images

Once logged in click on the **cog** icon in the top right hand corner.

[<img src="http://i1.wp.com/astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS.png?fit=189%2C159" alt="maas settings" class="alignnone size-full wp-image-286" data-recalc-dims="1" />][10]

On the settings page just under **Cluster controllers** click the **import boot images** button.

[<img src="http://i0.wp.com/astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS-1.png?fit=670%2C114" alt="maas import boot images" class="alignnone size-full wp-image-287" data-recalc-dims="1" />][11]

This will take awhile to run so maybe go get some coffee.

If you want to speed things up a bit edit `/etc/maas/import_pxe_files` with the following

    vagrant@precise-base:~$ cat /etc/maas/import_pxe_files 
    # This file replaces an older one called import_isos.  Include that here for
    # compatibility.
    if [ -f /etc/maas/import_isos ]
    then
        cat >&2 <<EOF
    
    Including obsolete /etc/maas/import_isos in configuration.  This file has been
    superseded by import_pxe_files.  Please see if it can be removed.
    
    EOF
        . /etc/maas/import_isos
    fi
    
    
    RELEASES="precise"
    ARCHES="amd64/generic"
    LOCALE="en_US"
    #IMPORT_EPHEMERALS=1
    

## Cluster interface configuration

Once the boot images are done you are ready to configure one of the network interfaces to be managed by MAAS. Click on the edit icon under **Cluster controllers**. In the **Edit Cluster Controller** page click on the edit icon next to the interface you&#8217;d like to configure. In this case I am using **eth0**. [<img src="http://i0.wp.com/astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Controller-precise-base-MAAS.png?fit=594%2C192" alt="Edit cluster interface" class="alignnone size-full wp-image-290" data-recalc-dims="1" />][12]

On the next page titled **Edit Cluster Interface** we are going to set **eth0** to manage **dhcp** and **dns** along with entering the ip information for our network. Since vagrant is using 10.0.3.32 as its IP we&#8217;ll set the rest according to that. [<img src="http://i1.wp.com/astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Interface-precise-base-MAAS-1.png?fit=605%2C704" alt="Edit Cluster Interface   precise-base MAAS (1)" class="alignnone size-full wp-image-336" data-recalc-dims="1" />][13]

## Troubleshooting

### DBusException error with avahi

    DBusException: org.freedesktop.DBus.Error.NameHasNoOwner: Could not get owner of name 'org.freedesktop.Avahi': no such name
    

### Solution

Comment out **rlimit-nproc** in `/etc/avahi/avahi-daemon.conf`, then start the service. [See here][14] for more information on this issue and user namespaces in lxc.

    vagrant@precise-base:~$ sudo service avahi-daemon restart
    

### Failing to mount ephemeral image

    precise-ephemeral-maas-amd64.img
    mount: Could not find any loop device. Maybe this kernel does not know
           about the loop device? (If so, recompile or `modprobe loop'.)
    Tue, 01 Oct 2013 19:33:58 +0000: failed to mount /tmp/uec2roottar.MmKLTg/precise-ephemeral-maas-amd64.img
    failed to create root image
    failed to prepare image for precise/amd64
    

### Solution

Per [this post][15]

  1. Copy `/etc/apparmor.d/lxc/lxc-default` to `/etc/apparmor.d/lxc/lxc-default-with-loops`
  2. Edit `/etc/apparmor.d/lxc/lxc-default-with-loops` 
      * Rename lxc-container-default to lxc-container-default-with-loops
      * Add an entry: `"mount -> /tmp/*/*,"` or matching the source node, fstype,
  3. `% sudo /etc/init.d/apparmor reload`
  4. Edit your container&#8217;s configuration and set lxc.aa_profile to lxc-container-default-with-loops 
      * **Note**: this would be `lxc.customize "aa_profile", "lxc-container-default-with-loops"` in your **Vagrantfile**
  5. Restart your container

# Conclusion

That&#8217;s pretty much it! Whether this is actually useful remains to be seen. Nevertheless, this was a good learning experience for me. <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" /> Oh and if you read this far down I did automate most of this which you can find over at my [github vagrant-maas repo][16].

    % git clone git://github.com:battlemidget/vagrant-maas.git
    % cd vagrant-maas
    % vagrant plugin install vagrant-lxc
    % vagrant box add precise64 http://bit.ly/vagrant-lxc-precise64-2013-09-28
    % vagrant up --provider=lxc --provision-with ansible
    % vagrant provision

 [1]: http://maas.ubuntu.com
 [2]: http://vagrantup.com
 [3]: http://www.ansibleworks.com/
 [4]: https://fedorahosted.org/func/
 [5]: https://github.com/fgrehm/vagrant-lxc
 [6]: http://downloads.vagrantup.com/tags/v1.3.3
 [7]: http://www.sudo.ws/repos/sudo/file/c158df7cd9d2/NEWS#l523
 [8]: https://github.com/fgrehm/vagrant-lxc/wiki/Avoiding-%27sudo%27-passwords
 [9]: http://source.mihelac.org/2009/10/23/django-avoiding-typing-password-for-superuser/
 [10]: http://i1.wp.com/astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS.png
 [11]: http://i0.wp.com/astokes.org/wp-content/uploads/2013/10/Settings-precise-base-MAAS-1.png
 [12]: http://i0.wp.com/astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Controller-precise-base-MAAS.png
 [13]: http://i1.wp.com/astokes.org/wp-content/uploads/2013/10/Edit-Cluster-Interface-precise-base-MAAS-1.png
 [14]: http://sourceforge.net/mailarchive/message.php?msg_id=29200350
 [15]: http://www.mail-archive.com/lxc-users@lists.sourceforge.net/msg03673.html
 [16]: https://github.com/battlemidget/vagrant-maas