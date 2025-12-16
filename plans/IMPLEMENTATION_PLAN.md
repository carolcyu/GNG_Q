# Implementation Plan: GNG Task Fixes

## Overview
This plan addresses four critical issues identified in the TODO list to ensure proper MRI data alignment, prevent unintended trial advancement, fix accuracy calculation, and implement correct stimulus repetition.

---

## Issue 1: Fixed Timing Order for MRI Alignment

### Problem
Currently, fixation and stimulus durations are randomly selected on each trial, making it impossible to align with MRI data. Need a predetermined sequence that's consistent across all participants but still appears random.

### Solution
Create a fixed sequence of durations that repeats for all participants. Store the sequence in the data for MRI alignment.

### Implementation Steps

1. **Create Fixed Duration Sequences**
   - Generate a predetermined sequence of fixation durations (500, 750, 1000ms)
   - Generate a predetermined sequence of stimulus durations (2000, 2500, 3000, 3500ms)
   - Store these sequences as arrays that will be used in order
   - Ensure sequences are long enough for all trials (80 trials for Qualtrics, 40 for standalone)

2. **Modify Fixation Trial**
   - Replace `sampleWithoutReplacement` with indexed access to fixed sequence
   - Track current index in trial data
   - Store the exact duration used in trial data for MRI alignment

3. **Modify Test Block Trial**
   - Replace `sampleWithoutReplacement` with indexed access to fixed sequence
   - Track current index in trial data
   - Store the exact duration used in trial data for MRI alignment

4. **Data Storage**
   - Add `fixation_duration` and `stimulus_duration` to trial data
   - Add `trial_sequence_index` to track position in sequence
   - Add `stimulus_type` (go/no-go) to trial data for easy filtering

### Files to Modify
- `src/index.html` (standalone version)
- `src/lib/qualtrics/qualtrics.js` (Qualtrics version)

### Code Example
```javascript
// Fixed sequences (same for all participants)
var fixation_sequence = [500, 750, 1000, 500, 750, 1000, ...]; // 80 values
var stimulus_sequence = [2000, 2500, 3000, 3500, 2000, ...]; // 80 values

// In fixation trial
trial_duration: function(){
    var index = jsPsych.getProgress().current_trial_global;
    var duration = fixation_sequence[index % fixation_sequence.length];
    return duration;
}
```

---

## Issue 2: Prevent Mouse Clicks from Advancing Trials

### Problem
Even with `response_ends_trial: false`, mouse clicks are advancing trials. This breaks the fixed timing needed for MRI alignment.

