# Technical Analysis: Go/No-Go Task (GNG_Q)

## Executive Summary

This project implements a **Go/No-Go (GNG) cognitive task** designed for neuroimaging studies (specifically MRI/fMRI) and integrated with Qualtrics survey platform. The task measures response inhibition by requiring participants to respond to "Go" stimuli (blue circles) while withholding responses to "No-Go" stimuli (orange circles).

**Key Technologies:**
- jsPsych 7.x framework for behavioral experiments
- Qualtrics Survey Platform integration
- GitHub Pages hosting (carolcyu.github.io/GNG_Q)
- HTML5/CSS3/JavaScript

---

## 1. Project Architecture

### 1.1 File Structure
```
GNG_Q/
├── src/
│   ├── index.html          # Standalone version
│   ├── config.json         # Configuration (currently empty)
│   ├── img/                # Stimulus images
│   │   ├── blue.png        # Go stimulus
│   │   └── orange.png      # No-Go stimulus
│   └── lib/
│       ├── jspsych/        # jsPsych library & plugins
│       └── qualtrics/
│           └── qualtrics.js # Qualtrics integration wrapper
```

### 1.2 Dual Implementation

The project contains **two distinct implementations**:

1. **Standalone Version** (`index.html`): Direct HTML/JavaScript implementation
2. **Qualtrics Version** (`qualtrics.js`): Wrapped for Qualtrics survey integration

These implementations have **significant differences** in:
- Response keys (F key vs. '1' key)
- Stimulus presentation
- Data collection methods
- Trial structure

---

## 2. Task Design & Cognitive Paradigm

### 2.1 Go/No-Go Task Overview

The Go/No-Go task is a classic **response inhibition paradigm** used in cognitive neuroscience to measure:
- **Response inhibition**: Ability to suppress prepotent responses
- **Impulse control**: Behavioral regulation
- **Executive function**: Cognitive control processes

### 2.2 Stimulus Design

- **Go Stimulus**: Blue circle → Requires keypress response
- **No-Go Stimulus**: Orange circle → Requires response withholding
- **Fixation Cross**: "+" symbol shown between trials

### 2.3 Trial Structure

Each trial consists of:
1. **Fixation period**: Variable duration (250-2000ms in standalone, 500-1000ms in Qualtrics)
2. **Stimulus presentation**: Circle appears (1000ms fixed in standalone, 2000-3500ms variable in Qualtrics)
3. **Response window**: Participant responds or withholds response

### 2.4 Behavioral Measures

- **Accuracy**: Percentage of correct responses
  - Go trials: Keypress = correct
  - No-Go trials: No keypress = correct
- **Response Time (RT)**: Reaction time for correct Go trials
- **Commission Errors**: False alarms on No-Go trials
- **Omission Errors**: Missed responses on Go trials

---

## 3. Implementation Analysis

### 3.1 Standalone Version (`index.html`)

#### Key Features:
- Uses **F key** for Go responses
- **20 repetitions** of 2-stimulus array (40 total trials)
- Fixed 1000ms stimulus duration
- Variable fixation (250-2000ms, 8 possible durations)
- Button-based instruction screens
- MRI scanner trigger wait (key '5')
- Debrief with accuracy and RT feedback

#### Timeline Structure:
```
Welcome → Instructions (3 screens) → Questions → MRI Start → 
Test Procedure (40 trials) → Debrief
```

#### Code Issues Identified:

1. **Path Errors** (Lines 5-6):
   ```html
   <script src="libn/jspsych/jspsych.js"></script>  <!-- "libn" should be "lib" -->
   <script src="libjspsych/plugin-image-keyboard-response.js"></script>  <!-- Missing "/" -->
   ```

2. **HTML Structure Issues**:
   - Unclosed `<div>` tags in instructions
   - Inconsistent formatting in instruction screens

3. **Trial Configuration**:
   - Uses `randomize_order: true` but only 2 unique stimuli
   - No preloading of images (as noted in comment)

### 3.2 Qualtrics Version (`qualtrics.js`)

#### Key Features:
- Uses **'1' key** for Go responses
- **5 repetitions** of 16-stimulus array (80 total trials)
- Variable stimulus duration (2000-3500ms)
- Variable fixation (500-1000ms, 3 possible durations)
- Keyboard-based instruction screens
- MRI scanner trigger wait (key '5')
- Data saved to Qualtrics embedded data field
- Automatic progression to next Qualtrics question

#### Integration Architecture:

1. **Qualtrics Wrapper**:
   - Hides Qualtrics UI elements
   - Creates full-screen display container
   - Loads jsPsych dynamically from GitHub Pages
   - Manages focus for keyboard input

2. **Dynamic Loading**:
   - CSS files loaded via jQuery
   - JavaScript files loaded sequentially
   - Error handling for failed script loads
   - Inline CSS as backup styling

3. **Focus Management**:
   - Multiple focus strategies (display stage, body, intervals)
   - Keyboard event capture
   - Trial-level focus enforcement

4. **Data Collection**:
   - All trial data saved as JSON to Qualtrics embedded data
   - Field name: `"GNG"`
   - Automatic survey progression on completion

