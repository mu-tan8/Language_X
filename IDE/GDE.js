var oTag = null;
var oMenu , oXML , oXSL = [] , oDocument , oXHR , FileName = 'temp.xml' , AppName;


function callbackf(mes){
	console.log(mes);
}
function createXHRObject(){
	try{
		return new XMLHttpRequest();
	}catch(e){
		callbackf(e);
	}
	try{
		return new ActiveXObject("Msxml2.XMLHTTP");
	}catch(e){
		callbackf(e);
	}
	//return null;
}
function createXMLObject(){
	try{
		return new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
	}catch(e){
		callbackf(e);
	}
	try{
		return new ActiveXObject("Microsoft.XMLDOM");
	}catch(e){
		callbackf(e);
	}
	//return null;
}
function DocToStr(oDoc){	//	[Strings] DocToStr( XMLDOMObject )
	if (window.XMLSerializer){
		try{
			return (new XMLSerializer()).serializeToString(oDoc);
		}catch(e){
			callbackf(e);
		}
	}else if('xml' in oDoc){
		return oDoc.xml;
	}else{
		return (('innerHTML' in oDoc) ? oDoc.innerHTML : oDoc.documentElement.outerHTML);
	}
}
function StrToXMLDOM(str){	//	[XMLDOMObject] StrToXMLDOM( XMLStrings )
	if (window.DOMParser){
		try {
			return (new DOMParser()).parseFromString(str , 'application/xml');
		}catch(e){
			callbackf(e);
		}
	}else if(window.URL){
		try {
			return loadURL(URL.createObjectURL(new Blob([str],{'type':'application/xml'})));
		}catch(e){
			callbackf(e);
		}
	}else{
		var oAXML = createXMLObject();
		if (oAXML){
			try{
				oAXML.async = false;
				oAXML.loadXML(str);
				return oAXML;
			} catch(e) {
				callbackf(e);
			}
		}
	}
	//return null;
}

function loadURL(URL){	//	[XMLDOMObject] loadURL( Strings )
	var oXHR = createXHRObject();
	if (oXHR){
		try{
			oXHR.open('get' , URL , false);
			//oXHR.responseType = 'document';
			oXHR.send(null);
			return oXHR.responseXML;
		}catch(e){
			callbackf(e);
		}
	}
	var oAXML = createXMLObject();
	if (oAXML){
		try{
			oAXML.async = false;
			oAXML.load(URL);
			return oAXML;
		}catch(e){
			callbackf(e);
		}
	}
	//throw new Error("XML API , not support!");
}
function createDocument( XML , XSL ){	//	[XMLDOMObject] createDocument( XMLDOMObject , XSLDOMObject )
	
	if(window.XSLTProcessor){
		try {
			var oXSLT = new XSLTProcessor();
			oXSLT.importStylesheet(XSL);
			return oXSLT.transformToDocument(XML);
		}catch(e){
			callbackf(e);
		}
	}else{
		try {
			var oXSLT = new ActiveXObject("Msxml2.XSLTemplate");
			oXSLT.stylesheet = XSL;
			oXSLT = oXSLT.createProcessor();
			oXSLT.input = XML;
			oXSLT.transform();
			return StrToXMLDOM(oXSLT.output);
		}catch(e){
			callbackf(e);
		}
		if ('transformNode' in XML){
			try {
				return XML.transformNode(XSL);
			}catch(e){
				callbackf(e);
			}
		}
	}
	//return null;
}

	oXSL[0] = loadURL('XtoGDE.xsl');
	oXSL[1] = loadURL('GDEtoX.xsl');

