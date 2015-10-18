//
//
//		x language main library
//
//
//
//	call method
//		void parse( rootnode );
//
//


/*	x literal	*/

function x_parse_bool(value){
	if (value.match(/\&\&|\|\|/)){	//	&& || 
		var sign = RegExp.lastMatch;
		var left = RegExp.leftContext;
		var right = RegExp.rightContext;
		if (sign == "&&"){
			return (x_parse_bool(left) && x_parse_bool(right));
		}else if (sign == "||"){
			return (x_parse_bool(left) || x_parse_bool(right));
		}
	} else if (value.match(/\s(and|or)\s/)){	//	 and   or 
		var sign = RegExp.lastMatch;
		var left = RegExp.leftContext;
		var right = RegExp.rightContext;
		if (sign == "and"){
			return (x_parse_bool(left) && x_parse_bool(right));
		}else if (sign == "or"){
			return (x_parse_bool(left) || x_parse_bool(right));
		}
	} else if (value.match(/[\<\>\!\=][\=]?/)){	//	< <= > >= ! != = == 
		var sign = RegExp.lastMatch;
		var left = RegExp.leftContext;
		var right = RegExp.rightContext;
		if (sign == "="){
			var varie = left.match(/\$[a-zA-Z_][a-zA-Z0-9_]*(\[(\$?[a-zA-Z0-9_]+)\])?/);	//	$name $_num[0] $s[str] $a[$v6]
			if (varie){
				var name = varie[0].match(/\$[a-zA-Z_][a-zA-Z0-9_]*/);	//	$name
				main[name] = x_parse_varie(right);
				return (main[name] == x_parse_varie(right));
			} else {
				return false;
			}
		}else if (sign == "<"){
			return (x_parse_bool(left) < x_parse_bool(right));
		}else if (sign == ">"){
			return (x_parse_bool(left) > x_parse_bool(right));
		}else if (sign == "!="){
			return (x_parse_bool(left) != x_parse_bool(right));
		}else if (sign == "=="){
			return (x_parse_bool(left) == x_parse_bool(right));
		}else if (sign == "<="){
			return (x_parse_bool(left) <= x_parse_bool(right));
		}else if (sign == ">="){
			return (x_parse_bool(left) >= x_parse_bool(right));
		}
	} else {
		if (typeof(x_parse_varie(value)) == "undefined"){
			return false;
		} else {
			return x_parse_double(x_parse_varie(value));
		}
	}
	return void(0);
}

function x_parse_integer(strings){
	var digit = strings.match(/\-?\d+/);
	return (digit) ? parseInt(digit) : strings;
}

function x_parse_double(strings){
	var point = strings.match(/\-?\d+(\.\d+)?/);
	return (point) ? parseFloat(point) : strings;
}

function x_parse_varie(strings){
	var varie = strings.match(/\$[a-zA-Z_][a-zA-Z0-9_]*(\[(\$?[a-zA-Z0-9_]+)\])?/);	//	$name $_num[0] $s[str] $a[$v6]
	if (varie){
		var name = varie[0].match(/\$[a-zA-Z_][a-zA-Z0-9_]*/);	//	$name
		var ary = varie[0].match(/\[(\$?[a-zA-Z0-9]+)\]/g);	//	[num] [num][9]
		if (ary){
			var r = /\$[a-zA-Z_][a-zA-Z0-9_]*|[a-zA-Z0-9]+/;
			var value = main[name][x_parse_varie(ary[0].match(r)[0])];	//	main[$name][][]
			for (var a = 1;a < ary.length;a++){
				value = value[ary[a].match(r)[0]];	
			}
		}else{
			var value = main[name];	//	main[$name]
		}
		if (typeof(value) != 'undefined'){strings = strings.replace(varie[0] , value)};
	}
	return strings;
}

