---
title: Multiline sql statements in clojure
author: Adam Stokes
layout: post
permalink: /multiline-sql-statements-in-clojure/
categories:
  - "What's New"
---
***NB*** Most of these articles are geared towards those are who not  
really familiar with Clojure and are just getting started. (like me)

As I'm continuing to dig through clojure and specifically database  
interactions I've been writing some simple sql statements with a few  
joins. First off we'll define our namespace:<pre class="prettyprint"> (ns rosay.models (:require \[clojure.java.jdbc :as sql\] \[clojure.string :as string\])) </pre> 

Next I've written a simple helper function that will read in an sql  
statement with optional arguments.<pre class="prettyprint"> (defn db-read "processes query returns result" \[query & args\] (sql/with-connection rosay-db (sql/with-query-results res (vec (cons query args)) (doall res)))) </pre> 

From here we can do something like:<pre class="prettyprint"> rosay.server=> (def client-id 1) rosay.server=> (db-read "select * from clients where id=?" client-id) </pre> 

This is simple and straightforward approach, but, I'd like to be able  
to add more complexity to the sql statement and still keep things  
rather readable in emacs.

This helper function basically takes a vector and joins it with a  
*space*. Nothing fancy or even fault tolerant but for this experiment  
it works.<pre class="prettyprint"> (defn- simple-query [query] "Vector of query data for multiline sql statements" (string/join " " query)) </pre> 

Now that I have this simple query builder I can expand on the  
complexity of my SQL statements but still keep it readable.<pre class="prettyprint"> (defn get-pages [client-id] "return associated client pages" (db-read (simple-query ["SELECT p.*, c.username, pt.name as page\_type from pages p" "LEFT OUTER JOIN clients as c on p.client\_id = c.id" "LEFT OUTER JOIN pages\_types as pt on p.pages\_type\_id = pt.id" "WHERE client\_id=?" ]) client-id)) </pre> 

From my research there wasn't really a decent way to do multiline like  
above so this was the simplest thing I could come up with.

Finally, to test from the nrepl I can run:<pre class="prettyprint"> rosay.server=> (use 'rosay.models) nil rosay.server=> (get-pages 19) ({:created\_on #inst "2012-12-04T19:23:06.614156000-00:00", :keywords "words", :pages\_type\_id 11, :name "nameo", :updated\_on nil, :client\_id 19, :username "beef, :page\_type "article", :frontpage true, :id 7, :description "description"} {:created\_on #inst "2012-12-04T19:23:09.109556000-00:00", :keywords "words", :pages\_type\_id 11, :name "nameo", :updated\_on nil, :client\_id 19, :username beef", :page\_type "article", :frontpage true, :id 8, :description "description"}) </pre> 

I'll be improving on these in time but in the distant future this is  
suitable for my experiements.