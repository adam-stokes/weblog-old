---
title: 'sosreport: mid-milestone update'
author: Adam Stokes
layout: post
permalink: /sosreport-mid-milestone-update/
cpr_mtb_plg:
  - 'a:27:{s:14:"aboutme-widget";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:12:"nginx-helper";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
internal_research_notes:
  - 
categories:
  - python
  - sosreport
  - Ubuntu
  - "What's New"
tags:
  - python
  - sosreport
  - Ubuntu
---
A small review of what&#8217;s happening as we enter into our 3rd month of development for the next major release of sosreport 3.1 (*approximate due date of February 2014*).

**Here is a rundown of what we need help on:**

  * Documentation
  * Openstack guru&#8217;s to review our existing plugins and provide feedback and/or code submissions. 
      * Our priority is to make sure we are capturing everything needed to successfully troubleshoot issues occurring within all of openstack&#8217;s moving parts.
      * Validating all captured configs to make sure we&#8217;ve scrubbed out any secrets/credentials.
      * Any new additions since Havana.
  * MAAS/Juju guru&#8217;s to review existing plugins and provide feedback and/or code.
  * Security auditing 
      * Mainly need extra set of eyes to make sure none of the plugins capture secret/confidential information along with scrubbing out those bits if unavoidable.

We also have a [list of bugs needing attention/resolution][1] that would also benefit from community contributions.

Also be aware that ***support for Python 2.6 will be dropped*** in the next release as well.

 [1]: https://github.com/sosreport/sosreport/issues?milestone=2&state=open