function x_parse(strings){
	var parse = strings.match(/\{[^\}]+\}/mg);
	for (var a = 0;a < parse.length;a++){
		strings = strings.replace(parse[a] , x_parse_varie(parse[a].match(/\$[a-zA-Z_][a-zA-Z0-9_]*(\[(\$?[a-zA-Z0-9_]+)\])?/)[0]));
	}
	return strings;
}

function x_array(list){
	var array = list.split(" ");
	for (var a = 0;a < array.length;a++){
		array[a] = x_parse_varie(array[a]);
	}
	return array;
}

function x_plain(text){
	text = text.replace("&lt;","<");
	text = text.replace("&gt;",">");
	text = text.replace("&amp;","&");
	text = text.replace("&quot;",'"');
	return (text);
}

/*	term x literal	*/



/*	x instruction	*/

function x_var(node){
	var name = node.getAttribute('name');
	var type = node.getAttribute('type');
	var value = node.getAttribute('value');
	switch (type){
		case 'ary' :
			var vAry = x_array(value);
			if (!(isNaN(vAry)) || vAry.length){
				var len = (vAry.length) ? vAry.length : vAry - 0 ;
				var a = 0 , hAry = [] , key;
				for (var i = 0;i < len;i++){
					Hash = vAry[i].split(':');
					if (Hash.length == 2){
						hAry[Hash[0]] = Hash[1];
					}else{
						hAry[a] = vAry[i] || null;
						a++;
					}
				}
				main['$'+name] = hAry;
			}else {
				main['$'+name] = [];
			}
			break;
		case 'str' :
			main['$'+name] = (value) ? ''+value : '' ;
			break;
		case 'int' :
			main['$'+name] = (value) ? parseInt(value) : 0 ;
			break;
		case 'dbl' :
			main['$'+name] = (value) ? parseFloat(value) : 0.0 ;
			break;
		default :
			main['$'+name] = (value) ? value : null ;
			break;
	}
}

function x_calc(node){
	var vAry = x_array(node.getAttribute('value'));
	var value = Number(vAry.shift());
	switch(node.getAttribute('type')){
		case "add" :
			for (var i = 0; i < vAry.length ; i++){
				value += (vAry[i] - 0);
			}
			break;
		case "diff" :
			for (var i = 0; i < vAry.length ; i++){
				value -= (vAry[i] - 0);
			}
			break;
		case "multi" :
			for (var i = 0; i < vAry.length ; i++){
				value *= (vAry[i] - 0);
			}
			break;
		case "div" :
			for (var i = 0; i < vAry.length ; i++){
				value /= (vAry[i] - 0);
			}
			break;
		case "mod" :
			for (var i = 0; i < vAry.length ; i++){
				value %= (vAry[i] - 0);
			}
			break;
	}
	main[node.getAttribute('return')] = value;
}

function x_if(node){
	if (x_parse_bool(x_plain(node.getAttribute('test')))){
		parse(node.getElementsByTagName('then')[0]);
	}else{
		parse(node.getElementsByTagName('else')[0]);
	}
}

function x_while(node){
	while (x_parse_bool(x_plain(node.getAttribute('test')))){
		parse(node.firstChild);
	}
}

function x_echo(text){
	js_echo(x_plain(x_parse(text)));
}

/*	term x instructon	*/





var main = [];	// global variable

function parse(sub){
	var alias = sub;
	if (!alias){return void(0)}
	do {
		if (alias.nodeType == 1){
			if (alias.namespaceURI == "http://mutan8.exout.net/"){
				var tagName = alias.baseName || alias.localName ;
				switch (tagName){
					case "var" :
						x_var(alias);
						break;
					case "calc" :
						x_calc(alias);
						break;
					case "while":
						x_while(alias);
						break;
					case "echo" :
						var Text = alias.text || alias.textContent;
						x_echo(Text);
						break;
					default :
						
						parse(alias.firstChild);
						break;
				}
			}else{
				
				parse(alias.firstChild);
			}
		}
	} while (alias = alias.nextSibling);
}
