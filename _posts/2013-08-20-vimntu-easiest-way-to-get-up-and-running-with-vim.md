---
title: vimntu; easiest way to get up and running with vim
author: Adam Stokes
layout: post
permalink: /vimntu-easiest-way-to-get-up-and-running-with-vim/
cpr_mtb_plg:
  - 'a:28:{s:14:"aboutme-widget";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:31:"creative-commons-configurator-1";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:21:"html-javascript-adder";s:1:"1";s:7:"jetpack";s:1:"1";s:12:"nginx-helper";s:1:"1";s:15:"oa-social-login";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - 
internal_research_notes:
  - 
categories:
  - Coder
  - Shellscript
  - Software
  - VIM
tags:
  - blog
  - cms
  - library
  - perl
  - vim
---
I&#8217;ve spent some time working on a [stupid simple script][1] that would install latest snapshot of VIM along with [janus][2] and my additional plugins. It&#8217;s really easy to get started, to install simply run:

    $ curl -L https://github.com/battlemidget/vimntu/raw/master/vimntu | bash
    

You get all the modifications from [janus][2] in addition to an extensive set of plugins activated through pathogen that gives extensive support to most of the major programming languages.

 [1]: https://github.com/battlemidget/vimntu
 [2]: https://github.com/carlhuda/janus