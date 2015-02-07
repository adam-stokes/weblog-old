---
title: Lenovo x230 Tablet tips
author: Adam Stokes
layout: post
permalink: /lenovo-x230-tablet-tips/
categories:
  - "What's New"
---
Some tips for getting around the lack of tablet functionality with Ubuntu Precise and even Quantal. First is a small shell script for disabling finger touch on the tablet when you want to use the stylus for writing/drawing.<pre class="prettyprint"> #!/bin/bash # This script can be used to toggle enable state of wacom multitouch screen for # Thinkpad Tablet Series. You may need to change the name of multitouch device # which can be found by running \*xinput list\* command TOGGLE=$HOME/.multitouch_toggle if [ ! -e $TOGGLE ]; then touch $TOGGLE xinput set-prop 'Wacom ISDv4 E6 Finger touch' 'Device Enabled' 0 else rm $TOGGLE xinput set-prop 'Wacom ISDv4 E6 Finger touch' 'Device Enabled' 1 fi </pre> 

This allows you to place your hand comfortably down on the tablet while you hand write notes in applications such as Xournal or drawing in applications such as MyPaint.

Another script for rotating the orientation and making sure the mouse recognizes the new quadrants (rather than up being down, down being up, etc) can be found on github. The url for that project is <a href="https://github.com/martin-ueding/think-rotate.git">think-rotate</a>. You can rotate left, right, and back to default. This works in all desktop environments and window managers, however, attempting to navigate smoothly through the UI like you would within a smartphone or android/iphone tablet still needs some more work. As of right now Unity is the same UI no matter the resolution or orientation of the device.

I am going to do some more work and hopefully get some integrated hotkey events into udev so that you may simply swivel the screen into a tablet and the orientation happens automatically.