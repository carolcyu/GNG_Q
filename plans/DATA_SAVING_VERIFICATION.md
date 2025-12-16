# Data Saving Verification Report

## Summary

All timing configurations and trial data are now being saved correctly in both standalone and Qualtrics versions.

---

## Data Saved Per Trial

### Fixation Trials

**Fields Saved:**
- `trial_type`: "html-keyboard-response"
- `task`: "fixation"
- `fixation_duration`: number (exact duration in ms)
- `trial_sequence_index`: number (position in sequence, 0-39 for standalone, 0-79 for Qualtrics)
- `trial_duration`: number (same as fixation_duration)
- `stimulus`: string (fixation cross HTML)
- Standard jsPsych fields (trial_index, time_elapsed, etc.)

**Storage Location:**
- Standalone: Included in `jsPsych.data.get()` and displayed via `jsPsych.data.displayData()`
- Qualtrics: Included in `jsPsych.data.get().json()` and saved to Qualtrics embedded data "GNG"

### Response Trials (Test Block)

**Fields Saved:**
- `trial_type`: "image-keyboard-response"
- `task`: "response"
- `stimulus_duration`: number (exact duration in ms)
- `trial_sequence_index`: number (position in sequence, matches fixation index)
- `stimulus_type`: "go" | "no-go"
- `correct_response`: "f" | "1" | null
- `response_type`: "go" | "no-go"
- `response`: "f" | "1" | null (actual key pressed)
- `rt`: number | null (response time in ms)
- `correct`: boolean (calculated correctness)
- `stimulus`: string (image path)
- Standard jsPsych fields (trial_index, time_elapsed, etc.)

**Storage Location:**
- Standalone: Included in `jsPsych.data.get()` and displayed via `jsPsych.data.displayData()`
- Qualtrics: Included in `jsPsych.data.get().json()` and saved to Qualtrics embedded data "GNG"

---

## Timing Sequence Configuration

### Standalone Version

**Configuration Saved:**
- `timing_config.fixation_sequence`: Array of 40 durations [500, 1000, 250, ...]
- `timing_config.stimulus_sequence`: Array of 40 durations [1000, 1000, ...]
- `timing_config.version`: "standalone"
- `timing_config.total_trials`: 40

**Storage:**
- Added via `jsPsych.data.addProperties()` in `on_finish`
- Included in data export

### Qualtrics Version

**Configuration Saved:**
- `timing_config.fixation_sequence`: Array of 80 durations [500, 750, 1000, ...]
- `timing_config.stimulus_sequence`: Array of 80 durations [2000, 2500, 3000, 3500, ...]
- `timing_config.version`: "qualtrics"
- `timing_config.total_trials`: 80

**Storage:**
- Added via `jsPsych.data.addProperties()` in `on_finish`
- Included in JSON export to Qualtrics

---

## Complete Data Structure

### Example Fixation Trial Data

```json
{
  "trial_type": "html-keyboard-response",
  "task": "fixation",
  "fixation_duration": 500,
  "trial_sequence_index": 0,
  "trial_duration": 500,
  "stimulus": "<div style=\"font-size:60px;\">+</div>",
  "trial_index": 5,
  "time_elapsed": 1234,
  ...
}
```

### Example Response Trial Data (Go)

```json
{
  "trial_type": "image-keyboard-response",
  "task": "response",
  "stimulus_duration": 1000,
  "trial_sequence_index": 0,
  "stimulus_type": "go",
  "correct_response": "f",
  "response_type": "go",
  "response": "f",
  "rt": 234,
  "correct": true,
  "stimulus": "img/blue.png",
  "trial_index": 6,
  "time_elapsed": 2234,
  ...
}
```

### Example Response Trial Data (No-Go)

```json
{
  "trial_type": "image-keyboard-response",
  "task": "response",
  "stimulus_duration": 1000,
  "trial_sequence_index": 1,
  "stimulus_type": "no-go",
  "correct_response": null,
  "response_type": "no-go",
  "response": null,
  "rt": null,
  "correct": true,
  "stimulus": "img/orange.png",
  "trial_index": 7,
  "time_elapsed": 3234,
  ...
}
```

### Timing Configuration (Added to All Data)

```json
{
  "timing_config": {
    "fixation_sequence": [500, 1000, 250, ...],
    "stimulus_sequence": [1000, 1000, ...],
    "version": "standalone",
    "total_trials": 40
  }
}
```

---

## Verification Checklist

### Per-Trial Data

- [x] Fixation duration stored in fixation trials
- [x] Stimulus duration stored in response trials
- [x] Trial sequence index stored in both trial types
- [x] Stimulus type stored in response trials
- [x] Response data (response, rt, correct) stored
- [x] All standard jsPsych fields included

### Timing Configuration

- [x] Fixation sequence array saved
- [x] Stimulus sequence array saved
- [x] Version identifier saved
- [x] Total trial count saved

### Data Export

- [x] Standalone: All data included in displayData()
- [x] Qualtrics: All data included in JSON export
- [x] Timing config included in export
- [x] All trial data included in export

---

## MRI Alignment Data Completeness

### Required for MRI Alignment

- [x] Fixation duration for each trial
- [x] Stimulus duration for each trial
- [x] Trial sequence index (for ordering)
- [x] Stimulus type (Go/No-Go)
- [x] Full timing sequence configuration
- [x] Response timing (RT)

### Data Sufficiency

**For MRI Alignment:**
- Complete timing information for each trial
- Sequence order preserved via trial_sequence_index
- Full sequence configuration available for verification
- Response timing for event-related analysis

**For Behavioral Analysis:**
- Response accuracy (correct field)
- Response times (rt field)
- Trial type (Go/No-Go)
- Stimulus information

---

## Verification Status

**All Data Fields: VERIFIED**

- All per-trial timing data is saved
- Timing sequence configuration is saved
- All response data is saved
- Data structure is complete for MRI alignment
- Data export includes all fields

**Status: COMPLETE**

All timing configurations and trial data are properly saved in both versions.

---

**Report Date**: 2024  
**Status**: All data saving verified and enhanced

