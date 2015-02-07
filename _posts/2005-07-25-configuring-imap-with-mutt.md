---
title: Configuring imap with mutt
author: Adam Stokes
layout: post
permalink: /configuring-imap-with-mutt/
categories:
  - "What's New"
---
Place this in your ~/.muttrc<pre class="prettyprint"> # This configures mutt to use IMAP(S) server, however, you'll need to # setup sendmail/postfix/alternative smtp server to enable sending # mail out 

<img src="http://i1.wp.com/astokes.org/wp-includes/images/smilies/icon_smile.gif?w=720" alt=":)" class="wp-smiley" data-recalc-dims="1" /> my\_hdr From: user@example.com (Joe Blow) # sets the location for your spool mailbox - # the INBOX setting should work on most imap servers set spoolfile=imaps://mail.server.com/INBOX # Specifies the default location of your mailboxes. set folder=imaps://mail.server.com/ # Your login name on the IMAP server. # Put in a value here to avoid typing in your username # each time you start mutt set imap\_user=username # Specifies the password for your IMAP account. # Warning: you should only use this option when you are on # a fairly secure machine # set imap\_pass=xyz # Set this to no to avoid mutt asking you whether you want # to move your mail to the local mbox set move=no # If you have more than one mailbox then. # This is how long mutt will wait between scanning for # incoming mail set mail\_check=60 # Mutt will only scan curently open mailbox for new mail # every 10 minutes by default. Set to 15 seconds set timeout=15 </pre>