# Edge AI Adversarial Attack System — Site Copy

> IITP Edge AI Security Project · Prototype
> Adversarial attack simulation system for vulnerability analysis of various AI models (image classification, object detection, speech recognition, etc.)

---

## 1. Login Page

### Main Area

| Element | Copy |
|---------|------|
| Main title | Adversarial Attack Simulation |
| Subtitle | (Edge AI Vulnerability Analysis) |
| ID field label | Enter ID |
| ID placeholder | `ID` |
| Password field label | Enter Password |
| Password placeholder | `Password` |
| Login button | Log In |
| Checkbox label | Remember ID |
| Footer notice | For new account creation or password reset, please contact the administrator. |

### Admin Area (Fixed, bottom-left)

| Element | Copy |
|---------|------|
| Title | Admin Page |
| Description | - Accessible to development team only |

---

## 2. Left Navigation Bar (LNB)

| Order | Menu Label | Route |
|-------|------------|-------|
| — | **Edge AI Attack Sim** (logo) | — |
| 1 | Dashboard | `/dashboard` |
| 2 | Run Attack | `/attack` |
| 3 | Attack Results | `/results` |
| 4 | Project Management | `/projects` |
| — | Log Out (bottom) | → `/login` |

---

## 3. Dashboard (Main Overview)

### Header

| Element | Copy |
|---------|------|
| Top bar title | Home (Dashboard) |
| Content title | Edge AI Adversarial Attack Dashboard |
| Content description | Overview of system-wide attack simulation status and AI model vulnerability summary. |
| CTA button | Start New Attack |

### KPI Cards (4)

| # | Title | Example Value | Trend |
|---|-------|---------------|-------|
| 1 | Models Validated | 12 | +2 this month |
| 2 | Total Attack Runs | 3,450 | +150 this week |
| 3 | Avg. Attack Success Rate | 24.8% | -2.1% vs. last month |
| 4 | Safety Verified | 8 | +1 this week |

### Chart Area

| Element | Copy |
|---------|------|
| Left chart title | Attack Success Rate (Vulnerability) — Last 30 Days |
| Right section title | Edge Device Status |

### Edge Device Status List

| Device Name | Status Label | Model Type |
|-------------|-------------|------------|
| CCTV Node 01 | Online | Object Detection (YOLOv8) |
| CCTV Node 02 | Vulnerability Alert | Object Detection (DETR) |
| Voice Assistant Hub | Disconnected | Speech Recognition (Whisper) |
| Auto-Drive Vision | Online | Image Classification (ResNet) |

### Recent Attack History

| Element | Copy |
|---------|------|
| Table title | Recent Attack Simulation History |
| Link button | View All |

**Column headers:** Status · Target Model · Attack Type · Success Rate (Vulnerability) · Date/Time

**Status badges:**

| Status | Label |
|--------|-------|
| completed | Verified |
| running | Analyzing |
| failed | Stopped / Failed |

---

## 4. Run Attack Page

### Header

| Element | Copy |
|---------|------|
| Top bar title | Attack Simulation |

### Step Indicator

| Step | Label |
|------|-------|
| 1 | 1. Select Model Type |
| 2 | 2. Select Attack Type |
| 3 | 3. Data Source & Execution |

---

### Step 1 — Select Model Type

| Element | Copy |
|---------|------|
| Title | Select the AI model to test |

**Model cards:**

| Icon | Title | Subtitle |
|------|-------|----------|
| Camera | CCTV | (Object Detection Model) |
| Microphone | AI Assistant | (Speech Recognition Model) |
| Car | Autonomous Driving | (Image Classification Model) |

---

### Step 2 — Select Attack Type

| Element | Copy |
|---------|------|
| Title | Select the attack type to perform |

**Attack checklist:**

| Category | Sub-techniques |
|----------|----------------|
| Adversarial Attack | FGSM · BIM · PGD |
| Adversarial Patch Attack | Hiding · Creating · Altering |
| Voice Authentication Bypass (DeepVoice) | *(no sub-items)* |

---

### Step 3 — Data Source & Execution

| Element | Copy |
|---------|------|
| Title | Configure Attack Data |

**Data source options:**

| Option | Label | Description |
|--------|-------|-------------|
| Generate | Generate Attack Data in Real Time | The system automatically generates data based on the selected model and attack technique. |
| Load | Load Saved Data | Upload a pre-prepared attack dataset to run the test. |

**Shown when "Load" is selected:**

| Element | Copy |
|---------|------|
| File input placeholder | `Dataset path or select file` |
| Browse button | Browse |

---

### Bottom Navigation Buttons

| Condition | Left Button | Right Button |
|-----------|-------------|--------------|
| Step 1 | *(none)* | Next Step |
| Step 2 | Previous Step | Next Step |
| Step 3 | Previous Step | Start Attack Simulation |

> "Next Step" button is disabled on Step 1 when no model is selected.

---

### Attack In Progress (Progress Screen)

| Element | Copy |
|---------|------|
| Progress bar label | Generating attack data... ({N}%) |
| Completion message | Attack data generation complete. |

**Post-completion action buttons:**

| Button | Copy | Action |
|--------|------|--------|
| 1 | View Results | Navigate to Attack Results tab |
| 2 | Save Attack Data | Save the generated dataset |
| 3 | Start New Attack | Reset to Step 1 |

---

## 5. Attack Results Page

### Header

| Element | Copy |
|---------|------|
| Top bar title | Attack Results |

### Tab Menu

