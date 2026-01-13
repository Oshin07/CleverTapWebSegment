/**
 * Add dynamic property row
 */
function addProp() {
  const container = document.getElementById('props');
  if (!container) return;

  const row = document.createElement('div');
  row.style.display = 'grid';
  row.style.gridTemplateColumns = '1fr 1fr 1fr';
  row.style.gap = '10px';
  row.style.marginBottom = '10px';

  row.innerHTML = `
    <input type="text" placeholder="Key"
      style="padding:10px; background:#0f172a; border:1px solid #475569; color:white;" />
    <input type="text" placeholder="Value"
      style="padding:10px; background:#0f172a; border:1px solid #475569; color:white;" />
    <select style="padding:10px; background:#0f172a; border:1px solid #475569; color:white;">
      <option value="string">String</option>
      <option value="number">Number</option>
      <option value="boolean">Boolean</option>
    </select>
  `;

  container.appendChild(row);
}

/**
 * Collect dynamic properties
 */
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

  console.log('Dynamic Event Properties:', props);
  return props;
}

/**
 * 🔥 Dynamic Segment Event
 */
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

  console.log('✅ Segment track →', eventName, properties);
  analytics.track(eventName, properties);

  alert('Dynamic event sent via Segment');
}
