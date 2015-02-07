---
title: quickly beautify your javascript in emacs
author: Adam Stokes
layout: post
permalink: /quickly-beautify-your-javascript-in-emacs/
categories:
  - Emacs
  - javascript
tags:
  - emacs
  - javascript
  - lisp
---
This is for the javascript version of js-beautify and could easily apply to their python version as well. You&#8217;ll need to have node installed with npm and run the following:

    $ sudo npm install -g js-beautify
    

Next, open up your emacs init file (**~/.emacs.d/init.el**) and add the following lisp code:

    (defun jstidy ()
      'Run js-beautify on the current region or buffer.'
      (interactive)
      (save-excursion
        (unless mark-active (mark-defun))
        (shell-command-on-region (point) (mark) 'js-beautify -f -'; nil t)))
    (global-set-key "\C-cg" 'jstidy)
    

Once you&#8217;ve re-evaluated or restarted emacs the (**CTRL+c then g**) will be bound to the *jstidy* function.

Finally, load up any javascript file and either mark a region or not and press the key commands to execute jstidy and you should see your code re-formatted nicely.