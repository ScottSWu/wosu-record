var DEBUG = true;

var app = require('app');
var BrowserWindow = require('browser-window');

var window = null;

app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});
	
	mainWindow.loadUrl('file://' + __dirname + '/index.html');
	
	if (DEBUG) {
		mainWindow.openDevTools();
	}
	
	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
