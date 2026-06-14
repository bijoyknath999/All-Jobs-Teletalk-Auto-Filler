(function() {
  // Prevent duplicate execution
  if (window.bjscFormFillerLoaded) return;
  window.bjscFormFillerLoaded = true;

  // Constants
  const STORAGE_KEY = 'formFillerProfiles';
  const ACTIVE_PROFILE_KEY = 'activeProfileId';

  // Inject Shadow DOM UI Container
  const host = document.createElement('div');
  host.id = 'bjsc-form-filler-root';
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  document.body.appendChild(host);

  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Load stylesheet link into Shadow Root
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL('inject.css');
  shadowRoot.appendChild(link);

  // Template HTML for Injected Panel
  const panelHTML = `
    <!-- Floating Action Button -->
    <button class="fill-fab" id="fabBtn" title="Open Form Auto-Filler (Ctrl+Shift+F)">
      📋
    </button>

    <!-- Overlay & Modal -->
    <div class="overlay" id="modalOverlay">
      <div class="modal">
        <div class="modal-header">
          <div class="header-title-group">
            <span>⚡</span>
            <div>
              <h2>All Jobs Teletalk Form Filler</h2>
              <p>Auto-fill for AllJobs, Teletalk & BJSC forms</p>
            </div>
          </div>
          <button class="close-btn" id="closeBtn">×</button>
        </div>

        <div class="modal-body">
          <!-- Profile Selector + Management -->
          <div class="input-group">
            <label>👤 Profile</label>
            <div class="profile-bar">
              <select class="profile-select" id="modalProfileSelect">
                <option value="">-- Select Profile --</option>
              </select>
              <button class="btn-icon btn-icon-save" id="saveProfileBtn" title="Save Profile">💾</button>
              <button class="btn-icon btn-icon-del" id="deleteProfileBtn" title="Delete Profile">🗑️</button>
              <button class="btn-icon btn-icon-new" id="newProfileBtn" title="New Profile">➕</button>
            </div>
          </div>

          <!-- Tab Switcher -->
          <div class="tab-bar">
            <button class="tab-btn active" id="tabBuilder">📝 Builder</button>
            <button class="tab-btn" id="tabJson">🔧 JSON</button>
          </div>

          <!-- ═══ BUILDER TAB ═══ -->
          <div class="tab-content active" id="builderTab">
            <div class="accordion" id="builderAccordion">

              <!-- Personal Info -->
              <div class="acc-section">
                <button class="acc-header" data-acc="personal">👤 Personal Info <span class="acc-arrow">▾</span></button>
                <div class="acc-body open" id="acc-personal">
                  <div class="form-grid">
                    <div class="fg"><label>Name (EN)</label><input data-key="name"></div>
                    <div class="fg"><label>Name (BN)</label><input data-key="name_bn"></div>
                    <div class="fg"><label>Father (EN)</label><input data-key="father"></div>
                    <div class="fg"><label>Father (BN)</label><input data-key="father_bn"></div>
                    <div class="fg"><label>Mother (EN)</label><input data-key="mother"></div>
                    <div class="fg"><label>Mother (BN)</label><input data-key="mother_bn"></div>
                    <div class="fg"><label>Date of Birth</label><input data-key="dob" type="date"></div>
                    <div class="fg"><label>Gender</label>
                      <select data-key="gender"><option value="">--</option><option>Male</option><option>Female</option><option>Third Gender</option></select>
                    </div>
                    <div class="fg"><label>Religion</label>
                      <select data-key="religion"><option value="">--</option><option>Islam</option><option>Hinduism</option><option>Buddhism</option><option>Christianity</option><option>Other</option></select>
                    </div>
                    <div class="fg"><label>Nationality</label><input data-key="nationality"></div>
                    <div class="fg"><label>AllJobs ID</label><input data-key="alljobs_id"></div>
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div class="acc-section">
                <button class="acc-header" data-acc="documents">📄 Documents <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-documents">
                  <div class="form-grid">
                    <div class="fg"><label>Have NID?</label>
                      <select data-key="nid"><option value="">--</option><option>Yes</option><option>No</option></select>
                    </div>
                    <div class="fg"><label>NID Number</label><input data-key="nid_no"></div>
                    <div class="fg"><label>Birth Registration?</label>
                      <select data-key="breg"><option value="">--</option><option>Yes</option><option>No</option></select>
                    </div>
                    <div class="fg"><label>Birth Reg No</label><input data-key="breg_no"></div>
                    <div class="fg"><label>Have Passport?</label>
                      <select data-key="passport"><option value="">--</option><option>Yes</option><option>No</option></select>
                    </div>
                    <div class="fg"><label>Passport No</label><input data-key="passport_no"></div>
                    <div class="fg"><label>Marital Status</label>
                      <select data-key="marital_status" id="builderMaritalStatus"><option value="">--</option><option>Single</option><option>Married</option><option>Divorced</option><option>Widowed</option></select>
                    </div>
                    <div class="fg" id="spouseNameWrap" style="display:none"><label>Spouse Name</label><input data-key="spouse_name"></div>
                    <div class="fg"><label>Quota</label>
                      <select data-key="quota"><option value="">--</option><option>Not Applicable</option><option>Child of Freedom Fighter</option><option>Child of Martyred Freedom Fighter</option><option>Child of War Heroine (Birangana)</option><option>Physically Challenged</option><option>Ethnic Minority</option><option>Third Gender</option></select>
                    </div>
                    <div class="fg"><label>Dept Status</label>
                      <select data-key="dep_status"><option value="">--</option><option>Not Applicable</option><option>Govt. Employee</option><option>Semi Govt. Employee</option><option>Autonomous</option><option>Departmental Candidate</option></select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact & Address -->
              <div class="acc-section">
                <button class="acc-header" data-acc="address">📍 Contact & Address <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-address">
                  <div class="form-grid">
                    <div class="fg"><label>Mobile</label><input data-key="mobile"></div>
                    <div class="fg"><label>Email</label><input data-key="email" type="email"></div>
                  </div>
                  <div class="section-divider">Present Address</div>
                  <div class="form-grid">
                    <div class="fg"><label>C/O</label><input data-key="present_careof"></div>
                    <div class="fg"><label>Village/Road</label><input data-key="present_village"></div>
                    <div class="fg"><label>Post Office</label><input data-key="present_post"></div>
                    <div class="fg"><label>Post Code</label><input data-key="present_postcode"></div>
                    <div class="fg"><label>District</label><input data-key="present_district"></div>
                    <div class="fg"><label>Upazila</label><input data-key="present_upazila"></div>
                  </div>
                  <div class="section-divider">Permanent Address</div>
                  <div class="form-grid">
                    <div class="fg"><label>C/O</label><input data-key="permanent_careof"></div>
                    <div class="fg"><label>Village/Road</label><input data-key="permanent_village"></div>
                    <div class="fg"><label>Post Office</label><input data-key="permanent_post"></div>
                    <div class="fg"><label>Post Code</label><input data-key="permanent_postcode"></div>
                    <div class="fg"><label>District</label><input data-key="permanent_district"></div>
                    <div class="fg"><label>Upazila</label><input data-key="permanent_upazila"></div>
                  </div>
                </div>
              </div>

              <!-- SSC -->
              <div class="acc-section">
                <button class="acc-header" data-acc="ssc">📚 SSC / Equivalent <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-ssc">
                  <div class="form-grid">
                    <div class="fg"><label>Exam Type</label>
                      <select data-key="ssc_exam"><option value="">--</option><option>S.S.C</option><option>Dakhil</option><option>O Level</option><option>SSC(Vocational)</option></select>
                    </div>
                    <div class="fg"><label>Board</label>
                      <select data-key="ssc_board" data-show-child="ssc_board_other"><option value="">--</option><option value="11">Barishal</option><option value="12">Chattogram</option><option value="13">Cumilla</option><option value="14">Dhaka</option><option value="15">Dinajpur</option><option value="16">Jashore</option><option value="17">Madrasah</option><option value="18">Mymensingh</option><option value="19">Rajshahi</option><option value="20">Sylhet</option><option value="21">Open University</option><option value="22">Edexcel</option><option value="23">Cambridge IGCE</option><option value="26">BTEB</option><option value="99">Other</option></select>
                    </div>
                    <div class="fg" id="ssc_board_other_wrap" style="display:none"><label>Board Name (Other)</label><input data-key="ssc_board_other"></div>
                    <div class="fg"><label>Roll</label><input data-key="ssc_roll"></div>
                    <div class="fg"><label>Group</label>
                      <select data-key="ssc_group" data-show-child="ssc_group_other"><option value="">--</option><option value="1">Science</option><option value="2">Humanities</option><option value="3">Business Studies</option><option value="4">General</option><option value="99">Other</option></select>
                    </div>
                    <div class="fg" id="ssc_group_other_wrap" style="display:none"><label>Group (Other)</label><input data-key="ssc_group_other"></div>
                    <div class="fg"><label>Passing Year</label>
                      <select data-key="ssc_year"><option value="">--</option><option>2026</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option><option>2021</option><option>2020</option><option>2019</option><option>2018</option><option>2017</option><option>2016</option><option>2015</option><option>2014</option><option>2013</option><option>2012</option><option>2011</option><option>2010</option><option>2009</option><option>2008</option><option>2007</option><option>2006</option><option>2005</option></select>
                    </div>
                    <div class="fg"><label>Result Type</label>
                      <select data-key="ssc_result_type"><option value="">--</option><option value="1">1st Division</option><option value="2">2nd Division</option><option value="3">3rd Division</option><option value="4">GPA(out of 4)</option><option value="5">GPA(out of 5)</option></select>
                    </div>
                    <div class="fg gpa-field"><label>GPA/CGPA</label><input data-key="ssc_result"></div>
                  </div>
                </div>
              </div>

              <!-- HSC -->
              <div class="acc-section">
                <button class="acc-header" data-acc="hsc">🎓 HSC / Equivalent <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-hsc">
                  <div class="form-grid">
                    <div class="fg"><label>Exam Type</label>
                      <select data-key="hsc_exam"><option value="">--</option><option>H.S.C</option><option>Alim</option><option>A Level</option><option>HSC(Vocational)</option></select>
                    </div>
                    <div class="fg"><label>Board</label>
                      <select data-key="hsc_board" data-show-child="hsc_board_other"><option value="">--</option><option value="11">Barishal</option><option value="12">Chattogram</option><option value="13">Cumilla</option><option value="14">Dhaka</option><option value="15">Dinajpur</option><option value="16">Jashore</option><option value="17">Madrasah</option><option value="18">Mymensingh</option><option value="19">Rajshahi</option><option value="20">Sylhet</option><option value="21">Open University</option><option value="22">Edexcel</option><option value="23">Cambridge IGCE</option><option value="26">BTEB</option><option value="99">Other</option></select>
                    </div>
                    <div class="fg" id="hsc_board_other_wrap" style="display:none"><label>Board Name (Other)</label><input data-key="hsc_board_other"></div>
                    <div class="fg"><label>Roll</label><input data-key="hsc_roll"></div>
                    <div class="fg"><label>Group</label>
                      <select data-key="hsc_group" data-show-child="hsc_group_other"><option value="">--</option><option value="1">Science</option><option value="2">Humanities</option><option value="3">Business Studies</option><option value="4">General</option><option value="99">Other</option></select>
                    </div>
                    <div class="fg" id="hsc_group_other_wrap" style="display:none"><label>Group (Other)</label><input data-key="hsc_group_other"></div>
                    <div class="fg"><label>Passing Year</label>
                      <select data-key="hsc_year"><option value="">--</option><option>2026</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option><option>2021</option><option>2020</option><option>2019</option><option>2018</option><option>2017</option><option>2016</option><option>2015</option><option>2014</option><option>2013</option><option>2012</option><option>2011</option><option>2010</option><option>2009</option><option>2008</option><option>2007</option><option>2006</option><option>2005</option></select>
                    </div>
                    <div class="fg"><label>Result Type</label>
                      <select data-key="hsc_result_type"><option value="">--</option><option value="1">1st Division</option><option value="2">2nd Division</option><option value="3">3rd Division</option><option value="4">GPA(out of 4)</option><option value="5">GPA(out of 5)</option></select>
                    </div>
                    <div class="fg gpa-field"><label>GPA/CGPA</label><input data-key="hsc_result"></div>
                  </div>
                </div>
              </div>

              <!-- Graduation -->
              <div class="acc-section">
                <button class="acc-header" data-acc="graduation">🏛️ Graduation <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-graduation">
                  <div class="form-grid">
                    <div class="fg fg-full"><label>Institute (type name or select Other on form)</label><input data-key="gra_institute"></div>
                    <div class="fg" id="gra_institute_other_wrap" style="display:none"><label>Institute Name (Other)</label><input data-key="gra_institute_other"></div>
                    <div class="fg"><label>Exam</label>
                      <select data-key="gra_exam"><option value="">--</option><option>Honors</option><option>B.Sc Engineering</option><option>MBBS</option><option>BBA</option><option>LLB</option></select>
                    </div>
                    <div class="fg"><label>Subject</label><input data-key="gra_subject"></div>
                    <div class="fg" id="gra_subject_other_wrap" style="display:none"><label>Subject Name (Other)</label><input data-key="gra_subject_other"></div>
                    <div class="fg"><label>Passing Year</label><input data-key="gra_year"></div>
                    <div class="fg"><label>Duration (years)</label>
                      <select data-key="gra_duration"><option value="">--</option><option value="01">1 Year</option><option value="02">2 Years</option><option value="03">3 Years</option><option value="04">4 Years</option><option value="05">5 Years</option></select>
                    </div>
                    <div class="fg"><label>Result Type</label>
                      <select data-key="gra_result_type"><option value="">--</option><option value="1">1st Class</option><option value="2">2nd Class</option><option value="3">3rd Class</option><option value="4">GPA(out of 4)</option><option value="5">GPA(out of 5)</option></select>
                    </div>
                    <div class="fg gpa-field"><label>GPA/CGPA</label><input data-key="gra_result"></div>
                  </div>
                </div>
              </div>

              <!-- Masters -->
              <div class="acc-section">
                <button class="acc-header" data-acc="masters">🎓 Masters <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-masters">
                  <div class="form-grid">
                    <div class="fg fg-full"><label>Institute (type name or select Other on form)</label><input data-key="mas_institute"></div>
                    <div class="fg" id="mas_institute_other_wrap" style="display:none"><label>Institute Name (Other)</label><input data-key="mas_institute_other"></div>
                    <div class="fg"><label>Exam</label>
                      <select data-key="mas_exam"><option value="">--</option><option>M.A</option><option>M.Sc</option><option>MBA</option><option>LLM</option><option>M.Com</option></select>
                    </div>
                    <div class="fg"><label>Subject</label><input data-key="mas_subject"></div>
                    <div class="fg" id="mas_subject_other_wrap" style="display:none"><label>Subject Name (Other)</label><input data-key="mas_subject_other"></div>
                    <div class="fg"><label>Passing Year</label><input data-key="mas_year"></div>
                    <div class="fg"><label>Duration</label>
                      <select data-key="mas_duration"><option value="">--</option><option value="01">1 Year</option><option value="02">2 Years</option></select>
                    </div>
                    <div class="fg"><label>Result Type</label>
                      <select data-key="mas_result_type"><option value="">--</option><option value="1">1st Class</option><option value="2">2nd Class</option><option value="3">3rd Class</option><option value="4">GPA(out of 4)</option><option value="5">GPA(out of 5)</option></select>
                    </div>
                    <div class="fg gpa-field"><label>GPA/CGPA</label><input data-key="mas_result"></div>
                  </div>
                </div>
              </div>

              <!-- Job Experience -->
              <div class="acc-section">
                <button class="acc-header" data-acc="job">💼 Job Experience <span class="acc-arrow">▾</span></button>
                <div class="acc-body" id="acc-job">
                  <div id="jobEntries">
                    <!-- Job 0 -->
                    <div class="job-entry" data-job-idx="0">
                      <div class="job-entry-header"><span class="job-entry-num">Job 1</span></div>
                      <div class="form-grid">
                        <div class="fg"><label>Employment Type</label>
                          <select data-key="job[0][employment_type]"><option value="">--</option><option value="1">Regular (Revenue)</option><option value="2">Ad-hoc (Revenue)</option><option value="3">Temporary (Revenue)</option><option value="4">Work Charged (Revenue)</option><option value="5">Temporary (Dev Project)</option><option value="6">Work Charged (Dev Project)</option><option value="7">Autonomous/Semi</option><option value="8">Private</option><option value="9">Business/Self Employed</option></select>
                        </div>
                        <div class="fg"><label>Designation</label><input data-key="job[0][designation]"></div>
                        <div class="fg"><label>Organization</label><input data-key="job[0][organization]"></div>
                        <div class="fg"><label>Office Address</label><input data-key="job[0][office_address]"></div>
                        <div class="fg"><label>Start Date</label><input data-key="job[0][job_start_date]" type="date"></div>
                        <div class="fg"><label>End Date</label><input data-key="job[0][job_end_date]" type="date"></div>
                        <div class="fg"><label>Last Salary</label><input data-key="job[0][last_salary]" type="number"></div>
                        <div class="fg fg-full"><label>Description</label><textarea data-key="job[0][job_description]" rows="2" maxlength="300"></textarea></div>
                      </div>
                    </div>
                  </div>
                  <div class="button-row" style="margin-top:8px;">
                    <button class="btn btn-secondary" id="addJobBtn" style="font-size:11px;padding:6px 12px;">+ Add Job</button>
                    <button class="btn btn-clear" id="removeJobBtn" style="font-size:11px;padding:6px 12px;">- Remove Last</button>
                  </div>
                </div>
              </div>

            </div>

            <!-- Builder Actions -->
            <div class="button-row" style="margin-top:12px;">
              <button class="btn btn-fill" id="generateJsonBtn">⚡ Generate JSON</button>
            </div>
            <div class="button-row">
              <button class="btn btn-secondary" id="loadSampleBuilder">📝 Fill Sample</button>
              <button class="btn btn-clear" id="clearBuilder">🗑️ Clear</button>
            </div>
          </div>

          <!-- ═══ JSON TAB ═══ -->
          <div class="tab-content" id="jsonTab">
            <!-- JSON Editor Toolbar -->
            <div class="json-toolbar">
              <button class="json-tool-btn" id="jsonFormat" title="Format JSON">Format</button>
              <button class="json-tool-btn" id="jsonMinify" title="Minify JSON">Minify</button>
              <button class="json-tool-btn" id="jsonCopy" title="Copy JSON">Copy</button>
              <button class="json-tool-btn" id="jsonClear" title="Clear">Clear</button>
              <span class="json-status" id="jsonStatus">Ready</span>
            </div>

            <!-- JSON Textarea -->
            <div class="textarea-wrapper">
              <textarea class="json-textarea" id="modalJsonTextarea" rows="12"></textarea>
            </div>

            <!-- Upload JSON -->
            <div class="upload-btn-wrapper">
              <div class="upload-placeholder" id="uploadArea">
                <span>📁 Click or Drag & Drop JSON File</span>
              </div>
              <input type="file" id="modalFileInput" accept=".json">
            </div>

            <div class="button-row">
              <button class="btn btn-secondary" id="modalLoadSample">📝 Load Sample</button>
            </div>
          </div>

          <!-- Global Actions -->
          <div class="button-row">
            <button class="btn btn-fill" id="fillFormBtn">⚡ Fill Form</button>
            <button class="btn btn-clear" id="clearAllBtn">🗑️ Clear Page Fields</button>
          </div>
          <div class="button-row">
            <button class="btn btn-cancel" id="cancelBtn">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Shadow Toast Notification -->
    <div class="toast" id="shadowToast">
      <span id="toastIcon">✨</span>
      <span id="toastText">Form filling complete</span>
    </div>
  `;

  // Append HTML to Shadow Root
  const container = document.createElement('div');
  container.innerHTML = panelHTML;
  shadowRoot.appendChild(container);

  // References to shadow elements
  const fabBtn = shadowRoot.getElementById('fabBtn');
  const modalOverlay = shadowRoot.getElementById('modalOverlay');
  const closeBtn = shadowRoot.getElementById('closeBtn');
  const cancelBtn = shadowRoot.getElementById('cancelBtn');
  const modalProfileSelect = shadowRoot.getElementById('modalProfileSelect');
  const modalJsonTextarea = shadowRoot.getElementById('modalJsonTextarea');
  const modalFileInput = shadowRoot.getElementById('modalFileInput');
  const uploadArea = shadowRoot.getElementById('uploadArea');
  const fillFormBtn = shadowRoot.getElementById('fillFormBtn');
  const clearAllBtn = shadowRoot.getElementById('clearAllBtn');
  const modalLoadSample = shadowRoot.getElementById('modalLoadSample');
  const shadowToast = shadowRoot.getElementById('shadowToast');
  const toastText = shadowRoot.getElementById('toastText');
  const toastIcon = shadowRoot.getElementById('toastIcon');
  const tabBuilder = shadowRoot.getElementById('tabBuilder');
  const tabJson = shadowRoot.getElementById('tabJson');
  const builderTab = shadowRoot.getElementById('builderTab');
  const jsonTab = shadowRoot.getElementById('jsonTab');
  const generateJsonBtn = shadowRoot.getElementById('generateJsonBtn');
  const loadSampleBuilder = shadowRoot.getElementById('loadSampleBuilder');
  const clearBuilderBtn = shadowRoot.getElementById('clearBuilder');
  const addJobBtn = shadowRoot.getElementById('addJobBtn');
  const removeJobBtn = shadowRoot.getElementById('removeJobBtn');
  const jobEntries = shadowRoot.getElementById('jobEntries');
  const saveProfileBtn = shadowRoot.getElementById('saveProfileBtn');
  const deleteProfileBtn = shadowRoot.getElementById('deleteProfileBtn');
  const newProfileBtn = shadowRoot.getElementById('newProfileBtn');
  const jsonFormatBtn = shadowRoot.getElementById('jsonFormat');
  const jsonMinifyBtn = shadowRoot.getElementById('jsonMinify');
  const jsonCopyBtn = shadowRoot.getElementById('jsonCopy');
  const jsonClearBtn = shadowRoot.getElementById('jsonClear');
  const jsonStatus = shadowRoot.getElementById('jsonStatus');

  // State
  let cachedProfiles = {};
  let activeProfileData = null;

  // BJSC & AllJobs Sample Data Template (keys match actual form field names)
  const sampleData = {
    "alljobs_id": "AJ12345678",
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

    // NID & Document Dropdowns + Text Inputs
    "nid": "Yes",
    "nid_no": "1234567890",
    "breg": "Yes",
    "breg_no": "19971234567890123",
    "passport": "No",
    "passport_no": "",

    "marital_status": "Single",
    "quota": "Not Applicable",
    "dep_status": "Not Applicable",

    "mobile": "01712345678",
    "confirm_mobile": "01712345678",
    "email": "nasiruddin@example.com",

    // Present Address (keys match actual form field IDs)
    "present_careof": "MD. ABDUR RAHMAN",
    "present_village": "12 Main Street, Dhanmondi",
    "present_post": "Dhanmondi",
    "present_postcode": "1209",
    "present_district": "Dhaka",
    "present_upazila": "Dhanmondi",

    // Permanent Address
    "permanent_careof": "MD. ABDUR RAHMAN",
    "permanent_village": "12 Main Street, Dhanmondi",
    "permanent_post": "Dhanmondi",
    "permanent_postcode": "1209",
    "permanent_district": "Dhaka",
    "permanent_upazila": "Dhanmondi",

    // SSC Details (result_type = dropdown, result = GPA input)
    "ssc_exam": "S.S.C",
    "ssc_board": "Dhaka",
    "ssc_roll": "102938",
    "ssc_group": "Science",
    "ssc_year": "2013",
    "ssc_result_type": "GPA(out of 5)",
    "ssc_result": "5.00",

    // HSC Details
    "hsc_exam": "H.S.C",
    "hsc_board": "Dhaka",
    "hsc_roll": "203948",
    "hsc_group": "Science",
    "hsc_year": "2015",
    "hsc_result_type": "GPA(out of 5)",
    "hsc_result": "5.00",

    // Graduation Details (keys use gra_ prefix to match actual form)
    "gra_exam": "Honors",
    "gra_institute": "University of Dhaka",
    "gra_subject": "Computer Science",
    "gra_year": "2019",
    "gra_result_type": "1st Class",
    "gra_duration": "04",

    // Masters/Post-Grad (keys use mas_ prefix, enable via "If Applicable" checkbox)
    "mas_exam": "M.A",
    "mas_institute": "University of Dhaka",
    "mas_subject": "Bangla",
    "mas_year": "2020",
    "mas_result_type": "1st Class",
    "mas_duration": "01",

    // Job Experience (enable via "If Applicable" checkbox)
    "job[0][employment_type]": "8",
    "job[0][designation]": "Software Developer",
    "job[0][organization]": "Tech Solutions Ltd.",
    "job[0][office_address]": "Dhaka, Bangladesh",
    "job[0][job_start_date]": "2020-01-15",
    "job[0][job_end_date]": "2023-06-30",
    "job[0][job_description]": "Developed and maintained web applications using modern frameworks."
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // Profile Data Normalization — maps legacy/alternative key names → actual form field IDs
  // ═══════════════════════════════════════════════════════════════════════════
  function normalizeProfileData(data) {
    const d = Object.assign({}, data);

    // ── Simple field renames (profile key → actual form field name) ─────────
    const fieldRenames = {
      'present_care_of': 'present_careof',
      'present_post_office': 'present_post',
      'present_post_code': 'present_postcode',
      'permanent_care_of': 'permanent_careof',
      'permanent_post_office': 'permanent_post',
      'permanent_post_code': 'permanent_postcode',
      'dept_status': 'dep_status',
      'birth_reg': 'breg',
      'birth_reg_no': 'breg_no',
      'birth_registration': 'breg',
      'birth_registration_no': 'breg_no',
      'mobile_no': 'mobile',
      // Graduation aliases
      'grad_exam': 'gra_exam',
      'grad_subject': 'gra_subject',
      'grad_university': 'gra_institute',
      'grad_year': 'gra_year',
      'grad_duration': 'gra_duration',
      // Masters aliases
      'post_grad_exam': 'mas_exam',
      'post_grad_subject': 'mas_subject',
      'post_grad_university': 'mas_institute',
      'post_grad_year': 'mas_year',
      'post_grad_duration': 'mas_duration',
    };

    for (const [oldKey, newKey] of Object.entries(fieldRenames)) {
      if (d[oldKey] !== undefined && d[newKey] === undefined) {
        d[newKey] = d[oldKey];
      }
      delete d[oldKey];
    }

    // ── Result type text → numeric value mappings ───────────────────────────
    const resultMap = {
      '1st division': '1', 'first division': '1',
      '2nd division': '2', 'second division': '2',
      '3rd division': '3', 'third division': '3',
      'gpa(out of 4)': '4', 'gpa (out of 4)': '4', 'cgpa(out of 4)': '4', 'cgpa (out of 4)': '4',
      'gpa(out of 5)': '5', 'gpa (out of 5)': '5', 'cgpa(out of 5)': '5', 'cgpa (out of 5)': '5',
      '1st class': '1', 'first class': '1',
      '2nd class': '2', 'second class': '2',
      '3rd class': '3', 'third class': '3',
      'passed': '6', 'pass': '6',
    };

    // ── Split field handling: "ssc_result" (text) → ssc_result_type (dropdown value) ──
    const splitResultLevels = [
      { resultKey: 'ssc_result', typeKey: 'ssc_result_type', gpaKey: 'ssc_gpa' },
      { resultKey: 'hsc_result', typeKey: 'hsc_result_type', gpaKey: 'hsc_gpa' },
      { resultKey: 'gra_result', typeKey: 'gra_result_type', gpaKey: 'grad_cgpa' },
      { resultKey: 'mas_result', typeKey: 'mas_result_type', gpaKey: 'post_grad_cgpa' },
    ];

    for (const { resultKey, typeKey, gpaKey } of splitResultLevels) {
      // ── STEP 1: Convert result type text → numeric dropdown value ──────────
      // Try exact match first, then regex pattern for GPA/CGPA variations
      function resolveResultType(val) {
        if (!val) return null;
        const s = val.toString().trim().toLowerCase();
        // Exact matches
        if (resultMap[s]) return resultMap[s];
        // Regex: matches "GPA(out of 5)", "GPA (out of 4)", "cgpa(outof5)", "gpa out of 4", etc.
        const gpaMatch = s.match(/(?:cgpa|gpa)\s*\(?\s*out\s*of\s*(\d)\s*\)?/);
        if (gpaMatch) return gpaMatch[1]; // returns "4" or "5"
        // Division/Class patterns
        if (s.match(/1st\s*(division|class)/) || s.match(/first\s*(division|class)/)) return '1';
        if (s.match(/2nd\s*(division|class)/) || s.match(/second\s*(division|class)/)) return '2';
        if (s.match(/3rd\s*(division|class)/) || s.match(/third\s*(division|class)/)) return '3';
        if (s === 'passed' || s === 'pass') return '6';
        // Already numeric
        if (/^[1-6]$/.test(s)) return s;
        return null;
      }

      // If user provided result as text (e.g. "GPA (out of 5)" or "First Class")
      // OR as a number (e.g. "5.00") without specifying result_type
      if (d[resultKey] && !d[typeKey]) {
        const resolved = resolveResultType(d[resultKey]);
        if (resolved) {
          d[typeKey] = resolved;
          if ((resolved === '4' || resolved === '5') && d[gpaKey]) {
            d[resultKey] = d[gpaKey];
          } else {
            delete d[resultKey];
          }
        } else {
           // Auto-detect: if result is a number, assume it's a GPA score
           const numVal = parseFloat(d[resultKey]);
           if (!isNaN(numVal) && numVal >= 1.0 && numVal <= 5.0) {
             d[typeKey] = '5'; // Default to GPA(out of 5) for Bangladesh forms
             // Keep result value as-is (it's the GPA number)
             // If there's a separate gpaKey, use that instead
             if (d[gpaKey]) d[resultKey] = d[gpaKey];
           }
         }
      }
      // If user provided ssc_result_type as text, convert to numeric
      if (d[typeKey]) {
        const resolved = resolveResultType(d[typeKey]);
        if (resolved) d[typeKey] = resolved;
      }
      // If gpaKey exists, move to resultKey for GPA types
      if (d[gpaKey] && d[typeKey]) {
        const tv = d[typeKey].toString();
        if (tv === '4' || tv === '5') {
          d[resultKey] = d[gpaKey];
        }
      }
      // Clean up gpaKey alias
      if (d[gpaKey]) delete d[gpaKey];
    }

    // ── Religion text → numeric value ───────────────────────────────────────
    const religionMap = {
      'islam': '1', 'muslim': '1',
      'hinduism': '2', 'hindu': '2',
      'buddhism': '3', 'buddhist': '3',
      'christianity': '4', 'christian': '4',
      'other': '5',
    };
    if (d.religion && isNaN(d.religion)) {
      const rKey = d.religion.toString().trim().toLowerCase();
      if (religionMap[rKey]) d.religion = religionMap[rKey];
    }

    // ── Dep status text → numeric value ─────────────────────────────────────
    const depStatusMap = {
      'govt. employee': '1', 'govt employee': '1', 'government employee': '1',
      'semi govt. employee': '2', 'semi govt employee': '2', 'semi-government': '2',
      'autonomous': '3',
      'departmental candidate': '4', 'departmental': '4',
      'not applicable': '5', 'none': '5', 'na': '5', 'n/a': '5',
    };
    if (d.dep_status && isNaN(d.dep_status)) {
      const dsKey = d.dep_status.toString().trim().toLowerCase();
      if (depStatusMap[dsKey]) d.dep_status = depStatusMap[dsKey];
    }

    // ── Quota text → numeric value ──────────────────────────────────────────
    const quotaMap = {
      'non-quota': '8', 'nonquota': '8', 'not applicable': '8', 'na': '8', 'n/a': '8',
      'child of freedom fighter': '1', 'freedom fighter': '1',
      'child of martyred freedom fighter': '2', 'martyred freedom fighter': '2',
      'child of war heroine (birangana)': '3', 'birangana': '3',
      'physically challenged': '4', 'disability': '4',
      'ethnic minority': '6', 'tribal': '6',
      'third gender': '7',
    };
    if (d.quota && isNaN(d.quota)) {
      const qKey = d.quota.toString().trim().toLowerCase();
      if (quotaMap[qKey]) d.quota = quotaMap[qKey];
    }

    return d;
  }

  // Toast System
  function showShadowToast(message, isError = false) {
    toastText.textContent = message;
    toastIcon.textContent = isError ? '❌' : '✅';
    shadowToast.className = 'toast show ' + (isError ? 'toast-error' : 'toast-success');
    
    setTimeout(() => {
      shadowToast.classList.remove('show');
    }, 3000);
  }

  // Toggle Modal View
  function openModal() {
    modalOverlay.classList.add('show');
    loadProfiles(); // Refresh profiles from storage
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
  }

  // Event Listeners for UI
  fabBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Load Profiles from chrome storage (optional callback after load)
  function loadProfiles(callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([STORAGE_KEY, ACTIVE_PROFILE_KEY], function(result) {
        cachedProfiles = result[STORAGE_KEY] || {};
        let activeId = result[ACTIVE_PROFILE_KEY];
        
        // If no profiles exist in storage, initialize with default sample profile
        if (Object.keys(cachedProfiles).length === 0) {
          const defaultId = 'profile_' + Date.now();
          cachedProfiles[defaultId] = {
            name: "Default AllJobs & BJSC Profile",
            data: sampleData
          };
          activeId = defaultId;
          
          chrome.storage.local.set({
            [STORAGE_KEY]: cachedProfiles,
            [ACTIVE_PROFILE_KEY]: activeId
          });
        }
        
        populateDropdowns(activeId);
        if (typeof callback === 'function') callback();
      });
    }
  }

  // Populate profiles in select element
  function populateDropdowns(activeId) {
    modalProfileSelect.innerHTML = '<option value="">-- Select Profile --</option>';
    
    for (const [id, profile] of Object.entries(cachedProfiles)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = profile.name;
      if (id === activeId) {
        option.selected = true;
        activeProfileData = profile.data;
      }
      modalProfileSelect.appendChild(option);
    }

    // Populate builder with active profile data
    if (activeProfileData && typeof populateBuilder === 'function') {
      try { populateBuilder(activeProfileData); } catch(e) {}
    }
  }

  // Profile change listener is defined later (with builder integration)

  // Load sample data button
  modalLoadSample.addEventListener('click', function() {
    modalJsonTextarea.value = JSON.stringify(sampleData, null, 2);
    showShadowToast('📝 Loaded AllJobs & BJSC sample JSON profile!');
  });

  // File Upload listener
  modalFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const importedData = JSON.parse(evt.target.result);
        modalJsonTextarea.value = JSON.stringify(importedData, null, 2);
        showShadowToast('✅ JSON profile uploaded successfully!');
      } catch (err) {
        showShadowToast('❌ Error parsing JSON file: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  });

  // Drag and drop for upload
  uploadArea.addEventListener('click', () => modalFileInput.click());
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#10b981';
    uploadArea.style.background = 'rgba(16, 185, 129, 0.08)';
  });
  uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
  });
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    uploadArea.style.background = 'rgba(255, 255, 255, 0.02)';
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const importedData = JSON.parse(evt.target.result);
          modalJsonTextarea.value = JSON.stringify(importedData, null, 2);
          showShadowToast('✅ JSON profile dropped successfully!');
        } catch (err) {
          showShadowToast('❌ Error parsing dropped JSON: ' + err.message, true);
        }
      };
      reader.readAsText(file);
    } else {
      showShadowToast('❌ Please drop a valid .json file', true);
    }
  });

  // Keyboard shortcut Ctrl+Shift+F (or Cmd+Shift+F on Mac)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toUpperCase() === 'F') {
      e.preventDefault();
      if (modalOverlay.classList.contains('show')) {
        closeModal();
      } else {
        openModal();
      }
    }
  });

  // Receive profile update broadcasts from toolbar popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.action === 'profileUpdated') {
        loadProfiles();
      }
    });
  }

  // Clear Form Fields Utility
  clearAllBtn.addEventListener('click', function() {
    clearFormFields();
  });

  function clearFormFields() {
    const inputs = document.querySelectorAll('input, select, textarea');
    let clearedCount = 0;
    
    inputs.forEach(input => {
      // Do not clear the injected extension inputs
      if (input.closest('#bjsc-form-filler-root')) return;

      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          input.checked = false;
          triggerEvents(input);
          clearedCount++;
        }
      } else {
        if (input.value !== '') {
          input.value = '';
          triggerEvents(input);
          clearedCount++;
        }
      }
    });
    
    showShadowToast(`🗑️ Cleared ${clearedCount} form fields!`);
  }

  // Main Form Filling Engine
  fillFormBtn.addEventListener('click', function() {
    const rawJson = modalJsonTextarea.value.trim();
    if (!rawJson) {
      showShadowToast('❌ Please provide JSON profile data!', true);
      return;
    }

    try {
      let data = JSON.parse(rawJson);
      // Normalize profile keys to match actual form field names
      data = normalizeProfileData(data);
      const stats = fillForm(data);

      let message = `⚡ Filled ${stats.filled} fields!`;
      if (stats.unfilledKeys.length > 0) {
        message += ` (${stats.unfilledKeys.length} items unmapped)`;
      }

      showShadowToast(message);
      closeModal();
    } catch (e) {
      showShadowToast('❌ Invalid JSON formatting: ' + e.message, true);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Tab Switching (Builder / JSON)
  // ═══════════════════════════════════════════════════════════════════════════
  tabBuilder.addEventListener('click', function() {
    tabBuilder.classList.add('active');
    tabJson.classList.remove('active');
    builderTab.classList.add('active');
    jsonTab.classList.remove('active');
  });
  tabJson.addEventListener('click', function() {
    tabJson.classList.add('active');
    tabBuilder.classList.remove('active');
    jsonTab.classList.add('active');
    builderTab.classList.remove('active');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Accordion (collapsible sections)
  // ═══════════════════════════════════════════════════════════════════════════
  shadowRoot.querySelectorAll('.acc-header').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('data-acc');
      var body = shadowRoot.getElementById('acc-' + target);
      if (!body) return;
      var isOpen = body.classList.contains('open');
      body.classList.toggle('open');
      btn.querySelector('.acc-arrow').textContent = isOpen ? '▸' : '▾';
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Multiple Job Experience — Add/Remove job entries
  // ═══════════════════════════════════════════════════════════════════════════
  var jobCount = 1;

  function createJobEntry(idx) {
    var div = document.createElement('div');
    div.className = 'job-entry';
    div.setAttribute('data-job-idx', idx);
    div.innerHTML =
      '<div class="job-entry-header"><span class="job-entry-num">Job ' + (idx + 1) + '</span></div>' +
      '<div class="form-grid">' +
        '<div class="fg"><label>Employment Type</label>' +
          '<select data-key="job[' + idx + '][employment_type]"><option value="">--</option><option value="1">Regular (Revenue)</option><option value="2">Ad-hoc (Revenue)</option><option value="3">Temporary (Revenue)</option><option value="4">Work Charged (Revenue)</option><option value="5">Temporary (Dev Project)</option><option value="6">Work Charged (Dev Project)</option><option value="7">Autonomous/Semi</option><option value="8">Private</option><option value="9">Business/Self Employed</option></select>' +
        '</div>' +
        '<div class="fg"><label>Designation</label><input data-key="job[' + idx + '][designation]"></div>' +
        '<div class="fg"><label>Organization</label><input data-key="job[' + idx + '][organization]"></div>' +
        '<div class="fg"><label>Office Address</label><input data-key="job[' + idx + '][office_address]"></div>' +
        '<div class="fg"><label>Start Date</label><input data-key="job[' + idx + '][job_start_date]" type="date"></div>' +
        '<div class="fg"><label>End Date</label><input data-key="job[' + idx + '][job_end_date]" type="date"></div>' +
        '<div class="fg"><label>Last Salary</label><input data-key="job[' + idx + '][last_salary]" type="number"></div>' +
        '<div class="fg fg-full"><label>Description</label><textarea data-key="job[' + idx + '][job_description]" rows="2" maxlength="300"></textarea></div>' +
      '</div>';
    return div;
  }

  addJobBtn.addEventListener('click', function() {
    if (jobCount >= 10) { showShadowToast('Maximum 10 job entries', true); return; }
    jobEntries.appendChild(createJobEntry(jobCount));
    jobCount++;
    showShadowToast('Added Job ' + jobCount);
  });

  removeJobBtn.addEventListener('click', function() {
    if (jobCount <= 1) { showShadowToast('Need at least 1 job entry', true); return; }
    jobCount--;
    var last = jobEntries.querySelector('.job-entry[data-job-idx="' + jobCount + '"]');
    if (last) last.remove();
    showShadowToast('Removed last job entry');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // "Other" field visibility — show text input when "Other" selected
  // ═══════════════════════════════════════════════════════════════════════════
  var otherFieldMap = {
    'ssc_board': 'ssc_board_other_wrap',
    'hsc_board': 'hsc_board_other_wrap',
    'ssc_group': 'ssc_group_other_wrap',
    'hsc_group': 'hsc_group_other_wrap',
    'gra_institute': 'gra_institute_other_wrap',
    'gra_subject': 'gra_subject_other_wrap',
    'mas_institute': 'mas_institute_other_wrap',
    'mas_subject': 'mas_subject_other_wrap'
  };

  function setupOtherFieldListeners() {
    for (var selectKey in otherFieldMap) {
      (function(key) {
        var sel = shadowRoot.querySelector('select[data-key="' + key + '"]');
        var wrapId = otherFieldMap[key];
        if (!sel) return;
        sel.addEventListener('change', function() {
          var wrap = shadowRoot.getElementById(wrapId);
          if (wrap) wrap.style.display = sel.value === 'Other' || sel.value === '99' || sel.value === '999' ? '' : 'none';
        });
      })(selectKey);
    }
  }
  setupOtherFieldListeners();

  // ═══════════════════════════════════════════════════════════════════════════
  // Marital Status → Spouse Name visibility
  // ═══════════════════════════════════════════════════════════════════════════
  var maritalSelect = shadowRoot.getElementById('builderMaritalStatus');
  var spouseWrap = shadowRoot.getElementById('spouseNameWrap');
  if (maritalSelect && spouseWrap) {
    maritalSelect.addEventListener('change', function() {
      spouseWrap.style.display = maritalSelect.value === 'Married' ? '' : 'none';
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GPA field visibility in builder — only show when result_type is GPA/CGPA
  // ═══════════════════════════════════════════════════════════════════════════
  function updateGpaVisibility(sectionId) {
    var section = shadowRoot.getElementById(sectionId);
    if (!section) return;
    var typeSelect = section.querySelector('select[data-key$="_result_type"]');
    var gpaField = section.querySelector('.gpa-field');
    if (!typeSelect || !gpaField) return;
    var val = typeSelect.value;
    if (val === '4' || val === '5') {
      gpaField.style.display = '';
    } else {
      gpaField.style.display = 'none';
      var gpaInput = gpaField.querySelector('input');
      if (gpaInput) gpaInput.value = '';
    }
  }
  ['acc-ssc', 'acc-hsc', 'acc-graduation', 'acc-masters'].forEach(function(sid) {
    var section = shadowRoot.getElementById(sid);
    if (!section) return;
    var sel = section.querySelector('select[data-key$="_result_type"]');
    if (sel) {
      sel.addEventListener('change', function() { updateGpaVisibility(sid); });
      // Initial hide
      updateGpaVisibility(sid);
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Builder → JSON Generator
  // ═══════════════════════════════════════════════════════════════════════════
  function collectBuilderData() {
    var data = {};
    var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
    fields.forEach(function(el) {
      var key = el.getAttribute('data-key');
      var val = (el.value || '').trim();
      if (val !== '') {
        data[key] = val;
      }
    });
    return data;
  }

  function populateBuilder(data) {
    // Clear all builder fields first
    var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
    fields.forEach(function(el) { el.value = ''; });

    // Remove extra job entries (keep only job 0)
    var extraJobs = jobEntries.querySelectorAll('.job-entry[data-job-idx]');
    extraJobs.forEach(function(el) { if (el.getAttribute('data-job-idx') !== '0') el.remove(); });
    jobCount = 1;

    // Detect max job index in data and create entries as needed
    var maxJobIdx = 0;
    for (var dk in data) {
      var m = dk.match(/^job\[(\d+)\]/);
      if (m) { var idx = parseInt(m[1]); if (idx > maxJobIdx) maxJobIdx = idx; }
    }
    for (var j = 1; j <= maxJobIdx; j++) {
      jobEntries.appendChild(createJobEntry(j));
      jobCount = j + 1;
    }

    // Populate from data
    for (var key in data) {
      var el = shadowRoot.querySelector('#builderTab [data-key="' + key + '"]');
      if (el) el.value = data[key];
    }

    // Show "Other" fields if value matches
    for (var selectKey in otherFieldMap) {
      var sel = shadowRoot.querySelector('select[data-key="' + selectKey + '"]');
      var wrap = shadowRoot.getElementById(otherFieldMap[selectKey]);
      if (sel && wrap) {
        wrap.style.display = (sel.value === 'Other' || sel.value === '99' || sel.value === '999') ? '' : 'none';
      }
    }

    // Show spouse name if married
    if (maritalSelect && spouseWrap) {
      spouseWrap.style.display = maritalSelect.value === 'Married' ? '' : 'none';
    }

    // Update GPA visibility
    ['acc-ssc', 'acc-hsc', 'acc-graduation', 'acc-masters'].forEach(updateGpaVisibility);
  }

  generateJsonBtn.addEventListener('click', function() {
    var data = collectBuilderData();
    if (Object.keys(data).length === 0) {
      showShadowToast('❌ Fill in some fields first!', true);
      return;
    }
    // Add confirm_mobile = mobile if mobile exists
    if (data.mobile && !data.confirm_mobile) {
      data.confirm_mobile = data.mobile;
    }
    modalJsonTextarea.value = JSON.stringify(data, null, 2);
    // Switch to JSON tab to show result
    tabJson.click();
    showShadowToast('⚡ JSON generated! Check JSON tab.');
  });

  loadSampleBuilder.addEventListener('click', function() {
    populateBuilder(sampleData);
    showShadowToast('📝 Sample data loaded into builder!');
  });

  clearBuilderBtn.addEventListener('click', function() {
    var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
    fields.forEach(function(el) { el.value = ''; });
    ['acc-ssc', 'acc-hsc', 'acc-graduation', 'acc-masters'].forEach(updateGpaVisibility);
    showShadowToast('🗑️ Builder fields cleared!');
  });

  // When profile is selected, populate builder + JSON too
  modalProfileSelect.addEventListener('change', function(e) {
    var id = e.target.value;
    if (id && cachedProfiles[id]) {
      activeProfileData = cachedProfiles[id].data;
      populateBuilder(cachedProfiles[id].data);
      modalJsonTextarea.value = JSON.stringify(activeProfileData, null, 2);
      showShadowToast('👤 Loaded profile: ' + cachedProfiles[id].name);
    } else {
      activeProfileData = null;
      var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
      fields.forEach(function(el) { el.value = ''; });
      modalJsonTextarea.value = '';
    }
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // Profile Management (Save / Delete / New)
  // ═══════════════════════════════════════════════════════════════════════════
  function getActiveProfileId() {
    return modalProfileSelect.value || null;
  }

  function saveProfiles() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ [STORAGE_KEY]: cachedProfiles });
    }
  }

  // Save current profile (from builder or JSON)
  saveProfileBtn.addEventListener('click', function() {
    // Gather data from whichever tab has content
    var data = null;
    var rawJson = modalJsonTextarea.value.trim();
    if (rawJson) {
      try { data = JSON.parse(rawJson); } catch(e) {}
    }
    if (!data || Object.keys(data).length === 0) {
      data = collectBuilderData();
    }
    if (!data || Object.keys(data).length === 0) {
      showShadowToast('❌ No data to save! Fill builder or paste JSON.', true);
      return;
    }

    var activeId = getActiveProfileId();
    if (activeId && cachedProfiles[activeId]) {
      // Update existing profile
      cachedProfiles[activeId].data = data;
      saveProfiles();
      showShadowToast('💾 Profile "' + cachedProfiles[activeId].name + '" updated!');
    } else {
      // New profile — prompt for name
      var name = prompt('Enter profile name:', 'My Profile ' + (Object.keys(cachedProfiles).length + 1));
      if (!name) return;
      var newId = 'profile_' + Date.now();
      cachedProfiles[newId] = { name: name, data: data };
      saveProfiles();
      loadProfiles(function() {
        modalProfileSelect.value = newId;
      });
      showShadowToast('💾 Profile "' + name + '" saved!');
    }
  });

  // Delete selected profile
  deleteProfileBtn.addEventListener('click', function() {
    var activeId = getActiveProfileId();
    if (!activeId || !cachedProfiles[activeId]) {
      showShadowToast('❌ Select a profile to delete!', true);
      return;
    }
    var name = cachedProfiles[activeId].name;
    if (!confirm('Delete profile "' + name + '"?')) return;
    delete cachedProfiles[activeId];
    saveProfiles();
    loadProfiles();
    activeProfileData = null;
    modalJsonTextarea.value = '';
    var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
    fields.forEach(function(el) { el.value = ''; });
    showShadowToast('🗑️ Profile "' + name + '" deleted!');
  });

  // Create new blank profile
  newProfileBtn.addEventListener('click', function() {
    var name = prompt('Enter new profile name:', 'My Profile ' + (Object.keys(cachedProfiles).length + 1));
    if (!name) return;
    var newId = 'profile_' + Date.now();
    cachedProfiles[newId] = { name: name, data: {} };
    saveProfiles();
    loadProfiles(function() {
      modalProfileSelect.value = newId;
    });
    // Clear builder and JSON
    modalJsonTextarea.value = '';
    var fields = shadowRoot.querySelectorAll('#builderTab [data-key]');
    fields.forEach(function(el) { el.value = ''; });
    showShadowToast('➕ New profile "' + name + '" created!');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // JSON Editor Toolbar (Format / Minify / Copy / Clear)
  // ═══════════════════════════════════════════════════════════════════════════
  function updateJsonStatus(text) {
    jsonStatus.textContent = text;
    clearTimeout(jsonStatus._timer);
    jsonStatus._timer = setTimeout(function() { jsonStatus.textContent = 'Ready'; }, 3000);
  }

  // Live validation on input
  modalJsonTextarea.addEventListener('input', function() {
    var raw = modalJsonTextarea.value.trim();
    if (!raw) { jsonStatus.textContent = 'Ready'; jsonStatus.style.color = ''; return; }
    try {
      JSON.parse(raw);
      jsonStatus.textContent = 'Valid JSON';
      jsonStatus.style.color = '#10b981';
    } catch(e) {
      jsonStatus.textContent = 'Invalid JSON';
      jsonStatus.style.color = '#ef4444';
    }
  });

  jsonFormatBtn.addEventListener('click', function() {
    var raw = modalJsonTextarea.value.trim();
    if (!raw) return;
    try {
      var obj = JSON.parse(raw);
      modalJsonTextarea.value = JSON.stringify(obj, null, 2);
      updateJsonStatus('Formatted');
      jsonStatus.style.color = '#10b981';
    } catch(e) {
      showShadowToast('❌ Invalid JSON: ' + e.message, true);
    }
  });

  jsonMinifyBtn.addEventListener('click', function() {
    var raw = modalJsonTextarea.value.trim();
    if (!raw) return;
    try {
      var obj = JSON.parse(raw);
      modalJsonTextarea.value = JSON.stringify(obj);
      updateJsonStatus('Minified');
      jsonStatus.style.color = '#10b981';
    } catch(e) {
      showShadowToast('❌ Invalid JSON: ' + e.message, true);
    }
  });

  jsonCopyBtn.addEventListener('click', function() {
    var raw = modalJsonTextarea.value.trim();
    if (!raw) return;
    navigator.clipboard.writeText(raw).then(function() {
      updateJsonStatus('Copied!');
      showShadowToast('📋 JSON copied to clipboard!');
    }).catch(function() {
      // Fallback: select all text
      modalJsonTextarea.select();
      document.execCommand('copy');
      updateJsonStatus('Copied!');
      showShadowToast('📋 JSON copied!');
    });
  });

  jsonClearBtn.addEventListener('click', function() {
    modalJsonTextarea.value = '';
    jsonStatus.textContent = 'Ready';
    jsonStatus.style.color = '';
  });

  // Helper: Dispatch events to notify page scripts of changes
  // Uses both native events AND jQuery triggers for maximum compatibility
  function triggerEvents(element) {
    // Native DOM events
    ['input', 'change', 'blur'].forEach(eventName => {
      const event = new Event(eventName, { bubbles: true, cancelable: true });
      element.dispatchEvent(event);
    });
    // jQuery events (the Teletalk form uses jQuery event handlers)
    if (typeof $ === 'function' || typeof jQuery === 'function') {
      const jq = (typeof $ === 'function') ? $ : jQuery;
      try {
        jq(element).trigger('change');
        jq(element).trigger('input');
      } catch(e) { /* ignore jQuery errors */ }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CustomEvent bridge to page context.
  // page-helper.js (loaded as world:"MAIN" content script) listens for these
  // events and calls page-level functions like onChangeResult, onChangeExamTypeSSC.
  // ═══════════════════════════════════════════════════════════════════════════

  // Helpers that dispatch CustomEvents to the page context
  function pageSetSelect(id, val, handlerName) {
    document.dispatchEvent(new CustomEvent('__BJSC_setSelect', {
      detail: { id: id, val: val, handler: handlerName || null }
    }));
  }
  function pageSetInput(id, val) {
    document.dispatchEvent(new CustomEvent('__BJSC_setInput', {
      detail: { id: id, val: val }
    }));
  }
  function pageShowElement(id) {
    document.dispatchEvent(new CustomEvent('__BJSC_showElement', {
      detail: { id: id }
    }));
  }
  function pageClickElement(id) {
    document.dispatchEvent(new CustomEvent('__BJSC_clickElement', {
      detail: { id: id }
    }));
  }

  // Helper: Get cleaned associated label of an element
  function getElementLabel(element) {
    // 1. Check for standard <label for="...">
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`);
      if (label && label.innerText) return label.innerText.trim();
    }
    
    // 2. Check parent labels
    let parent = element.parentElement;
    while (parent) {
      if (parent.tagName === 'LABEL' && parent.innerText) {
        return parent.innerText.trim();
      }
      parent = parent.parentElement;
    }

    // 3. Table layouts: Look for text in previous cell in the same row
    const cell = element.closest('td');
    if (cell && cell.previousElementSibling) {
      const prevCell = cell.previousElementSibling;
      if (prevCell && prevCell.innerText) {
        return prevCell.innerText.trim();
      }
    }
    
    // 4. Placeholder
    if (element.placeholder) {
      return element.placeholder;
    }

    return '';
  }

  // Check if a result_type value is GPA/CGPA (needs GPA input field visible)
  // Values "4" (GPA out of 4), "5" (GPA out of 5) → show GPA input
  // Values "1" (1st Class/Division), "2" (2nd Class/Division), "3" (3rd Class) → DON'T show
  function isGpaResultType(resultTypeVal) {
    if (!resultTypeVal) return false;
    var s = resultTypeVal.toString().toLowerCase().replace(/[\s\-_.]/g, '');
    // Match text patterns like "gpa(outof5)", "cgpa(outof4)"
    if (s.indexOf('gpa') !== -1 || s.indexOf('cgpa') !== -1) return true;
    // Match numeric values: 4 = GPA(out of 4), 5 = GPA(out of 5), 6 = CGPA
    if (s === '4' || s === '5' || s === '6') return true;
    return false;
  }

  // Show & fill GPA result field ONLY if result_type is GPA/CGPA
  function showAndFillResult(resultFieldId, resultTypeVal, resultVal) {
    if (resultTypeVal && isGpaResultType(resultTypeVal)) {
      pageShowElement(resultFieldId);
      if (resultVal) pageSetInput(resultFieldId, resultVal);
    } else if (resultVal && isGpaResultType(resultVal)) {
      // User provided a GPA number (like "5.00") without explicit type — show it
      pageShowElement(resultFieldId);
      pageSetInput(resultFieldId, resultVal);
    }
    // For class/division types, DON'T show or fill the GPA field
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Direct Education Field Setter — bypasses the generic scoring/filling engine
  // and explicitly sets values by known field IDs with proper event chains.
  // This is the "nuclear option" that guarantees education fields get filled.
  // ═══════════════════════════════════════════════════════════════════════════
  function fillEducationFieldsDirectly(data) {
    // ── SSC ──────────────────────────────────────────────────────────────
    if (data.ssc_exam) pageSetSelect('ssc_exam', data.ssc_exam, 'onChangeExamTypeSSC');
    if (data.ssc_board) pageSetSelect('ssc_board', data.ssc_board, 'onChangeBoard');
    if (data.ssc_roll) pageSetInput('ssc_roll', data.ssc_roll);
    if (data.ssc_year) pageSetSelect('ssc_year', data.ssc_year);
    if (data.ssc_group) pageSetSelect('ssc_group', data.ssc_group);
    if (data.ssc_result_type) {
      pageSetSelect('ssc_result_type', data.ssc_result_type, 'onChangeResult');
    }
    showAndFillResult('ssc_result', data.ssc_result_type, data.ssc_result);

    // ── HSC ──────────────────────────────────────────────────────────────
    if (data.hsc_exam) pageSetSelect('hsc_exam', data.hsc_exam, 'onChangeExamTypeHSC');
    if (data.hsc_board) pageSetSelect('hsc_board', data.hsc_board, 'onChangeBoard');
    if (data.hsc_roll) pageSetInput('hsc_roll', data.hsc_roll);
    if (data.hsc_year) pageSetSelect('hsc_year', data.hsc_year);
    if (data.hsc_group) pageSetSelect('hsc_group', data.hsc_group);
    if (data.hsc_result_type) {
      pageSetSelect('hsc_result_type', data.hsc_result_type, 'onChangeResult');
    }
    showAndFillResult('hsc_result', data.hsc_result_type, data.hsc_result);

    // ── Graduation ───────────────────────────────────────────────────────
    // Chain: institute → (AJAX loads exams) → exam → (AJAX loads subjects) → subject
    if (data.gra_institute) pageSetSelect('gra_institute', data.gra_institute, 'onChangeSubUni');
    if (data.gra_year) pageSetInput('gra_year', data.gra_year);
    if (data.gra_duration) pageSetSelect('gra_duration', data.gra_duration);
    if (data.gra_result_type) {
      pageSetSelect('gra_result_type', data.gra_result_type, 'onChangeResult');
    }
    showAndFillResult('gra_result', data.gra_result_type, data.gra_result);
    // Exam loads after institute AJAX → delay 800ms
    if (data.gra_exam) {
      setTimeout(function() {
        pageSetSelect('gra_exam', data.gra_exam, 'onChangeExamTypeGRA');
      }, 800);
    }
    // Subject loads after BOTH institute + exam AJAX → delay 1500ms
    if (data.gra_subject) {
      setTimeout(function() {
        pageSetSelect('gra_subject', data.gra_subject);
      }, 1500);
    }

    // ── Masters ──────────────────────────────────────────────────────────
    if (Object.keys(data).some(k => k.startsWith('mas_'))) {
      pageClickElement('if_applicable_mas');
    }
    // Institute must be set first (triggers AJAX to load subjects)
    if (data.mas_institute) pageSetSelect('mas_institute', data.mas_institute, 'onChangeSubUniMas');
    if (data.mas_exam) pageSetSelect('mas_exam', data.mas_exam, 'onChangeExamTypeMAS');
    if (data.mas_year) pageSetInput('mas_year', data.mas_year);
    if (data.mas_duration) pageSetSelect('mas_duration', data.mas_duration);
    if (data.mas_result_type) {
      pageSetSelect('mas_result_type', data.mas_result_type, 'onChangeResult');
    }
    showAndFillResult('mas_result', data.mas_result_type, data.mas_result);
    // Subject is dependent on institute — delay to wait for AJAX
    if (data.mas_subject) {
      setTimeout(function() {
        pageSetSelect('mas_subject', data.mas_subject);
      }, 800);
    }

    // ── "Other" fields (board_other, institute_other, subject_other) ──
    if (data.ssc_board_other) pageSetInput('ssc_board_other', data.ssc_board_other);
    if (data.hsc_board_other) pageSetInput('hsc_board_other', data.hsc_board_other);
    if (data.gra_institute_other) pageSetInput('gra_institute_other', data.gra_institute_other);
    if (data.gra_subject_other) pageSetInput('gra_subject_other', data.gra_subject_other);
    if (data.mas_institute_other) pageSetInput('mas_institute_other', data.mas_institute_other);
    if (data.mas_subject_other) pageSetInput('mas_subject_other', data.mas_subject_other);

    // ── Spouse Name ─────────────────────────────────────────────────────
    if (data.spouse_name) pageSetInput('spouse_name', data.spouse_name);
  }

  // Auto-Fill Form core algorithm
  function fillForm(data) {
    let filledCount = 0;
    const elementsToHighlight = [];

    // Pre-parse split Date of Birth if available
    let dobParts = null;
    if (data.dob) {
      // Formats supported: YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY
      const parts = data.dob.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) { // YYYY-MM-DD
          dobParts = { year: parts[0], month: parseInt(parts[1], 10), day: parseInt(parts[2], 10) };
        } else if (parts[2].length === 4) { // DD-MM-YYYY
          dobParts = { year: parts[2], month: parseInt(parts[1], 10), day: parseInt(parts[0], 10) };
        }
      }
    }

    // Apply glow highlights to filled elements
    function applyHighlights() {
      elementsToHighlight.forEach(el => {
        el.classList.add('filled-highlight');
        setTimeout(() => el.classList.remove('filled-highlight'), 1600);
      });
    }

    // Main filling function helper that can be run in passes
    function runFillPass(keysToFill) {
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
        .filter(el => !el.closest('#bjsc-form-filler-root'));

      const remainingKeys = [];

      for (const key of keysToFill) {
        const val = data[key];
        if (val === undefined || val === null || val === '') continue;

        let success = false;
        const candidates = [];

        // Loop through page elements to find the best match for this key
        inputs.forEach(el => {
          const score = scoreElementForKey(el, key, val, dobParts);
          if (score > 50) {
            candidates.push({ el, score });
          }
        });

        // Sort candidates by score descending, then prefer visible/enabled elements
        candidates.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          // Tiebreaker: prefer non-disabled, non-hidden elements
          const aDisabled = a.el.disabled || a.el.type === 'hidden' || a.el.hidden;
          const bDisabled = b.el.disabled || b.el.type === 'hidden' || b.el.hidden;
          if (aDisabled !== bDisabled) return aDisabled ? 1 : -1;
          // Prefer elements inside visible parents
          const aVisible = a.el.offsetParent !== null;
          const bVisible = b.el.offsetParent !== null;
          if (aVisible !== bVisible) return aVisible ? -1 : 1;
          return 0;
        });

        if (candidates.length > 0) {
          const bestCandidate = candidates[0].el;
          // Skip disabled/hidden elements — they're likely hidden field duplicates
          if (bestCandidate.disabled || bestCandidate.type === 'hidden' || bestCandidate.hidden) {
            // Check if there's a non-disabled candidate with the same score
            const altCandidate = candidates.find(c =>
              c.score === candidates[0].score &&
              !c.el.disabled && c.el.type !== 'hidden' && !c.el.hidden
            );
            if (altCandidate) {
              if (fillElement(altCandidate.el, val, key, dobParts)) {
                success = true;
                filledCount++;
                if (!elementsToHighlight.includes(altCandidate.el)) {
                  elementsToHighlight.push(altCandidate.el);
                }
              }
            }
          }
          if (!success) {
            if (fillElement(bestCandidate, val, key, dobParts)) {
              success = true;
              filledCount++;
              if (!elementsToHighlight.includes(bestCandidate)) {
                elementsToHighlight.push(bestCandidate);
              }
            }
          }
        }

        if (!success) remainingKeys.push(key);
      }

      return remainingKeys;
    }

    const allKeys = Object.keys(data);

    // ── PHASE 1 (immediate): Fill "reveal trigger" selects FIRST ──────────────
    // These are Yes/No selects whose onchange shows/hides dependent input fields.
    // We must fill them before the dependent fields so the DOM has been updated.
    const revealPatterns = ['nid', 'breg', 'passport', 'marital_status', 'dep_status'];
    const revealKeys = allKeys.filter(k => revealPatterns.includes(k.toLowerCase()));
    if (revealKeys.length > 0) {
      runFillPass(revealKeys);
    }

    // ── PHASE 2 (after 200ms): Fill independent fields + trigger dependent chains ──
    setTimeout(() => {
      // Enable Masters "If Applicable" checkbox if any mas_* fields are present
      const hasMasFields = allKeys.some(k => k.startsWith('mas_'));
      if (hasMasFields) {
        const masCheckbox = document.getElementById('if_applicable_mas');
        if (masCheckbox && !masCheckbox.checked) {
          masCheckbox.click();
          triggerEvents(masCheckbox);
        }
      }

      // Enable Job Experience "If Applicable" checkbox if any job fields are present
      const hasJobFields = allKeys.some(k => k.startsWith('job['));
      if (hasJobFields) {
        const expCheckbox = document.getElementById('if_applicable_exp');
        if (expCheckbox && !expCheckbox.checked) {
          expCheckbox.click();
          triggerEvents(expCheckbox);
        }
      }

      // Fill all fields — parent fields (district, exam, result_type, institute) will
      // trigger their onChange handlers which populate dependent dropdowns.
      runFillPass(allKeys);

      // Directly set all education fields with proper change event chains
      // This bypasses the generic scoring engine and uses exact field IDs
      fillEducationFieldsDirectly(data);

      applyHighlights();

      // Same-as-present-address checkbox (AFTER addresses are filled)
      if (isSameAddressProfile(data)) {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'))
          .filter(el => !el.closest('#bjsc-form-filler-root'));
        const sameAddrCheckbox = inputs.find(el => {
          if (el.type !== 'checkbox') return false;
          const name = (el.name || '').toLowerCase();
          const id   = (el.id   || '').toLowerCase();
          return name === 'same_as_present' || id === 'same_as_present';
        });
        if (sameAddrCheckbox && !sameAddrCheckbox.checked) {
          sameAddrCheckbox.click();
          triggerEvents(sameAddrCheckbox);
          filledCount++;
        }
      }

      // ── PHASE 3 (after 800ms total): Fill dependent fields that need parent populated ──
      // By now onChangeDistrict has populated upazila options, onChangeExamType has
      // populated group options, onChangeResult has shown GPA inputs, etc.
      setTimeout(() => {
        // Explicitly show GPA/CGPA input fields that were hidden by the form.
        // The form's onChangeResult handler should have revealed them, but if not
        // (e.g. jQuery event propagation issue), we force-show them.
        const resultTypePairs = [
          { typeSelect: 'ssc_result_type', gpaInput: 'ssc_result' },
          { typeSelect: 'hsc_result_type', gpaInput: 'hsc_result' },
          { typeSelect: 'gra_result_type', gpaInput: 'gra_result' },
          { typeSelect: 'mas_result_type', gpaInput: 'mas_result' },
        ];
        for (const { typeSelect, gpaInput } of resultTypePairs) {
          const typeEl = document.getElementById(typeSelect);
          const gpaEl = document.getElementById(gpaInput);
          if (typeEl && gpaEl && typeEl.value) {
            const tv = typeEl.value.toString();
            // Value 4 = GPA(out of 4), 5 = GPA(out of 5), 6 = CGPA variants
            if (tv === '4' || tv === '5' || tv === '6') {
              // Force-show the GPA input
              gpaEl.style.display = 'block';
              gpaEl.style.paddingRight = '10px';
              gpaEl.removeAttribute('disabled');
            }
          }
        }

        runFillPass(allKeys);
        fillEducationFieldsDirectly(data);
        applyHighlights();

        // ── PHASE 4 (after 1500ms total): Final cleanup retry ──────────────
        setTimeout(() => {
          runFillPass(allKeys);
          applyHighlights();

          // ── PHASE 5 (after 3s total): Late cleanup for slow AJAX-populated fields ──
          setTimeout(() => {
            // Re-show GPA inputs in case they got hidden again
            for (const { typeSelect, gpaInput } of resultTypePairs) {
              const typeEl = document.getElementById(typeSelect);
              const gpaEl = document.getElementById(gpaInput);
              if (typeEl && gpaEl && typeEl.value) {
                const tv = typeEl.value.toString();
                if (tv === '4' || tv === '5' || tv === '6') {
                  gpaEl.style.display = 'block';
                  gpaEl.removeAttribute('disabled');
                }
              }
            }
            runFillPass(allKeys);
            fillEducationFieldsDirectly(data);
            applyHighlights();
          }, 1500);

        }, 700);

      }, 600);

    }, 200);

    // Immediate highlight for Phase 1 elements
    applyHighlights();

    return { filled: filledCount, unfilledKeys: [] };
  }

  // Check if present and permanent addresses in profile are matching
  function isSameAddressProfile(data) {
    return (
      data.present_district && data.permanent_district &&
      data.present_district.toLowerCase() === data.permanent_district.toLowerCase() &&
      data.present_village && data.permanent_village &&
      data.present_village.toLowerCase() === data.permanent_village.toLowerCase()
    );
  }

  // Scoring engine to rank elements for a specific profile key
  function scoreElementForKey(el, key, val, dobParts) {
    const elName = (el.name || '').toLowerCase();
    const elId = (el.id || '').toLowerCase();
    const label = getElementLabel(el).toLowerCase();
    const cleanKey = key.toLowerCase();

    // 1. Date of Birth Split Dropdown support
    if (dobParts && cleanKey === 'dob') {
      const isDayEl = elName.includes('day') || elId.includes('day') || elName.includes('dd') || elId.includes('dd') || 
                      elName.includes('dob_d') || elId.includes('dob_d') || elName.endsWith('_d') || elId.endsWith('_d') ||
                      elName === 'd' || elId === 'd' ||
                      ((label.includes('day') || label.includes('দিন') || label.includes('তারিখ')) && !label.includes('month') && !label.includes('mas') && !label.includes('year') && !label.includes('bosor') && !label.includes('sal'));
                      
      const isMonthEl = elName.includes('month') || elId.includes('month') || elName.includes('mm') || elId.includes('mm') || 
                        elName.includes('dob_m') || elId.includes('dob_m') || elName.endsWith('_m') || elId.endsWith('_m') ||
                        elName === 'm' || elId === 'm' ||
                        label.includes('month') || label.includes('মাস') || label.includes('মাস');
                        
      const isYearEl = elName.includes('year') || elId.includes('year') || elName.includes('yyyy') || elId.includes('yyyy') || 
                       elName.includes('dob_y') || elId.includes('dob_y') || elName.endsWith('_y') || elId.endsWith('_y') ||
                       elName === 'y' || elId === 'y' ||
                       label.includes('year') || label.includes('বছর') || label.includes('সাল');
      
      const isDobSelect = el.tagName === 'SELECT' && (
        elName.includes('dob') || elId.includes('dob') || 
        elName.includes('birth') || elId.includes('birth') ||
        label.includes('birth') || label.includes('dob') || 
        label.includes('জন্ম') || label.includes('তারিখ') ||
        ((elName.includes('day') || elName.includes('month') || elName.includes('year') || elName.includes('dd') || elName.includes('mm') || elName.includes('yyyy') || elName === 'd' || elName === 'm' || elName === 'y') && 
         (label.includes('date') || label.includes('birth') || label.includes('জন্ম') || label.includes('তারিখ')))
      );
      
      if (isDobSelect || elName.includes('birth') || elId.includes('birth')) {
        if (isDayEl) return 95;
        if (isMonthEl) return 95;
        if (isYearEl) return 95;
      }
    }

    // 2. SSC/HSC examination block filters
    const isSSCField = cleanKey.startsWith('ssc_');
    const isHSCField = cleanKey.startsWith('hsc_');
    const isGradField = cleanKey.startsWith('grad_');
    const isPostGradField = cleanKey.startsWith('post_grad_');

    if (isSSCField || isHSCField || isGradField || isPostGradField) {
      const level = isSSCField ? 'ssc' : (isHSCField ? 'hsc' : (isGradField ? 'grad' : 'post'));
      const subKey = cleanKey.replace(/^(ssc_|hsc_|grad_|post_grad_)/, '');

      // Check if element name or ID contains the exact education level
      const hasLevelIndicator = elName.includes(level) || elId.includes(level) || label.includes(level);
      
      if (hasLevelIndicator) {
        if (elName.includes(subKey) || elId.includes(subKey) || label.includes(subKey)) return 100;
        
        // Handle variations (e.g. ssc_result maps to 'gpa', ssc_year maps to 'passing')
        if (subKey === 'result' && (elName.includes('gpa') || elName.includes('result') || label.includes('gpa') || label.includes('result'))) return 90;
        if (subKey === 'year' && (elName.includes('year') || elName.includes('pass') || label.includes('year') || label.includes('passing'))) return 90;
        if (subKey === 'group' && (elName.includes('group') || elName.includes('sub') || label.includes('group') || label.includes('subject'))) return 90;
        if (subKey === 'board' && (elName.includes('board') || label.includes('board'))) return 90;
      }
      
      // Fallback check: if there is no ssc/hsc in inputs but they are grouped in tables
      // We score 60 if it matches the subkey and matches surrounding text
      if (elName.includes(subKey) || elId.includes(subKey)) {
        return 60;
      }
      
      return 0;
    }

    // 3. Present vs Permanent Address fields
    const isPresentField = cleanKey.startsWith('present_');
    const isPermanentField = cleanKey.startsWith('permanent_');

    if (isPresentField || isPermanentField) {
      const addrType = isPresentField ? 'present' : 'permanent';
      const subKey = cleanKey.replace(/^(present_|permanent_)/, '');

      // Standard prefixes used by Teletalk
      const prefixShort = isPresentField ? 'pre_' : 'per_';

      const hasType = elName.includes(addrType) || elId.includes(addrType) || label.includes(addrType) ||
                      elName.includes(prefixShort) || elId.includes(prefixShort);

      if (hasType) {
        if (elName.includes(subKey) || elId.includes(subKey) || label.includes(subKey)) return 100;

        // Handle common variations in sub-properties
        if (subKey === 'careof' && (elName.includes('care') || elId.includes('care') || label.includes('care of'))) return 95;
        if (subKey === 'post' && (elName.includes('post') || elName.includes('_post') || elId.includes('post') || label.includes('post'))) return 95;
        if (subKey === 'postcode' && (elName.includes('code') || elName.includes('postcode') || elId.includes('postcode') || elName.includes('zip') || label.includes('code') || label.includes('zip'))) return 95;
        if (subKey === 'upazila' && (elName.includes('upa') || elName.includes('thana') || label.includes('upa') || label.includes('thana'))) return 95;
        if (subKey === 'post_office' && (elName.includes('post') || elId.includes('post') || label.includes('post'))) return 95;
        if (subKey === 'post_code' && (elName.includes('code') || elName.includes('postcode') || elId.includes('postcode') || label.includes('code'))) return 95;
        if (subKey === 'care_of' && (elName.includes('care') || elId.includes('care') || label.includes('care of'))) return 95;
      }
      return 0;
    }

    // 4. Exact direct match
    if (elName === cleanKey || elId === cleanKey) {
      return 100;
    }

    // 5. standard fields scoring (e.g. mobile, email, name, father, mother, gender)
    if (cleanKey === 'alljobs_id' || cleanKey === 'member_id') {
      if (elName.includes('member') || elId.includes('member') || elName.includes('alljobs') || elId.includes('alljobs') || label.includes('member') || label.includes('alljobs') || label.includes('seeker')) return 98;
    }
    
    // Bangla indicators check (case-insensitive for multiple common formats)
    const isBanglaElement = elName.includes('bangla') || elName.includes('bn') || elName.includes('bng') || elName.includes('bengali') ||
                            elId.includes('bangla') || elId.includes('bn') || elId.includes('bng') || elId.includes('bengali') ||
                            label.includes('বাংলা') || label.includes('bangla') || label.includes('bengali');

    if (cleanKey === 'name_bn' || cleanKey === 'name_bangla') {
      if ((elName.includes('name') || elId.includes('name')) && isBanglaElement) return 100;
      if (label.includes('নাম') && label.includes('বাংলা')) return 99;
      if (label.includes('name') && (label.includes('bangla') || label.includes('bengali') || label.includes('bng') || label.includes('bn'))) return 99;
    }
    if (cleanKey === 'name') {
      if (elName.includes('applicant') || elId.includes('applicant') || label.includes('applicant name') || label.includes('full name') || label === 'name' || elName === 'name') {
        if (isBanglaElement) {
          return 0; // Exclude Bangla fields from matching English Name key
        }
        return 95;
      }
    }
    if (cleanKey === 'father_bn' || cleanKey === 'father_bangla') {
      if ((elName.includes('father') || elId.includes('father')) && isBanglaElement) return 100;
      if (label.includes('পিতা') && label.includes('বাংলা')) return 99;
      if (label.includes('father') && (label.includes('bangla') || label.includes('bengali') || label.includes('bng') || label.includes('bn'))) return 99;
    }
    if (cleanKey === 'father') {
      if (elName.includes('father') || elId.includes('father') || label.includes('father')) {
        if (isBanglaElement) {
          return 0; // Exclude Bangla fields
        }
        return 95;
      }
    }
    if (cleanKey === 'mother_bn' || cleanKey === 'mother_bangla') {
      if ((elName.includes('mother') || elId.includes('mother')) && isBanglaElement) return 100;
      if (label.includes('মাতা') && label.includes('বাংলা')) return 99;
      if (label.includes('mother') && (label.includes('bangla') || label.includes('bengali') || label.includes('bng') || label.includes('bn'))) return 99;
    }
    if (cleanKey === 'mother') {
      if (elName.includes('mother') || elId.includes('mother') || label.includes('mother')) {
        if (isBanglaElement) {
          return 0; // Exclude Bangla fields
        }
        return 95;
      }
    }
    if (cleanKey === 'mobile' || cleanKey === 'mobile_no') {
      if (elName.includes('mobile') || elId.includes('mobile') || elName.includes('phone') || label.includes('mobile') || label.includes('phone')) {
        // If it's a mobile field, give higher score to non-confirmation fields first
        if (elName.includes('confirm') || elId.includes('confirm') || label.includes('confirm')) {
          return 90; // Let confirm field get filled slightly later/lower
        }
        return 98;
      }
    }
    if (cleanKey === 'confirm_mobile') {
      if ((elName.includes('mobile') || elId.includes('mobile')) && (elName.includes('confirm') || elId.includes('confirm') || elName.includes('re') || label.includes('confirm') || label.includes('re-type'))) {
        return 99;
      }
    }
    if (cleanKey === 'nid') {
      if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
        if (elName.includes('nid') || elId.includes('nid') || elName.includes('national') || label.includes('nid') || label.includes('national id') || label.includes('এনআইডি')) return 98;
      }
      return 0; // Exclude text input fields from matching Yes/No choice key
    }
    if (cleanKey === 'nid_no') {
      if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'radio') {
        if (elName.includes('nid') || elId.includes('nid') || elName.includes('national') || label.includes('nid') || label.includes('national id') || label.includes('এনআইডি')) return 98;
      }
      return 0; // Exclude dropdowns from matching Number/Value key
    }
    if (cleanKey === 'birth_reg' || cleanKey === 'birth_registration' || cleanKey === 'breg') {
      if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
        if (elName === 'breg' || elId === 'breg') return 100; // Direct exact match for Teletalk BJSC form field
        if (elName.includes('birth') || elId.includes('birth') || elName.includes('breg') || elId.includes('breg') || label.includes('birth') || label.includes('breg') || label.includes('জন্ম')) return 98;
      }
      return 0; // Exclude text fields
    }
    if (cleanKey === 'birth_reg_no' || cleanKey === 'birth_registration_no' || cleanKey === 'breg_no') {
      if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'radio') {
        if (elName === 'breg_no' || elId === 'breg_no') return 100; // Direct exact match for Teletalk BJSC form field
        if (elName.includes('birth') || elId.includes('birth') || elName.includes('breg') || elId.includes('breg') || label.includes('birth') || label.includes('breg') || label.includes('জন্ম')) return 98;
      }
      return 0; // Exclude dropdowns
    }
    if (cleanKey === 'passport') {
      if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
        if (elName.includes('pass') || elId.includes('pass') || label.includes('passport') || label.includes('পাসপোর্ট')) return 98;
      }
      return 0; // Exclude text fields
    }
    if (cleanKey === 'passport_no') {
      if (el.tagName === 'INPUT' && el.type !== 'checkbox' && el.type !== 'radio') {
        if (elName.includes('pass') || elId.includes('pass') || label.includes('passport') || label.includes('পাসপোর্ট')) return 98;
      }
      return 0; // Exclude dropdowns
    }
    if (cleanKey === 'gender') {
      if (elName.includes('gender') || elId.includes('gender') || label.includes('gender') || elName.includes('sex') || label.includes('sex') || label.includes('লিঙ্গ')) return 98;
    }
    if (cleanKey === 'religion') {
      if (elName.includes('religion') || elId.includes('religion') || label.includes('religion') || label.includes('ধর্ম')) return 98;
    }
    if (cleanKey === 'marital_status' || cleanKey === 'marital') {
      if (elName.includes('marit') || elId.includes('marit') || label.includes('marit') || label.includes('marriage') || label.includes('বৈবাহিক')) return 98;
    }
    if (cleanKey === 'dep_status' || cleanKey === 'dept_status' || cleanKey === 'departmental_status') {
      if (elName.includes('dep') || elId.includes('dep') || label.includes('dep') || label.includes('departmental') || label.includes('বিভাগীয়')) return 98;
    }
    // Quota select handling
    if (cleanKey === 'quota') {
      if (el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio') {
        if (elName.includes('quota') || elId.includes('quota') || label.includes('quota') || label.includes('কোটা')) return 98;
      }
      return 0;
    }

    // Substring scoring fallback
    if (elName.includes(cleanKey) || elId.includes(cleanKey)) {
      return 80;
    }

    if (label.includes(cleanKey)) {
      return 70;
    }

    return 0;
  }

  // Populate element with the profile value
  function fillElement(el, val, key, dobParts) {
    // 1. Handle Select elements (dropdowns)
    if (el.tagName === 'SELECT') {
      const elName = (el.name || '').toLowerCase();
      const elId = (el.id || '').toLowerCase();
      const label = getElementLabel(el).toLowerCase();

      // DOB split selects
      if (dobParts && key.toLowerCase() === 'dob') {
        const isDayEl = elName.includes('day') || elId.includes('day') || elName.includes('dd') || elId.includes('dd') || 
                        elName.includes('dob_d') || elId.includes('dob_d') || elName.endsWith('_d') || elId.endsWith('_d') ||
                        elName === 'd' || elId === 'd' ||
                        ((label.includes('day') || label.includes('দিন') || label.includes('তারিখ')) && !label.includes('month') && !label.includes('mas') && !label.includes('year') && !label.includes('bosor') && !label.includes('sal'));
                        
        const isMonthEl = elName.includes('month') || elId.includes('month') || elName.includes('mm') || elId.includes('mm') || 
                          elName.includes('dob_m') || elId.includes('dob_m') || elName.endsWith('_m') || elId.endsWith('_m') ||
                          elName === 'm' || elId === 'm' ||
                          label.includes('month') || label.includes('মাস') || label.includes('মাস');
                          
        const isYearEl = elName.includes('year') || elId.includes('year') || elName.includes('yyyy') || elId.includes('yyyy') || 
                         elName.includes('dob_y') || elId.includes('dob_y') || elName.endsWith('_y') || elId.endsWith('_y') ||
                         elName === 'y' || elId === 'y' ||
                         label.includes('year') || label.includes('বছর') || label.includes('সাল');

        if (isDayEl) { selectOptionFuzzy(el, dobParts.day.toString()); }
        if (isMonthEl) { selectOptionMonth(el, dobParts.month); }
        if (isYearEl) { selectOptionFuzzy(el, dobParts.year.toString()); }
        triggerEvents(el);
        return true;
      }

      // Quota-specific handling (maps various synonyms to the appropriate option)
      if (key && key.toLowerCase() === 'quota') {
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '');
        const map = {
          'nonquota': '8',
          'notapplicable': '8',
          'na': '8',
          '8': '8'
        };
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) triggerEvents(el);
          return changed;
        }
      }

      // SSC exam specific handling (value-based mapping)
      if (key && key.toLowerCase() === 'ssc_exam') {
        const map = {
          'ssc': '1', 's.s.c': '1', 's.s.c.': '1',
          'dakhil': '2',
          'sscvocational': '3', 's.s.cvocational': '3',
          'olevel': '4', 'olevel/cambridge': '4', 'cambridge': '4',
          'sscequivalent': '5', 's.s.cequivalent': '5', 'equivalent': '5',
          'dakhilvocational': '6'
        };
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s.]/g, '');
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) {
            triggerEvents(el);
            if (typeof window.onChangeExamTypeSSC === 'function') {
              try { window.onChangeExamTypeSSC.call(el, el); } catch(e) {}
            }
          }
          return changed;
        }
      }

      // HSC exam specific handling
      if (key && key.toLowerCase() === 'hsc_exam') {
        const map = {
          'hsc': '1', 'h.s.c': '1', 'h.s.c.': '1',
          'alim': '2',
          'businessmanagement': '3',
          'diploma-in-engineering': '4', 'diplomainengineering': '4',
          'alevel': '5', 'alevel/srcambridge': '5', 'srcambridge': '5',
          'hscequivalent': '6', 'h.s.cequivalent': '6', 'equivalent': '6',
          'diplomainmedicaltechnology': '7',
          'hscvocational': '8', 'h.s.cvocational': '8',
          'hsc(bm)': '9', 'hscbm': '9',
          'diplomainpharmacy': '10'
        };
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s.()]/g, '');
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) {
            triggerEvents(el);
            if (typeof window.onChangeExamTypeHSC === 'function') {
              try { window.onChangeExamTypeHSC.call(el, el); } catch(e) {}
            }
          }
          return changed;
        }
      }

      // SSC board specific handling
      if (key && key.toLowerCase() === 'ssc_board') {
        const map = {
          'barishal': '11','chattogram':'12','cumilla':'13','dhaka':'14','dinajpur':'15','jashore':'16','madrasah':'17','mymensingh':'18','rajshahi':'19','sylhet':'20','open university':'21','edexcel international':'22','cambridge international - igce':'23','pharmacy council of bangladesh':'24','the state medical faculty of bangladesh':'25','bteb':'26','bangladesh technical education board (bteb)':'26','other':'99'
        };
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '');
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) {
            triggerEvents(el);
            if (typeof window.onChangeBoard === 'function') {
              try { window.onChangeBoard.call(el, el); } catch(e) {}
            }
          }
          return changed;
        }
      }

      // HSC exam specific handling
      if (key && key.toLowerCase() === 'hsc_exam') {
        const map = {
          'h.s.c': '1','h.s.c.': '1','hsc': '1','intermediate': '1','dakhil': '2','hsc vocational': '3','o level': '4','cambridge': '4','equivalent': '5','dakhil vocational': '6'
        };
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s.]/g, '');
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) triggerEvents(el);
          return changed;
        }
      }

      // HSC board specific handling
      if (key && key.toLowerCase() === 'hsc_board') {
        const map = {
          'dibs (dhaka)': '10','barishal': '11','chattogram':'12','cumilla':'13','dhaka':'14','dinajpur':'15','jashore':'16','madrasah':'17','mymensingh':'18','rajshahi':'19','sylhet':'20','open university':'21','edexcel international':'22','cambridge international - igce':'23','pharmacy council of bangladesh':'24','the state medical faculty of bangladesh':'25','bteb':'26','bangladesh technical education board (bteb)':'26','other':'99'
        };
        const norm = (s) => (s || '').toString().toLowerCase().replace(/[-_\s]/g, '');
        const target = map[norm(val)];
        if (target) {
          const changed = selectOptionFuzzy(el, target);
          if (changed) {
            triggerEvents(el);
            if (typeof window.onChangeBoard === 'function') {
              try { window.onChangeBoard.call(el, el); } catch(e) {}
            }
          }
          return changed;
        }
      }

      // Result type selects (ssc_result_type, hsc_result_type, gra_result_type, mas_result_type)
      // These trigger onChangeResult which shows/hides the GPA input field
      if (key && (key === 'ssc_result_type' || key === 'hsc_result_type' ||
                  key === 'gra_result_type' || key === 'mas_result_type')) {
        const valStr = val.toString().trim();

        // Convert text to numeric code if needed
        let targetVal = valStr;
        if (isNaN(valStr)) {
          const s = valStr.toLowerCase();
          const gpaMatch = s.match(/(?:cgpa|gpa)\s*\(?\s*out\s*of\s*(\d)\s*\)?/);
          if (gpaMatch) {
            targetVal = gpaMatch[1];
          } else if (s.match(/1st\s*(division|class)/) || s.match(/first\s*(division|class)/)) {
            targetVal = '1';
          } else if (s.match(/2nd\s*(division|class)/) || s.match(/second\s*(division|class)/)) {
            targetVal = '2';
          } else if (s.match(/3rd\s*(division|class)/) || s.match(/third\s*(division|class)/)) {
            targetVal = '3';
          } else if (s === 'passed' || s === 'pass') {
            targetVal = '6';
          }
        }

        // Directly set the select value by iterating options
        let found = false;
        for (let i = 0; i < el.options.length; i++) {
          if (el.options[i].value === targetVal) {
            el.selectedIndex = i;
            found = true;
            break;
          }
        }

        if (found) {
          triggerEvents(el);
          // Directly call onChangeResult if the form defines it
          if (typeof window.onChangeResult === 'function') {
            try { window.onChangeResult.call(el, el); } catch(e) {}
          }
          // Only show GPA input for GPA/CGPA types (values 4, 5, 6), NOT for class/division
          const gpaId = key.replace('_type', '');
          const gpaEl = document.getElementById(gpaId);
          if (gpaEl && (targetVal === '4' || targetVal === '5' || targetVal === '6')) {
            gpaEl.style.display = 'block';
            gpaEl.removeAttribute('disabled');
          }
          return true;
        }
        return false;
      }

      // Generic select handling for other dropdowns (quota, districts, etc.)
      const changed = selectOptionFuzzy(el, val !== undefined ? val.toString() : '');
      if (changed) triggerEvents(el);
      return changed;
    }

    // 2. Handle Text, Date, Email, Tel, Number inputs
    if (el.tagName === 'INPUT') {
      if (el.type === 'checkbox') {
        const isChecked = val === true || val === '1' || val === 'on' || val.toString().toLowerCase() === 'yes';
        if (el.checked !== isChecked) {
          el.checked = isChecked;
          triggerEvents(el);
          return true;
        }
        return false;
      }

      if (el.type === 'radio') {
        // Match value exact or substring
        const isMatch = el.value.toLowerCase() === val.toString().toLowerCase() ||
                        val.toString().toLowerCase().includes(el.value.toLowerCase());
        if (isMatch) {
          el.checked = true;
          triggerEvents(el);
          return true;
        }
        return false;
      }

      if (el.type === 'date') {
        // Normalize to YYYY-MM-DD which is what <input type="date"> requires
        let dateVal = val.toString().trim();
        if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(dateVal)) {
          // Convert DD-MM-YYYY or DD/MM/YYYY → YYYY-MM-DD
          const p = dateVal.split(/[-/]/);
          dateVal = `${p[2]}-${p[1].padStart(2,'0')}-${p[0].padStart(2,'0')}`;
        } else if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(dateVal)) {
          // Ensure zero-padded YYYY-MM-DD
          const p = dateVal.split(/[-/]/);
          dateVal = `${p[0]}-${p[1].padStart(2,'0')}-${p[2].padStart(2,'0')}`;
        }
        // Only set if within min/max bounds
        const minDate = el.min || '';
        const maxDate = el.max || '';
        if ((!minDate || dateVal >= minDate) && (!maxDate || dateVal <= maxDate)) {
          el.value = dateVal;
          triggerEvents(el);
          return true;
        } else {
          // Try setting anyway — user may have correct dob outside default range
          el.value = dateVal;
          triggerEvents(el);
        }
      }

      // Default: text, email, tel, number, search, url inputs
      el.value = val;
      triggerEvents(el);
      return true;
    }

    // 3. Handle Textarea
    if (el.tagName === 'TEXTAREA') {
      el.value = val;
      triggerEvents(el);
      return true;
    }

    return false;
  }

  // Fuzzy select dropdown option matcher
  function selectOptionFuzzy(selectEl, searchVal) {
    const normalize = (s) => (s || '').trim().toLowerCase().replace(/[-_\s]/g, '');
    const searchClean = normalize(searchVal);
    
    // Map of common synonyms across English/Bangla/Variations
    const synonyms = {
      'yes': ['yes', 'y', 'হ্যাঁ', 'হ্যা', 'ha', '1', 'true'],
      'no': ['no', 'n', 'না', 'na', '0', 'false'],
      'single': ['single', 'unmarried', 'অবিবাহিত', 'singel'],
      'married': ['married', 'বিবাহিত'],
      'male': ['male', 'm', 'পুরুষ'],
      'female': ['female', 'f', 'মহিলা', 'নারী'],
      'islam': ['islam', 'muslim', 'ইসলাম'],
      'hindu': ['hindu', 'sanatan', 'হিন্দু'],
      'christian': ['christian', 'খ্রিস্টান', 'খ্রিষ্টান'],
      'buddhist': ['buddhist', 'বৌদ্ধ'],
      'none': ['none','not applicable','na','5'],
      'nonquota': ['nonquota','not applicable','na','8','notapplicable']
    };

    // Find if the search value corresponds to any synonym group
    let searchSynonyms = [searchClean];
    for (const [key, list] of Object.entries(synonyms)) {
      if (list.map(normalize).includes(searchClean)) {
        searchSynonyms = list.map(normalize);
        break;
      }
    }

    const options = Array.from(selectEl.options);
    let bestOption = null;
    let highestScore = 0;

    options.forEach(opt => {
      const optVal = normalize(opt.value);
      const optText = normalize(opt.text);

      let score = 0;
      
      // Check if option value or text matches search value or any of its synonyms
      const isValSynonym = searchSynonyms.includes(optVal);
      const isTextSynonym = searchSynonyms.includes(optText);

      if (optVal === searchClean || optText === searchClean) {
        score = 100;
      } else if (isValSynonym || isTextSynonym) {
        score = 95; // Extremely high confidence synonym match
      } else if (optText.includes(searchClean) || searchClean.includes(optText)) {
        score = 80;
      } else if (optVal.includes(searchClean) || searchClean.includes(optVal)) {
        score = 70;
      }

      if (score > highestScore) {
        highestScore = score;
        bestOption = opt;
      }
    });

    if (bestOption && highestScore > 40) {
      if (selectEl.value !== bestOption.value) {
        selectEl.value = bestOption.value;
        triggerEvents(selectEl);
      }
      return true;
    }
    return false;
  }

  // Month-specific select matcher supporting numbers and full names
  function selectOptionMonth(selectEl, monthNum) {
    const monthNames = [
      "january", "february", "march", "april", "may", "june",
      "july", "august", "september", "october", "november", "december"
    ];
    const monthShorts = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];

    const options = Array.from(selectEl.options);
    let bestOption = null;

    options.forEach(opt => {
      const val = (opt.value || '').trim().toLowerCase();
      const text = (opt.text || '').trim().toLowerCase();
      const numStr = monthNum.toString();
      const paddedNumStr = monthNum < 10 ? '0' + numStr : numStr;

      const isMatch = val === numStr || val === paddedNumStr ||
                      text === numStr || text === paddedNumStr ||
                      text.includes(monthNames[monthNum - 1]) ||
                      text.includes(monthShorts[monthNum - 1]) ||
                      val.includes(monthShorts[monthNum - 1]);

      if (isMatch) {
        bestOption = opt;
      }
    });

    if (bestOption) {
      if (selectEl.value !== bestOption.value) {
        selectEl.value = bestOption.value;
        triggerEvents(selectEl);
      }
      return true;
    }
    return false;
  }

  // Initial local profile sync
  loadProfiles();
})();
