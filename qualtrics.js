Qualtrics.SurveyEngine.addOnload(function()
{
	// ================================================================= //
	//                      SETUP AND INITIALIZATION                     //
	// ================================================================= //
	var qthis = this;
	qthis.hideNextButton();

	// Make the question container full screen
	jQuery('.QuestionText, .QuestionBody').hide();
	jQuery('.QuestionOuter').css({
		'position': 'fixed', 'top': '0', 'left': '0', 'width': '100%',
		'height': '100vh', 'z-index': '9999', 'background': 'black',
		'margin': '0', 'padding': '0'
	});

	// Create the display stage for the experiment
	var displayDiv = document.createElement('div');
	displayDiv.id = 'display_stage';
	jQuery('.QuestionOuter').prepend(displayDiv);

	// =========================================================== //
	//          ** FORCEFUL STYLE INJECTION (THE FIX) ** //
	// =========================================================== //
	var css = `
		#display_stage {
			background-color: black !important;
			color: white !important;
			height: 100vh !important;
			width: 100% !important;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
		#display_stage p, #display_stage div, #display_stage strong {
			color: white !important;
		}
	`;
	var styleSheet = document.createElement("style");
	styleSheet.type = "text/css";
	styleSheet.innerText = css;
	document.head.appendChild(styleSheet);

	// GitHub repository path for GNG
	window.task_github = "https://carolcyu.github.io/GNG_Q/";

	// Load necessary jsPsych scripts
	var scripts = [
		"https://carolcyu.github.io/GNG_Q/jspsych/jspsych.js",
		"https://carolcyu.github.io/GNG_Q/jspsych/plugin-image-keyboard-response.js",
		"https://carolcyu.github.io/GNG_Q/jspsych/plugin-html-keyboard-response.js",
        "https://carolcyu.github.io/GNG_Q/jspsych/plugin-html-button-response.js"
	];

	var loaded_scripts = 0;
	function loadScript() {
		if (loaded_scripts < scripts.length) {
			jQuery.getScript(scripts[loaded_scripts], function() {
				loaded_scripts++;
				loadScript();
			});
		} else {
			initExp();
		}
	}
	loadScript();

	// ================================================================= //
	//                          EXPERIMENT LOGIC                         //
	// ================================================================= //
	function initExp(){
		try {
			var jsPsych = initJsPsych({
				display_element: 'display_stage',
				on_finish: function() {
					document.removeEventListener('keydown', window.qualtricsKeyboardListener);
					var gng_data = jsPsych.
