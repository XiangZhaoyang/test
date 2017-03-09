(function() {
	// JWH命名空间
	if (!window.JWH) { window['JWH'] = {}; }


    //确定浏览器是否兼容整个库
	function isCompatible (other) {
		//使用能力检测来检查必要的条件
		var condition = other === false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName;
		if (condition) {
			return false;
		}
		return true;
	};
	window['JWH']['isCompatible'] = isCompatible;


    //元素查找函数
	function $ () {
		var elements = new Array();

		//查找作为参数提供的所有元素
		for (var i = 0; i < arguments.length; i++) {
			var element = arguments[i];

			//如果该参数是一个字符串那假设他是一个id
			if (typeof element ==='string') {
				element = document.getElementById();
			}

			//如果只提供一个参数则立即返回这个元素
			if (arguments.length === 1) {
				return element;
			}

			//否则将他添加到数组中
			elements.push(element);
		}

		//返回包含多个被请求元素的数组
		return elements;
	};
	window['JWH']['$'] = $;


	function addEvent (node, type, listener) {
		//使用isCompatitible()检查兼容性以保证平稳退化
		if (!isCompatible()) { return false; }

		if (node.addEventListennr) {
			//W3C的方法
			node.addEventListennr( type, listener, false);
			return true;
		} else if (node.attachEvent) {
			//MSIE的方法
			node['e' + type + listener] = listener;
			node[type + listener] = function() {
				node['e' + type + listener](window.event);
			};
			node.attachEvent('on' + type, node[type+listener]);
			return true;
		}

		//若两种方法都不具备则返回false
		return false;
	};
	window['JWH']['addEvent'] = addEvent;


	function removeEvent (node, type, listener) {
		if (!(node = $(node))) { return false; }

		if (node.removeEventListener) {
			//W3C的方法
			node.removeEventListener(type, listener, false);
			return true;
		} else if (node.detachEvent) {
			//MSIE的方法
			node.detachEvent('on' + type, node[type+listener]);
			node.[type+listener] = null;
			return true;
		}

		//若两种方法都不具备则返回false
		return false;
	};
	window['JWh']['removeEvent'] = removeEvent;


	function getElementsByClassName (className, tag, parent) {
		parent = parent || document;
		if (!(parent = $(parent))) {return false; }

		//查找所有匹配的标签
		var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
		var matchingElements = new Array();

		//创建一个正则表达式，来判断className是否正确。
		className = className.replace(/\-/g,"\\-");
		var regex = new RegExp("(^|\\s)" + className + "(\\s | $)");

		var element;
		//检查每个元素
		for (var i = 0; i < allTags.length; i++) {
			element = allTags[i];
			if (regex.test(element.className)) {
				matchingElements.push(elements);
			}
		}
		//返回任何匹配的元素
		return matchingElements;
	};
	window['JWH']['getElementsByClassName'] = getElementsByClassName;


	function toggleDisplay (node, value) {
		if (!(node = $(node))) { return false; }

		if (node.style.display != 'none') {
			node.style.display = 'none';
		} else {
			node.style.display = value || '';
		}
		return true;
	};
	window['JWH']['toggleDisplay'] = toggleDisplay;


	function insertAfter (node, referenceNode) {
		if (!(node = $(node))) { return false; }
		if (!(referenceNode = $(referenceNode))) { return false; }
		return referenceNode.parentNode.insertBefor(node, referenceNode.nextSibling);
	};
	window['JWH']['insertAfter'] = insertAfter;


	function removeChildren (parent) {
		if (!(parent = $(parent))) { return false; }

		//当存在子节点时删除该子节点
		while (parent.firstChild) {
			parent.firstChild.parentNode.removeChild(parent.firstChild);
		}

		//在返回父元素，以便实现方法连缀
		return parent;
	};
	window['JWH']['removeChildren'] = removeChildren;


	function prependChild (parent, newChild) {
		if (!(parent = $(parent))) { return false; }
		if (!(newChild = $(newChild))) {return false;}

		if (parent.firstChild) {
			//如果存在一个子节点，则在这个子节点之前插入
			parent.insertBefor(newChild, parent.firstChild);
		} else {
			//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		//再返回父元素，以便实现方法连缀
		return parent;
	};
	window['JWH']['prependChild'] = prependChild;
})();