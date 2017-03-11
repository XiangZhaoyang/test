// 向页面中添加载入事件，注册事件侦听器
JWH.addEvent(window, 'load', function() {

	//在按钮上注册一个点击事件侦听器
	JWH.addEvent('generate', 'click', function(W3CEvent) {

		//取得html源代码
		var source = JWH.$('source').value;
		//将html转换为DOM并放到#result文本区
		JWH.$('result').value = generateDOM(source);
	});
});