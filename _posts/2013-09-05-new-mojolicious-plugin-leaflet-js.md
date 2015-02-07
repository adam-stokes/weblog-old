---
title: 'New mojolicious plugin: leaflet.js'
author: Adam Stokes
layout: post
permalink: /new-mojolicious-plugin-leaflet-js/
cpr_mtb_plg:
  - 'a:27:{s:14:"aboutme-widget";s:1:"1";s:10:"adminimize";s:1:"1";s:22:"advanced-custom-fields";s:1:"1";s:15:"awesome-weather";s:1:"1";s:12:"easy-wp-smtp";s:1:"1";s:13:"et-shortcodes";s:1:"1";s:23:"font-awesome-more-icons";s:1:"1";s:21:"gist-github-shortcode";s:1:"1";s:17:"google-typography";s:1:"1";s:24:"google-sitemap-generator";s:1:"1";s:7:"jetpack";s:1:"1";s:15:"social-stickers";s:1:"1";s:18:"tabify-edit-screen";s:1:"1";s:10:"tablepress";s:1:"1";s:15:"twitter-tracker";s:1:"1";s:21:"ultimate-metabox-tabs";s:1:"1";s:15:"white-label-cms";s:1:"1";s:16:"widgets-on-pages";s:1:"1";s:13:"font-uploader";s:1:"1";s:13:"wordpress-seo";s:1:"1";s:7:"wp-ffpc";s:1:"1";s:11:"wp-markdown";s:1:"1";s:16:"wp-atom-importer";s:1:"1";s:7:"wp-help";s:1:"1";s:10:"wp-smushit";s:1:"1";s:21:"wp-social-seo-booster";s:1:"1";s:32:"yet-another-related-posts-plugin";s:1:"1";}'
external_references:
  - http://mojolicio.us
categories:
  - Coder
  - javascript
  - perl
  - "What's New"
tags:
  - blog
  - cms
  - javascript
  - leaflet
  - library
  - perl
  - web
---
Started working on a new Mojolicious plugin for integrating the popular javascript mapping library [leaflet.js][1]. You can find it on [metacpan][2] or help with contributions at the [github project page][3].

A quick synopsis of how to use it:

    # Mojolicious
    $self->plugin('Leafletjs');
    
    # Mojolicious::Lite
    plugin 'Leafletjs';
    
    # In your template
    <%= leaflet {
      name      => 'map1',
      latitude => '35.9239',
      longitude  => '-78.4611',
      zoomLevel => 18,
      markers   => [
        {   name      => 'marker1',
            latitude => '35.9239',
            longitude  => '-78.4611',
            popup     => 'A new message tada!',
        },
        {   name      => 'marker2',
            latitude => '35.9235',
            longitude  => '-78.4610',
            popup     => 'A second popup here!',
        }
      ],
    }
    %>
    

An example of a Mojolicious Lite application can be found in [the examples directory on github][4]

 [1]: http://leafletjs.com
 [2]: https://metacpan.org/release/ADAMJS/Mojolicious-Plugin-Leafletjs-0.001
 [3]: https://github.com/battlemidget/Mojolicious-Plugin-Leafletjs
 [4]: https://github.com/battlemidget/Mojolicious-Plugin-Leafletjs/tree/master/eg