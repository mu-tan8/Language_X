var oTag = null;
var oMenu , oXML , oXSL = [] , oDocument , oXHR , FileName;


function callbackf(mes){
	console.log(mes);
}
function loadURL(URL){
	var oXHR = (function(){
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
		return null;
	})();
	try{
		oXHR.open('get' , URL , false);
		oXHR.send(null);
		return oXHR.responseXML;
	}catch(e){
		callbackf(e);
	}
	var oAXML = (function(){
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
		return null;
	})();
	try{
		oAXML.async = false;
		oAXML.load(URL);
		return oAXML;
	}catch(e){
		callbackf(e);
	}
	//throw new Error("XML API , not support!");
}
function createDocument( XML , XSL ){
	
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
			return oXSLT.output;
		}catch(e){
			callbackf(e);
		}
	}
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
function DocToStr(oDoc){
	if (window.XMLSerializer){
		try{
			return (new XMLSerializer()).serializeToString(oDoc);
		}catch(){
			callbackf(e);
		}
	}else if(oDoc.xml){
		return oDoc.xml;
	}else{
		return oDoc.innerHTML || oDoc.documentElement.outerHTML;
	}
}
function StrToXMLDOM(str){
	try {
		return (new DOMParser()).parseFromString(str , 'application/xml');
	}catch(e){
		callbackf(e);
	};
	try {
		return loadURL(URL.createObjectURL(new Blob([str],{'type':'application/xml'})));
	}catch(e){
		callbackf(e);
	}
	var oAXML = (function (){
		try {
			return new ActiveXObject('Msxml2.FreeThreadedDOMDocument');
		}catch(e){
			callbackf(e);
		}
		try {
			return new ActiveXObject('Microsoft.XMLDOM');
		}catch(e){
			callbackf(e);
		}
		return null;
	})();
	try {
		oAXML.async = false;
		oAXML.loadXML(str);
		return oAXML;
	} catch(e) {
		callbackf(e);
	}
	return null;
}

function loadAs(obj){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	try{

		var oFR = new FileReader();
		oFR.onload = function(event){

			var oXHR = new XMLHttpRequest();
			oXHR.onload = function(){

					oDocument.getElementsByTagName('body')[0].innerHTML = createDocument(oXHR.responseXML,oXSL[0]).getElementsByTagName('body')[0].innerHTML;
					init();
					FileName = oFR.name;

					oXHR = oFR = null;
			}
			oXHR.onerror = function(event){
				document.getElementById('debug').value += oXHR.statusText;
				oXHR = oFR = null;
			}
			oXHR.responseType = 'document';
			oXHR.open('get' , URL.createObjectURL(new Blob([oFR.result],{type:'application/xml'})));
			oXHR.send(null);

		}
		oFR.onerror = function(e){
			document.getElementById('debug').value += oFR.error;
			oFR = null;
		}
		oFR.readAsText(obj.files[0]);

	}catch(e){
		callbackf(e);
	}
}
function saveAs(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	var oDOM = StrToXMLDOM(DocToStr(oDocument));	//	cleaning DOM.

	var nm = prompt('File Name :',''+(FileName || 'temp.xml'));
	FileName = (nm) ? nm : 'temp.xml' ;

	var a = document.createElement('a');
	if ( 'download' in a ){

		a.href = URL.createObjectURL(new Blob([DocToStr(createDocument(oDOM,oXSL[1]))] , {type:'application/xml'}));
		a.download = FileName;
		a.type = 'application/xml';
		a.click();

	}else{

		var w = window.open();
		w.document.open('application/xml');
		w.document.write(createDocument(oDOM,oXSL[1]));
		w.document.close();
		w.alert('右クリックからファイル名をつけて保存してね。');

	}
	oDOM = a = null;

	//	Lost Logia (Attach a Name to the Download File )
/*
	var oXHR = new XMLHttpRequest();
	oXHR.onload = function(){

		var oFR = new FileReader();

		oFR.onload = function (){
			window.open(oFR.result);
			oDOM = oXHR = null;
		}
		oFR.onerror = function(e){
			document.getElementById('debug').value += oFR.error;
		}

		oFR.readAsDataURL(oXHR.response);

	}
	oXHR.onerror = function(event){
		document.getElementById('debug').value += oXHR.statusText;
	}
	oXHR.overrideMimeType('application/octet-stream');
	oXHR.responseType = 'blob';
	oXHR.open('get' , URL.createObjectURL(new Blob([(new XMLSerializer()).serializeToString(oXSLT[1].transformToDocument(oDOM))] , {type:'application/xml'})));
	oXHR.setRequestHeader('Content-Disposition','attachment;filename='+nam+'');
	oXHR.send(null);
*/

	
}
function preview(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	var oDOM = StrToXMLDOM(DocToStr(oDocument));

	alert(DocToStr(createDocument(oDOM,oXSL[1])));

	oDOM = null;
}