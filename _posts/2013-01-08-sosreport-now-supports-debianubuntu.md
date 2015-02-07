---
title: SOSreport now supports Debian/Ubuntu
author: Adam Stokes
layout: post
permalink: /sosreport-now-supports-debianubuntu/
categories:
  - Coder
  - python
  - Ubuntu
  - "What's New"
tags:
  - linux
  - sosreport
  - Ubuntu
---
Sosreport is a set of tools is designed to provide information to support organizations  
in an extensible manner, allowing third parties, package maintainers, and  
anyone else to provide plugins that will collect and report information that  
is useful for supporting software packages.

This project is hosted at <a href="http://github.com/sosreport/sosreport">Github</a> For the latest  
version, to contribute, and for more information, please visit there.

Installing it through Launchpad PPA:<pre class="prettyprint"> sudo add-apt-repository ppa:debugmonkeys/sosreport sudo apt-get update sudo apt-get install sosreport </pre> 

If you are coming from a Red Hat Enterprise Linux or Fedora background and are familiar with sosreport we'd like to invite you to participate in porting over plugins to work across these distributions as well. Several plugins have been ported over that you can use as a guide for making other plugins distribution aware.