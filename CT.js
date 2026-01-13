/*************************************************
 * Add dynamic property row (used everywhere)
 *************************************************/
function addProp() {
  const container = document.getElementById('props');
  if (!container) return;

  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr 1fr 1fr';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';

  row.innerHTML = `
    <input placeholder="Key" />
    <input placeholder="Value" />
    <select>
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
    </select>
  `;

  container.appendChild(row);
}

/*************************************************
 * Collect dynamic properties
 *************************************************/
function collectProps() {
  const props = {};

  document.querySelectorAll('#props > div').forEach(row => {
    const key = row.children[0].value.trim();
    let value = row.children[1].value;
    const type = row.children[2].value;

    if (!key) return;

    if (type === 'number') value = Number(value);
    if (type === 'boolean') value = value === 'true';

    props[key] = value;
  });

  console.log('📦 Collected properties:', props);
  return props;
}

/*************************************************
 * 🔥 EVENT — works pre-login & post-login
 *************************************************/
function sendEvent() {
  if (!window.analytics || !analytics.track) {
    alert('Segment not loaded');
    return;
  }

  const eventName = document.getElementById('eventName')?.value?.trim();
  if (!eventName) {
    alert('Event name is required');
    return;
  }

  const properties = collectProps();

  console.log('⚡ Segment TRACK →', eventName, properties);
  analytics.track(eventName, properties);

  alert('Event sent via Segment');
}

/*************************************************
 * 👤 LOGIN — creates CleverTap user
 *************************************************/

function loginUser() {
  if (!window.analytics) {
    alert('Segment not initialized');
    return;
  }

  analytics.ready(() => {
    const userId = document.getElementById('identity')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const phone = document.getElementById('phone')?.value?.trim();

    if (!userId && !email && !phone) {
      alert('Provide at least one identity (ID / Email / Phone)');
      return;
    }

    const traits = {
      ...(email && { email }),
      ...(phone && { phone }),
      ...collectProps()
    };

    const resolvedUserId = userId || email || phone;

    console.log('👤 Segment IDENTIFY (login) →', resolvedUserId, traits);
    analytics.identify(resolvedUserId, traits);

    alert('Login successful — user identified');
  });
}

/*************************************************
 * 🧬 PROFILE PUSH — updates user in CT
 *************************************************/
function pushProfile() {
  if (!window.analytics || !analytics.identify) {
    alert('Segment not loaded');
    return;
  }

  const userId = document.getElementById('identity')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const phone = document.getElementById('phone')?.value?.trim();

  if (!userId && !email && !phone) {
    alert('Provide at least one identity (ID / Email / Phone)');
    return;
  }

  const traits = {
    ...(email && { email }),
    ...(phone && { phone }),
    ...collectProps()
  };

  const resolvedUserId = userId || email || phone;

  console.log('🧬 Segment IDENTIFY (profile) →', resolvedUserId, traits);
  analytics.identify(resolvedUserId, traits);

  alert('Profile updated in Segment & CleverTap');
}

/*************************************************
 * Expose globally (for inline HTML onclick)
 *************************************************/
window.addProp = addProp;
window.sendEvent = sendEvent;
window.loginUser = loginUser;
window.pushProfile = pushProfile;
