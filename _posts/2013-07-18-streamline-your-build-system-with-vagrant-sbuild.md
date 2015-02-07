---
title: Streamline your build system with vagrant + sbuild
author: Adam Stokes
layout: post
permalink: /streamline-your-build-system-with-vagrant-sbuild/
cpr_mtb_plg:
  - 'a:10:{s:18:"easy-related-posts";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"white-label-cms";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:10:"wp-smushit";s:1:"1";}'
categories:
  - Ubuntu
tags:
  - linux
  - sbuild
  - Ubuntu
  - vagrant
---
Remembering what to do in order to get your sbuild environment setup with deb caching and configuring Barry Warsaws repotools for those packages not in the archive can be a little tedious at times.

For me I hated upgrading my systems knowing I had to re-setup my sbuild environments.

In order to streamline this I created a project to help package builders take some of these boilerplate stuff out of the way and just create the schroot and start your build.

This vagrant project was modeled after [SbuildSimple][1]. Please check there for additional information on local packages.

You can find the project at [github][2]

## Features

  * supports lxc and virtualbox
  * apt package caching for quicker builds
  * automatically set maxcpus available to sbuild
  * supports building packages against newer/custom local packages

Using it is fairly simple:

## Setup

Install virtualbox

    $ sudo apt-get install virtualbox
    

Install [vagrant][3]

Install vagrant-sbuild

    $ git clone git://github.com:battlemidget/vagrant-sbuild.git 
    $ cd vagrant-sbuild 
    $ git submodule init 
    $ git submodule update
    

Install [vagrant-lxc][4]

    $ vagrant plugin install vagrant-lxc
    

Set some environment variables

    export DEBEMAIL=Your Name < hi2u@mail.com > export DEBSIGN_KEY=123134
    

### Optional

Install [vagrant-cachier][5] for improved performance

    $ vagrant plugin install vagrant-cachier
    

**Note**: I havent personally tested this as apt-cacher-ng is running for builds, however, for the provisioning itself it may be beneficial if you are doing a lot of provisioning. Make sure you read the **Vagrantfile** and uncomment the section that enables the auto caching feature.

## Vagrant boxes

A list of lxc supported vagrant boxes can be found at the [Vagrant LXC wiki][6] page.

## Usage

    $ vagrant up
    

## Create sbuild environments

    $ vagrant mk-sbuild --series saucy
    

## Perform builds

    $ vagrant sbuild --project saucy-amd64 --dsc scratch/PACKAGE\*.dsc
    

If packages are required that are not in the archive you may place them in the **repo/** directory and they will be included in any future builds.

Once complete the build packages should be in your **scratch/** directory and not once did you have to ssh into your vagrant box <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_biggrin.gif?w=720" alt=":D" class="wp-smiley" data-recalc-dims="1" />

## Todo&#8217;s

  * setup vagrant multi-machine for each series
  * include a config.yaml file for setting your debian maintainer info and other necessities.

 [1]: https://wiki.ubuntu.com/SimpleSbuild
 [2]: https://github.com/battlemidget/vagrant-sbuild
 [3]: http://downloads.vagrantup.com/
 [4]: https://github.com/fgrehm/vagrant-lxc
 [5]: https://github.com/fgrehm/vagrant-cachier
 [6]: https://github.com/fgrehm/vagrant-lxc/wiki/Base-boxes