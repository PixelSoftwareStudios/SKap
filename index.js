const menubar = require("menubar");
const skap = require("./app/skap.js");
const {BrowserWindow, ipcMain} = require("electron");

require("electron-debug")();

let mb = menubar({
	"preloadWindow": true,
	"width": 400,
	"height": 750,
	"fullscreen": false
});

let pickerDialog;

mb.on("ready", () => {
	console.log("hello");
	skap.giveMenubar(mb);
	pickerDialog = new BrowserWindow({
		parent: mb.BrowserWindow,
		skipTaskbar: true,
		modal: true,
		show: false,
		height: 340,
		width: 620
  	});

	pickerDialog.loadURL("file://" + __dirname + "/app/picker.html");

});

ipcMain.on("show-picker", (event, options) => {
	pickerDialog.show();
	pickerDialog.webContents.send("get-sources", options);
})

ipcMain.on("source-id-selected", (event, sourceId) => {
	pickerDialog.hide();
	mainWindow.webContents.send("source-id-selected", sourceId);
})

mb.on("show", () => {
	if (skap.recording) {
		skap.stopRecording();
	}
});
