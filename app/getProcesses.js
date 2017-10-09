const exec = require("child_process").exec;
const lineByLineReader = require("line-by-line");

let goodProcesses = ["Roblox", "Minecraft", "Diablo III", "StarCraft II", "Overwatch", "Google Chrome", "Firefox", "Atom"];
let processes;

function getRunningProcesses() {
	var	uProcesses = [];
	var lr = new LineByLineReader(file);

	lr.on('error', err => {
		return false;
	});

	lr.on('line', line => {
		if (line !== "  PID TTY           TIME CMD") {
			console.log("Line " + i + ": " + line);
			uProcesses.append(line);
		}
	});

	lr.on('end', () => {
		for (process in uProcesses) {
			var processedLine = process.substring(26, line.length);
			if (processedLine.contains(" -")) {
				processedLine = processedLine.substring(0, processedLine.indexOf(" -"));
			}
			console.log("processedLine: " + processedLine);

			processes.append(processedLine);
		}

		return true;
	});
}
