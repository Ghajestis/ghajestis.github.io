// ************ Themes ************
var themes = ["default", "aqua"]

var colors = {
	default: {
		1: "#ffffff", //Branch color 1
		2: "#bfbfbf", //Branch color 2
		3: "#7f7f7f", //Branch color 3
		color: "#dfdfdf",
		color_dim: "#9b9b9b",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
		quarks: "#a8a8a8",
		manifold: "#12a272",
		supernova: "#f8902f",
		txt_supernova_primary: "rgb(248, 104, 47)",
		txt_supernova_secondary: "rgb(243, 210, 62))",
	},
	aqua: {
		1: "#bfdfff",
		2: "#8fa7bf",
		3: "#5f6f7f",
		color: "#bfdfff",
		points: "#dfefff",
		locked: "#c4a7b3",
		background: "#001f3f",
		background_tooltip: "rgba(0, 15, 31, 0.75)",
		quarks: "#a8a8a8",
		manifold: "#12a272"
	},
}
function changeTheme() {

	colors_theme = colors[options.theme || "default"];
	document.body.style.setProperty('--background', colors_theme["background"]);
	document.body.style.setProperty('--background_tooltip', colors_theme["background_tooltip"]);
	document.body.style.setProperty('--color', colors_theme["color"]);
	document.body.style.setProperty('--color_dim', colors_theme["color_dim"]);
	document.body.style.setProperty('--points', colors_theme["points"]);
	document.body.style.setProperty("--locked", colors_theme["locked"]);
	document.body.style.setProperty('--quarks', colors_theme["quarks"]);
	document.body.style.setProperty("--manifold", colors_theme["manifold"]);
	document.body.style.setProperty("--supernova", colors_theme["supernova"]);
	document.body.style.setProperty('--txt_supernova_primary', colors_theme["txt_supernova_primary"]);
	document.body.style.setProperty("--txt_supernova_secondary", colors_theme["txt_supernova_secondary"]);
}
function getThemeName() {
	return options.theme? options.theme : "default";
}

function switchTheme() {
	let index = themes.indexOf(options.theme)
	if (options.theme === null || index >= themes.length-1 || index < 0) {
		options.theme = themes[0];
	}
	else {
		index ++;
		options.theme = themes[index];
		options.theme = themes[1];
	}
	changeTheme();
	resizeCanvas();
}
