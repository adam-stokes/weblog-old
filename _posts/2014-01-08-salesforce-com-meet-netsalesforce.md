---
title: Salesforce.com meet Net::Salesforce
author: Adam Stokes
layout: post
permalink: /salesforce-com-meet-netsalesforce/
cpr_mtb_plg:
  - 'a:27:{s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:21:"html-javascript-adder";s:1:"1";s:7:"jetpack";s:1:"1";s:12:"nginx-helper";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:35:"wordpress-to-jekyll-exporter-master";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
internal_research_notes:
  - 
dsq_thread_id:
  - 2100549282
categories:
  - perl
  - "What's New"
tags:
  - salesforce
---
I&#8217;ve got a couple of new perl packages written for interacting with Salesforce.com, it&#8217;s features include:

  * OAuth 2 authentication with support for scopes including refresh_token and api. Easily add more for what you need in your application.
  * Client that will query sobjects via JSON api so no more SOAP!

Net::Salesforce is in pretty good condition to be used daily and Net::Salesforce::Client is usable but needs more models added to interact with Salesforce API. So far I&#8217;ve got models written for Accounts and Cases with more coming soon.

As always contributions welcomed! You can find the code hosted on github at the following:

  * [Net::Salesforce][1]
  * [Net::Salesforce::Client][2]

 [1]: https://github.com/battlemidget/Net-Salesforce
 [2]: https://github.com/battlemidget/Net-Salesforce-Client