(function($){var restore_dims=function(){$('img[data-recalc-dims]').each(function(){if(this.complete){var width=this.width,height=this.height;if(width&&width>0&&height&&height>0){$(this).attr({width:width,height:height});reset_for_retina(this);}}
else{$(this).load(arguments.callee);}});},reset_for_retina=function(img){$(img).removeAttr('data-recalc-dims').removeAttr('scale');};$(document).ready(restore_dims);if("on"in $.fn)
$(document.body).on('post-load',restore_dims);else
$(document).delegate('body','post-load',restore_dims);})(jQuery);
WPGroHo=jQuery.extend({my_hash:'',data:{},renderers:{},syncProfileData:function(hash,id){if(!WPGroHo.data[hash]){WPGroHo.data[hash]={};a=jQuery('div.grofile-hash-map-'+hash+' span').each(function(){WPGroHo.data[hash][this.className]=jQuery(this).text();});}
WPGroHo.appendProfileData(WPGroHo.data[hash],hash,id);},appendProfileData:function(data,hash,id){for(var key in data){if(jQuery.isFunction(WPGroHo.renderers[key])){return WPGroHo.renderers[key](data[key],hash,id,key);}
jQuery('#'+id).find('h4').after(jQuery('<p class="grav-extra '+key+'" />').html(data[key]));}}},WPGroHo);jQuery(document).ready(function($){Gravatar.profile_cb=function(h,d){WPGroHo.syncProfileData(h,d);};Gravatar.my_hash=WPGroHo.my_hash;Gravatar.init('body','#wpadminbar');});