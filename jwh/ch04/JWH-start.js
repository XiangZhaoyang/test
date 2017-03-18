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
				element = document.getElementById(element);
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
		if(!(node = $(node))) return false;

		if (node.addEventListener) { 
			//W3C的方法
			node.addEventListener( type, listener, false);
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
			node[type+listener] = null;
			return true;
		}

		//若两种方法都不具备则返回false
		return false;
	};
	window['JWH']['removeEvent'] = removeEvent;


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
			'height': (window.innerHeight || (de && de.clientHeight) || document.body.clientHeight)
		}
	};
	window['JWH']['getBrowserWindowSize'] = getBrowserWindowSize;


	window['JWH']['node'] = {
		ELEMENT_NODE					:1,
		ATTRIBUTE_NODE					:2,
		TEXT_NODE						:3,
		CDATA_SECTION_NODE				:4,
		ENTITY_REFERENCE_NODE			:5,
		ENTITY_NODE						:6,
		PROCESSING_INSTRUCTION_NODE		:7,
		COMMENT_NODE					:8,
		DOCUMENT_NODE					:9,
		DOCUMENT_TYPE_NODE				:10,
		DOCUMENT_FRAGMENT_NODE			:11,
		NOTATION_NODE					:12

	};

	
	function walkElementsLinear (func, node) {
		var rootNode = node || window.document;
		var nodes = rootNode.getElementsByClassName("*");
		for (var i = 0; i < nodes.length; i++) {
			func.call(nodes[i]);
		}
	};
	window['JWH']['walkElementsLinear'] = walkElementsLinear;


	function walkTheDOMRecursive (func, node, depth, returnedFromParent) {
		var rootNode = node || window.document;
		var returnedFromParent = func.call(rootNode, depth++, returnedFromParent);
		var node = rootNode.firstChild;
		while (node) {
			walkTheDOMRecursive(func, node, depth, returnedFromParent);
			node = node.nextSibling;
		}
	};
	window['JWH']['walkTheDOMRecursive'] = walkTheDOMRecursive;


	function walkTheDOMWithAttributes (node, func, depth, returnedFromParent) {
		var rootNode = node || window.document;
		returnedFromParent = func(rootNode, depth++, returnedFromParent);
		if (rootNode.attributes) {
			for (var i = 0; i < rootNode.attributes.length; i++) {
				walkTheDOMWithAttributes(rootNode.attributes[i], func, depth-1, returnedFromParent);
			}
		}
		if (rootNode.nodeType != JWH.node.ATTRIBUTE_NODE) {
			node = rootNode.firstChild;
			while (node) {
				walkTheDOMWithAttributes(node, func, depth, returnedFromParent);
				node = node.nextSibling;
			}
		}
	};
	window['JWH']['walkTheDOMWithAttributes'] = walkTheDOMWithAttributes;

	
	//把word-word转换为wordWord
	function camelize(s) {
		return s.replace(/-(\w)/g, function(strMatch, pl){
			return pl.toUpperCase();
		});
	};
	window['JWH']['camelize'] = camelize;


	function stopPropagation (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);
		if (eventObject.stopPropagation) {
			eventObject.stopPropagation();
		} else {
			eventObject.cancelBubble = true;
		}
	}
	window['JWH']['stopPropagation'] = stopPropagation;


	function preventDefault (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);
		if (eventObject.preventDefault) {
			eventObject.preventDefault();
		} else {
			eventObject.returnValue = false;
		}
	}
	window['JWh']['preventDefault'] = preventDefault;


	function addLoadEvent (loadEvent, waitForImages) {
		if (!isCompatible()) { return false; }

		// 如果等待标记是true则使用常规的添加事件的方法
		if (waitForImages) {
			return addEvent(window, 'load', loadEvent);
		}

		// 否则使用一些不同的方式包装loadEvent()方法
		// 以便为this关键字指定正确的内容，同时确保
		// 事件不会被执行两次
		var init = function() {

			// 如果这个函数已经被调用过了则返回
			if(arguments.callee.done) return;

			// 标记这个函数以便检验它是否运行过
			arguments.callee.done = true;

			// 在document的环境中运行载入事件
			loadEvent.apply(document, arguments);
		};

		// 为DOMContentLoaded事件注册事件侦听器
		if (document.addEventListener) {
			document.addEventListener('DOMContentLoaded', init, false);
		}

		// 对于Safari，使用setInterval()函数检测
		// document是否载入完成
		if (/WebKit/i.test(navigator.userAgent)) {
			var _timer = setInterval(function(){
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(_timer);
					init();
				}
			}, 10);
		}

		// 对于IE
		// 附加一个在载入过程最后执行的脚本，
		// 并检测该脚本是否载入完成
		/*@cc_on @*/
		/*@if (@_win32)
		document.write('<script id=__ie_onload defer src=javascript:void(10)><\/script>');
		var script = document.geetElementById('__ie_onload');
		script.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				init();
			}
		};
		/*@end @*/

		return true;
	}
	window['JWH']['addLoadEvent'] = addLoadEvent;


	function getEventObject (W3CEvent) {
		return W3CEvent || window.event;
	}
	window['JWH']['getEventObject'] = getEventObject;


	// 访问事件的目标元素
	function getTarget (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);

		// 如果是W3C或MSIE的模型
		var target = eventObject.target || eventObject.srcElement;

		// 如果像Safari中一样是一个文本节点
		// 重新将目标对象指定为父元素
		if (target.nodeType == JWH.node.TEXT_NODE) {
			target = nodes.parentNode;
		}

		return target;
	}
	window['JWH']['getTarget'] = getTarget;


	// 确定单击了哪个鼠标键
	function getMouseButton (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);

		// 使用适当的属性初始化一个对象变量
		var buttons = {
			'left':false,
			'middle':false,
			'right':false
		};

		// 检查eventObeject对象的toSring()方法的值
		// W3C DOM对象有toString()方法并且此时该
		// 方法的返回值应该是MouseEvent
		if (eventObject.toString && eventObject.toString().indexOf('MouseEevent') != -1) {
			// W3C方法
			switch(eventObject.button) {
				case 0: buttons.left = true; break;
				case 1: buttons.middle = true; break;
				case 2: buttons.right = true; break;
				default: break;
			}

		} else if (eventObject.button) {
			// MSIE方法
			switch(eventObject.button) {
				case 1: buttons.left = true; break;
				case 2: buttons.right = true; break;
				case 3:
					buttons.left = true;
					buttons.right = true;
				break;
				case 4: buttons.middle = true; break;
				case 5:
					buttons.left = true;
					buttons.middle = true;
				break;
				case 6:
					buttons.middle = true;
					buttons.right = true;
				break;
				case 7:
					buttons.left = true;
					buttons.middle = true;
					buttons.right = true;
				break;
				default: break;
			}

		} else {
			return false;
		}

	}
	window['JWH']['getMouseButton'] = getMouseButton;


	// 处理鼠标的位置
	function getPointerPositionInDocument (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);

		var x = eventObject.pageX || (eventObject.clientX + 
			(document.documentElement.scrollLeft || document.body.scrollLeft));

		var y = eventObject.pageY || (eventObject.clientY +
			(document.documentElement.scrollTop || document.body.scrollTop));

		// 现在X和y中包含着鼠标
		// 相对于文档原点的坐标
		return {'x':x, 'y':y};
	}
	window['JWH']['getPointerPositionInDocument'] = getPointerPositionInDocument;


	// 访问键盘命令
	function getKeyPressed (eventObject) {
		eventObject = eventObject || getEventObject(eventObject);

		var code = eventObject.keyCode;
		var value = String.fromCharCode(code);
		return {'code':code, 'value':value};
	}
	window['JWH']['getKeyPressed'] = getKeyPressed;

})();

//重复一个字符串
if (!String.repeat) {
	String.prototype.repeat = function(l) {
		return new Array(l+l).join(this);
	};
}

//清除结尾和开头的空白符
if (!String.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	};
}