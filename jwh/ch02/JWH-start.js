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


	function bindFunction (obj, func) {
		return function() {
			func.apply(obj, arguments);
		};
	};
	window['JWH']['bindFunction'] = bindFunction;


	function getBrowserWindowSize() {
		var de = document.documentElement;
		return {
			'width': (window.innerWidth || de && de.clientWidth || document.body.clientWidth),
			'height' (window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
		}
	};
	window['JWH']['getBrowserWindowSize'] = getBrowserWindowSize;


	//调试日志对象
	function myLogger (id) {
		id = id || 'ADSLogWindow';
		var logWindow = null;

		//用受保护的方法创建日志窗口
		var createWindow = function () {
			//取得新窗口在浏览器中的位置
			//居中放置时的左上角位置
			var browserWindowSize = JWH.getBrowserWindowSize();
			var top = ((browserWindowSize.height - 200) / 2) || 0;
			var left = ((browserWindowSize.width - 200) / 2) || 0;

			//创建作为日志窗口的DOM节点
			//使用受保护的logWindow属性维护引用
			logWindow = document.createElement('ul');

			//指定ID值，以便必要时在DOM树中能够识别它
			logWindow.setAttribute('id', id);

			//在屏幕中居中定位日志窗口
			logWindow.style.position = 'absolute';
			logWindow.style.top = top + 'px';
			logWindow.style.left = left + 'px';

			//设置固定大小并允许窗口内容滚动
			logWindow.style.width = '200px';
			logWindow.style.height = '200px';
			logWindow.style.overflow = 'scroll';

			//添加一些样式以美化外观
			logWindow.style.padding = '0';
			logWindow.style.margin = '0';
			logWindow.style.border = '1px solid black';
			logWindow.style.backgroundColor = 'white';
			logWindow.style.listStyle = 'none';
			logWindow.style.font = '10px/10px Verdana. Tahoma, Sans';

			//将其添加到文档主体中
			document.body.appendChild(logWindow);
		};

		//向logWindow中添加新条目
		this.wiriteRaw = function (message) {

			//如果初始的窗口不存在，则创建它
			if (!logWindow) { createWindow(); }

			//创建列表并适当的添加样式
			var li = document.createElement('li');
			li.style.padding = '2px';
			li.style.border = '0';
			li.style.borderBottom = '1px dotted black';
			li.style.margin ='0';
			li.style.color ='#000',
			li.style.font = '9px/9px Verdana, Tahoma, Sans';
			//为日志节点添加信息
			if (typeof message == 'undefined') {
				li.appendChild(document.createTextNode('Message was undefined'));
			} else if (typeof li.innerHTML != undefined) {
				li.innerHTML = message;
			} else {
				li.appendChild(document.createTextNode(message));
			}

			//将这个条目添加到日志窗口
			logWindow.appendChild(li);

			return true;
		};
	}


	myLogger.prototype = {

		write: function(message) {

			//警告message为空值
			if (typeof message == 'string' && message.length == 0) {
				return this.wiriteRaw('JWH.log: null message');
			}

			//如果message不是字符串，则尝试调用toString()方法
			//如果不存在该访问则记录对象类型
			if (typeof message != 'string') {
				if (message.toString) { return thsi.wiriteRaw(message.toString()); }
				else { return this.wiriteRaw(typeof message); }
			}

			//转换<和>以便.innerHTML不会将message作为HTML进行解析
			message = message.replace(/</g, "&lt").replace(/>/g, "&gt");

			return this.wiriteRaw(message);
		},

		//向日志窗口写入一个标题
		header: function(message) {
			message = '<span style="color:white;background-color:black;font-weight:bold;padding:0px 5px">' + message + '</span>';
			return this.wiriteRaw(message);
		}
	};
	if (!window.JWH) { window['JWH'] = {}; }
	window['JWH'] = new myLogger();
})();