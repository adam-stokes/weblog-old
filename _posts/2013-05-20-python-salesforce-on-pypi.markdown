---
layout: post
status: publish
published: true
title: python-salesforce on pypi
author:
  display_name: Adam Stokes
  login: adam.stokes
  email: adam.stokes@gmail.com
  url: ''
author_login: adam.stokes
author_email: adam.stokes@gmail.com
wordpress_id: 97
wordpress_url: http://beta.astokes.org/python-salesforce-on-pypi/
date: '2013-05-20 23:04:34 -0400'
date_gmt: '2013-05-20 23:04:34 -0400'
categories:
- What's New
- Ubuntu
- Coder
- python
tags:
- Ubuntu
- linux
- sosreport
---
<p>I've got a project going to utilize Salesforce.com api over json and oauth rather than soap. Today I uploaded the package to the cheeseshop in hopes to pull in some interest from the community.</p>
<p>Right now the library contains authorization over OAuth 1.0a and client methods for retrieving basic Account, Case, and Asset information. My goal is to be api complete by the end of the year.</p>
<p>I would love to have contributors join the project in order to shape this young project into a well documented, tested, and easy to use library. As far as I can tell there isn't another python library like this that doesn't utilize SOAP for its endpoints.</p>
<p>Using the library is pretty straight forward, currently, I have 2 scripts that provide a simple way to authorize yourself and communicate with the endpoints.</p>
<p><strong>sf-exchange-auth</strong> provides a local ssl enabled web server for going through the OAuth process and storing your token/secret.</p>
<p><strong>sf-cli</strong> provides some arguments for pulling in rudimentary account and case information. Usage documentation is provided for this script.</p>
<p>The current focus is to stick to the <a href="http://en.wikipedia.org/wiki/You_Ain%27t_Gonna_Need_It">YAGNI</a> principles and utilize OO when it makes sense. This may or may not be the way to go so I am open to ideas and patches :D.</p>
<p>You can currently install python-salesforce through pip</p>
<pre><code>$ pip install python-salesforce
</code></pre>
<p>The project page is located at</p>
<p>http://python.salesforce.astokes.org</p>
<p>Looking forward to hearing from you.</p>
