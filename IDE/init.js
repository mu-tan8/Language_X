function newDocument(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;

	oDocument.getElementsByTagName('body')[0].innerHTML =
		'<div id="xml">'
	+	'<span class="xml">?xml <span class="version">version="1.0"</span>?</span>'
	+	'<div class="element" style="background-color:#ffff66;" onclick="oTag = event.target">'
	+	'<span class="name" style="position:absolute;">source</span>'
	+	'<div class="element" draggable="true"><span class="name">var</span><span class="attribute" draggable="true">@<span class="name">name</span>=<span class="value" contentEditable="true">a</span></span></div>'
	+	'<div class="element" draggable="true"><span class="name">assign</span></div>'
	+	'</div>'
	+	'</div>';
	oDocument.getElementsByTagName('head')[0].innerHTML = '<link rel="stylesheet" type="text/css" href="IDE.css" />'
	+	'<link rel="stylesheet" type="text/css" href="UI.css" />';
}
function init(){
	oXML = document.getElementById('oXML');
	oDocument = oXML.document || oXML.contentDocument;
	oDiv = oDocument.getElementById('xml').getElementsByTagName('div')[0];
	oDiv.ondragstart = function (event){
		doDrag(event);
	}
	oDiv.ondragover = function (event){
		allowDrop(event);
	}
	oDiv.ondrop = function (event){
		doDrop(event);
	}
	oDiv.oncontextmenu = function (event){
		openMenu(event);
	}
	oDiv.onclick = function (event){
		oTag = event.target;
	}
	oDiv.ondblclick = function (event){
		oTag = event.target;
		if (oTag.className == 'element'){
			oElem = oTag.getElementsByTagName('span')[0];
			AttrName = prompt('要素"'+oElem.innerHTML+'"に追加する属性名','');
			if (AttrName){
				AttrValue = prompt('属性"'+AttrName+'"に紐付く属性値','');
				if (AttrValue){
					addAttr(oTag , {'name':AttrName , 'value':AttrValue });
				}
			}
		}
		event.stopPropagation();
	}
	oDocument.getElementById('xml').ondblclick = function (event){
		var flg = false;
		if (event.target.getElementsByTagName('div').length){
			flg = confirm('新しくルート要素を創ります。\n全ての子要素が削除されますがよろしいですか？');
			if (flg){
				while (event.target.getElementsByTagName('div').length){
					event.target.removeChild(event.target.getElementsByTagName('div')[0]);
				}
			}
		}
		if (event.target.getElementsByTagName('div').length == 0){
			RootName = prompt('ルート要素名を入力してください','source');
			if (RootName){
				oDiv = oDocument.createElement('div');
				oDiv.setAttribute('class','element');
				oDiv.style.backgroundColor = '#ffff66';
				oSpan = oDocument.createElement('span');
				oSpan.setAttribute('class','name');
				oSpan.style.position = 'absolute';
				oSpan.appendChild(document.createTextNode(RootName));
				oDiv.appendChild(oSpan);
				event.target.appendChild(oDiv);
				init();
				oTag = oDiv;
			}
		}
	}
	oDocument.onclick = function (){
		oMenu.style.display = 'none';
	}

		
}