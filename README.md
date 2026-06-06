# All Jobs Teletalk Form Filler

A Chrome Extension that auto-fills AllJobs, Teletalk, and Bangladesh Judicial Service Commission (BJSC) recruitment application forms with stored profile data.

## Features

- **One-click form filling** — fills all fields instantly from saved profile data
- **Profile Builder UI** — visual form with sections for Personal Info, Documents, Address, Education, and Job Experience
- **JSON Editor** — raw JSON editing with Format, Minify, Copy, and live validation
- **Profile Management** — save, load, delete, and switch between multiple profiles
- **Smart field matching** — fuzzy matching engine that maps your data to form fields even when names differ
- **Dependent field chains** — handles cascading dropdowns (District → Upazila, Institute → Exam → Subject, Result Type → GPA)
- **GPA visibility logic** — GPA input fields only appear when result type is GPA/CGPA, hidden for Class/Division types
- **Responsive UI** — works on desktop, tablet, and mobile screens
- **Import/Export** — backup and share profiles as JSON files

## Supported Sites

- `alljobs.teletalk.com.bd`
- `bjsc.teletalk.com.bd`
- Other Teletalk job application portals

## Installation

### From Source (Developer Mode)

1. **Download** or clone this repository:
   ```
   git clone https://github.com/bijoyknath999/All-Jobs-Teletalk-Auto-Filler.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle in top-right corner).

4. Click **Load unpacked** and select the downloaded folder.

5. The extension icon will appear in your Chrome toolbar.

### How to Use

#### Quick Start

1. Navigate to any Teletalk job application form.
2. Click the **floating green button** (bottom-right corner) or press **Ctrl+Shift+F**.
3. The extension panel opens with two tabs: **Builder** and **JSON**.

#### Using the Builder Tab

The Builder provides a visual form organized into collapsible sections:

- **Personal Info** — Name, Father, Mother, DOB, Gender, Religion, Nationality
- **Documents** — NID, Birth Registration, Passport, Marital Status, Quota
- **Contact & Address** — Mobile, Email, Present and Permanent addresses
- **SSC / HSC / Graduation / Masters** — Exam type, Board, Roll, Group, Year, Result
- **Job Experience** — Employment type, Designation, Organization, Dates

Steps:
1. Fill in the fields you need (or click **Fill Sample** to load example data).
2. Click **Generate JSON** to convert your entries to JSON format.
3. Switch to the JSON tab to review, then click **Fill Form**.

#### Using the JSON Tab

1. Paste your profile JSON directly into the editor, or upload a `.json` file.
2. Use the toolbar buttons: **Format** (pretty-print), **Minify**, **Copy**, **Clear**.
3. The status indicator shows if your JSON is valid (green) or invalid (red).
4. Click **Fill Form** to auto-fill the page.

#### Managing Profiles

- **Save (disk icon)** — saves current data to the selected profile, or creates a new one
- **Delete (trash icon)** — deletes the selected profile
- **New (plus icon)** — creates a new blank profile
- **Select dropdown** — switch between saved profiles (loads data into both Builder and JSON)

#### Import / Export

In the popup (click extension icon in toolbar):
- **Export** — downloads your profile as a `.json` file
- **Import** — loads a `.json` file into your profiles

## Profile JSON Format

```json
{
  "name": "MD. NASIRUDDIN",
  "name_bn": "মোঃ নাসিরুদ্দিন",
  "father": "MD. ABDUR RAHMAN",
  "father_bn": "মোঃ আব্দুর রহমান",
  "mother": "MRS. RAHIMA BEGUM",
  "mother_bn": "মিসেস রহিমা বেগম",
  "dob": "1997-10-15",
  "gender": "Male",
  "religion": "Islam",
  "nationality": "Bangladeshi",
  "nid": "Yes",
  "nid_no": "1234567890",
  "breg": "Yes",
  "breg_no": "19971234567890123",
  "passport": "No",
  "marital_status": "Single",
  "quota": "Not Applicable",
  "dep_status": "Not Applicable",
  "mobile": "01712345678",
  "email": "nasir@example.com",
  "present_careof": "MD. ABDUR RAHMAN",
  "present_village": "12 Main Street",
  "present_post": "Dhanmondi",
  "present_postcode": "1209",
  "present_district": "Dhaka",
  "present_upazila": "Dhanmondi",
  "permanent_careof": "MD. ABDUR RAHMAN",
  "permanent_village": "12 Main Street",
  "permanent_post": "Dhanmondi",
  "permanent_postcode": "1209",
  "permanent_district": "Dhaka",
  "permanent_upazila": "Dhanmondi",
  "ssc_exam": "S.S.C",
  "ssc_board": "Dhaka",
  "ssc_roll": "102938",
  "ssc_group": "Science",
  "ssc_year": "2013",
  "ssc_result_type": "GPA(out of 5)",
  "ssc_result": "5.00",
  "hsc_exam": "H.S.C",
  "hsc_board": "Dhaka",
  "hsc_roll": "203948",
  "hsc_group": "Science",
  "hsc_year": "2015",
  "hsc_result_type": "GPA(out of 5)",
  "hsc_result": "5.00",
  "gra_institute": "University of Dhaka",
  "gra_exam": "Honors",
  "gra_subject": "Computer Science",
  "gra_year": "2019",
  "gra_duration": "04",
  "gra_result_type": "1st Class",
  "mas_institute": "University of Dhaka",
  "mas_exam": "M.A",
  "mas_subject": "Bangla",
  "mas_year": "2020",
  "mas_duration": "02",
  "mas_result_type": "1st Class",
  "job[0][employment_type]": "8",
  "job[0][designation]": "Software Developer",
  "job[0][organization]": "Tech Solutions Ltd.",
  "job[0][office_address]": "Dhaka, Bangladesh",
  "job[0][job_start_date]": "2020-01-15",
  "job[0][job_end_date]": "2023-06-30",
  "job[0][job_description]": "Full-stack web development"
}
```

### Key Field Notes

| Field | Values |
|-------|--------|
| `gender` | `Male`, `Female`, `Third Gender` |
| `religion` | `Islam`, `Hinduism`, `Buddhism`, `Christianity`, `Other` |
| `nid` / `breg` / `passport` | `Yes`, `No` |
| `marital_status` | `Single`, `Married`, `Divorced`, `Widowed` |
| `quota` | `Not Applicable`, `Child of Freedom Fighter`, `Physically Challenged`, `Ethnic Minority`, `Third Gender` |
| `dep_status` | `Not Applicable`, `Govt. Employee`, `Semi Govt. Employee`, `Autonomous`, `Departmental Candidate` |
| `ssc_exam` / `hsc_exam` | `S.S.C`, `Dakhil`, `O Level`, `H.S.C`, `Alim`, `A Level` |
| `ssc_board` / `hsc_board` | `Dhaka`, `Rajshahi`, `Comilla`, `Jessore`, `Chittagong`, `Barisal`, `Sylhet`, `Dinajpur`, `Mymensingh`, `Madrasah`, `Technical` |
| `result_type` | `1` = 1st Division/Class, `2` = 2nd, `3` = 3rd, `4` = GPA(out of 4), `5` = GPA(out of 5) |
| `gra_duration` / `mas_duration` | `01` to `05` (years as 2-digit string) |
| `employment_type` | `8` = Full Time, `9` = Part Time, `10` = Contract, `11` = Freelance |

## How It Works

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  Content Script (ISOLATED world)                    │
│  - Shadow DOM UI (panel, builder, JSON editor)      │
│  - Scoring engine (matches data → form fields)      │
│  - Multi-phase fill strategy                        │
│  - CustomEvent dispatcher ──────────────┐           │
└─────────────────────────────────────────┼───────────┘
                                          │  CustomEvents
┌─────────────────────────────────────────┼───────────┐
│  Page Helper (MAIN world)             ◄─┘           │
│  - Has access to page JS functions                  │
│  - Calls onChangeResult, onChangeExamType, etc.      │
│  - Sets values via jQuery + native DOM events       │
└─────────────────────────────────────────────────────┘
```

