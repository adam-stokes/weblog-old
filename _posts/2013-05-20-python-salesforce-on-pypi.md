---
title: python-salesforce on pypi
author: Adam Stokes
layout: post
permalink: /python-salesforce-on-pypi/
categories:
  - Coder
  - python
  - Ubuntu
  - "What's New"
tags:
  - linux
  - sosreport
  - Ubuntu
---
I&#8217;ve got a project going to utilize Salesforce.com api over json and oauth rather than soap. Today I uploaded the package to the cheeseshop in hopes to pull in some interest from the community.

Right now the library contains authorization over OAuth 1.0a and client methods for retrieving basic Account, Case, and Asset information. My goal is to be api complete by the end of the year.

I would love to have contributors join the project in order to shape this young project into a well documented, tested, and easy to use library. As far as I can tell there isn&#8217;t another python library like this that doesn&#8217;t utilize SOAP for its endpoints.

Using the library is pretty straight forward, currently, I have 2 scripts that provide a simple way to authorize yourself and communicate with the endpoints.

**sf-exchange-auth** provides a local ssl enabled web server for going through the OAuth process and storing your token/secret.

**sf-cli** provides some arguments for pulling in rudimentary account and case information. Usage documentation is provided for this script.

The current focus is to stick to the [YAGNI][1] principles and utilize OO when it makes sense. This may or may not be the way to go so I am open to ideas and patches :D.

You can currently install python-salesforce through pip

    $ pip install python-salesforce
    

The project page is located at

http://python.salesforce.astokes.org

Looking forward to hearing from you.

 [1]: http://en.wikipedia.org/wiki/You_Ain%27t_Gonna_Need_It