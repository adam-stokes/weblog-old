---
layout: post
status: publish
published: true
title: Streamline your build system with vagrant + sbuild
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 87
wordpress_url: http://beta.astokes.org/streamline-your-build-system-with-vagrant-sbuild/
date: '2013-07-18 13:03:17 -0400'
date_gmt: '2013-07-18 13:03:17 -0400'
categories:
- Ubuntu
tags:
- Ubuntu
- linux
- sbuild
- vagrant
---
<p>Remembering what to do in order to get your sbuild environment setup with deb caching and configuring Barry Warsaws repotools for those packages not in the archive can be a little tedious at times.</p>
<p>For me I hated upgrading my systems knowing I had to re-setup my sbuild environments.</p>
<p>In order to streamline this I created a project to help package builders take some of these boilerplate stuff out of the way and just create the schroot and start your build.</p>
<p>This vagrant project was modeled after <a href="https://wiki.ubuntu.com/SimpleSbuild">SbuildSimple</a>. Please check there for additional information on local packages.</p>
<p>You can find the project at <a href="https://github.com/battlemidget/vagrant-sbuild">github</a></p>
<h2>Features</h2>
<ul>
<li>supports lxc and virtualbox</li>
<li>apt package caching for quicker builds</li>
<li>automatically set maxcpus available to sbuild</li>
<li>supports building packages against newer/custom local packages</li>
</ul>
<p>Using it is fairly simple:</p>
<h2>Setup</h2>
<p>Install virtualbox</p>
<pre><code>$ sudo apt-get install virtualbox
</code></pre>
<p>Install <a href="http://downloads.vagrantup.com/">vagrant</a></p>
<p>Install vagrant-sbuild</p>
<pre><code>$ git clone git://github.com:battlemidget/vagrant-sbuild.git 
$ cd vagrant-sbuild 
$ git submodule init 
$ git submodule update
</code></pre>
<p>Install <a href="https://github.com/fgrehm/vagrant-lxc">vagrant-lxc</a></p>
<pre><code>$ vagrant plugin install vagrant-lxc
</code></pre>
<p>Set some environment variables</p>
<pre><code>export DEBEMAIL=Your Name &lt; hi2u@mail.com &gt; export DEBSIGN_KEY=123134
</code></pre>
<h3>Optional</h3>
<p>Install <a href="https://github.com/fgrehm/vagrant-cachier">vagrant-cachier</a> for improved performance</p>
<pre><code>$ vagrant plugin install vagrant-cachier
</code></pre>
<p><strong>Note</strong>: I havent personally tested this as apt-cacher-ng is running for builds, however, for the provisioning itself it may be beneficial if you are doing a lot of provisioning. Make sure you read the <strong>Vagrantfile</strong> and uncomment the section that enables the auto caching feature.</p>
<h2>Vagrant boxes</h2>
<p>A list of lxc supported vagrant boxes can be found at the <a href="https://github.com/fgrehm/vagrant-lxc/wiki/Base-boxes">Vagrant LXC wiki</a> page.</p>
<h2>Usage</h2>
<pre><code>$ vagrant up
</code></pre>
<h2>Create sbuild environments</h2>
<pre><code>$ vagrant mk-sbuild --series saucy
</code></pre>
<h2>Perform builds</h2>
<pre><code>$ vagrant sbuild --project saucy-amd64 --dsc scratch/PACKAGE\*.dsc
</code></pre>
<p>If packages are required that are not in the archive you may place them in the <strong>repo/</strong> directory and they will be included in any future builds.</p>
<p>Once complete the build packages should be in your <strong>scratch/</strong> directory and not once did you have to ssh into your vagrant box :D</p>
<h2>Todo's</h2>
<ul>
<li>setup vagrant multi-machine for each series</li>
<li>include a config.yaml file for setting your debian maintainer info and other necessities.</li>
</ul>
