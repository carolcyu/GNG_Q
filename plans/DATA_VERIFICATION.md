# Data Verification: Timing Configuration and Trial Data

## Verification Status

### Current Implementation Analysis

#### Standalone Version (`src/index.html`)

**Data Collection:**
- `jsPsych.data.get()` - Collects all trial data
- `jsPsych.data.displayData()` - Displays data in browser

**Timing Data Stored Per Trial:**

**Fixation Trials:**
- `fixation_duration` - Stored in `on_finish` (line 187)
- `trial_sequence_index` - Stored in `on_finish` (line 188)
- `task: 'fixation'` - Stored in data object (line 171)

**Test Block Trials:**
- `stimulus_duration` - Stored in `on_finish` (line 272)
- `trial_sequence_index` - Stored in `on_finish` (line 273)
- `stimulus_type` - Stored in `on_finish` (line 274)
- `task: 'response'` - Stored in data object (line 207)
- `correct_response` - Stored in data object (line 208)
- `response_type` - Stored in data object (line 209)
- `response` - Collected by jsPsych plugin
- `rt` - Collected by jsPsych plugin
- `correct` - Calculated in `on_finish` (line 282, 296)

**Timing Sequence Configuration:**
- `fixation_sequence_standalone` - NOT saved (only used internally)
- `stimulus_sequence_standalone` - NOT saved (only used internally)

#### Qualtrics Version (`src/lib/qualtrics/qualtrics.js`)

**Data Collection:**
- `jsPsych.data.get().json()` - Exports all trial data as JSON string
- Saved to Qualtrics embedded data field "GNG"

**Timing Data Stored Per Trial:**

**Fixation Trials:**
- `fixation_duration` - Stored in `on_finish` (line 388)
- `trial_sequence_index` - Stored in `on_finish` (line 389)
- `task: 'fixation'` - Stored in data object (line 371)

**Test Block Trials:**
- `stimulus_duration` - Stored in `on_finish` (line 481)
- `trial_sequence_index` - Stored in `on_finish` (line 482)
- `stimulus_type` - Stored in `on_finish` (line 483)
- `task: 'response'` - Stored in data object (line 409)
- `correct_response` - Stored in data object (line 410)
- `response_type` - Stored in data object (line 411)
- `response` - Collected by jsPsych plugin
- `rt` - Collected by jsPsych plugin
- `correct` - Calculated in `on_finish` (line 491, 505)

**Timing Sequence Configuration:**
- `fixation_sequence_qualtrics` - NOT saved (only used internally)
- `stimulus_sequence_qualtrics` - NOT saved (only used internally)

---

## Recommendations

### Issue: Timing Sequence Configuration Not Saved

**Problem:** The timing sequence arrays themselves are not saved, only the individual trial durations. This makes it harder to verify the sequence was correct or to reconstruct the full timing pattern.

**Solution:** Add timing sequence configuration to the final data export.

### Recommended Enhancement

Add timing sequence metadata to the data export so researchers can:
1. Verify the sequence was correct
2. Reconstruct the full timing pattern
3. Have a reference for MRI alignment

---

## Verification Checklist

### Per-Trial Data Fields

- [x] Fixation trials include `fixation_duration`
- [x] Fixation trials include `trial_sequence_index`
- [x] Response trials include `stimulus_duration`
- [x] Response trials include `trial_sequence_index`
- [x] Response trials include `stimulus_type`
- [x] All standard jsPsych fields (response, rt, correct, etc.)

### Data Export

- [x] Standalone: `jsPsych.data.displayData()` includes all trials
- [x] Qualtrics: `jsPsych.data.get().json()` includes all trials
- [x] All timing fields are in the data object when exported

### Missing: Sequence Configuration

- [ ] Timing sequence arrays not saved
- [ ] Sequence metadata not included in export

---

## Conclusion

**Current Status:** All per-trial timing data IS being saved correctly. Each trial includes:
- Its specific duration values
- Its position in the sequence
- Its stimulus type

**Enhancement Needed:** Timing sequence configuration arrays should be added to the export for complete documentation and verification.