window.onload = function(){

	oMenu = document.getElementById('menu');
	newDocument();
	init();
	document.onclick = function (){
		oMenu.style.display = 'none';
	}
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	AppName = document.title;
	
}
function doDrag(event){
	if (event.target && event.target.getAttribute('draggable')){
		oTag = event.target;
	}
}
function allowDrop(event){
	if (event.target){
		if (event.target.tagName == 'DIV'){
			if (oTag.className != 'attribute' || (event.target.className == 'element' && oTag.className == 'attribute')){
				event.preventDefault();
			}
		}
	}
}
function doDrop(event){
	if (event.target && !oTag.contains(event.target)){
		if (event.target.tagName == 'DIV'){
				oTag.parentNode.removeChild(oTag);
				oTag.style.margin = '5%';
				event.target.appendChild(oTag);
				oTag = null;
				event.preventDefault();
		}
	}
}
function delAttr(){
	var oAttrSet = document.getElementById('attr');
	while (oAttrSet.hasChildNodes()){
		oAttrSet.removeChild(oAttrSet.childNodes[0]);
	}
	oAttrSet = null;
}
function autoSelect(value){
	delAttr();
	document.order.elemName.hidden = true;
	var oAttrSet = document.getElementById('attr');
	var callAttr = function (arg){
		for (var i = 0;i < arg.length;i++){
			oLabel = document.createElement('label');
			oLabel.appendChild(document.createTextNode('@'+arg[i]+'='));
			oInput = document.createElement('input');
			oInput.name = arg[i];
			oLabel.appendChild(oInput);
			oAttrSet.appendChild(oLabel);
			oAttrSet.appendChild(document.createTextNode(' ,\n'));
			oAttrSet.appendChild(document.createElement('br'));
		}
		oLabel = oInput = null;
	}
	switch(value){
		case 'var':
			callAttr(['name','type','value']);
			break;
		case 'if':
		case 'while':
			callAttr(['test']);
			break;
		case 'switch':
			callAttr(['select']);
			break;
		case 'func':
			callAttr(['name','args','type']);
			break;
		case 'for':
			callAttr((confirm('Basic modeで入力しますか？\n[from-to-step]')) ? ['from','to','step'] : ['do','test','next']);
			break;
		case 'assign':
			callAttr(['select']);
			break;
		case '':
			document.order.elemName.hidden = false;
			break;
		default :
			break;
	}
	callAttr = oAttrSet = null;
}
function autoInsert(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;
	oElem = oTag || oDocument.getElementById('xml').getElementsByTagName('div')[0];
	switch (document.order.insertTag.value){
		case 'var':
			oElem = addTag(oElem , 'var');
			addAttr(oElem , {'name':'name' , 'value':document.order.elements['name'].value});
			addAttr(oElem , {'name':'type' , 'value':document.order.elements['type'].value});
			addAttr(oElem , {'name':'value' , 'value':document.order.elements['value'].value});
			break;
		case 'if':
			oElem = addTag(oElem , 'if');
			addAttr(oElem , {'name':'test' , 'value':document.order.test.value});
			addTag(oElem , 'then');
			addTag(oElem , 'else');
			break;
		case 'switch':
			oElem = addTag(oElem , 'switch');
			addAttr(oElem , {'name':'select' , 'value':document.order.select.value});
			break;
		case 'while':
			oElem = addTag(oElem , 'while');
			addAttr(oElem , {'name':'test' , 'value':document.order.test.value});
			break;
		case 'assign':
			oElem = addTag(oElem , 'assign');
			addAttr(oElem , {'name':'select' , 'value':document.order.select.value});
			break;
		case '':
		default:
			oElem = addTag(oElem , document.order.elemName.value || prompt('要素"'+oElem.getElementsByTagName('span')[0].innerHTML+'"に追加する子要素名',''));
			addAttr(oElem , {'name':document.order.attrName.value , 'value':document.order.attrValue.value});
			break;
	}
	oElem = null;
}
function addTag(oElem , str){
	if (oElem && oElem.getAttribute('class') == 'element'){
		if (str){
			var oDiv = document.createElement('div');
			var oSpan = document.createElement('span');
			oDiv.setAttribute('class' , 'element');
			oDiv.setAttribute('draggable' , 'true');
			oDiv.style.margin = '5%';
			oSpan.setAttribute('class' , 'name');
			oSpan.appendChild(document.createTextNode(str));
			oDiv.appendChild(oSpan);
			oSpan = null;
			oElem.appendChild(oDiv);
			return oDiv;
		}
	}
}
function addAttr(oElem , obj){
	if (oElem && oElem.getAttribute('class') == 'element'){
		if (('name' in obj && 'value' in obj) && (obj['name'] && obj['value'])){
			var oSpan = document.createElement('span');
			oSpan.setAttribute('class' , 'attribute');
			oSpan.setAttribute('draggable','true');
			oSpan.appendChild(document.createTextNode('@'));

			var oAtSpan = document.createElement('span');
			oAtSpan.setAttribute('class' , 'name');
			oAtSpan.appendChild(document.createTextNode(obj['name']));
			oSpan.appendChild(oAtSpan);
			oSpan.appendChild(document.createTextNode('='));
			oAtSpan = null;

			var oAtSpan = document.createElement('span');
			oAtSpan.setAttribute('class' , 'value');
			oAtSpan.setAttribute('contentEditable' , 'true');
			oAtSpan.onblur = function (event){
				if (!event.target.hasChildNodes()){
					event.target.appendChild(document.createTextNode('null'));
				}else if(/^\s+$|^(\s*\<br\s*\/?\s*\>\s*)+$/.test(event.target.innerHTML)){
					event.target.innerHTML = 'null';
				}
			}
			oAtSpan.appendChild(document.createTextNode(obj['value']));
			oSpan.appendChild(oAtSpan);
			oAtSpan = null;

			oElem.appendChild(oSpan);
			oSpan = null;
		}
	}
}
function addValue(oElem){
	if (document.order.vMode.checked){
		var value =  'comment';
		var sign = ['<!--\n' , '\n-->'];
	}else{
		var value = 'text' ;
		var sign = ['<![CDATA[\n' , '\n]]>'];
	}
	if (oElem && oElem.getAttribute('class') == 'element'){
		if (document.order.strValue.value){
			var oDiv = document.createElement('div');
			oDiv.setAttribute('class' , value);
			oDiv.setAttribute('draggable','true');
			oDiv.appendChild(document.createTextNode(sign[0]));
			var oSpan = document.createElement('span');
			oSpan.setAttribute('class','value');
			oSpan.setAttribute('contentEditable','true');
			oSpan.onblur = function (event){
				if (!event.target.hasChildNodes()){
					event.target.appendChild(document.createTextNode('null'));
				}else if(/^\s+$|^(\s*\<br\s*\/?\s*\>\s*)+$/.test(event.target.innerHTML)){
					event.target.innerHTML = 'null';
				}
			}
			oSpan.appendChild(document.createTextNode(document.order.strValue.value));
			oDiv.appendChild(oSpan);
			oDiv.appendChild(document.createTextNode(sign[1]));
			oElem.appendChild(oDiv);
			oDiv = oSpan = null;
		}
	}
	sign = value = null;
}
function addPI(oElem , obj){
	if (oElem && oElem.tagName == 'DIV'){
		if(('target' in obj && 'data' in obj) && (obj['target'] && obj['data'])){
			var oDiv = document.createElement('div');
			oDiv.setAttribute('class' , 'processing-instruction');
			oDiv.setAttribute('draggable','true');
			oDiv.appendChild(document.createTextNode('<?'));

			var oSpan = document.createElement('span');
			oSpan.setAttribute('class' , 'target');
			oSpan.appendChild(document.createTextNode(obj['target']));
			oDiv.appendChild(oSpan);
			oSpan = null;
			oDiv.appendChild(document.createTextNode('\n'));

			var oSpan = document.createElement('span');
			oSpan.setAttribute('class' , 'data');
			oSpan.setAttribute('contentEditable' , 'true');
			oSpan.onblur = function (event){
				if (!event.target.hasChildNodes()){
					event.target.appendChild(document.createTextNode('null'));
				}else if(/^\s+$|^(\s*\<br\s*\/?\s*\>\s*)+$/.test(event.target.innerHTML)){
					event.target.innerHTML = 'null';
				}
			}
			oSpan.appendChild(document.createTextNode(obj['data']));
			oDiv.appendChild(oSpan);
			oSpan = null;
			oDiv.appendChild(document.createTextNode('\n?>'));

			oElem.appendChild(oDiv);
		}
	}
}
function removeTag(oElem){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;
	if (oElem != oDocument.getElementById('xml').getElementsByTagName('div')[0]){
		if (oElem.getAttribute('class') == 'attribute' || oElem.tagName == 'DIV'){
			oElem.parentNode.removeChild(oElem);
			oTag = null;
		}
	}
}
function copyTag(oElem){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;
	if (oElem != oDocument.getElementById('xml').getElementsByTagName('div')[0]){
		if (oElem.getAttribute('class') == 'attribute' || oElem.tagName == 'DIV'){
			document.getElementById('board').appendChild(oElem.cloneNode(true));
			oTag = null;
		}
	}
}
function cutTag(oElem){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;
	if (oElem != oDocument.getElementById('xml').getElementsByTagName('div')[0]){
		if (oElem.getAttribute('class') == 'attribute' || oElem.tagName == 'DIV'){
			document.getElementById('board').appendChild(oElem.parentNode.removeChild(oElem));
			oTag = null;
		}
	}
}
function eraseBoard(){
	oBoard = document.getElementById('board');
	while (oBoard.hasChildNodes()){
		oBoard.removeChild(oBoard.childNodes[0]);
	}
}
function openMenu(event){
	oTag = event.target;
	oMenu = document.getElementById('menu');
	oMenu.style.left = ''+event.pageX+'px';
	oMenu.style.top = ''+event.pageY+'px';
	oMenu.style.display = 'block';
	oMenu.getElementsByTagName('div')[4].hidden = !(document.getElementById('board').getElementsByTagName('*').length);
	event.preventDefault();
}

