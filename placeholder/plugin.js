/**
	TinyMCE Placeholder v1.0 - December 2013
	(c) 2013 Federico Isacchi - http://www.isacchi.eu
	license: http://www.opensource.org/licenses/mit-license.php

A customizable placeholder plugin for TinyMCE 4.
It can be used to create image placeholders for tokens like [!token_name].

Into the configuration of TineMCE 'placeholder_tokens' should be declared as an
array of objects.
Each object can have the following properties:
	token	The token name.
	title	[optional] The text that will be used into the menus.
	image	[optional] The image url that will be used as placeholder.
*/
tinymce.PluginManager.add('placeholder', function(editor, url) {
	
	var tokens = editor.getParam('placeholder_tokens',[]);
	
	//--------------------------------
	
	
	/**
		WYSIWYG -> source
		Substitutes the placeholders with the tokens.
	*/
	function _toSrc(s) {
		var i,re;
		for(i=tokens.length-1; i>=0; i--) {
			//to prevent the text equal to a token to be treated as a token
			re = new RegExp('\\[\\!'+tokens[i].escapedToken+'\\](?![^\\<\\>]*\>)', 'gi');
			s = s.replace(re, '[&#x21;'+tokens[i].token+']');
			
			//substitutes the placeholders with the tokens
			re = new RegExp('\<img[^\\>]+placeholder_data\\=\\"'+tokens[i].escapedToken+'\\"[^\\>]*\>', 'gi');
			s = s.replace(re, '[!'+tokens[i].token+']');
		}
		return s;
	}


	/**
		source -> WYSIWYG
		Substitutes the tokens with the placeholders.
	*/
	function _fromSrc(s) {
		var i,re;
		for(i=tokens.length-1; i>=0; i--) {
			re = new RegExp('\\[\\!'+tokens[i].escapedToken+'\\](?![^\\<\\>]*\\>)', 'gi');
			s = s.replace(re, '<img src="'+tokens[i].image+'" placeholder_data="'+tokens[i].token+'">');
		}
		return s;
	}
	
	
	//--------------------------------
	
	
	//BEGIN add the attribute placeholder_data as a valid one for img
	//note: the attribute list of img was taken from Schema.js
	if(editor.settings.extended_valid_elements == undefined)
		editor.settings.extended_valid_elements = 'img[src|alt|usemap|ismap|width|height|class|placeholder_data]';
	else {
		var i = editor.settings.extended_valid_elements.search(/img[\s]*\[[^\[\]]+\]/i);
		if(i==-1)
			editor.settings.extended_valid_elements += ',img[src|alt|usemap|ismap|width|height|class|placeholder_data]';
		else {
			var a = editor.settings.extended_valid_elements.substr(i);
			a = a.substr(a.indexOf('[')+1);
			editor.settings.extended_valid_elements = editor.settings.extended_valid_elements.substring(0,i) + 'img[placeholder_data|' + a;
		}
	}
	//END add the attribute placeholder_data as a valid one for img
	
	//prepare the menu list to be used in addButton() and addMenuItem()
	var placeholder_menu = new Array();
	for(var i=tokens.length-1; i>=0; i--) {
		//if a title was not set then set a default one
		if(tokens[i].title == undefined)
			tokens[i].title = tokens[i].token;
		
		placeholder_menu.push({text:tokens[i].title, token:tokens[i].token});
		
		//to prevent that special chars into the tokens make mess
		tokens[i].escapedToken = tokens[i].token.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
		
		//if an image was not set then set a default one
		if(tokens[i].image == undefined)
			tokens[i].image = url+'/placeholder.gif';
	}
	
	editor.addButton('placeholder', {
		text: 'Placeholder',
		type: 'listbox',
		values: placeholder_menu,
		onselect: function(e) {
			editor.insertContent('[!'+e.control.settings.token+']');
		}
	});
	editor.addMenuItem('placeholder', {
		text: 'Placeholder',
		context: 'insert',
		menu: placeholder_menu,
		onselect: function(e) {
			editor.insertContent('[!'+e.control.settings.token+']');
		}
	});
	
	editor.on('beforeSetContent', function(e) {
		e.content = _fromSrc(e.content);
	});
	editor.on('postProcess', function(e) {
		e.content = _toSrc(e.content);
	});
});
