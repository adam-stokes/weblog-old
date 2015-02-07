---
title: SOSreport now in Debian unstable(sid) and Ubuntu saucy
author: Adam Stokes
layout: post
permalink: /sosreport-now-in-debian-unstablesid-and-ubuntu-saucy/
cpr_mtb_plg:
  - 'a:10:{s:18:"easy-related-posts";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"white-label-cms";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:10:"wp-smushit";s:1:"1";}'
categories:
  - Coder
  - python
  - sosreport
  - Ubuntu
tags:
  - debian
  - linux
  - sosreport
  - Ubuntu
---
[sosreport][1] v3.0 is now in ***Debian Unstable(Sid)*** and was synced this morning into ***Saucy*** (13.10). I&#8217;ve created some [backport][2] requests to hopefully have sosreport put into Precise, Quantal, and Raring.

Another goal of mine is to have sosreport included in the **main** archive so I&#8217;ve filed a [MIR][3] request for that as well. If this is something that interests you please visit the [MIR][3] and set to affects you. I would like to see this in **main** in time for the next LTS release.

Development of [sosreport][1] is on-going and we encourage new contributions in any form, but, particularly interested in new plugins. We welcome you to fork the project and submit pull requests as this seems to be the easiest and most productive way to get code accepted into upstream.

Finally, I&#8217;d like to thank those companies and its engineers who&#8217;ve contributed to the growth of sosreport. These companies include but are not limited to Canonical Ltd, EMC Corporation, Rackspace US, Inc., and Red Hat, Inc. You may find a list of all contributors in **/usr/share/doc/sosreport/AUTHORS**.

 [1]: https://github.com/sosreport/sosreport
 [2]: https://bugs.launchpad.net/raring-backports/+bug/1206118
 [3]: https://bugs.launchpad.net/ubuntu/+source/sosreport/+bug/1206106