const {electron, remote, desktopCapturer} = require("electron");
const os = require("os");
const path = require("path");
const fs = require("fs");
const moment = require("moment");

var recorder;
var recording = false;
var format;
var res;
var blobs = [];
var captureSource;
var mb;

exports.giveMenubar = (menubar) => {
	mb = menubar;
}

exports.isRecording = () => {
	return recording;
}

exports.stopRecording = () => {
	stopRecording();
}

function stopRecording() {
	recorder.stop();
	recording = false;
	download();
}

function startRecording() {
	mb.hideWindow();
	desktopCapturer.getSources({types: ['window', 'screen']}, (error, sources) => {
		if (error) throw error;
		for (let i = 0; i < sources.length; ++i) {
			let src = sources[i];
			if (src.name === captureSource) {
				navigator.mediaDevices.getUserMedia({
					audio: false,
					video: {
						mandatory: {
							chromeMediaSource: 'desktop',
							chromeMediaSourceId: src.id,
							minWidth: 1920,
							maxWidth: 1920,
							minHeight: 1080,
							maxHeight: 1080
						}
					}
				}, handleStream, handleError);
				return;
			}
		}
	});
}

function download() {
	if (!recording) {
		remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
			filters: [{name: "Videos", extensions: ["mp4", "webm", "mkv"]}],
			defaultPath: os.homedir() + "/Movies/" + "Skap-" + moment().format("MM/DD/YYYY-h:mm:ss A") + ".mp4"
		}, (fileName) => {
			if (fileName !== undefined) {
				fileNameParsed = path.parse(fileName);
				format = fileNameParsed.ext.replace(".", "");
				switch (format) {
					case "webm":
					case "mp4":
					case "mkv":
						toArrayBuffer(new Blob(blobs, {type: "video/" + format}), ab => {
							var buffer = toBuffer(ab);

							fs.writeFile(fileName, buffer, err => {
								if (err) {
									console.error("Failed to save video" + err);
								} else {
									console.log("Saved video");
								}
							});
						});
					break;

					default:
						console.log("Not a recognized format: " + format);
				}
			} else {
				console.log("No file");
			}
		});
	}
}

function handleStream(stream) {
	recorder = new MediaRecorder(stream);
	blobs = [];
	recorder.ondataavailable = event => {
		blobs.push(event.data);
	};
	recorder.start();
	recording = true;
}

function handleError(err) {
	console.log("Error: " + err);
}

function toBuffer(ab) {
	let buffer = new Buffer(ab.byteLength);
	let arr = new Uint8Array(ab);

	for (let i = 0; i < arr.byteLength; i++) {
		buffer[i] = arr[i];
	}

	return buffer;
}

function toArrayBuffer(blob, cb) {
	let fileReader = new FileReader();

	fileReader.onload = () => {
		let arrayBuffer = this.result;
		cb(arrayBuffer);
	};

	fileReader.readAsArrayBuffer(blob);
}
