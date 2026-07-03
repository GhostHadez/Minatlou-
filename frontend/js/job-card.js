/**
 * =============================================================
 * MINATLOU SECURITY & PROJECTS — JOB CARD RENDERER
 * =============================================================
 * Given a job object shaped like the /api/jobs response, returns
 * the HTML for one job card. Kept separate so the markup only
 * has to be right in one place.
 *
 * Expected job shape (adjust to match real API once connected):
 * {
 *   id, title, location, type, description,
 *   department, postedAt
 * }
 * =============================================================
 */

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

function renderJobCard(job) {
  return `
    <article class="job-card reveal">
      <div class="job-card-top">
        <h3>${job.title}</h3>
        <span class="job-badge">${job.type}</span>
      </div>
      <div class="job-meta">
        <span class="job-meta-item"><span class="ic">📍</span> ${job.location}</span>
        ${job.department ? `<span class="job-meta-item"><span class="ic">🏢</span> ${job.department}</span>` : ''}
      </div>
      <p class="desc">${job.description}</p>
      <div class="job-card-footer">
        <span class="job-posted">${timeAgo(job.postedAt)}</span>
        <a class="btn btn-primary" href="job-details.html?id=${encodeURIComponent(job.id)}">Apply Now</a>
      </div>
    </article>
  `;
}

window.renderJobCard = renderJobCard;
window.timeAgo = timeAgo;
