function onRefresh() {
	$.ajax({ url:'/api/posts', type:'GET' }).done(function(response) {
		console.log(response)
	});
}