#### Code Complexity:

The Qualtrics version contains **significant complexity** for:
- Focus management (lines 154-190, 371-377, 384-442)
- Keyboard event handling (lines 169-172, 379-442)
- Trial-specific key filtering (lines 391-414)
- Error handling and fallbacks

#### Potential Issues:

1. **Redundant Focus Management**: Multiple overlapping focus strategies may conflict
2. **Complex Keyboard Handler**: Custom keyboard handler (lines 379-442) may interfere with jsPsych's native handling
3. **Trial Duration Logic**: `response_ends_trial: false` means trials always run full duration, regardless of response
4. **Stimulus Array**: Hardcoded 16-item array with manual repetition (could use randomization)

---

## 4. MRI Scanner Integration

### 4.1 Scanner Trigger

Both versions include an **MRI start trial** that:
- Waits for scanner keyboard button **'5'** to be pressed
- Displays waiting message
- Serves as synchronization point for fMRI acquisition

### 4.2 Timing Considerations

- **Variable fixation**: Jitters timing to reduce anticipation
- **Variable stimulus duration**: Prevents predictable timing patterns
- **Post-trial gaps**: Allows for hemodynamic response modeling

### 4.3 Compatibility

The task is designed for:
- **MRI-safe keyboards** (button box with numbered keys)
- **fMRI timing requirements** (variable ITIs, jittered durations)
- **Scanner environment** (dark background, minimal distractions)

---

## 5. Data Structure & Collection

### 5.1 jsPsych Data Format

Each trial records:
```javascript
{
  trial_type: "image-keyboard-response" | "html-keyboard-response",
  stimulus: "path/to/image.png",
  response: "1" | "f" | null,
  rt: number (milliseconds),
  correct: true | false,
  task: "response" | "fixation" | "mri_start",
  correct_response: "1" | "f" | null,
  response: "go" | "no-go"
}
```

### 5.2 Qualtrics Integration

- **Embedded Data Field**: `GNG` (contains full JSON)
- **Data Format**: JSON string of all trial data
- **Access**: Available in Qualtrics survey flow and data exports

### 5.3 Data Analysis Capabilities

The collected data enables:
- Trial-by-trial accuracy analysis
- Response time distributions
- Error type classification (commission vs. omission)
- Condition-specific analyses (Go vs. No-Go)
- Timing analysis (fixation, stimulus, ITI)

---

## 6. Styling & Presentation

### 6.1 CSS Design

**Custom Styles** (`my_experiment_style_GNG.css`):
- Black background (MRI-friendly)
- White text (high contrast)
- Centered content (max-width: 65%)
- Image sizing (25% width, auto height)

**Qualtrics Inline Styles**:
- Full-screen overlay (100vh, fixed positioning)
- Black background
- Centered flexbox layout
- Image constraints (max 65% width, 50vh height)

### 6.2 Visual Design

- **Minimalist**: Black background, white text, simple stimuli
- **MRI-optimized**: High contrast, minimal visual noise
- **Responsive**: Flexbox layouts for centering
- **Accessible**: Clear instructions with visual examples

---

## 7. Code Quality Assessment

### 7.1 Strengths

✅ **Clear task structure**: Well-organized timeline
✅ **MRI compatibility**: Appropriate timing and design
✅ **Qualtrics integration**: Functional wrapper with error handling
✅ **Data collection**: Comprehensive trial-level data
✅ **Error handling**: Try-catch blocks and fallbacks in Qualtrics version

### 7.2 Issues & Concerns

#### Critical Issues:

1. **Path Errors in `index.html`**:
   - Line 5: `libn/jspsych` → should be `lib/jspsych`
   - Line 6: `libjspsych/` → should be `lib/jspsych/`

2. **HTML Structure**:
   - Unclosed `<div>` tags in instruction screens
   - Inconsistent nesting

3. **Code Duplication**:
   - Two separate implementations with similar logic
   - Maintenance burden (changes must be made twice)

#### Moderate Issues:

4. **Focus Management Complexity**:
   - Over-engineered focus handling in Qualtrics version
   - Multiple competing strategies may cause conflicts

5. **Keyboard Handler**:
   - Custom keyboard handler may interfere with jsPsych
   - Complex conditional logic for trial types
   - Potential race conditions

6. **Stimulus Array**:
   - Hardcoded 16-item array in Qualtrics version
   - Manual repetition instead of programmatic generation
   - No easy way to adjust trial counts

7. **Trial Duration Logic**:
   - `response_ends_trial: false` means responses don't advance trials
   - May confuse participants expecting immediate feedback
   - Could affect response time measurements

#### Minor Issues:

8. **Empty Config File**: `config.json` is empty (unused)
9. **Inconsistent Response Keys**: F key vs. '1' key between versions
10. **No Image Preloading**: May cause timing issues on slow connections
11. **Limited Error Messages**: Minimal user-facing error handling

---

## 8. Behavioral Task Validity

### 8.1 Task Validity

✅ **Appropriate paradigm**: Go/No-Go is well-established
✅ **Clear instructions**: Visual examples provided
✅ **Adequate trial count**: 40-80 trials provides sufficient power
✅ **Timing variability**: Jittered durations reduce anticipation

