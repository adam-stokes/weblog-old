---
layout: post
status: publish
published: true
title: Using fastpath installer in MAAS
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 391
wordpress_url: http://astokes.org/?p=391
date: '2013-10-08 17:04:09 -0400'
date_gmt: '2013-10-08 21:04:09 -0400'
categories:
- What's New
- Ubuntu
- Cloud
- maas
- Installer
tags:
- maas
- fastpath
- curtin
- kvm
---
<p>MAAS 1.4 supports installing images via <a href="http://launchpad.net/curtin">curtin</a> (fastpath).</p>
<p>To enable fastpath for a node we need to <a href="http://maas.ubuntu.com/docs/tags.html">tag</a> it with <code>use-fastpath-installer</code> that is understood by MAAS and fastpath. As far as I can tell this has to be accomplished via <code>maas-cli</code>.</p>
<h2>Set your MAAS profile</h2>
<p>If you've gone through the <a href="http://maas.ubuntu.com/docs/install.html">basic getting started steps</a> with MAAS your profile is most likely <code>maas</code>. Assign <code>MAASNAME</code> to your <code>maas</code> profile.</p>
<pre><code>ubuntu@maas:~$ MAASNAME=maas
</code></pre>
<h2>Login to your MAAS instance via maas-cli</h2>
<p>In order to login to your maas instance you'll need to grab your <strong>maas-key</strong>. This can be done by visiting the user preferences page (http://maas.ip/MAAS/account/prefs) or clicking the <code>preferences</code> link under your account name (Fig 1). [caption id="attachment_393" align="alignnone" width="199"]<img src="http://astokes.org/wp-content/uploads/2013/10/figure_8a.png" alt="Fig 1. User preferences" width="199" height="105" class="size-full wp-image-393" /> Fig 1. User preferences[/caption]</p>
<p>Your <strong>maas-key</strong> should be located under the <em>MAAS keys</em> section (Fig 2) [caption id="attachment_401" align="alignnone" width="453"]<img src="http://astokes.org/wp-content/uploads/2013/10/figure_9a.png" alt="Fig 2. MAAS keys" width="453" height="289" class="size-full wp-image-401" /> Fig 2. MAAS keys[/caption]</p>
<p>Once you have that key copied, <a href="http://maas.ubuntu.com/docs/maascli.html#api-key">login</a> to your MAAS instance from the command line.</p>
<pre><code>ubuntu@maas:~$ maas-cli login maas http://192.168.122.206/MAAS/api/1.0 CNTvmLmstUadGLk4wp:nxcJ9LZnCmksRe2jFS:xAYeYj4yJdJ4ARsfGBxWYSgqzsMtJbcF

You are now logged in to the MAAS server at
http://192.168.122.206/MAAS/api/1.0/ with the profile name 'maas'.

For help with the available commands, try:

  maas-cli maas --help

ubuntu@maas:~$
</code></pre>
<h2>Apply the tag to a single node</h2>
<p>Once logged in we can start tagging nodes. In order to figure out which node you'd like to tag run the following command:</p>
<pre><code>ubuntu@maas:~$ maas-cli maas nodes list
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
</code></pre>
<p>If you look at <code>system_id</code> this will be what you'll use when tagging a single node. Go ahead and store that node in a variable</p>
<pre><code>ubuntu@maas:~$ node=node-1a62d358-2f8e-11e3-b5c3-525400a1c422
</code></pre>
<p>At this point the <code>use-fastpath-installer</code> tag doesn't exist so we need to create it first</p>
<pre><code>ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp'
{
    "comment": "fp", 
    "definition": "", 
    "resource_uri": "/MAAS/api/1.0/tags/use-fastpath-installer/", 
    "name": "use-fastpath-installer", 
    "kernel_opts": ""
}
</code></pre>
<p>Now we can apply the tag to the node</p>
<pre><code>ubuntu@maas:~$ maas-cli $MAASNAME tag update-nodes use-fastpath-installer add=$node
{
    "removed": 0, 
    "added": 1
}
</code></pre>
<p>Or you can run the following command and bypass creating the tag and applying it manually to a node with the following</p>
<pre><code>ubuntu@maas:~$ maas-cli $MAASNAME tags new name='use-fastpath-installer' comment='fp' "definition=true()"
</code></pre>
<p>This will create the <code>use-fastpath-installer</code> tag and apply to all available nodes.</p>
<h2>Verify your node(s) are tagged</h2>
<p>You can view that the tagging worked by either running the following command:</p>
<pre><code>ubuntu@maas:~$ maas-cli $MAASNAME tag nodes use-fastpath-installer
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
</code></pre>
<p>Or through the <strong>web-ui</strong> and viewing your node properties (Fig. 3) [caption id="attachment_406" align="alignnone" width="490"]<img src="http://astokes.org/wp-content/uploads/2013/10/figure_10a.png" alt="Fig 3. Node properties" width="490" height="309" class="size-full wp-image-406" /> Fig 3. Node properties[/caption]</p>
<h2>Deploy your node with fastpath installer</h2>
<p>Now that the node is tagged simply re-deploy the node and fastpath should take over automatically. Should note that you really won't see a difference other than speed increase of the installation, but, let's be honest that's really what we care about right? :)</p>
<h2>Tips</h2>
<p>I ran this test on <strong>Precise</strong> in order to do that you'll need the <em>cloud-tools</em> pocket in the <strong>cloud archive</strong>:</p>
<pre><code>ubuntu@hostmachine:~$ sudo apt-get install -qy ubuntu-cloud-keyring &lt;/dev/null
ubuntu@hostmachine:~$ sudo tee /etc/apt/sources.list.d/cloud-tools-precise.list &lt;&lt;EOF
deb http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
deb-src http://ubuntu-cloud.archive.canonical.com/ubuntu precise-updates/cloud-tools main
EOF
</code></pre>
