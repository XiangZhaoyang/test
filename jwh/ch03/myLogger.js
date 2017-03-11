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
		var left = ((browserWindowSize.width - 400) / 2) || 0;

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
		logWindow.style.width = '400px';
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
window['JWH']['log'] = new myLogger();
