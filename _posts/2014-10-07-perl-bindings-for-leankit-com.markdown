---
layout: post
status: publish
published: true
title: Perl bindings for LeanKit.com
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 642
wordpress_url: http://astokes.org/?p=642
date: '2014-10-07 15:38:17 -0400'
date_gmt: '2014-10-07 19:38:17 -0400'
categories:
- What's New
- perl
tags:
- api
- json
- rest
---
<p>I recently released a Perl API client for LeanKit which covers the majority of exposed endpoints from the service.</p>
<p>This library can be installed from CPAN and supports Perl versions 5.14+:</p>
<pre>$ cpanm Net::LeanKit</pre>
<p>An example use of the library:</p>
<pre>use strict;
use warnings;
use Net::LeanKit;

my $lk = Net::LeanKit->new(email => 'email@mail.com',
                           password => 'password',
                           account => 'mycompany');

print("Listing known boards\n");
foreach my $board (@{$lk->getBoards}) {
  printf("Board Name: %s has an id of %s\n", $board->{Title}, $board->{Id});
}

my $boardByName = $lk->getBoardByName('Getting Started');
print("Board Lanes\n");
foreach my $lane (@{$boardByName->{Lanes}}) {
  printf("Lane id (%s) with title (%s)\n", $lane->{Id}, $lane->{Title});
}
</pre>
<p>This library is designed to match the same functionality as the <a href="https://github.com/LeanKit/leankit-node-client">official nodejs client</a>.</p>
<p>Documentation on the available api can be found at <a href="https://metacpan.org/pod/Net::LeanKit">the release page</a>. Also feel free to visit the <a href="https://github.com/battlemidget/p5-leankit">github page</a> and to see other available bindings head over to <a href="https://support.leankit.com/entries/28686507-Other-LeanKit-API-Wrappers-and-Examples">LeanKit's API wrappers</a> page.</p>
