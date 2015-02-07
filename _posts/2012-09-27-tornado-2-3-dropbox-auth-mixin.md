---
title: Tornado 2.3+ dropbox auth mixin
author: Adam Stokes
layout: post
permalink: /tornado-2-3-dropbox-auth-mixin/
categories:
  - "What's New"
---
Working on <a href="http://tornadoweb.org">Tornado</a> web application server has been a great  
experience. I've written a few simple OAuth mixin's and this  
one is for dropbox. It's been tested and works, however, I am  
probably including way to many method overrides. If anyone  
would like to update the gist please feel free and I'll make  
sure to link it in this post.<pre class="prettyprint"> class DropboxMixin(tornado.auth.OAuthMixin): """ Dropbox OAuth authentication. """ \_OAUTH\_REQUEST\_TOKEN\_URL = "https://api.dropbox.com/1/oauth/request\_token" \_OAUTH\_ACCESS\_TOKEN\_URL = "https://api.dropbox.com/1/oauth/access\_token" \_OAUTH\_AUTHORIZE\_URL = "https://www.dropbox.com/1/oauth/authorize" \_OAUTH\_VERSION = "1.0" \_OAUTH\_NO\_CALLBACKS = False def authorize\_redirect(self, callback\_uri=None, extra\_params=None, http\_client=None): """Redirects the user to obtain OAuth authorization for this service. Twitter and FriendFeed both require that you register a Callback URL with your application. You should call this method to log the user in, and then call get\_authenticated\_user() in the handler you registered as your Callback URL to complete the authorization process. This method sets a cookie called \_oauth\_request\_token which is subsequently used (and cleared) in get\_authenticated\_user for security purposes. """ http\_client = httpclient.AsyncHTTPClient() http\_client.fetch( self.\_oauth\_request\_token\_url(), self.async\_callback( self.\_on\_request\_token, self.\_OAUTH\_AUTHORIZE\_URL, callback\_uri)) def get\_authenticated\_user(self, callback, http\_client=None): """Gets the OAuth authorized user and access token on callback. This method should be called from the handler for your registered OAuth Callback URL to complete the registration process. We call callback with the authenticated user, which in addition to standard attributes like 'name' includes the 'access\_key' attribute, which contains the OAuth access you can use to make authorized requests to this service on behalf of the user. """ request\_key = escape.utf8(self.get\_argument("oauth\_token")) oauth\_verifier = self.get\_argument("oauth\_verifier", None) request\_cookie = self.get\_cookie("\_oauth\_request\_token") if not request\_cookie: logging.warning("Missing OAuth request token cookie") callback(None) return self.clear\_cookie("\_oauth\_request\_token") cookie\_key, cookie\_secret = [base64.b64decode(escape.utf8(i)) for i in request\_cookie.split("|")] if cookie\_key != request\_key: logging.info((cookie\_key, request\_key, request\_cookie)) logging.warning("Request token does not match cookie") callback(None) return token = dict(key=cookie\_key, secret=cookie\_secret) if oauth\_verifier: token["verifier"] = oauth\_verifier if http\_client is None: http\_client = httpclient.AsyncHTTPClient() http\_client.fetch(self.\_oauth\_access\_token\_url(token), self.async\_callback(self.\_on\_access\_token, callback)) def \_on\_access\_token(self, callback, response): if response.error: logging.warning("Could not fetch access token") callback(None) return access\_token = \_oauth\_parse\_response(response.body) self.\_oauth\_get\_user(access\_token, self.async\_callback( self.\_on\_oauth\_get\_user, access\_token, callback)) def \_on\_oauth\_get\_user(self, access\_token, callback, user): if not user: callback(None) return user["access\_token"] = access\_token callback(user) def dropbox\_request(self, path, callback, access\_token=None, post\_args=None, **args): # Add the OAuth resource request signature if we have credentials url = "https://api.dropbox.com/1" + path if access\_token: all\_args = {} all\_args.update(args) all\_args.update(post\_args or {}) method = "POST" if post\_args is not None else "GET" oauth = self.\_oauth\_request\_parameters( url, access\_token, all\_args, method=method) args.update(oauth) if args: url += "?" + urllib.urlencode(args) callback = self.async\_callback(self.\_on\_dropbox\_request, callback) http = httpclient.AsyncHTTPClient() if post\_args is not None: http.fetch(url, method="POST", body=urllib.urlencode(post\_args), callback=callback) else: http.fetch(url, callback=callback) def \_on\_dropbox\_request(self, callback, response): if response.error: print("Error response %s fetching %s", response.error, response.request.url) callback(None) return callback(escape.json\_decode(response.body)) def \_oauth\_consumer\_token(self): self.require\_setting("dropbox\_consumer\_key", "Dropbox OAuth") self.require\_setting("dropbox\_consumer\_secret", "Dropbox OAuth") return dict( key=self.settings["dropbox\_consumer\_key"], secret=self.settings["dropbox\_consumer\_secret"]) def \_oauth\_get\_user(self, access\_token, callback): callback = self.async\_callback(self.\_parse\_user\_response, callback) self.dropbox\_request( "/account/info", access\_token=access\_token, callback=callback) def \_parse\_user\_response(self, callback, user): if user: user["username"] = user["display\_name"] callback(user) </pre>