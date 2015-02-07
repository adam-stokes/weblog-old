---
title: Perl bindings for Juju
author: Adam Stokes
layout: post
permalink: /perl-bindings-for-juju/
external_references:
  - 
internal_research_notes:
  - 
dsq_thread_id:
  - 2277900152
dsq_needs_sync:
  - 1
categories:
  - juju
  - perl
  - Ubuntu
---
In an attempt to better learn the Juju internals I started working on some Perl bindings and as a result a lot of time spent in the Go codebase. The library utilizes an event-based approach making use of technologies such as [AnyEvent][1] and [AnyEvent::WebSocket::Client][2]. I am still going through the golang code to make the library api complete and the code is considered alpha quality so not recommended in production by any means. The library is located on [GitHub][3], as always contributions welcomed. <img src="http://i2.wp.com/astokes.org/wp-includes/images/smilies/icon_razz.gif?w=720" alt=":P" class="wp-smiley" data-recalc-dims="1" />

## A quick walkthrough

Installing is easy with `cpanm`, simply point the client at the github repo and the dependencies will be handled for you:

### Installing

`$ cpanm git@github.com:battlemidget/perl-juju.git`

### Example

This code snippet shows you how to pull the juju environment data

    #!/usr/bin/env perl
    
    use strict;
    use warnings;
    use v5.18.0;
    use Juju::Environment;
    use Mojo::JSON qw(j);
    use Data::Dumper;
    
    $Data::Dumper::Indent = 1;
    
    my $client = Juju::Environment->new(
        endpoint => 'wss://10.0.3.1:17070/',
        password => '211fdd69b8942c10cef6cfb8a4748fa4'
    );
    $client->login;
    my $_info = $client->info;
    print Dumper($_info);
    
    $client->close;
    
    __END__
    
    Output of code:
    
    $VAR1 = {
      'Name' => 'local',
      'DefaultSeries' => 'precise',
      'UUID' => '23929e29-5b3d-42d7-8984-5e18319aeacb',
      'ProviderType' => 'local'
    };
    

I should probably put a disclaimer that this isn&#8217;t endorsed by Canonical and please dont report any issues with this library to the Juju team. For now this is nothing more than a hobby project and maybe a helpful starting point for others to write bindings in their preferred language.

 [1]: https://metacpan.org/pod/AnyEvent
 [2]: https://metacpan.org/pod/AnyEvent::WebSocket::Client
 [3]: https://github.com/battlemidget/perl-juju