| Tab | Label |
|-----|-------|
| 1 | Results Summary |
| 2 | Detailed Analysis |

---

### 5-1. Results Summary Tab

#### Filter / Search Area

| Element | Copy |
|---------|------|
| Model filter default | All Models |
| Model filter options | Object Detection (CCTV) · Speech Recognition (Assistant) · Image Classification (Autonomous) |
| Attack filter default | All Attack Techniques |
| Attack filter options | Adversarial Patch · FGSM / PGD · Voice Bypass |
| Search placeholder | `Search by Log ID or model name` |

#### KPI Summary Cards (4)

| # | Title | Example Value | Note |
|---|-------|---------------|------|
| 1 | Total Attack Runs | 124 | Dark background, emphasized |
| 2 | Avg. System Vulnerability | 62.4% | — |
| 3 | Most Vulnerable Model | YOLOv5 (98.5%) | — |
| 4 | Most Critical Attack | Patch-Hiding (82.1%) | — |

#### Chart Area

| Chart Position | Title |
|----------------|-------|
| Left (horizontal bar) | Attack Success Rate by Technique (Vulnerability) |
| Right (vertical bar) | Average Accuracy Drop by Model (Performance Degradation) |

**Right chart legend:**

- Pre-attack Accuracy
- Post-attack Accuracy

#### Detailed Attack Result Log Table

| Element | Copy |
|---------|------|
| Table title | Detailed Attack Result Log |
| Download button | Download CSV |

**Column headers:** Log ID · Date/Time · Target Model · Attack Type · Attack Success Rate · Risk Level · Action

**Action button:** View Analysis

#### Risk Level Badges

| Level | Label | Color Scheme |
|-------|-------|--------------|
| critical | Critical | rose |
| high | High Risk | orange |
| medium | Medium Risk | amber |
| low | Safe | emerald |

---

### 5-2. Detailed Analysis Tab

#### Empty State

| Element | Copy |
|---------|------|
| Main message | No attack log selected. |
| Sub message | Click the [View Analysis] button on a log entry in the Results Summary tab. |
| CTA button | Back to Summary |

#### Report Header

| Element | Copy |
|---------|------|
| Title pattern | `{Model Name}` Vulnerability Analysis Report |
| Meta info | Attack Technique: **`{Attack Name}`** \| Date: `{Date/Time}` |
| Download button | Download Report (PDF) |

#### Model Performance Change Card

| Element | Copy |
|---------|------|
| Card title | Model Accuracy Change |
| Left label | Pre-attack (Original) |
| Right label | Post-attack (Adversarial) |
| Bottom text | Performance drop: -`{N}`%p |

#### Visual Evidence

| Element | Copy |
|---------|------|
| Section title | Visual Evidence |
| Original caption | Original Data (Normal Detection) |
| Original description | Normal person image |
| Original detection result | `Person: 98%` |
| Adversarial caption | Adversarial Data (Detection Evasion Successful) |
| Adversarial description | Person image with adversarial patch attached |
| Adversarial detection result | Object detection failed (0 detections) |

#### Security Recommendations (Dark Background Section)

| Element | Copy |
|---------|------|
| Section title | AI Model Security Vulnerability Analysis & Recommendations |

**Vulnerability Found Block:**

| Element | Copy |
|---------|------|
| Subtitle | Vulnerability Found |
| Body pattern | The `{Model Name}` model has been confirmed to be critically vulnerable to the `{Attack Name}` attack technique. Localized pixel manipulation (patch) on the input image causes disruption in the model's feature map extraction process, resulting in objects that were previously detected with high confidence being completely ignored (Hiding). |

**Mitigation Strategy Block:**

| Element | Copy |
|---------|------|
| Subtitle | Mitigation Strategy |
| Recommendation 1 | **Adversarial Training:** Include the generated patch attack data in the training dataset and retrain the model. |
| Recommendation 2 | **Input Preprocessing Filter:** Apply Local Spatial Smoothing or JPEG compression-based denoising filters before inference on edge devices. |
| Recommendation 3 | **Model Ensemble:** Reduce single-model dependency and introduce cross-validation logic based on multiple architectures. |

---

## 6. Project Management Page

### Header

| Element | Copy |
|---------|------|
| Top bar title | Project Management |

### Tab Menu

| Tab | Label |
|-----|-------|
| 1 | Target Model Management |
| 2 | Attack Dataset Management |

---

### 6-1. Target Model Management Tab

#### Top Action Bar

| Element | Copy |
|---------|------|
| Search placeholder | `Search by model name or edge node` |
| Register button | Register New Model |

#### Model List Table

**Column headers:** (Checkbox) · Model Info · Framework · Connected Edge Node · Status · Registered Date · Actions

**Model status:**

| Status Code | Label |
|-------------|-------|
| active | Active |
| testing | Under Test |
| offline | Offline |

**Action icons:** Edit · Delete

---

### 6-2. Attack Dataset Management Tab

#### Top Action Bar

| Element | Copy |
|---------|------|
| Filter default | All Data Types |
| Filter options | Adversarial Patch (Image) · Adversarial Noise (Audio) |
| Search placeholder | `Search by dataset name` |
| Upload button | Upload New Dataset |

#### Dataset Cards (Grid)

| Element | Copy |
|---------|------|
| Card bottom-left | Size: `{size}` |
| Card bottom-right | Used: `{N}` times |

#### Upload Placeholder Card

| Element | Copy |
|---------|------|
| Main text | Drag & drop to upload |
| Sub text | or click to select files |