### Solution
Explicitly disable mouse interactions on test trials and ensure only keyboard responses are recorded (but don't end trials).

### Implementation Steps

1. **Disable Mouse Events on Test Blocks**
   - Add CSS to prevent pointer events on stimulus images
   - Add event listeners to prevent click events from propagating
   - Ensure `response_ends_trial: false` is properly set (already done)

2. **Add CSS Pointer Events Prevention**
   - Add `pointer-events: none` to stimulus images during test trials
   - Ensure this doesn't affect instruction screens

3. **Add JavaScript Click Prevention**
   - Add `on_load` handler to prevent clicks on display element
   - Use `event.preventDefault()` and `event.stopPropagation()` for mouse events

4. **Verify Qualtrics Integration**
   - Ensure Qualtrics wrapper doesn't interfere with click prevention
   - Test that keyboard responses still work correctly

### Files to Modify
- `src/index.html`
- `src/lib/qualtrics/qualtrics.js`
- `src/lib/jspsych/my_experiment_style_GNG.css` (if needed)

### Code Example
```javascript
var test_block = {
    type: jsPsychImageKeyboardResponse,
    // ... existing config ...
    response_ends_trial: false,
    on_load: function() {
        // Prevent mouse clicks
        var displayElement = document.querySelector('.jspsych-display-element');
        if (displayElement) {
            displayElement.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
            }, true);
        }
    }
}
```

---

## Issue 3: Fix Accuracy Percentage Calculation

### Problem
Debrief screen shows 0% or blank instead of actual accuracy. This suggests the `correct` field isn't being set properly or the calculation is failing.

### Solution
Debug and fix the correctness calculation logic, ensure proper data filtering, and add error handling for edge cases.

### Implementation Steps

1. **Verify Correctness Calculation**
   - Check that `on_finish` in test_block is setting `data.correct` correctly
   - Verify the logic handles both GO and NO-GO trials properly
   - Add debugging to see what values are being calculated

2. **Fix Data Filtering**
   - Ensure `filter({task: 'response'})` is working correctly
   - Verify trial data structure matches filter criteria
   - Check for null/undefined values

3. **Add Error Handling**
   - Handle division by zero (when no trials exist)
   - Handle NaN cases
   - Add fallback values

4. **Test Accuracy Calculation**
   - Manually verify with known correct/incorrect responses
   - Check console logs to see actual values
   - Verify both GO and NO-GO trials are counted

### Files to Modify
- `src/index.html` (debrief_block)
- `src/lib/qualtrics/qualtrics.js` (debrief_block)

### Code Example
```javascript
var debrief_block = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function() {
        var trials = jsPsych.data.get().filter({task: 'response'});
        var total = trials.count();
        
        if (total === 0) {
            return '<p>No response trials found.</p>';
        }
        
        var correct_trials = trials.filter({correct: true});
        var correct_count = correct_trials.count();
        var accuracy = total > 0 ? Math.round((correct_count / total) * 100) : 0;
        
        console.log('[DEBUG] Accuracy calculation:', {
            total: total,
            correct: correct_count,
            accuracy: accuracy
        });
        
        return `<p>You responded correctly on <strong>${accuracy}%</strong> of the trials.</p>...`;
    }
}
```

---

## Issue 4: Implement 5 Repetitions of 16-Stimulus Pattern

### Problem
Currently set to 1 repetition for testing. Need to set to 5 repetitions to get 80 total trials. The 16-stimulus pattern should repeat in the exact same order 5 times.

### Solution
Change `repetitions` from 1 to 5. The current implementation already supports this - just needs the value changed.

### Implementation Steps

1. **Update Repetitions Value**
   - Change `repetitions: 1` to `repetitions: 5` in test_procedure
   - Verify this applies to Qualtrics version

2. **Verify Stimulus Pattern**
   - Confirm the 16-stimulus pattern is correct
   - Ensure it will repeat 5 times in the same order (not randomized)
   - Verify `randomize_order: false` is set

3. **Test Total Trial Count**
   - Confirm 16 stimuli × 5 repetitions = 80 trials
   - Verify each repetition uses the same order
   - Check that fixation + stimulus pairs are correct

### Files to Modify
- `src/lib/qualtrics/qualtrics.js` (test_procedure)

### Code Example
```javascript
var test_procedure = {
    timeline: [fixation, test_block],
    timeline_variables: test_stimulus, // 16 stimuli
    repetitions: 5, // Changed from 1 to 5
    randomize_order: false // Keep false to maintain order
};
// Result: 16 stimuli × 5 repetitions = 80 trials
```

---

## Implementation Order

### Phase 1: Critical Fixes (Do First)
1. **Issue 4**: Change repetitions to 5 (quickest fix)
2. **Issue 3**: Fix accuracy calculation (affects user experience)
3. **Issue 2**: Prevent mouse clicks (critical for MRI timing)

### Phase 2: MRI Alignment (Do Second)
4. **Issue 1**: Implement fixed timing sequences (most complex, requires careful testing)

---

## Testing Checklist

### For Each Issue:

#### Issue 1: Fixed Timing
- [ ] Verify fixation durations follow predetermined sequence
- [ ] Verify stimulus durations follow predetermined sequence
- [ ] Check that durations are stored in trial data
- [ ] Confirm sequence is identical across multiple runs
- [ ] Verify sequence repeats correctly for 80 trials

#### Issue 2: Click Prevention
- [ ] Test that mouse clicks don't advance test trials
- [ ] Verify keyboard responses still work
- [ ] Confirm instruction screens still work with buttons
- [ ] Test in both standalone and Qualtrics versions
- [ ] Check that clicks don't interfere with MRI trigger

#### Issue 3: Accuracy Calculation
- [ ] Test with known correct responses (should show >0%)
- [ ] Test with known incorrect responses
- [ ] Verify GO trial accuracy is calculated
- [ ] Verify NO-GO trial accuracy is calculated
- [ ] Check edge cases (all correct, all incorrect)
- [ ] Verify no NaN or undefined values appear

#### Issue 4: Repetitions
- [ ] Verify total trial count is 80 (16 × 5)
- [ ] Confirm stimulus order is identical across repetitions
- [ ] Check that each repetition has correct Go/No-Go ratio
- [ ] Verify fixation + stimulus pairs are correct

### Integration Testing
- [ ] Test complete experiment flow
- [ ] Verify data collection includes all required fields
- [ ] Check MRI alignment data is properly stored
- [ ] Test in Qualtrics environment
- [ ] Test in standalone environment
- [ ] Verify debugging logs show correct information

---

## Data Structure Requirements

### Trial Data Fields Needed:
```javascript
{
    trial_type: "image-keyboard-response",
    task: "response" | "fixation" | "mri_start",
    stimulus: "path/to/image.png",
    response: "1" | "f" | null,
    rt: number,
    correct: true | false,
    correct_response: "1" | "f" | null,
    response_type: "go" | "no-go",
    fixation_duration: number,  // NEW: for MRI alignment
    stimulus_duration: number,   // NEW: for MRI alignment
    trial_sequence_index: number, // NEW: position in sequence
    stimulus_sequence_index: number // NEW: which stimulus in pattern
}
```

---

## Notes and Considerations

1. **MRI Alignment**: The fixed timing sequences must be documented and saved. Consider adding a comment in code with the full sequence or generating it deterministically (e.g., using a fixed random seed).

2. **Performance**: Fixed sequences should be generated once at experiment start, not on each trial.

3. **Backward Compatibility**: Ensure changes don't break existing data collection or analysis scripts.

4. **Qualtrics vs Standalone**: Some fixes may need different implementations for each version. Test both.

5. **Error Handling**: Add robust error handling for edge cases (no responses, timing issues, etc.).

---

## Estimated Time

- Issue 1 (Fixed Timing): 2-3 hours
- Issue 2 (Click Prevention): 1-2 hours
- Issue 3 (Accuracy Fix): 1 hour
- Issue 4 (Repetitions): 5 minutes
- Testing: 2-3 hours

**Total: ~6-9 hours**

---

## Success Criteria

✅ All 80 trials complete without mouse clicks advancing trials  
✅ Accuracy percentage displays correctly  
✅ Timing sequences are fixed and documented  
✅ Trial data includes all fields needed for MRI alignment  
✅ Experiment runs identically for all participants (same timing)  
✅ Both Qualtrics and standalone versions work correctly  

---

**Document Version**: 1.0  
**Created**: 2024  
**Status**: Ready for Implementation