### 8.2 Potential Improvements

- **Practice trials**: No practice phase before main task
- **Feedback**: No trial-by-trial feedback (may be intentional for MRI)
- **Stimulus ratio**: Go/No-Go ratio could be optimized (currently ~70% Go in Qualtrics version)
- **Response window**: Fixed/variable durations may affect RT measurements

---

## 9. Technical Recommendations

### 9.1 Immediate Fixes

1. **Fix path errors** in `index.html` (lines 5-6)
2. **Fix HTML structure** in instruction screens
3. **Standardize response keys** between versions (or document differences)
4. **Add image preloading** for consistent timing

### 9.2 Code Refactoring

1. **Unify implementations**: Create shared task logic, separate only UI/wrapper code
2. **Simplify focus management**: Remove redundant focus strategies
3. **Remove custom keyboard handler**: Let jsPsych handle keyboard events natively
4. **Generate stimulus array programmatically**: Use loops instead of hardcoded arrays

### 9.3 Feature Enhancements

1. **Configuration file**: Use `config.json` for:
   - Trial counts
   - Stimulus durations
   - Response keys
   - Go/No-Go ratios

2. **Practice phase**: Add optional practice trials
3. **Data validation**: Check data completeness before saving
4. **Error recovery**: Better handling of network/loading failures

### 9.4 Documentation

1. **README updates**: Document differences between versions
2. **Code comments**: Add JSDoc-style comments
3. **Deployment guide**: Instructions for GitHub Pages setup
4. **Qualtrics setup**: Step-by-step integration guide

---

## 10. Testing Recommendations

### 10.1 Functional Testing

- [ ] Test both standalone and Qualtrics versions
- [ ] Verify all keyboard responses are captured
- [ ] Test MRI trigger (key '5') functionality
- [ ] Validate data collection and export
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on different devices (desktop, tablet)

### 10.2 Timing Validation

- [ ] Verify fixation durations are correctly randomized
- [ ] Check stimulus presentation timing
- [ ] Validate response time measurements
- [ ] Test with slow network connections (image loading)

### 10.3 Integration Testing

- [ ] Test Qualtrics embedded data saving
- [ ] Verify survey progression after task completion
- [ ] Test focus management in Qualtrics environment
- [ ] Validate full-screen overlay functionality

---

## 11. Security & Privacy Considerations

### 11.1 Data Privacy

- **Qualtrics data**: Stored according to Qualtrics privacy policy
- **GitHub Pages**: Public repository (ensure no sensitive data)
- **Image hosting**: Public URLs (consider CDN for performance)

### 11.2 Browser Compatibility

- **Modern browsers**: Chrome, Firefox, Safari, Edge
- **JavaScript required**: No fallback for disabled JS
- **Keyboard input**: Requires physical keyboard (not touch-only devices)

---

## 12. Performance Analysis

### 12.1 Load Times

- **jsPsych library**: ~200-500KB (depending on plugins)
- **Images**: 2 images, likely <100KB total
- **Qualtrics version**: Sequential script loading may add 1-2 seconds

### 12.2 Runtime Performance

- **Trial rendering**: jsPsych handles efficiently
- **Data collection**: Minimal overhead
- **Focus management**: Multiple intervals may impact performance slightly

### 12.3 Optimization Opportunities

- **Minify JavaScript**: Reduce file sizes
- **Image optimization**: Compress PNG files
- **CDN hosting**: Faster image loading
- **Lazy loading**: Load images on demand

---

## 13. Conclusion

The GNG_Q project successfully implements a Go/No-Go task for MRI studies with Qualtrics integration. The core task design is sound and follows established cognitive neuroscience paradigms. However, there are **critical path errors** in the standalone version and **significant complexity** in the Qualtrics integration that could be simplified.

### Priority Actions:

1. **High Priority**: Fix path errors in `index.html`
2. **High Priority**: Fix HTML structure issues
3. **Medium Priority**: Simplify Qualtrics focus management
4. **Medium Priority**: Unify codebase or document differences clearly
5. **Low Priority**: Add configuration file support
6. **Low Priority**: Improve documentation

The task is **functional and usable** but would benefit from code cleanup and standardization before production deployment in research studies.

---

## Appendix: Version Comparison

| Feature | Standalone (`index.html`) | Qualtrics (`qualtrics.js`) |
|---------|-------------------------|---------------------------|
| Response Key | F | 1 |
| Total Trials | 40 (20 reps × 2 stimuli) | 80 (5 reps × 16 stimuli) |
| Stimulus Duration | 1000ms (fixed) | 2000-3500ms (variable) |
| Fixation Duration | 250-2000ms (8 options) | 500-1000ms (3 options) |
| Instruction Method | Button clicks | Keyboard presses |
| Data Storage | jsPsych display | Qualtrics embedded data |
| Image Paths | Relative (`img/blue.png`) | Absolute URLs (GitHub) |
| Randomization | Yes (20 reps) | No (fixed order, 5 reps) |

---

**Document Version**: 1.0  
**Analysis Date**: 2024  
**Analyst**: AI Technical Review

