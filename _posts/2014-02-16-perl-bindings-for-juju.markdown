---
layout: post
status: publish
published: true
title: Perl bindings for Juju
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 503
wordpress_url: http://astokes.org/?p=503
date: '2014-02-16 23:55:46 -0500'
date_gmt: '2014-02-17 03:55:46 -0500'
categories:
- Ubuntu
- perl
- juju
tags: []
---
<p>In an attempt to better learn the Juju internals I started working on some Perl bindings and as a result a lot of time spent in the Go codebase. The library utilizes an event-based approach making use of technologies such as <a href="https://metacpan.org/pod/AnyEvent">AnyEvent</a> and <a href="https://metacpan.org/pod/AnyEvent::WebSocket::Client">AnyEvent::WebSocket::Client</a>. I am still going through the golang code to make the library api complete and the code is considered alpha quality so not recommended in production by any means. The library is located on <a href="https://github.com/battlemidget/perl-juju">GitHub</a>, as always contributions welcomed. :P</p>
<h2>A quick walkthrough</h2>
<p>Installing is easy with <code>cpanm</code>, simply point the client at the github repo and the dependencies will be handled for you:</p>
<h3>Installing</h3>
<p><code>$ cpanm git@github.com:battlemidget/perl-juju.git</code></p>
<h3>Example</h3>
<p>This code snippet shows you how to pull the juju environment data</p>
<pre><code>#!/usr/bin/env perl

use strict;
use warnings;
use v5.18.0;
use Juju::Environment;
use Mojo::JSON qw(j);
use Data::Dumper;

$Data::Dumper::Indent = 1;

my $client = Juju::Environment-&gt;new(
    endpoint =&gt; 'wss://10.0.3.1:17070/',
    password =&gt; '211fdd69b8942c10cef6cfb8a4748fa4'
);
$client-&gt;login;
my $_info = $client-&gt;info;
print Dumper($_info);

$client-&gt;close;

__END__

Output of code:

$VAR1 = {
  'Name' =&gt; 'local',
  'DefaultSeries' =&gt; 'precise',
  'UUID' =&gt; '23929e29-5b3d-42d7-8984-5e18319aeacb',
  'ProviderType' =&gt; 'local'
};
</code></pre>
<p>I should probably put a disclaimer that this isn't endorsed by Canonical and please dont report any issues with this library to the Juju team. For now this is nothing more than a hobby project and maybe a helpful starting point for others to write bindings in their preferred language.</p>
