---
title: 'Mental Note: Django 1.4.x and Storm .19'
author: Adam Stokes
layout: post
permalink: /mental-note-django-1-4-x-and-storm-19/
categories:
  - Coder
  - python
  - Ubuntu
  - "What's New"
---
Some notes on getting Storm used as a database backend for Django. Props to James Henstridge for doing the heavy lifting.<h3 id="setupvirtualenvandinstalldependencies:">Setup virtualenv and install dependencies:</h3> <pre class="prettyprint"> $ virtualenv --prompt=stormy venv $ source venv/bin/activate $ pip install django storm psycopg2 pytz python-dateutil $ pip freeze > requirements.txt </pre> <h3 id="setupdjangoskeleton">Setup django skeleton</h3> <pre class="prettyprint"> $ django-admin.py startproject myproject $ cd myproject $ python manage.py startapp common </pre> <h3 id="editsettings.pytoincludethepropermiddlewareandstorm_stores">Edit 

**settings.py** to include the proper middleware and STORM_STORES</h3> <pre class="prettyprint"> MIDDLEWARE\_CLASSES = ( 'django.middleware.common.CommonMiddleware', 'django.contrib.sessions.middleware.SessionMiddleware', 'django.middleware.csrf.CsrfViewMiddleware', 'django.contrib.auth.middleware.AuthenticationMiddleware', 'django.contrib.messages.middleware.MessageMiddleware', 'storm.django.middleware.ZopeTransactionMiddleware', # Added this line # Uncomment the next line for simple clickjacking pro ) STORM\_STORES = { 'default' : "postgres://adam@localhost/testdb" } </pre> <h3 id="nextinmyappaddsomemodels">Next in my app add some models</h3> <pre class="prettyprint"> from django.db import models from storm.sqlobject import StringCol, UtcDateTimeCol, BoolCol, IntCol from storm.locals import Int from storm.expr import SQL from datetime import datetime from pytz import UTC import dateutil.parser class Bug(models.Model): \_\_storm\_table\\_\_ = "bug" id = Int(primary=True,) date\_created = UtcDateTimeCol(notNull=True,) date\_last\_message = UtcDateTimeCol() date\_last\_updated = UtcDateTimeCol() date\_made\_private = UtcDateTimeCol() description = StringCol(notNull=True,) duplicate\_of = IntCol() heat = IntCol() gravity = IntCol() information\_type = StringCol() latest\_patch\_uploaded = UtcDateTimeCol() message\_count = IntCol(notNull=True,) number\_of\_duplicates = IntCol() other\_users\_affected\_count\_with\_dupes = IntCol() owner = IntCol(notNull=True,) private = BoolCol(notNull=True, default=False,) security\_related = BoolCol(notNull=True, default=True,) tags = StringCol() title = StringCol(notNull=True,) users\_affected\_count = IntCol() users\_affected\_count\_with\_dupes = IntCol() web\_link = StringCol() who\_made_private = IntCol() </pre> <h3 id="pullthedataintotheview">Pull the data into the view</h3> <pre class="prettyprint"> from django.core.context\_processors import csrf from django.shortcuts import render\_to\_response, HttpResponseRedirect from storm.django.stores import \* from myproject.common.models import \* def index(request): store = get\_store('default') bug = store.find(Bug) return render\_to\_response("common/index.html", { 'bug' : bug }) </pre> <h3 id="finallyeditthetemplatetodisplaythedata">Finally, edit the template to display the data</h3> <pre class="prettyprint"> {% raw %} {% extends 'layout.html' %} {% block page_name %}Home{% endblock %} {% block content %} {% for b in bug %} {{ b.id }} : {{ b.title }} {% endfor %} {% endblock content %} {% endraw %} </pre> 

Things to do:

  * Have **get_store** persisted when the application starts
  * Integrate migrations with South
  * Integrate with something like celery for running some background jobs

I haven't done anything major other than a few queries so time will tell how well this does when this project really gets into making use of Storm.