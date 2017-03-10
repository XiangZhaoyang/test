function ovvride() {
	var alert = function(message) {
		window.alert('ovrridden:' + message);
	};
	alert('alert');

	window.alert('window.alert');
}
ovvride();
alert('alert for outside');