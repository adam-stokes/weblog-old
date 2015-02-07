---
title: Perl bindings for LeanKit.com
author: Adam Stokes
layout: post
permalink: /perl-bindings-for-leankit-com/
external_references:
  - 
internal_research_notes:
  - 
categories:
  - perl
  - "What's New"
tags:
  - api
  - json
  - rest
---
I recently released a Perl API client for **LeanKit** which covers the majority of exposed endpoints from the service.

This library can be installed from CPAN and supports Perl versions 5.14+:

`$ cpanm Net::LeanKit`

An example use of the library:

    use strict;
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
    

This library is designed to match the same functionality as the [official nodejs client][1].

Documentation on the available api can be found at [the release page][2]. Also feel free to visit the [github page][3] and to see other available bindings head over to [LeanKit&#8217;s API wrappers][4] page.

 [1]: https://github.com/LeanKit/leankit-node-client
 [2]: https://metacpan.org/pod/Net::LeanKit
 [3]: https://github.com/battlemidget/p5-leankit
 [4]: https://support.leankit.com/entries/28686507-Other-LeanKit-API-Wrappers-and-Examples