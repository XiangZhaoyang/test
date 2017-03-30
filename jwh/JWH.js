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


	// 通过ID修改单个元素的样式
	function setStyleById (element, styles) {
		// 取得对象的引用
		if (!(element = $(element))) { return false; }

		// 循环遍历styles对象并应用每个属性
		for (property in styles) {
			if (!styles.hasOwnProperty(property)) { continue; }

			if (element.style.setProperty) {
				// DOM2样式规范方法
				element.style.setProperty(uncamelize(property,'-'),styles[property], null);
			} else {
				// 备用方法
				element.style[camelize(property)] = styles[property];
			}
		}

		return true;
	}
	window['JWH']['setStyle'] = setStyleById;
	window['JWH']['setStyleById'] = setStyleById;


	// 通过类名修改多个元素的样式
	function setStyleByClassName (parent, tag, className, styles) {
		if (!(parent = $(parent))) { return false; }
		var elements = getElementsByClassName(className, tag, parent);
		for (var e = 0; e < elements.length; e++) {
			setStyleById(elements[e], styles);
		}
		return true;
	}
	window['JWH']['setStyleByClassName'] = setStyleByClassName;


	// 通过标签修改多个元素的样式
	function setStylesByTagName (tagname, styles, parent) {
		parent = $(parent) || document;
		var elements = parent.getElementsByTagName(tagname);
		for (var e = 0; i < elements.length; e++) {
			setStyleById(elements, styles);
		}
	}
	window['JWH']['setStylesByTagName'] = setStylesByTagName;


	// 取得包含元素类名的数组
	function getClassNames (element) {
		if (!(element = $(element))) { return false; }
		// 用一个空格替换多个空格
		// 然后基于空格分割类名
		return element.className.replace(/\s+/, ' ').split(' ');
	}
	window['JWh']['getClassNames'] = getClassNames;


	// 检查元素中是否存在某个类
	function hasClassName (element, className) {
		if (!(element = $(element))) { return false; }
		var classes = getClassNames(element);
		for (var i = 0; i < classes.length; i++) {
			if (classes[i] === className) { return true; }
		}
		return false;
	};
	window['JWH']['hasClassName'] = hasClassName;


	// 为元素添加类
	function addClassName (element, className) {
		if (!(element = $(element))) { return false; }
		// 将类名添加到当前className的末尾
		// 如果没有className，则不包括空格
		element.className += (element.className ? ' ' : '') + className;
		return true;
	}
	window['JWH']['addClassName'] = addClassName;


	// 从元素中删除类
	function removeClassName (element, className) {
		if (!(element = $(element))) { return false; }
		var classes = getClassNames(element);
		var length = classes.length;
		// 循环遍历数组删除匹配的项
		// 因为从数组中删除项会使
		// 数组变短，所以要反向删除
		for (var i = length - 1; i >= 0; i--) {
			if (classes[i] === className) { delete(classes[i]); }
		}
		element.className = classes.join(' ');
		return (length == classes.length ? false : true);
	};
	window['JWH']['removeClassName'] = removeClassName;


	// 添加新的样式表
	function addStyleSheet (url, media) {
		media = media || 'screen';
		var link = document.createElement('link');
		link.setAttribute('rel', 'stylesheet');
		link.setAttribute('type', 'text/css');
		link.setAttribute('href', url);
		link.setAttribute('media', media);
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	window['JWH']['addStyleSheet'] = addStyleSheet;


	// 移除样式表
	function removeStyleSheet (url, media) {
		var styles = getStyleSheets (url, media);
		for (var i = 0; i < styles.length; i++) {
			var node = styles[i].ownerNode || styles[i].owningElement;
			// 禁用样式表
			styles[i].disabled = true;
			// 移除节点
			node.parentNode.removeChildren(node);
		}
	}
	window['JWH']['removeStyleSheet'] = removeStyleSheet;


	// 通过url取得包含所有样式表的数组
	function getStyleSheets (url, media) {
		var sheets = [];
		for (var i = 0; i < document.styleSheets.length; i++) {
			if (url && document.styleSheets[i].href.indexOf(url) == -1) {
				continue;
			}
			if (media) {
				// 规范化media字符串
				media = media.replace(/,\s*/, ',');
				var sheetMedia;

				if (document.styleSheets[i].media.mediaText) {
					// DOM方法
					sheetMedia = document.styleSheets[i].media.mediaText.replace(/,\s*/, ',');
					// Safari会添加额外的逗号和空格
					sheetMedia = sheetMedia.replace(/,\s*$/, '');
				} else {
					// MSIE方法
					sheetMedia = document.styleSheets[i].media.replace(/,\s*/,',');
				}
				// 如果media不匹配则跳过
				if (media != sheetMedia) { continue; }
			}
			sheets.push(document.styleSheets[i]);
		}
		return sheets;
	}
	window['JWH']['getStyleSheets'] = getStyleSheets;


	// 编辑一条样式规则
	function editCSSRule (selector, styles, url, media) {
		var styleSheets = (typeof url == 'array' ? url : getStyleSheets(url,middle));

		for (var = 0; i < styleSheets.length; i++) {
			// 取得规则列表
			// DOM2样式规范方法是styleSheets[i].cssRules
			// MSIE方法是styleSheets[i].rules
			var rules = styleSheets[i].cssRules || styleSheets[i].rules;
			if (!rules) { continue; }

			// 由于msie默认使用大写故转换为大写形式
			// 如果你使用的区分大写的id，则可能会
			// 导致冲突
			selector = selector.toUpperCase();

			for (var j = 0; j < rules.length; j++) {
				// 检查是否匹配
				if (rules[j].selectorText.toUpperCase() == selector) {
					for (property in styles) {
						if (!styles.hasOwnProperty(property)) { continue; }
						// 设置新的样式属性
						rules[j].style[camelize(property)] = styles[property];
					}
				}
			}
		}
	}
	window['JWH']['editCSSRule'] = editCSSRule;

	// 添加一条CSS规则
	function addCSSRule (selector, styles, index, url, media) {
		var declaration = '';

		// 根据styles参数（样式对象）构建声明字符串
		for (property in styles) {
			if (!styles.hasOwnProperty(property)) { continue; }
			declaration += property + ':' + styles[property] + '; ';
		}

		var styleSheets = (typeof url == 'array' ? url : getStyleSheets(url, media));
		var newIndex;
		for (var i = 0; i < styleSheets.length; i++) {
			// 添加规则
			if (styleSheets[i].insertRule) {
				// DOM2样式规范的方法
				// index = length是列表末尾
				newIndex = (index >= 0 ? index : styleSheets[i].cssRules.length);
				styleSheets[i].insertRule(selector + ' { ' + declaration + ' } ', newIndex );
			} else if (styleSheets[i].addRule) {
				// MSIE的方法
				// index = -1 是列表的末尾
				newIndex = (index >= 0 ? index : -1);
				styleSheets[i].addRule(selector, declaration, newIndex);
			}
		}
	}
	window['JWH']['addCSSRule'] = addCSSRule;


	// 取得一个元素的计算样式
	function getStyle (element, property) {
		if (!(element = $(element)) || !property) { return false; }
		// 检测元素style属性中的值
		var value = element.style[camelize(property)];
		if (!value) {
			// 取得计算的样式值
			if (document.defaultView && document.defaultView.getComputedStyle) {
				// DOM方法
				var css = document.defaultView.getComputedStyle(element, null);
				value = css ? css.getPropertyValue(property) : null;
			} else if (element.currentStyle) {
				// MSIE的方法
				value = element.currentStyle(camelize(property));
			}
		}
		// 返回空字符串而不是auto
		// 这样就不必检查auto值了
		return value == 'auto' ? '' : value;
	}
	window['JWH']['getStyle'] = getStyle;
	window['JWH']['getStyleById'] = getStyle;


	//parseJSON(string, filter)这是一个在公共域方法http:www.json.org/jsron2.js
	//的基础上进行了少量修改的版本。该方法解析json文本
	//以生成一个对象或数组，它可能抛出SyntaxError异常
	function parseJSON(s, filter) {
		var j;

		function walk(k ,v) {
			var i;
			if (v && typeof v === 'object') {
				for (i in v) {
					if (v.hasOwnProperty(i)) {
						v[i] = walk(i, v[i]);
					}
				}
			}
			return filter(k, v);
		}

		// 解析通过3个阶段进行。第一阶段，通过正则表达式
		// 检测json文本，查找非json字符。其中，特别关注
		// “（）” 和 “new”，因为他们会引起语句的调用，还有“=”
		// 因为它会导致变量的值发生改变。不过，为安全起见
		// 这里会拒绝所有不希望出现的字符
		 
		 if (/^(*(\\.|[^*\\\n\r])*?*|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(s)) {

		 	// 第二阶段，使用eval函数将JSON文本编译为JavaScript
		 	// 结构。其中“{”操作符具有语法上的二义性：即它可以定
		 	// 义一个语句块，也可以表示对象字面量，这里将
		 	// JSON文本用括号括起来是为了消除这种二义性
		 	
		 	try {
		 		j = eval('(' + s + ')');
		 	} catch (e) {
		 		throw new SyntaxError("parseJSON");
		 	}
 		 } else {
 		 	throw new SyntaxError("parseJSON");
 		 }

 		 // 在可选的第三阶段，代码递归遍历了新生成的结构
 		 // 而且将每个名/值对传递一个过滤函数，以便进行
 		 // 可能的转换
 		 
 		 if (typeof filter === 'function') {
 		 	j = walk('', j);
 		 }
 		 return j;
	};


	// 设置XMLHttpRequest对象的各个不同部分
	function getRequestObject(url, options) {

		// 初始化请求对象
		var req = false;
		if (window.XMLHttpRequest) {
			var req = new window.XMLHttpRequest();
		} else if (window.ActiveXObject) {
			var req = new window.ActiveXObject('Microsoft.XMLHTTP');
		}

		if (!req) { return false; }

		// 定义默认的选项
		options = options || {};
		options.method = options.method || 'GET';
		options.send = options.send || null;

		// 为请求的每个阶段定义不同的侦听器
		req.onreadystatechange = function() {
			switch (req.readyState) {
				case 1:
				// 载入中
					if (options.loadListener) {
						options.loadListener.apply(req, arguments);
					}
					break;
				case 2:
				// 载入完成
					if (options.loadedListener) {
						options.loadedListener.apply(req, arguments);
					}
					break;
				case 3:
				// 交互
					if (options.ineractiveListener) {
						options.ineractiveListener.apply(req, arguments);
					}
					break;
				case 4:
				// 完成
				// 如果失败则抛出错误
				try {
					if (req.status && req.status == 200) {

						// 针对content-type的特殊侦听器
						// 由于content-type头部中可能包含字符集， 如：
						// content-type:text/html;charset=ISO-8859-4
						// 因此通过正则表达式取出所需的部分
						var contentType = req.getResponseHeader('Content-Type');
						var mimeType = contentType.match(/\s*([^;]+)\s*(;|$)/i)[i];

						switch (mimeType) {
							case 'text/javascript':
							case 'application/javascript':
								// 响应时JavaScrip,因此以
								// req.responseText作为回调的参数
								if (options.jsResponseListener) {
									options.jsResponseListener.call(req, req.responseText);
								}
								break;
							case 'application/json':
								// 响应时JSON，因此需要用匿名函数对
								// req.responseText进行解析
								// 以返回作为回调参数的JSON对象
								if (options.jsonResponselistener) {
									try {
										var json = parseJSON(req.responseText);
									} catch(e) {
										var json = false;
									}
									options.jsonResponselistener.call(req, json);
								}
								break;
							case 'text/xml':
							case 'application/xml':
							case 'application/xhtml+xml':
								// 响应是XML，因此以
								// req.responseXML作为
								// 回调的参数
								// 此时是Document对象
								if (options.xmlResponseListener) {
									options.xmlResponseListener.call(req, req.responseXML);
								}
								break;
							case 'text/html':
								// 响应是HTML，因此以
								// req.responseText作为
								// 回调的参数
								if (options.htmlResponseListener) {
									options.htmlResponseListener.call(req, req.responseText);
								}
								break;
						}
						// 针对响应成功完成的侦听器
						if (options.completeListener) {
							options.completeListener.apply(req, arguments);
						} 
					} else {
						// 响应完成单却存在错误
						if (options.errorListener) {
							options.errorListener.apply(req, arguments);
						}
					}
				} catch (e) {
					// 忽略错误
				}
				break;

			}
		};
		// 开启请求
		req.open(options.method, url, true);
		// 添加特殊的头部信息以标识请求
		req.setRequestHeader('X-JWH-Ajax-Request', 'AjaxRequest');
		return req;
	}
	window['JWH']['getRequestObject'] = getEventObject;


	// 通过简单地包装getRequestObject()和send()方法
	// 发送XMLHttpRequest对象的请求
	function ajaxRequest(url, options) {
		var req = getRequestObject(url, options);
		return req.send(options.send);
	}
	window['JWH']['ajaxRequest'] = ajaxRequest;

	// XssHttpRequest对象的计数器
	var XssHttpRequestCount = 0;
	// XMLHttpReqeust对象的一个
	// 跨站点<script>标签的实现
	var XssHttpRequest = function() {
		this.requestID = 'XSS_HTTP_REQUEST_' + (++XssHttpRequestCount);
	};
	XssHttpRequest.prototype = {
		url: null,
		scriptObject: null,
		responseJSON: null,
		status: 0,
		readyState: 0,
		timeout: 30000,
		onreadystatechange: function() {},

		setReadyState: function(newReadyState) {
			// 如果比当前状态更新
			// 则只更新就绪状态
			if (this.readyState < newReadyState || newReadyState == 0) {
				this.readyState = newReadyState;
				this.onreadystatechange();
			}
		},

		open: function(url, timeout) {
			this.timeout = timeout || 30000;
			// 将一个名为XSS_HTTP_REQUEST_CALLBACK
			// 的特殊变量附加给URL，其中包含本次请求的
			// 回调函数的名称
			this.url = url 
				+ ((url.indexOf('?')!=-1) ? '&' : '?')
				+ 'XSS_HTTP_REQUEST_CALLBACK='
				+ this.requestID
				+ '_CALLBACK'；
			this.setReadyState(0);
		},

		send: function() {
			var requestObject = this;
			// 创建一个载入外部数据的新script对象
			this.scriptObject = document.createElement('script');
			this.scriptObject.setAttribute('id', this.requestID);
			this.scriptObject.setAttribute('type', 'text/javascript');
			// 尚未设置src属性，也先不将其添加到文档...
			
			// 创建一个在给定的毫秒数之后触发的
			// setTimeout()方法。如果在给定的时间
			// 内脚本没有载入完成，则取消载入
			var timeoutWatcher = setTimeout(function() {
				// 在脚本晚于我们假定的停止时间之后载入的情况下
				// 通过一个空方法来重新为window方法赋值
				window[requestObject.requestID + '_CALLBACK'] = function() {};

				// 移除脚本以防止进一步载入
				requestObject.scriptObject.parentNode.removeChild(
					requestObject.scriptObject
				);

				// 将状态设置为错误
				requestObject.status = 2;
				requestObject.statusText = 'Timeout after'
					+ requestObject.timeout
					+ ' milliseconds.';

				// 更新就绪状态
				requestObject.setReadyState(2);
				requestObject.setReadyState(3);
				requestObject.setReadyState(4);
			}, this.timeout);

			// 在window对象中创建一个与
			// 请求中的回调方法匹配的方法
			// 在调用时负责处理请求的其他部分
			window[this.requestID + '_CALLBACK'] = function(JSON) {
				// 当脚本载入时将执行这个方法
				// 同时传入预期的JSON对象
				
				// 在请求载入成功时
				// 清除timeoutWatcher方法
				clearTimeout(timeoutWatcher);

				// 更新就绪状态
				requestObject.setReadyState(2);
				requestObject.setReadyState(3);

				// 将状态设置为成功
				requestObject.responseJSON = JSON;
				requestObject.status = 1;
				requestObject.statusText = 'Loaded.';

				// 跟新就绪状态
				requestObject.setReadyState(4);
			};

			// 设置初始就绪状态
			this.setReadyState(1);

			// 现在再设置src属性并将其添加
			// 到文档头部，这样会载入脚本
			this.scriptObject.setAttribute('src', this.url);
			var head = document.getElementsByTagName('head')[0];
			head.appendChild(this.scriptObject);
		}
	};
	window['JWH']['XssHttpRequest'] = XssHttpRequest;

	// 设置XssHttpRequest对象的不同部分
	function getXssRequestObject(url, options) {
		var req = new XssHttpRequest();

		options = options || {};
		// 默认中断时间为30秒
		options.timeout = options.timeout || 30000;
		req.onreadystatechange = function() {
			switch (req.readyState) {
				case 1:
					// 载入中
					if (options.loadListener) {
						options.loadListener.apply(req, arguments);
					}
					break;
				case 2:
					// 载入成功
					if (options.loadedListener) {
						options.loadedListener.array(req, arguments);
					}
					break;
				case 3:
					// 交互
					if (options.ineractiveListener) {
						options.ineractiveListener.array(req, arguments);
					}
					break;
				case 4:
					// 完成
					if (req.status == 1) {
						if (options.completeListener) {
							options.completeListener.apply(req, arguments);
						}
					} else {
						if (options.errorListener) {
							options.errorListener.apply(req, arguments);
						}
					}
					break;
			}
		};
		req.open(url, options.timeout);

		return req;
	}
	window['JWH']['getXssRequestObject'] = getXssRequestObject;

	// 发送XssHttpRequest请求
	function xssRequest(url, options) {
		var req = getXssRequestObject(url, options);
		return req.send(null);
	}
	window['JWH']['xssRequest'] = xssRequest;

	// 生成回调函数的一个辅助方法
	function makeCallback(method, target) {
		return function() {
			method.apply(target, arguments);
		};
	}


	// 一个用来基于hash触发注册的方法的URL hash侦听器
	var actionPager = {
		// 前一个hash
		lastHash: '',
		// 为hash模式注册的方法列表
		callbacks: [],
		// Safari历史记录列表
		safariHistory: false,
		// 对为IE准备的iframe的引用
		msieHistory: false,
		// 应该被转换的链接的类名
		ajaxifyClassName: '',
		// 应用程序的根目录，当创建hash时
		// 它将是被清理后的RUL
		ajaxifyRoot: '',

		init: function(ajaxifyClass, ajaxifyRoot, startingHash) {
			this.ajaxifyClassName = ajaxifyClass || 'JWHActionLink';
			this.ajaxifyRoot = ajaxifyRoot || '';

			if (/Safari/i.test(navigator.userAgent)) {
				this.safariHistory = [];
			} else if (/MSIE/i.test(navigator.userAgent)) {
				// 如果是MSIC,添加一个iframe以便
				// 跟踪重写(ovrride)后退按钮
				this.msieHistory = document.createElement('iframe');
				this.msieHistory.setAttribute('id', 'msieHistory');
				this.msieHistory.setAttribute('name', 'msieHistory');
				setStyleById(this.msieHistory, {
					'width': '100px',
					'height': '100px',
					'border': '1px solid black',
					'visibility': 'visible',
					'zIndex': '-1';
				})
				document.body.appendChild(this.msieHistory);
				this.msieHistory = frames['msieHistory'];
			}

			// 将链接转换为Ajax链接
			this.ajaxifyLinks();

			// 取得当前的地址
			var location = this.getLocation();

			// 检测地址中是否包含hash（来自书签）
			// 或者是否已经提供了hash
			if (!location.hash && !startingHash) {
				startingHash = 'start';
			}

			// 按照需要保存hash
			ajaxHash = this.getHashFromURL(location.hash) || startingHash;
			this.addBackButtonHash(ajaxHash);

			// 添加监视事件以观察地址栏中的变化
			var watcherCallback = makeCallback(this.watchLocationForChange, this);
			window.setInterval(watcherCallback, 200);
		},
		ajaxifyLinks: function() {
			// 将链接转换为锚以便Ajax进行处理
			links = getElementsByClassName(this.ajaxifyClassName, 'a', document);
			for (var i = 0; i < links.length; i++) {
				if (hasClassName(links[i], 'JWHActionPagerModified')) {
					continue;
				}

				// 将href属性转换为#value形式
				links[i].setAttribute('href', this.convertURLToHash(links[i].getAttribute('href')));
				addClassName(links[i], 'JWHActionPagerModified');

				// 注册单击事件以便必要时添加历史记录
				addEvent(links[i], 'click', function() {
					if (this.href && this.href.indexOf('#') > -1) {
						actionPager.addBackButtonHash(actionPager.getHashFromURL(this.href));
					}
				});
			}
		},
		addBackButtonHash: function(ajaxHash) {
			// 保存hash
			if (!ajaxHash) { return false; }
			if (this.safariHistory !== false) {
				// 为Safari使用特殊数组
				if (this.safariHistory.length == 0) {
					this.safariHistory[window.history.length] = ajaxHash;
				} else {
					this.safariHistory[window.history.length+1] = ajaxHash;
				}
				return true;
			} else if (this.msieHistory !== false) {
				// 在MSIE中通过导航iframe
				this.msieHistory.document.execCommand('Stop');
				this.msieHistory.location.href = '/fakepage?hash='
					+ ajaxHash
					+ '&title='+document.title;
				return true;
			} else {
				// 通过改变地址的值
				// 使用makeCallback包装函数
				// 以便在超时方法内部使this
				// 引用actionPager
				var timeoutCallback = makeCallback(function() {
					if (this.getHashFromURL(window.location.href) != ajaxHash) {
						window.location.replace(location.href + '#' + ajaxHash);
					}
				}, this);
				setTimeout(timeoutCallback, 200);
				return true;
			}
			return false;
		},
		watchLocationForChange: function() {
			var newHash;
			// 取得新的hash值
			if (this.safariHistory !== false) {
				// 在Safari中从历史的地址中取得
				if (this.safariHistory[history.length]) {
					newHash = this.safariHistory[history.length];
				}
			} else if (this.msieHistory !== false) {
				// 在MSIE中从历史记录数组中取得
				newHash = this.msieHistory.location.href.split('&')[0].split('=')[1];
			} else if (location.hash != '') {
				// 对其他浏览器从window.location中取得
				newHash = this.getHashFromURL(window.location.href);
			}

			// 如果新hash与最后一次的hash不相同，则更新页面
			if (newHash && this.lastHash != newHash) {
				if (this.msieHistory !== false && this.getHashFromURL(window.location.href) != newHash) {
					// 修复MSIE中的地址栏
					// 以便能适当地加上标签（或加入收藏夹)
					location.hash = newHash;
				}

				// 在发生异常的情况下使用tay/catch
				// 结构尝试执行任何注册的侦听器
				try {
					this.executeListeners(newHash);
					// 在通过处理程序添加任何
					// 新链接的情况下进行更新
					this.ajaxifyLinks();
				} catch(e) {
					// 这里将捕获到回调函数中的任何异常JS
					alert(e);
				}
				// 将其保存为最后一个hash
				this.lastHash = newHash;
			}
		},
		register: function(regex, method, context) {
			var obj = {'regex': regex};
			if (context) {
				// 一个已经指定的环境
				obj.callback = function(matches) {
					method.apply(context, matches);
				};
			} else {
				// 以window作为环境
				obj.callback = function(matches) {
					method.apply(window, matches);
				};
			}

			// 将侦听器添加到回调函数数组中
			this.callbacks.push(obj);
		},
		convertURLToHash: function(url) {
			if (!url) {
				// 没有url，因而返回一个磅字符(#)
				return #;
			} else if (url.indexOf('#') != -1) {
				// 存在hash，因而返回它
				return url.split('#')[1];
			} else {
				// 如果URL中包含域名（msie）则去掉它
				if (url.indexOf('://') != -1) {
					url = url.match(/:\/\/[^\/]+(.*)/)[1];
				}
				// 按照init()中的约定去掉根目录
				return '#' + url.substr(this.ajaxifyRoot.length);
			}
		},
		getHashFromURL: function(url) {
			if (!url || url.indexOf('#') == -1) { return ''; }
			return url.split('#')[1];
		},
		getLocation: function() {
			// 检查hash
			if (!window.location.hash) {
				// 没有则生成一个
				var url = {host: null, hash: null};
				if (window.location.href.indexOf('#') > -1) {
					parts = window.location.href.split('#')[1];
					url.domain = parts[0];
					url.hash = parts[1];
				} else {
					url.domain = window.location;
				}
				return url;
			}
			return window.location;
		},
		executeListeners: function(hash) {
			// 执行与hash匹配的任何侦听器
			for (var i in this.callbacks) {
				if (matches = hash.match(this.callbacks[i].regex)) {
					this.callbacks[i].callback(matches);
				}
			}
		}

	}
	window['JWH']['actionPager'] = actionPager;

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