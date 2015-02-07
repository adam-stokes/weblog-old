---
title: VMWare Server installed as host on FC6
author: Adam Stokes
layout: post
permalink: /vmware-server-installed-as-host-on-fc6/
categories:
  - "What's New"
---
If you run into errors related to this :<pre class="prettyprint"> make[1]: Entering directory \`/usr/src/kernels/2.6.18-1.2798.fc6-i686' CC [M] /tmp/vmware-config1/vmnet-only/driver.o CC [M] /tmp/vmware-config1/vmnet-only/hub.o CC [M] /tmp/vmware-config1/vmnet-only/userif.o CC [M] /tmp/vmware-config1/vmnet-only/netif.o CC [M] /tmp/vmware-config1/vmnet-only/bridge.o CC [M] /tmp/vmware-config1/vmnet-only/procfs.o /tmp/vmware-config1/vmnet-only/procfs.c:33:26: error: linux/config.h: No such file or directory make[2]: \*\\*\* [/tmp/vmware-config1/vmnet-only/procfs.o] Error 1 make[1]: \*\*\* [\_module\_/tmp/vmware-config1/vmnet-only] Error 2 make[1]: Leaving directory \`/usr/src/kernels/2.6.18-1.2798.fc6-i686' make: \*** [vmnet.ko] Error 2 make: Leaving directory \`/tmp/vmware-config1/vmnet-only 'Unable to build the vmnet module. </pre> 

That is because config.h does not exist and is being deprecated in 2.6.18-1.2798.fc6 and beyond.To solve this :<pre class="prettyprint"> # touch /usr/src/kernels/2.6.18-1.2798.fc6-i686/include/linux/config.h </pre> 

Once complete your VMware server should successfully complete  
vmware-config.pl and you can continue using this product.If it stills  
fails please see this thread for other ideas :

http://www.vmware.com/community/thread.jspa?messageID=501043&#501043