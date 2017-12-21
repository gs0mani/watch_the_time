 var bkgd = chrome.extension.getBackgroundPage();
 var port = chrome.extension.connect({
      name: "Time Communication"
 });
 port.postMessage("GET Data for time");
 port.onMessage.addListener(function(msg) {
      bkgd.console.log("Data recieved to popup " + msg.data);
      var mp = JSON.parse(msg.data);
      if(mp.length == 0) return;
      Object.keys(mp).forEach(function(key){
      	var x = document.getElementById(key);
      	if(x)
      	{
      		document.children(x)[1].innerHTML = mp[key];
      	}
      	else
      	{
      		document.body.innerHTML += '<div id='+ key + '>'+
      			'<div class ="left">'+ key + '</div>'+
      			'<div class ="right">'+ mp[key] + '</div>'+
      			'</div>';
      	}
      });
    });