// page-helper.js — Runs in PAGE context (world: "MAIN")
// Can access page-level functions: onChangeResult, onChangeExamTypeSSC, etc.
// Communication: content.js dispatches CustomEvents -> this file handles them.

(function() {
  'use strict';

  function norm(s) { return (s || '').toLowerCase().replace(/[-_.\s]/g, ''); }

  document.addEventListener('__BJSC_setSelect', function(e) {
    var d = e.detail;
    var el = document.getElementById(d.id);
    if (!el || el.tagName !== 'SELECT' || !d.val) return;
    var targetVal = d.val.toString().trim();
    var targetLower = norm(targetVal);
    var matchIndex = -1;

    // Pass 1: exact value match
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value === targetVal) { matchIndex = i; break; }
    }

    // Pass 2: fuzzy text match
    if (matchIndex === -1) {
      var bestScore = 0;
      for (var i = 1; i < el.options.length; i++) {
        var optText = norm(el.options[i].text);
        var optVal = norm(el.options[i].value);
        var score = 0;
        if (optText === targetLower) score = 100;
        else if (optText.indexOf(targetLower) !== -1 || targetLower.indexOf(optText) !== -1) score = 80;
        else if (optVal === targetLower) score = 90;
        if (score > bestScore) { bestScore = score; matchIndex = i; }
      }
    }

    if (matchIndex === -1) return;

    var selectedOpt = el.options[matchIndex];
    el.selectedIndex = matchIndex;
    el.value = selectedOpt.value;
    if (typeof jQuery !== 'undefined') {
      try { jQuery('#' + d.id).val(selectedOpt.value).trigger('change'); } catch(ex) {}
    }
    try { el.dispatchEvent(new Event('change', {bubbles:true})); } catch(ex) {}
    if (d.handler && typeof window[d.handler] === 'function') {
      try { window[d.handler].call(el, el); } catch(ex) {}
    }
  });

  document.addEventListener('__BJSC_setInput', function(e) {
    var d = e.detail;
    var el = document.getElementById(d.id);
    if (!el || !d.val) return;
    el.value = d.val;
    try { el.dispatchEvent(new Event('input', {bubbles:true})); } catch(ex) {}
    try { el.dispatchEvent(new Event('change', {bubbles:true})); } catch(ex) {}
  });

  document.addEventListener('__BJSC_showElement', function(e) {
    var el = document.getElementById(e.detail.id);
    if (el) { el.style.display = 'block'; el.removeAttribute('disabled'); }
  });

  document.addEventListener('__BJSC_clickElement', function(e) {
    var el = document.getElementById(e.detail.id);
    if (el && !el.checked) { el.click(); }
  });
})();
