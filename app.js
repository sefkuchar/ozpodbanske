/**
 * Jednoduchý markdown → HTML prevod
 * (stačí pre odseky, riadky a zvýraznenie)
 */
function mdToHtml(md) {
  return md
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

async function loadJSON(path) {
  const res = await fetch(path);
  return await res.json();
}

/**
 * AKTIVITY
 */
async function renderActivities() {
  try {
    const data = await loadJSON('/content/activities.json');
    const grid = document.getElementById('activitiesGrid');

    grid.innerHTML = data.items.map(item => `
      <div class="activity-card">
        ${item.image ? `<img src="${item.image}" class="activity-image">` : ''}
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        <div class="activity-body">
          ${mdToHtml(item.body || '')}
        </div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Chyba načítania aktivít', e);
  }
}

/**
 * GENERICKÁ FUNKCIA PRE OSTATNÉ SEKIE
 */
async function renderSection(jsonPath, containerId) {
  try {
    const data = await loadJSON(jsonPath);
    const el = document.getElementById(containerId);

    el.innerHTML = data.items.map(item => `
      <article class="content-block">
        <h3>${item.title}</h3>
        <div>${mdToHtml(item.body || '')}</div>
      </article>
    `).join('');
  } catch (e) {
    console.error('Chyba načítania sekcie', jsonPath, e);
  }
}

// Spustenie po načítaní stránky
document.addEventListener('DOMContentLoaded', () => {
  renderActivities();
  renderSection('/content/history.json', 'historyContent');
  renderSection('/content/nature.json', 'natureContent');
  renderSection('/content/rules.json', 'rulesContent');
  renderSection('/content/magic.json', 'magicContent');
});

const form = document.querySelector('form');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    await fetch('/', {
      method: 'POST',
      body: data
    });

    form.innerHTML = `
      <div class="success-message">
        Ďakujeme za správu. Ozveme sa čo najskôr.
      </div>
    `;
  });
}