### Fill Strategy

The engine uses a **5-phase approach** with timed delays:

1. **Phase 1 (immediate)** — Fill reveal triggers (NID, Birth Reg, Passport, Marital Status, Dept Status) to show dependent fields
2. **Phase 2 (200ms)** — Fill all independent fields + trigger education dependent chains
3. **Phase 3 (800ms)** — Fill dependent fields (Upazila, Group, GPA, Subject) that needed parent dropdowns populated
4. **Phase 4 (1500ms)** — Final cleanup retry for any fields that didn't stick
5. **Phase 5 (3000ms)** — Late cleanup for slow AJAX-populated fields

### Scoring Engine

Each profile key is matched against all visible form elements using:
- **Name/ID exact match** (100 points)
- **Substring match** (50-80 points)
- **Label text match** (40-70 points)
- **Alias/synonym matching** for common variations
- **Tiebreaker** favoring visible/enabled elements over hidden/disabled ones

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Shift + F` | Open the form filler panel |
| `Escape` | Close the panel |

## Privacy

- All data is stored locally in Chrome's `storage.local` — nothing is sent to any server.
- The extension only activates on Teletalk job application domains.
- No analytics, tracking, or external requests.

## License

MIT License

## Author

Created by [bijoyknath999](https://github.com/bijoyknath999)
