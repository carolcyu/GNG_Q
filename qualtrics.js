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
                    var gng_data = jsPsych.data.get().json();
                    // Save data to Qualtrics Embedded Data field "GNG_Q"
                    Qualtrics.SurveyEngine.setEmbeddedData("GNG_Q", gng_data);
                    jQuery('#display_stage').remove();
                    qthis.clickNextButton();
                }
            });

            // =====================================================================
            // ==      CRITICAL FIX: Manual Update with Direct Time Access      ==
            // =====================================================================
            setTimeout(function() {
                window.qualtricsKeyboardListener = function(event) {
                    var keyPressed = event.key;
                    
                    // 1. Get the current trial's data object.
                    var currentTrialData = jsPsych.data.get().last().values()[0];
                    
                    // CRITICAL CHECK: Only proceed if a trial is active and a response hasn't been recorded.
                    if (currentTrialData && currentTrialData.rt === null) {
                        try {
                            // 2. Retrieve the high-resolution start time recorded in on_start.
                            var trialStartTime = currentTrialData.time_start; 
                            
                            if (!trialStartTime) {
                                console.warn("Trial start time missing. Response ignored.");
                                return; 
                            }

                            // 3. Calculate RT manually using high-resolution time.
                            var rt = performance.now() - trialStartTime;
                            
                            // 4. Manually assign the recorded response and RT to the current data object.
                            jsPsych.data.get().last().values()[0].response = keyPressed;
                            jsPsych.data.get().last().values()[0].rt = rt;
                            
                            console.log("Response recorded:", keyPressed, "RT:", rt);

                        } catch (e) {
                            console.warn("Key press " + keyPressed + " ignored due to error: " + e);
                        }
                    } else if (currentTrialData) {
                        console.warn("Key press " + keyPressed + " ignored (response already recorded).");
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
                    <p>Press any key to continue.</p>`
            };
            timeline.push(instructions);
            
            var instructions2 = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: `
                    <p>If the circle is <strong>blue</strong>, you should press the '1' key as quickly as possible.</p>
                    <p>If the circle is <strong>orange</strong>, you should <strong>not</strong> press any key.</p>
                    <p>Press any key to begin.</p>`
            };
            timeline.push(instructions2);
            
            var MRIstart = { type: jsPsychHtmlKeyboardResponse, stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>", choices: "NO_KEYS", trial_duration: 10000, prompt: "<p> A cross (+) will appear when the task starts. </p>" };
            timeline.push(MRIstart);

            var test_stimuli = [
                { stimulus: window.task_github + "img/blue.png", correct_response: '1' },
                { stimulus: window.task_github + "img/orange.png", correct_response: null }
            ];

            var fixation = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: '<div style="font-size:60px;">+</div>',
                choices: "NO_KEYS",
                response_ends_trial: false,
                trial_duration: function(){
                    return jsPsych.randomization.sampleWithoutReplacement([500, 750, 1000], 1)[0];
                }
            };

            var test_block = {
                type: jsPsychImageKeyboardResponse,
                stimulus: jsPsych.timelineVariable('stimulus'),
                // Fixed timing: NO_KEYS prevents the plugin from terminating the trial early
                choices: "NO_KEYS", 
                response_ends_trial: false,
                trial_duration: function(){
                    return jsPsych.randomization.sampleWithoutReplacement([2000, 3000, 4000], 1)[0];
                },
                data: {
                    task: 'response',
                    correct_response: jsPsych.timelineVariable('correct_response'),
                    response: null, 
                    rt: null
                },
                // *** CRITICAL ADDITION: Record high-resolution start time when the trial begins ***
                on_start: function(trial) {
                    // Record the time the trial was added to the data pipeline
                    jsPsych.data.get().last().values()[0].time_start = performance.now();
                },
                on_finish: function(data){
                    // This logic uses the 'response' and 'rt' recorded by the manual listener for scoring.
                    var response = data.response ? data.response.toLowerCase() : null;
                    data.correct = jsPsych.pluginAPI.compareKeys(response, data.correct_response);
                }
            };

            var test_procedure = {
                timeline: [fixation, test_block],
                timeline_variables: test_stimuli,
                repetitions: 75,
                randomize_order: false,
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