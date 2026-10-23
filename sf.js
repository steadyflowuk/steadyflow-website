/* Shared behaviour for SteadyFlow pages: link wiring, plan selection, topographic texture. */
(function () {
  var L = window.SF_LINKS || {};
  var PLANS = ['presence', 'momentum', 'flow'];
  var NAMES = { presence: 'Presence', momentum: 'Momentum', flow: 'Flow' };
  var PRICES = { presence: '£395', momentum: '£695', flow: '£1,250' };

  function get(path) {
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, L);
  }

  function currentPlan() {
    var m = /[?&]plan=([a-z]+)/.exec(location.search);
    var p = m && m[1];
    return PLANS.indexOf(p) >= 0 ? p : null;
  }

  // Any element with data-link="booking" / "pay.flow" / "docs.agreement" etc. gets its href from links.js.
  // If the link isn't set yet, the element keeps its own fallback href (usually an email).
  function wireLinks(root) {
    (root || document).querySelectorAll('[data-link]').forEach(function (a) {
      var url = get(a.getAttribute('data-link'));
      if (url) {
        a.href = url;
        if (/^https?:/.test(url) && !a.hasAttribute('data-same-tab')) {
          a.target = '_blank';
          a.rel = 'noopener';
        }
      }
    });
  }

  // Start / welcome pages: a plan picker that updates the payment button and labels.
  function wirePlanPicker() {
    var picker = document.querySelector('[data-plan-picker]');
    if (!picker) return;
    var plan = currentPlan() || picker.getAttribute('data-default') || 'momentum';

    function apply(p) {
      plan = p;
      picker.querySelectorAll('input[name="plan"]').forEach(function (r) { r.checked = (r.value === p); });
      document.querySelectorAll('[data-plan-name]').forEach(function (el) { el.textContent = NAMES[p]; });
      document.querySelectorAll('[data-plan-price]').forEach(function (el) { el.textContent = PRICES[p]; });
      document.querySelectorAll('[data-plan-href]').forEach(function (el) { el.href = p + '.html'; });
      var pay = document.querySelector('[data-pay-button]');
      if (pay) {
        var url = (L.pay || {})[p];
        if (url) {
          pay.href = url;
          pay.removeAttribute('target');
        } else {
          pay.href = 'mailto:info@steadyflow.uk?subject=' + encodeURIComponent('Starting the ' + NAMES[p] + ' plan');
        }
      }
      if (history.replaceState) history.replaceState(null, '', location.pathname + '?plan=' + p);
    }

    picker.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'plan') apply(e.target.value);
    });
    apply(plan);
  }

  // Topographic contour texture (brand signature), drawn into any svg.topo
  function prng(seed) {
    var s = (seed >>> 0) || 1;
    return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 0xFFFFFFFF; };
  }
  // Gold "bullion" stroke: a metallic gradient across the drawing
  function goldStroke(el, id) {
    var NS = 'http://www.w3.org/2000/svg';
    var defs = document.createElementNS(NS, 'defs'), g = document.createElementNS(NS, 'linearGradient');
    g.setAttribute('id', id); g.setAttribute('gradientUnits', 'userSpaceOnUse');
    g.setAttribute('x1', '0'); g.setAttribute('y1', '0'); g.setAttribute('x2', '1400'); g.setAttribute('y2', '220');
    [['0', '#8A6A2F'], ['.18', '#E9CF85'], ['.36', '#B08A3C'], ['.55', '#F4E3A6'], ['.74', '#A47C34'], ['1', '#DDBB66']].forEach(function (st) {
      var s = document.createElementNS(NS, 'stop'); s.setAttribute('offset', st[0]); s.setAttribute('stop-color', st[1]); g.appendChild(s);
    });
    defs.appendChild(g); el.appendChild(defs);
    return 'url(#' + id + ')';
  }
  var topoCount = 0;
  function buildTopo(el) {
    var color = el.getAttribute('data-color') || 'gold';
    var opacity = parseFloat(el.getAttribute('data-opacity') || '.8');
    var bold = color === 'gold';
    if (bold) color = goldStroke(el, 'sf-gold-' + (topoCount++));
    var seed = parseInt(el.getAttribute('data-seed') || '2741', 10);
    var W = 1400, H = 500, r = prng(seed), y = -20;
    el.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    el.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    while (y < H + 20) {
      var f1 = .0009 + r() * .0015, f2 = .0025 + r() * .0038, f3 = .007 + r() * .005;
      var a1 = 8 + r() * 16, a2 = a1 * (.2 + r() * .2), a3 = a1 * .07;
      var p1 = r() * 6.28, p2 = r() * 6.28, p3 = r() * 6.28;
      var sw = bold ? (1.1 + r() * 1.2) : (.45 + r() * .72), op = opacity * (.5 + r() * .5), pts = [];
      for (var x = -10; x <= W + 10; x += 6) {
        var dy = Math.sin(x * f1 + p1) * a1 + Math.sin(x * f2 + p2) * a2 + Math.sin(x * f3 + p3) * a3;
        pts.push(x + ',' + (y + dy).toFixed(1));
      }
      var ln = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      ln.setAttribute('points', pts.join(' '));
      ln.setAttribute('stroke', color);
      ln.setAttribute('stroke-opacity', op.toFixed(3));
      ln.setAttribute('stroke-width', sw.toFixed(2));
      ln.setAttribute('fill', 'none');
      el.appendChild(ln);
      y += 18 + r() * 28;
    }
  }

  function init() {
    wireLinks();
    wirePlanPicker();
    document.querySelectorAll('svg.topo[data-seed]').forEach(buildTopo);
  }
  window.SF = { wireLinks: wireLinks };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
