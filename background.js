'use strict'

var time_map = new Map();
var processed_time_map = new Map();
var focused=true;

/**
 * @param {integer} time_in_sec 
 * @return {string} time_in_hr_min.
 */
function time_spent(time_in_sec){
	var min = Math.floor(time_in_sec/60);
	var sec = time_in_sec % 60;
	var hour = Math.floor(min/60);
	min = min % 60;
	if(hour == 0) hour = "";
	else hour = hour + " hr ";
	if(min == 0) min = "";
	else min = min + " min ";
	if(sec == 0) sec = "";
	else sec = sec + " sec ";
	return hour + min + sec;
}

function timeCheck()
{
	chrome.tabs.query({active: true, lastFocusedWindow: true},
		function(tabs){
			chrome.windows.getLastFocused(function(win){
					focused = win.focused;
			});
			if(tabs.length == 0) return;
			var url = tabs[0].url;
			if(!url || !focused) return;
			var host = $('<a>').prop('href', url).prop('hostname');
			host = host.replace("www.", "");
			var host_split = host.split(".");
			host = host_split[0];
			host = host.charAt(0).toUpperCase() + host.slice(1);
			//alert(host);
			time_map[host] = time_map[host] ? time_map[host]+ 5 : 5;
			processed_time_map[host] = time_spent(time_map[host]);
			//alert(host + " " + time_map[host]);
			//Notification every 30 mins for time_spent on a website
			if(time_map[host] % (900) == 0){
				//chrome.tabs.sendMessage(tabs[0].id, {website:host, time_spend: time_map[host]}, null);
				var time_hr_min = processed_time_map[host];
				var options = {
					type : "basic",
					title : "Watch_the_time",
					message : "You have already spent " + time_hr_min + "on this website!!",
					iconUrl: "/clock_icon_48.png"

				};
				var notificationId = chrome.notifications.create(null, options, null);
				//cancel after 3 seconds
				setTimeout(function(notificationId){
					chrome.notifications.clear(notificationId, null);
				}, 3000);
			}
		}
	);
}

setInterval(timeCheck, 5000);
chrome.extension.onConnect.addListener(function(port) {
      console.log("Connected to popup.js.....");
      port.onMessage.addListener(function(msg) {
           console.log("message recieved from popup->" + msg);
           port.postMessage({data : JSON.stringify(processed_time_map)});
      });
 });

/*
$("window").focus(function() {
	focused = true;
});
$("window").blur(function() {
	focused = false;
});

if(time_map[host])
			{
				time_map[host] = 5;
				//chrome.browserAction.setPopup({popup: "popup2.html"}); 
				var windows = chrome.extension.getViews({
						type: "popup"
				});
				if(windows.length == 0) {//console.log(windows); 
					return;}
				console.log(windows);
				popup.document.innerHTML += '<div>'+
					'<div class="left" id="' + host + 'left">' + host + '</div>'+
					'<div class="right" id="'+ host + 'right">' + time_map[host] + '</div>'+
					'</div>';
			}
			else
			{
				time_map[host] = time_map[host] + 5;
				//chrome.browserAction.setPopup({popup: "popup2.html"}); 
				var windows = chrome.extension.getViews({
						type: "popup"
				});
				if(windows.length == 0) {console.log(windows); return;}
				var popup = windows[0];
				popup.document.getElementById(host+'right').innerHTML = time_map[host];
			}


*/