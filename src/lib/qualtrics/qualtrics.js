Qualtrics.SurveyEngine.addOnload(function()
{
    console.log('[GNG-Qualtrics] Qualtrics onload triggered');
    // Retrieve Qualtrics object and save in qthis
	var qthis = this;
	qthis.hideNextButton();
	console.log('[GNG-Qualtrics] Next button hidden');

 // Hide the question text and make the container full screen
    jQuery('.QuestionText, .QuestionBody').hide();
    jQuery('.QuestionOuter').css({
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'width': '100%',
        'height': '100vh',
        'z-index': '9999',
        'background': 'black',
        'margin': '0',
        'padding': '0'
    });

	// Create display elements
    var displayDiv = document.createElement('div');
    displayDiv.id = 'display_stage';
    displayDiv.style.cssText = 'width: 100%; height: 100vh; padding: 80px 20px 20px 20px; position: relative; z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center;';
    displayDiv.innerHTML = '<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>';
    
	 // Insert at the top of the question area
    jQuery('.QuestionOuter').prepend(displayDiv);
    
    // Define task_github globally
    window.task_github = "https://carolcyu.github.io/GNG_Q/";
    console.log('[GNG-Qualtrics] GitHub URL set:', window.task_github);
    
    // Load the experiment
    if (typeof jQuery !== 'undefined') {
        console.log('[GNG-Qualtrics] jQuery available, loading experiment...');
        loadExperiment();
    } else {
        console.error('[GNG-Qualtrics] ERROR: jQuery not available!');
    }
    
    function loadExperiment() {
        console.log('[GNG-Qualtrics] loadExperiment() called');
        // Update display
        jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
        
        // Load CSS first with error handling
        console.log('[GNG-Qualtrics] Loading CSS files...');
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_GNG.css'>").appendTo('head');
        console.log('[GNG-Qualtrics] CSS files loaded');
        
        // Add inline CSS as backup
        jQuery("<style>").text(`
            #display_stage {
                background-color: black !important;
                height: 100vh !important;
                padding: 50px 20px 20px 20px !important;
                width: 100% !important;
                position: relative !important;
                z-index: 1000 !important;
                overflow: hidden;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                box-sizing: border-box !important;
            }
            #display_stage img {
                max-width: 65% !important;
                max-height: 50vh !important;
                height: auto !important;
                display: block !important;
                margin: 10px auto !important;
                object-fit: contain !important;
            }
            .jspsych-content {
                background-color: black !important;
                padding: 20px !important;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                width: 100% !important;
                height: 100vh !important;
                overflow: hidden;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
                box-sizing: border-box !important;
            }
            .jspsych-display-element {
                background-color: black !important;
                width: 100% !important;
                height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                align-items: center !important;
            }
            .jspsych-stimulus {
                max-width: 100% !important;
                max-height: 60vh !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: flex-start !important;
                align-items: center !important;
            }
            .QuestionOuter {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: black !important;
                margin: 0 !important;
                padding: 0 !important;
            }
            body {
                overflow: hidden !important;
            }
        `).appendTo('head');
        
        // Scripts to load
        var scripts = [
            window.task_github + "jspsych/jspsych.js",
            window.task_github + "jspsych/plugin-image-keyboard-response.js",
            window.task_github + "jspsych/plugin-html-keyboard-response.js",
            window.task_github + "jspsych/plugin-preload.js"
        ];
        
        loadScripts(0);
        
        function loadScripts(index) {
            if (index >= scripts.length) {
                // All scripts loaded, start experiment
                console.log('[GNG-Qualtrics] All scripts loaded successfully');
                console.log('[GNG-Qualtrics] Initializing experiment in 500ms...');
                setTimeout(initExp, 500);
                return;
            }
            
            console.log('[GNG-Qualtrics] Loading script', (index + 1) + '/' + scripts.length + ':', scripts[index]);
            jQuery.getScript(scripts[index])
                .done(function() {
                    console.log('[GNG-Qualtrics] Script loaded:', scripts[index]);
                    loadScripts(index + 1);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('[GNG-Qualtrics] Failed to load script:', scripts[index]);
                    console.error('[GNG-Qualtrics] Error details:', {
                        status: textStatus,
                        error: errorThrown,
                        responseText: jqXHR.responseText
                    });
                    jQuery('#display_stage').html('<p style="color: red;">Failed to load experiment scripts. Please refresh the page.</p>');
                });
        }
    }


function initExp(){
    console.log('[GNG-Qualtrics] initExp() called');
    try {
        // Check if jsPsych is available
        if (typeof initJsPsych === 'undefined') {
            console.error('[GNG-Qualtrics] ERROR: jsPsych library not loaded');
            jQuery('#display_stage').html('<p style="color: red;">Error: jsPsych library not loaded</p>');
            return;
        }
        console.log('[GNG-Qualtrics] jsPsych library available');
        
        // Ensure display stage is focused for keyboard input
        var displayStage = document.getElementById('display_stage');
        if (displayStage) {
            console.log('[GNG-Qualtrics] Setting up display stage focus');
            displayStage.setAttribute('tabindex', '0');
            displayStage.style.outline = 'none';
            displayStage.focus();
            console.log('[GNG-Qualtrics] Display stage focused');
            
            // Make it focusable on click
            displayStage.addEventListener('click', function() {
                console.log('[GNG-Qualtrics] Display stage clicked, refocusing');
                this.focus();
            });
        } else {
            console.error('[GNG-Qualtrics] ERROR: display_stage element not found');
        }
        
        jQuery('#display_stage').html('<h3>Experiment Starting...</h3>');
        console.log('[GNG-Qualtrics] Version: Qualtrics');
        console.log('[GNG-Qualtrics] Response key: 1');
        
        /* start the experiment*/
        var jsPsych = initJsPsych({
            /* Use the Qualtrics-mounted stage as the display element */
            display_element: 'display_stage',
            on_trial_start: function() {
                var trial = jsPsych.getCurrentTrial();
                console.log('[GNG-Qualtrics] Trial starting:', {
                    trial_type: trial.type,
                    task: trial.data ? trial.data.task : 'unknown',
                    trial_index: jsPsych.getProgress().current_trial_global
                });
                // Ensure focus on each trial for keyboard input
                var displayStage = document.getElementById('display_stage');
                if (displayStage) {
                    displayStage.focus();
                }
            },
            on_trial_finish: function(data) {
                console.log('[GNG-Qualtrics] Trial finished:', {
                    trial_type: data.trial_type,
                    task: data.task || 'unknown',
                    response: data.response,
                    rt: data.rt,
                    correct: data.correct,
                    trial_index: jsPsych.getProgress().current_trial_global
                });
            },
            on_finish: function() {
                console.log('[GNG-Qualtrics] Experiment completed!');
                var allData = jsPsych.data.get();
                var responseTrials = allData.filter({task: 'response'});
                console.log('[GNG-Qualtrics] Final statistics:', {
                    total_trials: responseTrials.count(),
                    correct_trials: responseTrials.filter({correct: true}).count(),
                    go_trials: responseTrials.filter({correct_response: '1'}).count(),
                    no_go_trials: responseTrials.filter({correct_response: null}).count()
                });
                
                // Add timing sequence configuration to data for MRI alignment reference
                var timingConfig = {
                    fixation_sequence: fixation_sequence_qualtrics,
                    stimulus_sequence: stimulus_sequence_qualtrics,
                    version: 'qualtrics',
                    total_trials: 80
                };
                jsPsych.data.addProperties({
                    timing_config: timingConfig
                });
                
                console.log('[GNG-Qualtrics] Timing configuration saved:', timingConfig);
                
                /* Saving task data to qualtrics */
                var GNG = jsPsych.data.get().json();
                console.log('[GNG-Qualtrics] Saving data to Qualtrics embedded data field "GNG"');
                console.log('[GNG-Qualtrics] Data size:', GNG.length, 'characters');
                // save to qualtrics embedded data
                Qualtrics.SurveyEngine.setEmbeddedData("GNG", GNG);
                console.log('[GNG-Qualtrics] Data saved to Qualtrics');
                
                // clear the stage
                jQuery('#display_stage').remove();
                jQuery('#display_stage_background').remove();
                console.log('[GNG-Qualtrics] Display stage cleared');

                // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
                console.log('[GNG-Qualtrics] Clicking Qualtrics next button');
                qthis.clickNextButton();
            }
        }); 
      // --- GNG TASK TIMELINE DEFINITION ---
      var timeline = [];

    /* define welcome message trial */
    var welcome = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>Welcome to the Go/No-Go Task.</p><p>In this experiment, different circles will appear in the center of the screen.</p><p>Press any key to continue.</p>",
      choices: "ALL_KEYS",
      response_ends_trial: true
    };
    timeline.push(welcome);

    /* define instructions trial */
    var instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>If the circle is <strong>blue</strong>, you should press the '1' key as quickly as possible.</p><br><p>If the circle is <strong>orange</strong>, you should <strong>not</strong> press any key.</p><p>Press any key to begin.</p>",
      choices: "ALL_KEYS",
      response_ends_trial: true,
      post_trial_gap: 1000
    };
    timeline.push(instructions);

    /*questions for the examiner*/
    var questions = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<p>If you have questions or concerns, please signal to the examiner.</p><p>If not, press any key to continue.</p>",
        choices: "ALL_KEYS",
        response_ends_trial: true
    };
    timeline.push(questions);

    /*define trial awaiting for the scanner keyboard button #5 */
    var MRIstart = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "<p>Please wait while the scanner starts up. This will take 10 seconds.</p>",
        choices: ['5'],
        prompt: "<p>A cross (+) will appear when the task starts.</p>",
        response_ends_trial: true,
        data: {
            task: 'mri_start'
        },
        on_start: function() {
            console.log('[GNG-Qualtrics] Waiting for MRI scanner trigger (key 5)...');
        },
        on_finish: function(data) {
            console.log('[GNG-Qualtrics] MRI trigger received:', {
                key: data.response,
                rt: data.rt,
                timestamp: new Date().toISOString()
            });
        }
    };
    timeline.push(MRIstart);

    /* define test trial stimuli array - programmatically generated */
    // Base stimulus definitions
    var base_stimuli = [
        {stimulus: window.task_github + 'img/blue.png', data: {response: 'go'}, correct_response: '1'},
        {stimulus: window.task_github + 'img/orange.png', data: {response: 'no-go'}, correct_response: null}
    ];
    
    // Generate stimulus array with desired Go/No-Go ratio (approximately 70% Go, 30% No-Go)
    // Pattern: Go, No-Go, Go, Go, No-Go, Go, No-Go, Go, Go, Go, No-Go, Go, Go, Go, No-Go, No-Go
    var stimulus_pattern = [
        'go', 'no-go', 'go', 'go', 'no-go', 'go', 'no-go', 'go', 
        'go', 'go', 'no-go', 'go', 'go', 'go', 'no-go', 'no-go'
    ];
    
    var test_stimulus = stimulus_pattern.map(function(type) {
        return base_stimuli.find(function(s) { return s.data.response === type; });
    });
    console.log('[GNG-Qualtrics] Stimulus array generated:', {
        total_stimuli: test_stimulus.length,
        go_count: test_stimulus.filter(function(s) { return s.data.response === 'go'; }).length,
        no_go_count: test_stimulus.filter(function(s) { return s.data.response === 'no-go'; }).length
    });
    
    /* Fixed timing sequences for MRI alignment (same for all participants) */
    // Qualtrics version: 80 trials (5 reps × 16 stimuli)
    // Fixation durations: 500, 750, 1000ms
    // Pattern repeats to cover 80 trials (500, 750, 1000 repeating)
    var fixation_sequence_qualtrics = [
        500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500,
        750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750,
        1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000,
        500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500,
        750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750, 1000, 500, 750
    ];
    
    // Stimulus durations: 2000, 2500, 3000, 3500ms
    // Pattern repeats to cover 80 trials
    var stimulus_sequence_qualtrics = [
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500,
        2000, 2500, 3000, 3500, 2000, 2500, 3000, 3500
    ];
    
    // Track current trial index for timing sequence
    var trial_counter_qualtrics = 0;
    
    var fixation = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<div style="font-size:60px;">+</div>',
        choices: "NO_KEYS",
        response_ends_trial: false,
        data: {
            task: 'fixation'
        },
        trial_duration: function(){
            var index = trial_counter_qualtrics;
            var duration = fixation_sequence_qualtrics[index % fixation_sequence_qualtrics.length];
            console.log('[GNG-Qualtrics] Fixation duration:', duration + 'ms', '(index:', index + ')');
            return duration;
        },
        on_start: function() {
            var index = trial_counter_qualtrics;
            var duration = fixation_sequence_qualtrics[index % fixation_sequence_qualtrics.length];
            console.log('[GNG-Qualtrics] Fixation cross displayed (trial', index + ')');
            // Store timing data for MRI alignment
            var trial = jsPsych.getCurrentTrial();
            if (trial && trial.data) {
                trial.data.fixation_duration = duration;
                trial.data.trial_sequence_index = index;
            }
        },
        on_finish: function(data) {
            var index = trial_counter_qualtrics;
            var duration = fixation_sequence_qualtrics[index % fixation_sequence_qualtrics.length];
            data.fixation_duration = duration;
            data.trial_sequence_index = index;
            // Don't increment here - increment after test_block finishes
        }
    };
    var test_block = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('stimulus'),
        choices: ['1'],
        trial_duration: function(){
            // Use fixed stimulus duration sequence
            // Use same index as fixation (they're a pair)
            var index = trial_counter_qualtrics;
            var duration = stimulus_sequence_qualtrics[index % stimulus_sequence_qualtrics.length];
            console.log('[GNG-Qualtrics] Stimulus duration:', duration + 'ms', '(index:', index + ')');
            return duration;
        },
        response_ends_trial: false,
        stimulus_height: 300,
        maintain_aspect_ratio: true,
        data: {
            task: 'response',
            correct_response: jsPsych.timelineVariable('correct_response'),
            response_type: jsPsych.timelineVariable('response')
        },
        on_load: function() {
            // Prevent mouse clicks from advancing trials
            var displayElement = document.getElementById('display_stage');
            if (!displayElement) {
                displayElement = document.querySelector('.jspsych-display-element');
            }
            if (displayElement) {
                // Use capture phase to intercept clicks early
                var clickHandler = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log('[GNG-Qualtrics] Mouse click prevented on test trial');
                    return false;
                };
                displayElement.addEventListener('click', clickHandler, true);
                displayElement.addEventListener('mousedown', clickHandler, true);
                displayElement.addEventListener('mouseup', clickHandler, true);
                
                // Also prevent clicks on images
                var images = displayElement.querySelectorAll('img');
                images.forEach(function(img) {
                    img.style.pointerEvents = 'none';
                    img.addEventListener('click', clickHandler, true);
                });
            }
        },
        on_start: function() {
            var trial = jsPsych.getCurrentTrial();
            // Use same index as fixation (they're a pair)
            var index = trial_counter_qualtrics;
            var duration = stimulus_sequence_qualtrics[index % stimulus_sequence_qualtrics.length];
            var trialType = trial.data.correct_response !== null ? 'GO' : 'NO-GO';
            console.log('[GNG-Qualtrics] Stimulus displayed:', {
                type: trialType,
                stimulus: trial.stimulus,
                expected_response: trial.data.correct_response || 'NO RESPONSE',
                duration: duration + 'ms',
                index: index
            });
            
            // Store timing data for MRI alignment
            if (trial && trial.data) {
                trial.data.stimulus_duration = duration;
                trial.data.trial_sequence_index = index;
                trial.data.stimulus_type = trial.data.response_type;
            }
            
            // Ensure pointer events are disabled on stimulus images
            setTimeout(function() {
                var displayStage = document.getElementById('display_stage');
                var container = displayStage || document.querySelector('.jspsych-display-element');
                if (container) {
                    var images = container.querySelectorAll('img');
                    images.forEach(function(img) {
                        img.style.pointerEvents = 'none';
                        img.style.cursor = 'default';
                    });
                }
            }, 50);
        },
        on_finish: function(data){
            // Use same index as fixation (they're a pair)
            var index = trial_counter_qualtrics;
            var duration = stimulus_sequence_qualtrics[index % stimulus_sequence_qualtrics.length];
            var trialType = data.correct_response !== null ? 'GO' : 'NO-GO';
            
            // Store timing data for MRI alignment
            data.stimulus_duration = duration;
            data.trial_sequence_index = index;
            data.stimulus_type = data.response_type;
            
            // Increment counter after test_block finishes (both fixation and test_block done)
            trial_counter_qualtrics++;
            
            // 1. Check if it is a GO trial (correct_response is '1')
            if (data.correct_response !== null) {
                // It is correct if the key pressed matches the correct response
                data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
                console.log('[GNG-Qualtrics] GO trial result:', {
                    type: 'GO',
                    response: data.response,
                    expected: data.correct_response,
                    correct: data.correct,
                    rt: data.rt,
                    duration: duration + 'ms',
                    index: index
                });
            } 
            // 2. Otherwise, it is a NO-GO trial (correct_response is null)
            else {
                // It is correct ONLY if no key was pressed (response is null)
                data.correct = (data.response === null);
                console.log('[GNG-Qualtrics] NO-GO trial result:', {
                    type: 'NO-GO',
                    response: data.response,
                    expected: 'NO RESPONSE',
                    correct: data.correct,
                    rt: data.rt || 'N/A',
                    duration: duration + 'ms',
                    index: index
                });
            }
        }
    };
    /* Preload images before test procedure */
    var preload = {
        type: jsPsychPreload,
        auto_preload: true,
        on_finish: function(data) {
            console.log('[GNG-Qualtrics] Preload completed:', {
                success_count: data.success_count,
                fail_count: data.fail_count,
                errors: data.errors
            });
        }
    };
    
    var test_procedure = {
        timeline: [fixation, test_block],
        timeline_variables: test_stimulus,
        repetitions: 5,
        randomize_order: false
    };
    
    timeline.push(preload);
    timeline.push(test_procedure);
    
    var debrief_block = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            // Get all trials labeled 'response'
            var trials = jsPsych.data.get().filter({task: 'response'});
            var total = trials.count();
            
            // Error handling: check if we have any trials
            if (total === 0) {
                console.error('[GNG-Qualtrics] ERROR: No response trials found for debrief');
                return '<p>No response trials found.</p><p>Press any key to complete the experiment.</p>';
            }
            
            // Get only the correct ones
            var correct_trials = trials.filter({correct: true});
            var correct_count = correct_trials.count();
            
            var go_trials = trials.filter({correct_response: '1'});
            var no_go_trials = trials.filter({correct_response: null});
            var go_correct = go_trials.filter({correct: true});
            var no_go_correct = no_go_trials.filter({correct: true});
            
            // Calculate accuracy with error handling
            var accuracy = total > 0 ? Math.round((correct_count / total) * 100) : 0;
            if (isNaN(accuracy)) {
                accuracy = 0;
            }
            
            // Calculate Go/No-Go specific accuracies with error handling
            var go_count = go_trials.count();
            var go_correct_count = go_correct.count();
            var go_accuracy = go_count > 0 ? Math.round((go_correct_count / go_count) * 100) : 0;
            if (isNaN(go_accuracy)) go_accuracy = 0;
            
            var no_go_count = no_go_trials.count();
            var no_go_correct_count = no_go_correct.count();
            var no_go_accuracy = no_go_count > 0 ? Math.round((no_go_correct_count / no_go_count) * 100) : 0;
            if (isNaN(no_go_accuracy)) no_go_accuracy = 0;
            
            var stats = {
                total_trials: total,
                correct_trials: correct_count,
                accuracy: accuracy + '%',
                go_trials: go_count,
                go_correct: go_correct_count,
                go_accuracy: go_accuracy + '%',
                no_go_trials: no_go_count,
                no_go_correct: no_go_correct_count,
                no_go_accuracy: no_go_accuracy + '%'
            };
            
            console.log('[GNG-Qualtrics] Debrief statistics:', stats);
            console.log('[GNG-Qualtrics] Accuracy calculation debug:', {
                total: total,
                correct: correct_count,
                accuracy: accuracy,
                calculation: correct_count + ' / ' + total + ' * 100 = ' + accuracy + '%'
            });

            return `<p>You responded correctly on <strong>${accuracy}%</strong> of the trials.</p>
                    <p>Press any key to complete the experiment. Thank you!</p>`;
        }
    };
    timeline.push(debrief_block);
    
    /* start the experiment */
    console.log('[GNG-Qualtrics] Starting experiment with', timeline.length, 'timeline items');
    console.log('[GNG-Qualtrics] Test procedure:', {
        repetitions: 5,
        stimuli_per_repetition: 16,
        total_test_trials: 80,
        randomize: false
    });
    jsPsych.run(timeline);
    
    } catch (error) {
        console.error('[GNG-Qualtrics] ERROR in initExp():', error);
        console.error('[GNG-Qualtrics] Error stack:', error.stack);
        if (document.getElementById('display_stage')) {
            document.getElementById('display_stage').innerHTML = '<p style="color: red;">Error initializing experiment. Please refresh the page.</p>';
        }
    }
}

// Close the addOnload function
});

Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});