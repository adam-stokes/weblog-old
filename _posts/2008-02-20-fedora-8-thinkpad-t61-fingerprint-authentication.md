---
title: Fedora 8, Thinkpad T61, fingerprint authentication
author: Adam Stokes
layout: post
permalink: /fedora-8-thinkpad-t61-fingerprint-authentication/
categories:
  - "What's New"
---
Using a T61 or any IBM laptop that has the fingerprint scanner install the package thinkfinger :<pre class="prettyprint"> # yum install thinkfinger </pre> 

Add your user:<pre class="prettyprint"> # su - # tf-tool --add-user adam </pre> 

Swipe your finger 3 times.

Alter /etc/pam.d/system-auth to include the think_finger pam module. Mine looks like :<pre class="prettyprint"> #%PAM-1.0# This file is auto-generated. # User changes will be destroyed the next time authconfig is run. auth required pam\_env.so auth sufficient pam\_thinkfinger.so auth sufficient pam\_unix.so nullok try\_first\_pass auth requisite pam\_succeed\_if.so uid >= 500 quiet auth required pam\_deny.so account required pam\_unix.so account sufficient pam\_localuser.so account sufficient pam\_succeed\_if.so uid account required pam\_permit.so password requisite pam\_cracklib.so try\_first\_pass retry=3 password sufficient pam\_unix.so md5 shadow nullok try\_first\_pass use\_authtok password required pam\_deny.so session optional pam\_keyinit.so revoke session required pam\_limits.so session [success=1 default=ignore] pam\_succeed\_if.so service in crond quiet use\_uid session required pam_unix.so </pre> 

Once complete logout of Gnome, and attempt to login by clicking or typing your associated user name and then swipe your finger <img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" />