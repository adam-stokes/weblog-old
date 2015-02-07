---
title: Using fastpath installer in MAAS
author: Adam Stokes
layout: post
permalink: /using-fastpath-installer-maas/
cpr_mtb_plg:
  - 'a:29:{s:14:"aboutme-widget";s:1:"1";s:10:"adminimize";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"font-uploader";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - http://bazaar.launchpad.net/~smoser/+junk/xinstall/view/head:/maas-usage.txt
internal_research_notes:
  - 
categories:
  - Cloud
  - Installer
  - maas
  - Ubuntu
  - "What's New"
tags:
  - curtin
  - fastpath
  - kvm
  - maas
---
MAAS 1.4 supports installing images via [curtin][1] (fastpath).

To enable fastpath for a node we need to [tag][2] it with `use-fastpath-installer` that is understood by MAAS and fastpath. As far as I can tell this has to be accomplished via `maas-cli`.

## Set your MAAS profile

If you&#8217;ve gone through the [basic getting started steps][3] with MAAS your profile is most likely `maas`. Assign `MAASNAME` to your `maas` profile.

    ubuntu@maas:~$ MAASNAME=maas
    

## Login to your MAAS instance via maas-cli

In order to login to your maas instance you&#8217;ll need to grab your **maas-key**. This can be done by visiting the user preferences page (http://maas.ip/MAAS/account/prefs) or clicking the `preferences` link under your account name (Fig 1). 

<div id="attachment_393" style="width: 209px" class="wp-caption alignnone">
  <img src="http://i0.wp.com/astokes.org/wp-content/uploads/2013/10/figure_8a.png?fit=199%2C105" alt="Fig 1. User preferences" class="size-full wp-image-393" data-recalc-dims="1" />
  
  <p class="wp-caption-text">
    Fig 1. User preferences
  </p>
</div>

Your **maas-key** should be located under the *MAAS keys* section (Fig 2) 

<div id="attachment_401" style="width: 463px" class="wp-caption alignnone">
  <img src="http://i1.wp.com/astokes.org/wp-content/uploads/2013/10/figure_9a.png?fit=453%2C289" alt="Fig 2. MAAS keys" class="size-full wp-image-401" data-recalc-dims="1" />
  
  <p class="wp-caption-text">
    Fig 2. MAAS keys
  </p>
</div>

Once you have that key copied, [login][4] to your MAAS instance from the command line.

    ubuntu@maas:~$ maas-cli login maas http://192.168.122.206/MAAS/api/1.0 CNTvmLmstUadGLk4wp:nxcJ9LZnCmksRe2jFS:xAYeYj4yJdJ4ARsfGBxWYSgqzsMtJbcF
    
    You are now logged in to the MAAS server at
    http://192.168.122.206/MAAS/api/1.0/ with the profile name 'maas'.
    
    For help with the available commands, try:
    
      maas-cli maas --help
    
    ubuntu@maas:~$
    

## Apply the tag to a single node

Once logged in we can start tagging nodes. In order to figure out which node you&#8217;d like to tag run the following command:

    ubuntu@maas:~$ maas-cli maas nodes list
    [
        {
            "status": 4, 
            "macaddress_set": [
                {
                    "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/macs/52:54:00:2a:37:ac/", 
                    "mac_address": "52:54:00:2a:37:ac"
                }
            ], 
            "hostname": "node1.master", 
            "power_type": "virsh", 
            "routers": [], 
            "netboot": true, 
            "cpu_count": 1, 
            "storage": 0, 
            "system_id": "node-1a62d358-2f8e-11e3-b5c3-525400a1c422", 
            "architecture": "amd64/generic", 
            "memory": 512, 
            "owner": null, 
            "tag_names": [
                "virtual"
            ], 
            "ip_addresses": [
                "192.168.122.101"
            ], 
            "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/"
        }
    ]
    

If you look at `system_id` this will be what you&#8217;ll use when tagging a single node. Go ahead and store that node in a variable

    ubuntu@maas:~$ node=node-1a62d358-2f8e-11e3-b5c3-525400a1c422
    

At this point the `use-fastpath-installer` tag doesn&#8217;t exist so we need to create it first

    ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp'
    {
        "comment": "fp", 
        "definition": "", 
        "resource_uri": "/MAAS/api/1.0/tags/use-fastpath-installer/", 
        "name": "use-fastpath-installer", 
        "kernel_opts": ""
    }
    

Now we can apply the tag to the node

    ubuntu@maas:~$ maas-cli $MAASNAME tag update-nodes use-fastpath-installer add=$node
    {
        "removed": 0, 
        "added": 1
    }
    

Or you can run the following command and bypass creating the tag and applying it manually to a node with the following

    ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp' "definition=true()"
    

This will create the `use-fastpath-installer` tag and apply to all available nodes.

## Verify your node(s) are tagged

You can view that the tagging worked by either running the following command:

    ubuntu@maas:~$ maas-cli $MAASNAME tag nodes use-fastpath-installer
    [
        {
            "status": 4, 
            "macaddress_set": [
                {
                    "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/macs/52:54:00:2a:37:ac/", 
                    "mac_address": "52:54:00:2a:37:ac"
                }
            ], 
            "hostname": "node1.master", 
            "power_type": "virsh", 
            "routers": [], 
            "netboot": true, 
            "cpu_count": 1, 
            "storage": 0, 
            "system_id": "node-1a62d358-2f8e-11e3-b5c3-525400a1c422", 
            "architecture": "amd64/generic", 
            "memory": 512, 
            "owner": null, 
            "tag_names": [
                "virtual", 
                "use-fastpath-installer"
            ], 
            "ip_addresses": [
                "192.168.122.101"
            ], 
            "resource_uri": "/MAAS/api/1.0/nodes/node-1a62d358-2f8e-11e3-b5c3-525400a1c422/"
        }
    ]
    

Or through the **web-ui** and viewing your node properties (Fig. 3) 

<div id="attachment_406" style="width: 500px" class="wp-caption alignnone">
  <img src="http://i2.wp.com/astokes.org/wp-content/uploads/2013/10/figure_10a.png?fit=490%2C309" alt="Fig 3. Node properties" class="size-full wp-image-406" data-recalc-dims="1" />
  
  <p class="wp-caption-text">
    Fig 3. Node properties
  </p>
</div>

## Deploy your node with fastpath installer

Now that the node is tagged simply re-deploy the node and fastpath should take over automatically. Should note that you really won&#8217;t see a difference other than speed increase of the installation, but, let&#8217;s be honest that&#8217;s really what we care about right? <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" />

## Tips

I ran this test on **Precise** in order to do that you&#8217;ll need the *cloud-tools* pocket in the **cloud archive**:

    ubuntu@hostmachine:~$ sudo apt-get install -qy ubuntu-cloud-keyring </dev/null
    ubuntu@hostmachine:~$ sudo tee /etc/apt/sources.list.d/cloud-tools-precise.list <<EOF
    deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
    deb-src http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
    EOF

 [1]: http://launchpad.net/curtin
 [2]: http://maas.ubuntu.com/docs/tags.html
 [3]: http://maas.ubuntu.com/docs/install.html
 [4]: http://maas.ubuntu.com/docs/maascli.html#api-key