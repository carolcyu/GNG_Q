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
	window.task_github = "https://carolcyu.github.io/GNG_MRI/";

	// Load necessary jsPsych scripts
	var scripts = [
		"https://carolcyu.github.io/GNG_MRI/jspsych/jspsych.js",
		"https://carolcyu.github.io/GNG_MRI/jspsych/plugin-image-keyboard-response.js",
		"https://carolcyu.github.io/GNG_MRI/jspsych/plugin-html-keyboard-response.js",
        "https://carolcyu.github.io/GNG_MRI/jspsych/plugin-html-button-response.js"
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
					var gng_data = jsPsych.data.get().json();
					// Save data to Qualtrics Embedded Data field "GNG"
					Qualtrics.SurveyEngine.setEmbeddedData("GNG", gng_data);
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
					var currentTrial = jsPsych.getCurrentTrial();

					try {
						// This logic handles both instruction screens and the actual task
						if (currentTrial && currentTrial.data.task === 'response') {
							// During the task, only the 'f' key should be registered as a response
							if (keyPressed.toLowerCase() === 'f') {
								jsPsych.finishTrial({ response: keyPressed });
							}
						} else {
							// For instructions or debriefing, any key press will advance the trial
							jsPsych.finishTrial({ response: keyPressed });
						}
					} catch (e) {
						console.warn("Key press " + keyPressed + " ignored on current trial.");
					}
				};
				document.addEventListener('keydown', window.qualtricsKeyboardListener);
			}, 1500);

			// --- GNG TASK TIMELINE DEFINITION ---
			var timeline = [];

			var instructions = {
				type: jsPsychHtmlKeyboardResponse,
				stimulus: `
					<p>Welcome to the Go/No-Go Task.</p>
					<p>In this experiment, different circles will appear in the center of the screen.</p>
					<p>If the circle is <strong>blue</strong>, you should press the 'F' key as quickly as possible.</p>
					<p>If the circle is <strong>orange</strong>, you should <strong>not</strong> press any key.</p>
					<p>Press any key to begin.</p>`
			};
			timeline.push(instructions);
			
			var MRIstart = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>", choices: "NO_KEYS", trial_duration: 10000, prompt: "<p> A cross (+) will appear when the task starts. </p>" };
			timeline.push(MRIstart);

			var test_stimuli = [
				{ stimulus: window.task_github + "img/blue.png", correct_response: 'f' },
				{ stimulus: window.task_github + "img/orange.png", correct_response: null }
			];

			var fixation = {
				type: jsPsychHtmlKeyboardResponse,
				stimulus: '<div style="font-size:60px;">+</div>',
				choices: "NO_KEYS",
				trial_duration: function(){
					return jsPsych.randomization.sampleWithoutReplacement([500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
				}
			};

			var test_block = {
				type: jsPsychImageKeyboardResponse,
				stimulus: jsPsych.timelineVariable('stimulus'),
				choices: "NO_KEYS", // The global listener handles all key presses
				trial_duration: 1000,
				data: {
					task: 'response',
					correct_response: jsPsych.timelineVariable('correct_response')
				},
				on_finish: function(data){
					// The global listener provides the response, now we check if it was correct
					data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
				}
			};

			var test_procedure = {
				timeline: [fixation, test_block],
				timeline_variables: test_stimuli,
				repetitions: 20,
				randomize_order: true
			};
			timeline.push(test_procedure);

			var debrief_block = {
				type: jsPsychHtmlKeyboardResponse,
				stimulus: function() {
					var trials = jsPsych.data.get().filter({task: 'response'});
					var correct_trials = trials.filter({correct: true});
					var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
					var rt = Math.round(correct_trials.select('rt').mean());
					return `<p>You responded correctly on ${accuracy}% of the trials.</p><p>Your average response time for correct trials was ${rt}ms.</p><p>Press any key to complete the experiment.</p>`;
				}
			};
			timeline.push(debrief_block);

			jsPsych.run(timeline);

		} catch (error) {
			console.error(error);
			jQuery('#display_stage').html('<p style="color: red;">A critical error occurred. Please contact the study administrator.</p>');
		}
	}
});
