---
layout: post
status: publish
published: true
title: 'new juju plugin: juju-sos'
author: Adam Stokes
date: '2014-04-23 01:52:59 -0400'
date_gmt: '2014-04-23 05:52:59 -0400'
categories:
- What's New
- Ubuntu
- juju
- go
- sosreport
tags: []
---
<p><a href="https://github.com/battlemidget/juju-sos">Juju sos</a> is my entryway into Go code and the juju internals. This plugin will execute and pull <a href="https://github.com/sosreport/sos">sosreports</a> from all machines known to juju or a specific machine of your choice and copy them locally on your machine.</p>
<p>An example of what this plugin does, first, some output of <code>juju status</code> to give you an idea of the machines I have:</p>
<pre><code>┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]&gt; juju status
environment: local
machines:
  "0":
    agent-state: started
    agent-version: 1.18.1.1
    dns-name: localhost
    instance-id: localhost
    series: trusty
  "1":
    agent-state: started
    agent-version: 1.18.1.1
    dns-name: 10.0.3.27
    instance-id: poe-local-machine-1
    series: trusty
    hardware: arch=amd64 cpu-cores=1 mem=2048M root-disk=8192M
  "2":
    agent-state: started
    agent-version: 1.18.1.1
    dns-name: 10.0.3.19
    instance-id: poe-local-machine-2
    series: trusty
    hardware: arch=amd64 cpu-cores=1 mem=2048M root-disk=8192M
services:
  keystone:
    charm: cs:trusty/keystone-2
    exposed: false
    relations:
      cluster:
      - keystone
      identity-service:
      - openstack-dashboard
    units:
      keystone/0:
        agent-state: started
        agent-version: 1.18.1.1
        machine: "2"
        public-address: 10.0.3.19
  openstack-dashboard:
    charm: cs:trusty/openstack-dashboard-0
    exposed: false
    relations:
      cluster:
      - openstack-dashboard
      identity-service:
      - keystone
    units:
      openstack-dashboard/0:
        agent-state: started
        agent-version: 1.18.1.1
        machine: "1"
        open-ports:
        - 80/tcp
        - 443/tcp
        public-address: 10.0.3.27
</code></pre>
<p>Basically what we are looking at is 2 machines that are running various services on them in my case <strong>Openstack Horizon</strong> and <strong>Keystone</strong>. Now suppose I have some issues with my juju machines and openstack and I need a quick way to gather a bunch of data on those machines and send them to someone who can help. With my <a href="https://github.com/battlemidget/juju-sos">juju-sos plugin</a>, I can quickly gather sosreports on each of the machines I care about in as little typing as possible.</p>
<p>Here is the output from <code>juju sos</code> querying all machines known to juju:</p>
<pre><code>┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]&gt; juju sos -d ~/scratch
2014-04-23 05:30:47 INFO juju.provider.local environprovider.go:40 opening environment "local"
2014-04-23 05:30:47 INFO juju.state open.go:81 opening state, mongo addresses: ["10.0.3.1:37017"]; entity ""
2014-04-23 05:30:47 INFO juju.state open.go:133 dialled mongo successfully
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:53 Querying all machines
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:59 Adding machine(1)
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:59 Adding machine(2)
2014-04-23 05:30:47 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 1
2014-04-23 05:30:55 INFO juju.sos main.go:119 Copying archive to "/home/poe/scratch"
2014-04-23 05:30:56 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 2
2014-04-23 05:31:08 INFO juju.sos main.go:119 Copying archive to "/home/poe/scratch"
┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]&gt; ls $HOME/scratch
sosreport-ubuntu-20140423040507.tar.xz  sosreport-ubuntu-20140423052125.tar.xz  sosreport-ubuntu-20140423052545.tar.xz
sosreport-ubuntu-20140423050401.tar.xz  sosreport-ubuntu-20140423052223.tar.xz  sosreport-ubuntu-20140423052600.tar.xz
sosreport-ubuntu-20140423050727.tar.xz  sosreport-ubuntu-20140423052330.tar.xz  sosreport-ubuntu-20140423052610.tar.xz
sosreport-ubuntu-20140423051436.tar.xz  sosreport-ubuntu-20140423052348.tar.xz  sosreport-ubuntu-20140423053052.tar.xz
sosreport-ubuntu-20140423051635.tar.xz  sosreport-ubuntu-20140423052450.tar.xz  sosreport-ubuntu-20140423053101.tar.xz
sosreport-ubuntu-20140423052006.tar.xz  sosreport-ubuntu-20140423052532.tar.xz
</code></pre>
<p>Another example of <code>juju sos</code> just capturing a sosreport from one machine:</p>
<pre><code>┌[poe@cloudymeatballs] [/dev/pts/1] 
└[~]&gt; juju sos -d ~/scratch -m 2
2014-04-23 05:41:59 INFO juju.provider.local environprovider.go:40 opening environment "local"
2014-04-23 05:42:00 INFO juju.state open.go:81 opening state, mongo addresses: ["10.0.3.1:37017"]; entity ""
2014-04-23 05:42:00 INFO juju.state open.go:133 dialled mongo successfully
2014-04-23 05:42:00 INFO juju.sos.cmd cmd.go:70 Querying one machine(2)
2014-04-23 05:42:00 INFO juju.sos.cmd cmd.go:88 Capturing sosreport for machine 2
2014-04-23 05:42:08 INFO juju.sos main.go:99 Copying archive to "/home/poe/scratch"
</code></pre>
<p>Fancy, fancy :)</p>
<p>Of course this is a <em>work in progress</em> and I have a few ideas of what else to add here, some of those being:</p>
<ul>
<li>Rename the sosreports to match the dns-name of the juju machine</li>
<li>Filter sosreport captures based on services</li>
<li>
<p>Optionally pass arguments to sosreport command in order to filter out specific plugins I want to run, ie</p>
<p><code>$ juju sos -d ~/sosreport -- -b -o juju,maas,nova-compute</code></p>
</li>
</ul>
<p>As usual contributions are welcomed and some installation instructions are located in the <a href="https://github.com/battlemidget/juju-sos/blob/master/README.md">readme</a></p>
