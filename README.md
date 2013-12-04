## About Placeholder:
A customizable placeholder plugin for TinyMCE 4. Released under the [MIT license](http://www.opensource.org/licenses/mit-license.php).

It can be used to put images as placeholders for tokens into the editor. Looking at the html code produced by TinyMCE, the tokens are visible in their textual form.

When the content of the editor is elaborated by, for example, a server-side script like php, then the tokens can be elaborated, substituted.
The tokens managed by this plugin are like this: `[!name]`, where *name* is be defined into the configuration code of TinyMCE.

## Configuration
Into the configuration of TineMCE 'placeholder_tokens' should be declared as an
array of objects.
Each object can have the following properties:

- **token**	The token name.
- **title**	[optional] The text that will be used into the menus.
- **image**	[optional] The image url that will be used as placeholder.

### Example of configuration

	tinymce.init({
		plugins: [ "placeholder" ],
		toolbar: "placeholder",
		placeholder_tokens: [
			{ token: "foo", title: "Foo example", image: "images/t_foo.gif" },
			{ token: "placeholder" },
			{ token: "project_path", image: "images/t_project_path.gif" }
		]
	});


## Changelog:

### Version 1.0 - December 01 2013
* First release
