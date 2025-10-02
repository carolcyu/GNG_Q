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

	// GitHub repository path for EFAD
	window.task_github = "https://carolcyu.github.io/EFAD_MRI/";

	// Load necessary jsPsych scripts
	var scripts = [
		"https://carolcyu.github.io/EFAD_MRI/jspsych/jspsych.js",
		"https://carolcyu.github.io/EFAD_MRI/jspsych/plugin-image-keyboard-response.js",
		"https://carolcyu.github.io/EFAD_MRI/jspsych/plugin-html-keyboard-response.js"
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
					var efad_data = jsPsych.data.get().json();
					// Save data to Qualtrics Embedded Data field "EFAD"
					Qualtrics.SurveyEngine.setEmbeddedData("EFAD", efad_data);
					jQuery('#display_stage').remove();
					qthis.clickNextButton();
				}
			});

			// =====================================================================
			// ==      ROBUST KEYBOARD LISTENER (DO NOT CHANGE)       ==
			// =====================================================================
			setTimeout(function() {
				window.qualtricsKeyboardListener = function(event) {
					var keyPressed = event.key;
					try {
						jsPsych.finishTrial({ response: keyPressed });
					} catch (e) {
						console.warn("Key press " + keyPressed + " ignored on current trial.");
					}
				};
				document.addEventListener('keydown', window.qualtricsKeyboardListener);
			}, 1500);

			// --- EFAD TASK TIMELINE DEFINITION ---
			var timeline = [];
			var welcome = { type: jsPsychHtmlKeyboardResponse, stimulus: " <p>Welcome to the Emotion Rating Task! </p> <p>Press any button for instructions. </p>" };
			timeline.push(welcome);

			var instructions = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>In this task, an image will appear on the screen.</p><p>Using the response pad, please rate <strong>HOW a picture makes you feel</strong>, as quickly as you can.</p>", post_trial_gap: 1000 };
			timeline.push(instructions);

			var instructions2 = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>If the picture makes you feel...</p> <p><strong>Very negative</strong>, press the button 1</p><p><strong>Negative</strong>, press the button 2</p><p><strong>Positive</strong>, press the button 3</p> <p><strong>Very positive</strong>, press the button 4.</p><p> <img src='" + window.task_github + "img/response_key.png' alt='Key'></div></p>", post_trial_gap: 1000 };
			timeline.push(instructions2);

			var questions = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any key to continue. </p>" };
			timeline.push(questions);
			
			var MRIstart = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>", choices: "NO_KEYS", trial_duration: 10000, prompt: "<p> A cross (+) will appear when the task starts. </p>" };
			timeline.push(MRIstart);

			var test_stimuli = [
				{stimulus: window.task_github + 'iaps_neg/1525.jpg'}, {stimulus: window.task_github + 'iaps_neg/2345_1.jpg'}, {stimulus: window.task_github + 'iaps_neg/3150.jpg'},
                {stimulus: window.task_github + 'iaps_neg/3170.jpg'}, {stimulus: window.task_github + 'iaps_neg/7380.jpg'}, {stimulus: window.task_github + 'iaps_neg/9140.jpg'},
                {stimulus: window.task_github + 'iaps_neg/9184.jpg'}, {stimulus: window.task_github + 'iaps_neg/9301.jpg'}, {stimulus: window.task_github + 'iaps_neg/9326.jpg'},
                {stimulus: window.task_github + 'iaps_neg/9611.jpg'}, {stimulus: window.task_github + 'iaps_neg/9903.jpg'}, {stimulus: window.task_github + 'iaps_neut/6150.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7001.jpg'}, {stimulus: window.task_github + 'iaps_neut/7002.jpg'}, {stimulus: window.task_github + 'iaps_neut/7009.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7026.jpg'}, {stimulus: window.task_github + 'iaps_neut/7052.jpg'}, {stimulus: window.task_github + 'iaps_neut/7055.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7080.jpg'}, {stimulus: window.task_github + 'iaps_neut/7100.jpg'}, {stimulus: window.task_github + 'iaps_neut/7150.jpg'},
                {stimulus: window.task_github + 'iaps_neut/7705.jpg'}, {stimulus: window.task_github + 'sdvp/3068.jpg'}, {stimulus: window.task_github + 'sdvp/6570.jpg'},
                {stimulus: window.task_github + 'sdvp/SDVPS_1.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_2.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_3.jpg'},
                {stimulus: window.task_github + 'sdvp/SDVPS_4.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_5.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_6.jpg'},
                {stimulus: window.task_github + 'sdvp/SDVPS_7.jpg'}, {stimulus: window.task_github + 'sdvp/SDVPS_8.jpg'}, {stimulus: window.task_github + 'iaps_pos/1463.jpg'},
                {stimulus: window.task_github + 'iaps_pos/1811.jpg'}, {stimulus: window.task_github + 'iaps_pos/2071.jpg'}, {stimulus: window.task_github + 'iaps_pos/2154.jpg'},
                {stimulus: window.task_github + 'iaps_pos/4610.jpg'}, {stimulus: window.task_github + 'iaps_pos/5480.jpg'}, {stimulus: window.task_github + 'iaps_pos/5829.jpg'},
                {stimulus: window.task_github + 'iaps_pos/7400.jpg'}, {stimulus: window.task_github + 'iaps_pos/7492.jpg'}, {stimulus: window.task_github + 'iaps_pos/8380.jpg'},
                {stimulus: window.task_github + 'iaps_pos/8503.jpg'}
			];

			var fixation = { type: jsPsychHtmlKeyboardResponse, stimulus: '<div style="font-size:60px;">+</div>', choices: "NO_KEYS", trial_duration: 1000 };
			var test = { type: jsPsychImageKeyboardResponse, stimulus: jsPsych.timelineVariable('stimulus'), choices: "NO_KEYS", trial_duration: 2000, stimulus_height: 650 };
			var response = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p>How would you rate this image?</p>", choices: "NO_KEYS", trial_duration: 3000 };

			var test_procedure = { timeline: [fixation, test, response], timeline_variables: test_stimuli, repetitions: 1, randomize_order: false, post_trial_gap: 500 };
			timeline.push(test_procedure);

			var debrief_block = { type: jsPsychHtmlKeyboardResponse, stimulus: function() { var trials = jsPsych.data.get(); var rt = Math.round(trials.select('rt').mean()); return `<p>Your average response time was ${rt}ms.</p><p>Press any key to complete the experiment. Thank you for your time!</p>`; } };
			timeline.push(debrief_block);

			jsPsych.run(timeline);

		} catch (error) {
			console.error(error);
			jQuery('#display_stage').html('<p style="color: red;">A critical error occurred. Please contact the study administrator.</p>');
		}
	}
});