function loadAs(obj){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	try{

		var oFR = new FileReader();
		oFR.onload = function(event){

			var oXHR = createXHRObject();
			oXHR.onload = function(){

					oDocument.getElementsByTagName('body')[0].innerHTML = createDocument(oXHR.responseXML,oXSL[0]).getElementsByTagName('body')[0].innerHTML;
					init();
					FileName = obj.files[0].name;
					document.title = AppName + ' ['+FileName+']';

					oXHR = oFR = null;
			}
			oXHR.onerror = function(event){
				document.getElementById('debug').value += oXHR.statusText;
				oXHR = oFR = null;
			}
			oXHR.open('get' , URL.createObjectURL(new Blob([oFR.result],{type:'application/xml'})));
			oXHR.responseType = 'document';
			oXHR.send(null);

		}
		oFR.onerror = function(e){
			document.getElementById('debug').value += oFR.error;
			oFR = null;
		}
		oFR.readAsText(obj.files[0]);
		return true;

	}catch(e){
		callbackf(e);
	}
	try {

		var oFSO = new ActiveXObject("Scripting.FileSystemObject");
		if (oFSO.FileExists(obj.value)){

			oDocument.getElementsByTagName('body')[0].innerHTML = createDocument(StrToXMLDOM(oFSO.OpenTextFile(obj.value).ReadAll()),oXSL[0]).getElementsByTagName('body')[0].innerHTML;
			init();
			FileName = oFSO.GetFileName(obj.value);
			document.title = AppName + ' ['+FileName+']';
		}

		return true;

	}catch(e){
		callbackf(e);
	}
}
function saveAs(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	var oDOM = StrToXMLDOM(DocToStr(oDocument));	//	cleaning DOM.

	var nm = prompt('ファイル名を入力してください（半角英数字のみ）\nInput a File Name (alphabets or numbers only) :',''+FileName);
	if (nm){
		FileName = (nm.match(/[^a-zA-Z0-9_\.]/)) ? 'temp.xml' : nm ;
	}else{	// null or emptystrings
		return false;
	}
	document.title = AppName + ' ['+FileName+']';

	var buf = DocToStr(createDocument(oDOM,oXSL[1]));
	buf = (buf.match(/^\<\?xml/i)) ? buf : '<?xml version="1.0"?>'+buf ;

	var a = document.createElement('a');
	if ('msSaveBlob' in navigator){		// MSIE

		navigator.msSaveBlob(new Blob([buf] , {type:'application/xml'}) , FileName);

	}else if ( 'download' in a ){	// 	if supported download attribute with anchor element

		a.href = URL.createObjectURL(new Blob([buf] , {type:'application/xml'}));
		a.download = FileName;
		a.type = 'application/xml';
		a.click();

	}else if(window.URL && window.Blob ){	//	if supported createObjectURL method and blob object 

		try {

			var oXHR = createXHRObject();
			oXHR.onload = function(){

				var oFR = new FileReader();

				oFR.onload = function (){
					window.open(oFR.result);	//	data URI open the new window . ( Hopefully the download will start )
					oDOM = buf = oXHR = null;
				}
				oFR.onerror = function(e){
					document.getElementById('debug').value += oFR.error;
					oDOM = buf = oXHR = null;
				}

				oFR.readAsDataURL(oXHR.response);	//	create data URI scheme ( data:// ) from blob Object . 

			}
			oXHR.onerror = function(event){
				document.getElementById('debug').value += oXHR.statusText;
				oDOM = buf = oXHR = null;
			}

			oXHR.open('get' , URL.createObjectURL(new Blob([buf] , {type:'application/xml'})));	//	create blob URI scheme ( blob:// ) .   

			oXHR.responseType = 'blob';
			if ('overrideMimeType' in oXHR){
				oXHR.overrideMimeType('application/octet-stream');
			}else {
				oXHR.setRequestHeader('Content-Type','application/octet-stream');
			}
			oXHR.setRequestHeader('Content-Disposition','attachment;filename='+FileName+'');
			oXHR.send(null);

		}catch(e){
			callbackf(e);
		}

	}else{

		var w = window.open();
		w.document.open('application/xml');
		w.document.write(buf);
		w.document.close();
		w.document.title = FileName;
		w.alert('このページにファイル名をつけて保存してね。\n Please , Save As this page !');
		oDOM = buf = w = null;

	}
	a = null;

	//return true;
}
function preview(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	var oDOM = StrToXMLDOM(DocToStr(oDocument));
console.log(oDOM);
	alert(DocToStr(createDocument(oDOM,oXSL[1])));

	oDOM = null;
}