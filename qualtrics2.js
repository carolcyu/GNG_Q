Qualtrics.SurveyEngine.addOnload(function()
{
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // >> NEW: Force body to be focusable
    document.body.setAttribute('tabindex', '0');
    document.body.style.outline = 'none';
    

    // Hide buttons and question content
    qthis.hideNextButton();
    
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
    

    // >> NEW: Ensure displayDiv is focusable immediately
    displayDiv.setAttribute('tabindex', '0');
    displayDiv.style.outline = 'none';
    
    displayDiv.style.cssText = 'width: 100%; height: 100vh; padding: 80px 20px 20px 20px; position: relative; z-index: 1000; display: flex; flex-direction: column; justify-content: center; align-items: center;';
    // 
    // Insert at the top of the question area
    jQuery('.QuestionOuter').prepend(displayDiv);
    
    // Define task_github globally
    window.task_github = "https://carolcyu.github.io/GNG_Q/";
    
    // Load the experiment
    if (typeof jQuery !== 'undefined') {
        loadExperiment();
    }
    
    function loadExperiment() {
        // Update display
        jQuery('#display_stage').html('<h3>Loading Experiment...</h3><p>Please wait while we load the task.</p>');
        
        // Load CSS first with error handling
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/jspsych.css'>").appendTo('head');
        jQuery("<link rel='stylesheet' href='" + window.task_github + "jspsych/my_experiment_style_GNG.css'>").appendTo('head');
        
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
                max-width: 30% !important;
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
            window.task_github + "jspsych/plugin-html-button-response.js", 
            window.task_github + "jspsych/plugin-html-keyboard-response.js", 
            window.task_github + "jspsych/plugin-categorize-html.js"
        ];
        
        loadScripts(0);
        
        function loadScripts(index) {
            if (index >= scripts.length) {
                // All scripts loaded, start experiment
                setTimeout(initExp, 500);
                return;
            }
            
            jQuery.getScript(scripts[index])
                .done(function() {
                    loadScripts(index + 1);
                })
                .fail(function() {
                    jQuery('#display_stage').html('<p style="color: red;">Failed to load experiment scripts. Please refresh the page.</p>');
                });
        }
    }


function initExp(){
    try {
// Ensure display stage is focused for keyboard input
        var displayStage = document.getElementById('display_stage');
        if (displayStage) {
            displayStage.focus();
            // These lines are now redundant but safe to keep:
            displayStage.setAttribute('tabindex', '0'); 
            displayStage.style.outline = 'none';
            displayStage.style.position = 'relative';
            displayStage.style.zIndex = '1000';
            
            // >> REMOVED CONFLICTING CLICK LISTENER:
            /*
            displayStage.addEventListener('click', function() {
                this.focus();
            });
            */
            
            // Force focus after a short delay
            setTimeout(function() {
                displayStage.focus();
                // Also try focusing the document body
                document.body.focus();
            }, 100);
        }
        
        jQuery('#display_stage').html('<h3>Experiment Starting...</h3><p>Focusing display for keyboard input...</p>');
        
        // Add focus management
        var focusInterval = setInterval(function() {
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        }, 1000);
        
        // Store reference to jsPsych for later use
        window.currentJsPsych = null;
        
        /* start the experiment*/
        var jsPsych = initJsPsych({
        /* Use the Qualtrics-mounted stage as the display element */
        display_element: 'display_stage',
        on_trial_start: function() {
            // Ensure focus on each trial
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        },
        on_trial_finish: function() {
            // Ensure focus after each trial
            var displayStage = document.getElementById('display_stage');
            if (displayStage) {
                displayStage.focus();
            }
        },
        on_finish: function() {
            // Clear the focus interval
            if (typeof focusInterval !== 'undefined') {
                clearInterval(focusInterval);
            }
            
            /* Saving task data to qualtrics */
            var GNG = jsPsych.data.get().json();
            // save to qualtrics embedded data
            Qualtrics.SurveyEngine.setEmbeddedData("GNG", GNG);
            
            // clear the stage
            jQuery('#display_stage').remove();
            jQuery('#display_stage_background').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        }
      }); 
      
      // Store jsPsych reference globally
      window.currentJsPsych = jsPsych;
      
          var timeline = [];

    /* define welcome message trial */
    var welcome = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>Welcome to the Go/No-Go Task.</p><p>In this experiment, different circles will appear in the center of the screen.</p><p>Press any key to continue.</p>",
      choices: "ALL_KEYS",
      response_ends_trial: true, // <-- Correctly advances after key press
      data: {
          task: 'welcome'
      }
    };
    timeline.push(welcome);

    /* define instructions trial */
    var instructions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>If the circle is <strong>blue</strong>, you should press the '1' key as quickly as possible.</p><br><p>If the circle is <strong>orange</strong>, you should <strong>not</strong> press any key.</p><p>Press any key to begin.</p>",
      choices: "ALL_KEYS",
      response_ends_trial: true, // <-- Correctly advances after key press
      post_trial_gap: 1000,
      data: {
          task: 'instructions'
      }
    };
    timeline.push(instructions);

/*questions for the examiner*/
var questions = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: "<p>If you have questions or concerns, please signal to the examiner. </p> <p>If not, press any button to continue. </p>",
      data: {
          task: 'questions'
      }
    };
    timeline.push(questions);

