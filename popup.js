document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const profileSelect = document.getElementById('profileSelect');
  const deleteProfileBtn = document.getElementById('deleteProfileBtn');
  const newProfileBtn = document.getElementById('newProfileBtn');
  const profileRenameSection = document.getElementById('profileRenameSection');
  const profileNameInput = document.getElementById('profileNameInput');
  const saveProfileNameBtn = document.getElementById('saveProfileNameBtn');
  const profileJsonTextarea = document.getElementById('profileJsonTextarea');
  const saveBtn = document.getElementById('saveBtn');
  const exportBtn = document.getElementById('exportBtn');
  const importFileInput = document.getElementById('importFileInput');
  const loadSampleBtn = document.getElementById('loadSampleBtn');

  // Sample data designed specifically for AllJobs & Teletalk Forms
  // Keys match actual BJSC form field names/IDs for direct matching
  const sampleBJSCProfile = {
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

    // SSC Details (result_type = dropdown value, result = GPA number)
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

    // Graduation Details (gra_ prefix matches actual form field IDs)
    "gra_exam": "Honors",
    "gra_institute": "University of Dhaka",
    "gra_subject": "Computer Science",
    "gra_year": "2019",
    "gra_result_type": "1st Class",
    "gra_duration": "04",

    // Masters/Post-Grad (mas_ prefix, enable via "If Applicable" checkbox)
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

  // State
  let profiles = {};
  let activeProfileId = '';

  // Initialize and load profiles
  function init() {
    loadProfilesFromStorage();
  }

  // Load profiles from chrome storage
  function loadProfilesFromStorage() {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['formFillerProfiles', 'activeProfileId'], function(result) {
        profiles = result.formFillerProfiles || {};
        activeProfileId = result.activeProfileId || '';
        
        // If no profiles exist, create a default one
        if (Object.keys(profiles).length === 0) {
          const defaultId = 'profile_' + Date.now();
          profiles[defaultId] = {
            name: "Default AllJobs & BJSC Profile",
            data: sampleBJSCProfile
          };
          activeProfileId = defaultId;
          saveAllToStorage();
        }
        
        populateProfileDropdown();
        selectActiveProfile();
      });
    } else {
      // LocalStorage Fallback (for local debugging)
      const cached = localStorage.getItem('formFillerProfiles');
      profiles = cached ? JSON.parse(cached) : {};
      activeProfileId = localStorage.getItem('activeProfileId') || '';

      if (Object.keys(profiles).length === 0) {
        const defaultId = 'profile_' + Date.now();
        profiles[defaultId] = {
          name: "Default AllJobs Profile (Local)",
          data: sampleBJSCProfile
        };
        activeProfileId = defaultId;
        localStorage.setItem('formFillerProfiles', JSON.stringify(profiles));
        localStorage.setItem('activeProfileId', activeProfileId);
      }
      
      populateProfileDropdown();
      selectActiveProfile();
    }
  }

  // Save current state to storage
  function saveAllToStorage(callback) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({
        formFillerProfiles: profiles,
        activeProfileId: activeProfileId
      }, function() {
        if (callback) callback();
      });
    } else {
      localStorage.setItem('formFillerProfiles', JSON.stringify(profiles));
      localStorage.setItem('activeProfileId', activeProfileId);
      if (callback) callback();
    }
  }

  // Populate Dropdown
  function populateProfileDropdown() {
    profileSelect.innerHTML = '';
    for (const [id, profile] of Object.entries(profiles)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = profile.name;
      profileSelect.appendChild(option);
    }
  }

  // Select active profile
  function selectActiveProfile() {
    if (activeProfileId && profiles[activeProfileId]) {
      profileSelect.value = activeProfileId;
      profileJsonTextarea.value = JSON.stringify(profiles[activeProfileId].data, null, 2);
    } else {
      profileJsonTextarea.value = '';
    }
  }

  // Toast notifier helper
  function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + (isError ? 'error' : 'success');
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  // Dropdown change listener
  profileSelect.addEventListener('change', function(e) {
    activeProfileId = e.target.value;
    if (activeProfileId) {
      selectActiveProfile();
      saveAllToStorage();
    }
  });

  // Load sample data into active profile editor
  loadSampleBtn.addEventListener('click', function() {
    profileJsonTextarea.value = JSON.stringify(sampleBJSCProfile, null, 2);
    showToast('📝 Sample data loaded! Click Save to apply.');
  });

  // Save active profile changes
  saveBtn.addEventListener('click', function() {
    if (!activeProfileId) {
      showToast('❌ No active profile selected', true);
      return;
    }

    try {
      const parsedData = JSON.parse(profileJsonTextarea.value);
      profiles[activeProfileId].data = parsedData;
      
      saveAllToStorage(function() {
        showToast('✅ Profile saved successfully!');
        // Broadcast the update to the content scripts of active tabs
        broadcastProfileUpdate();
      });
    } catch (err) {
      showToast('❌ Invalid JSON format: ' + err.message, true);
    }
  });

  // Broadcast the update to all open tabs
  function broadcastProfileUpdate() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({}, function(tabs) {
        tabs.forEach(tab => {
          try {
            chrome.tabs.sendMessage(tab.id, {
              action: 'profileUpdated',
              profileId: activeProfileId,
              profileData: profiles[activeProfileId].data
            });
          } catch(e) {
            // Ignore messaging errors for unsupported pages
          }
        });
      });
    }
  }

  // Create New Profile
  newProfileBtn.addEventListener('click', function() {
    profileRenameSection.classList.remove('hidden');
    profileNameInput.value = '';
    profileNameInput.focus();
  });

  // Confirm rename/creation of profile
  saveProfileNameBtn.addEventListener('click', function() {
    const name = profileNameInput.value.trim();
    if (!name) {
      showToast('❌ Profile name cannot be empty', true);
      return;
    }

    const newId = 'profile_' + Date.now();
    profiles[newId] = {
      name: name,
      data: sampleBJSCProfile // Start with a copy of sample data
    };
    activeProfileId = newId;

    saveAllToStorage(function() {
      populateProfileDropdown();
      selectActiveProfile();
      profileRenameSection.classList.add('hidden');
      showToast('👤 New profile created!');
    });
  });

  // Delete Profile
  deleteProfileBtn.addEventListener('click', function() {
    if (!activeProfileId) {
      showToast('❌ No active profile selected', true);
      return;
    }

    if (Object.keys(profiles).length <= 1) {
      showToast('⚠️ Cannot delete the only remaining profile', true);
      return;
    }

    if (confirm('Are you sure you want to delete this profile?')) {
      delete profiles[activeProfileId];
      // Set the next available profile as active
      activeProfileId = Object.keys(profiles)[0];
      
      saveAllToStorage(function() {
        populateProfileDropdown();
        selectActiveProfile();
        showToast('🗑️ Profile deleted!');
      });
    }
  });

  // Export profile
  exportBtn.addEventListener('click', function() {
    if (!activeProfileId || !profiles[activeProfileId]) {
      showToast('❌ No active profile to export', true);
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles[activeProfileId].data, null, 2));
    const downloadAnchor = document.createElement('a');
    const filename = profiles[activeProfileId].name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_profile.json';
    
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📤 Profile downloaded!');
  });

  // Import profile
  importFileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const importedData = JSON.parse(evt.target.result);
        const newId = 'profile_' + Date.now();
        const profileName = file.name.replace('_profile.json', '').replace('.json', '').replace(/_/g, ' ') + ' (Imported)';
        
        profiles[newId] = {
          name: profileName,
          data: importedData
        };
        activeProfileId = newId;

        saveAllToStorage(function() {
          populateProfileDropdown();
          selectActiveProfile();
          showToast('📥 Profile imported successfully!');
        });
      } catch (err) {
        showToast('❌ Error parsing imported JSON: ' + err.message, true);
      }
    };
    reader.readAsText(file);
  });

  init();
});
