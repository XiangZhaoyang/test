//generateDOM对象的心命名空间
(function() {

	function encode (str) {
		if (!str) return null;
		str = str.replace(/\\/g, '\\\\');
		str = str.replace(/';/g, "\\'");
		str = str.replace(/\s+^/mg, "\\n");
		return str;
	}


	function checkForVarible (v) {
		if (v.indexOf('$') == -1) {
			v = '\'' + v + '\'';
		} else {
			//因MSIE会添加锚的完整路径，故需要
			//取得该字符串从$到结尾处的的子字符串
			v = v.substring(v.indexOf('$') + 1);
			requiredVariables += 'var ' + v + ';n';
		}
		return v;
	}

	var domCode = '';
	var nodeNameCounters =[];
	var requiredVariables = '';
	var newVariables = '';

	function generate (strHTML, strRoot) {

		//将HTML代码添加到页面主体中，以便能够遍历相应的dom树
		var domRoot = document.createElement('div');
		domRoot.innerHTML = strHTML;

		//重置变量
		domCode = '';
		nodeNameCounters = [];
		requiredVariables = '';
		newVariables = '';

		//使用processNode()处理domRoot中的所有子节点
		var node = domRoot.firstChild;
		while (node) {
			JWh.walkTheDOMRecursive(processNode, node, 0, strRoot);
			node = node.nextSibling;
		}

		//输出生成的代码
		domCode = '* requiredVariables in this code\n' + requiredVariables 
		          + '*/\n\n' + domCode + '\n\n' 
		          +'/* new objects in this coden' + newVariables + '*/\n\n';
		return domCode;
	}

	function processAttribute (tabCount, refParent) {

		//跳过文本节点
		if (this.nodeType != JWh.node.ATTRIBUTE_NODE) return;

		//取得属性值
		var attrValue = (this.nodeValue ? encode(this.nodeValue.trime()) : '');
		if (this.nodeName == 'cssText') alert('true');

		//如果没有值则返回
		if (!attrValue) return;

		//确定缩进的级别
		var tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');

		//根据nodeName进行判断。除了class和style需要
		//特殊注意外，所有类型都可以按常规来处理
		switch(this.nodeName) {
			default:
				if (this.nodeName.substring(0, 2) == 'on') {
					//如果属性名称以'on'开头，说明是
					//一个嵌入的事件属性，也就需要
					//重新创建一个给该属性赋值的函数
					domCode += tabs + refParent + '.' + this.nodeName 
					           + '= function(){' + attrValue + '}n';
				} else {

					//对于其他情况则使用setAttribute
					domCode += tabs + refParent + '.setAttribute(\'' + this.nodeName
					           + '\', ' + checkForVarible(attrValue) + ');n';
				}
			break;
			case 'class':
				//使用className属性为class赋值
				domCode += tabs + refParent + '.className = '
				           + checkForVarible(attrValue) + ';n';
				break;
			case 'style':
				//使用正则表达式基于;和邻近的
				//空格符来分割样式属性值
				var style = attrValue.split(/\s*;\s*/);

				if (style) {
					for ( pair in style) {
						if (!style[pair]) continue;

						//使用正则表达式基于;和邻近的
						//空格符来分割没对样式属性
						var prop = style[pair].split(/\\s*:\s*/);
						if (!prop[1]) continue;

						//将css-property格式的css属性、
						//转换为cssProperty格式
						prop[0] = JWh.camelize(prop[0]);

						var propValue = checkForVarible(prop[1]);
						if (prop[0] == 'float') {
							//float是保留字，一次属特殊情况
							//cssFloat是标准的属性
							//styleFloat是IE使用的属性
							domCode += tabs + refParent + '.style.cssFloat = ' + propValue
							           + ';\n';
						} else {
							domCode += tabs + refParent + '/style.' + prop[0] 
							           + '=' + propValue + ';\n';
						}
					}
				}

			break;

		}

	}

	function processNode (tabCount, refParent) {
		//根据树的深度级别重复制表符
		//以便对每一行进行适当的缩进
		var  tabs = (tabCount ? '\t'.repeat(parseInt(tabCount)) : '');

		//确定节点类型并处理元素和文本节点
		switch(this.nodeType) {
			case JWh.node.ELEMENT_NODE:
				//计数器加1并创建一个使用标签和计数器的值
				//表示的新变量，例如：a1,a2,a3
				if (nodeNameCounters[this.nodeName]) {
					++nodeNameCounters[this.nodeName];
				} else {
					nodeNameCounters[this.nodeName] = 1;
				}

				var ref = this.nodeName.toLowerCase() + nodeNameCounters[this.nodeName];

				//添加创建这个元素的dom代码行
				domCode += tabs + 'var ' + ref
				           + ' = document.createElement(\''
				           + this.nodeName + '\');n';

				//将新变量添加到列表中
				//以便在结果中报告他们
				newVariables += '' + ref + ';\n';

				//检测是否存在属性，如果是则循环遍历这些属性
				//并使用processAtrribute()方法遍历他们的dom树
				if (this.attributes) {
					for (var i = 0; i < this.attributes.length; i++) {
						JWh.walkTheDOMRecursive(
							processAttribute,
							this.attributes[i],
							tabCount,
							ref
						);
					}
				}
				break;
			case JWh.node.TEXT_NODE:

				//检测文本节点中除了
				//空白符之外的值
				var value = (this.nodeValue ? encode(this.nodeValue.trim()) : '');
				if (value) {

					//计数器加1并创建一个使用text和计数器的值
					//表示新的变量，例如txt1、txt2、txt3
					if (nodeNameCounters['txt']) {
						++nodeNameCounters['txt'];
					} else {
						nodeNameCounters['txt'] = 1;
					}
					var ref = 'txt' + nodeNameCounters['txt'];

					//检查是不是$var格式的值
					value = checkForVarible(value);

					添加创建这个元素的dom代码行
					domCode += tabs + 'var ' + ref
					           + ' = document.createTextNode('+ value ');\n ';
					//将新变量添加到列表中
					//以便在结果中报告他们
					newVariables += '' + ref + ';n';
				} else {
					//如果不存在值（或者只有空白符）则返回
					//即这个节点将不会被加入到父节点中
					return;
				}
				break;

			default:
				//忽略其他情况
				break;
		}

		//添加将这个节点添加到其父节点的代码
		if (refParent) {
			domCode += tabs = refParent + '.appendChild(' + ref + ');n';
		}
		return ref;
	}

	window['generateDom'] = generate;
})();