/*define trial awaiting for the scanner keyboard button #5 */
var MRIstart ={
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "<p> Please wait while the scanner starts up. This will take 10 seconds. </strong></p>",
  choices: ['5'],
 prompt: "<p> A cross (+) will appear when the task starts. </p>",
 data: {
    task: 'mri_start'},
    on_finish: function(data){
    data.response;
 }
};
timeline.push(MRIstart);

    /* define test trial stimuli array */
    var test_stimulus = [
        {stimulus: 'https://carolcyu.github.io/GNG_Q/img/blue.png', data: {response: 'go'}, correct_response: '1'},
        {stimulus: 'https://carolcyu.github.io/GNG_Q/img/orange.png', data: {response: 'no-go'}, correct_response: null},
  ];
    var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  response_ends_trial: false,
  data: {
    task: 'fixation'
  },
  trial_duration: function(){
    return jsPsych.randomization.sampleWithoutReplacement([500, 750, 1000], 1)[0];
    }
};
var test_block = {
  // *** ENSURE THIS IS jsPsychImageKeyboardResponse ***
  type: jsPsychImageKeyboardResponse, 
  stimulus: jsPsych.timelineVariable('stimulus'),
  choices: ['1'],
  trial_duration: function(){
    // Trial ends after this duration, regardless of response
    return jsPsych.randomization.sampleWithoutReplacement([2000, 3000, 4000], 1)[0];
    },
  response_ends_trial: false, // <-- This ensures it runs for the full duration
   stimulus_height: 300, // Adjusted height for smaller image
  maintain_aspect_ration: true,
  data: {
    task: 'response', // Changed task name to 'response' for clarity in data
    correct_response: jsPsych.timelineVariable('correct_response')
  },
  on_finish: function(data){
        data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response);
  }
};
    var test_procedure = {
      timeline: [fixation,test_block],
      timeline_variables: test_stimulus,
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

        return `<p>You responded correctly on ${accuracy}% of the trials.</p>
          <p>Your average response time was ${rt}ms.</p>
          <p>Press any key to complete the experiment. Thank you!</p>`;

  },
  data: {
      task: 'debrief'
  }
};
timeline.push(debrief_block);
    /* start the experiment */
    jsPsych.run(timeline);
    
    // Ensure focus after experiment starts
    setTimeout(function() {
        var displayStage = document.getElementById('display_stage');
        if (displayStage) {
            displayStage.focus();
        }
    }, 1000);
    
    // *** REMOVED THE AGGRESSIVE CUSTOM KEYBOARD HANDLER ***
    
    } catch (error) {
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