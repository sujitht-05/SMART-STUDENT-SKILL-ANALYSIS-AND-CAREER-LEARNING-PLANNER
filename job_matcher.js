/**
 * Smart Student Skill Analysis - Job Matcher Module (job-matcher.js)
 * Fetches job_data.json, matches student readiness against active industry openings, and generates job cards.
 */

const JobMatcherModule = {
  cache: null,

  /**
   * Loads job_data.json asynchronously or returns cached instance.
   * @param {string} url - Path to job_data.json
   * @returns {Promise<Object>} Job dataset object
   */
  async loadJobs(url = 'job_data.json') {
    if (this.cache) return this.cache;
    try {
      const res = await fetch(url);
      if (res.ok) {
        this.cache = await res.json();
        return this.cache;
      }
    } catch (e) {
      console.warn("JobMatcherModule: Could not load job_data.json", e);
    }
    return null;
  },

  /**
   * Matches student readiness score against active job listings for a career track.
   * @param {string} trackId - Target career track ID (e.g., 'ai_ml', 'fullstack')
   * @param {number} studentMatchPercent - Student's overall match score
   * @param {Object} jobDataJson - Loaded job data object
   * @returns {Object} { trackTitle, activeJobs, eligibleCount, totalJobs }
   */
  matchTrackJobs(trackId, studentMatchPercent = 0, jobDataJson = null) {
    const data = jobDataJson || this.cache;
    if (!data || !data.careerTracks || !data.careerTracks[trackId]) {
      return { trackTitle: "", activeJobs: [], eligibleCount: 0, totalJobs: 0 };
    }

    const track = data.careerTracks[trackId];
    const jobs = track.activeJobs || [];

    let eligibleCount = 0;
    const evaluatedJobs = jobs.map(job => {
      const isEligible = studentMatchPercent >= job.matchThreshold;
      if (isEligible) eligibleCount++;
      const gapPercent = Math.max(0, job.matchThreshold - studentMatchPercent);

      return {
        ...job,
        isEligible,
        gapPercent
      };
    });

    return {
      trackTitle: track.title,
      activeJobs: evaluatedJobs,
      eligibleCount,
      totalJobs: jobs.length
    };
  },

  /**
   * Generates HTML markup for active job cards.
   * @param {Array} jobs - Evaluated job objects list
   * @param {number} studentMatchPercent - Current student score
   * @returns {string} HTML string
   */
  generateJobCardsHTML(jobs = [], studentMatchPercent = 0) {
    if (!jobs || !jobs.length) {
      return `<p style="color: var(--text-muted); padding: 1rem;">No active job postings currently available for this track.</p>`;
    }

    return jobs.map(job => {
      const isEligible = job.isEligible;
      const badgeStyle = isEligible 
        ? "background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4);" 
        : "background: rgba(245, 158, 11, 0.2); color: #fde047; border: 1px solid rgba(245, 158, 11, 0.4);";
      
      const badgeText = isEligible 
        ? "⚡ Ready to Apply" 
        : `Needs +${job.gapPercent}% Match`;

      return `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid ${isEligible ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-color)'}; border-radius: var(--radius-sm); padding: 1.1rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
          <div style="flex: 1; min-width: 250px;">
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 0.3rem;">
              <strong style="font-size: 1.05rem;">${job.title}</strong>
              <span style="font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.6rem; border-radius: var(--radius-full); ${badgeStyle}">
                ${badgeText}
              </span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1.25rem; flex-wrap: wrap;">
              <span><i class="fa-solid fa-building"></i> ${job.company}</span>
              <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
              <span><i class="fa-solid fa-money-check-dollar"></i> ${job.salary}</span>
              <span><i class="fa-solid fa-user-clock"></i> ${job.experience}</span>
            </div>
            <p style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.5rem;">${job.description}</p>
          </div>
          <div>
            <button class="btn ${isEligible ? 'btn-primary' : 'btn-secondary'}" onclick="alert('Saved opening: ${job.title} at ${job.company}')">
              <i class="fa-solid ${isEligible ? 'fa-paper-plane' : 'fa-bookmark'}"></i> ${isEligible ? 'Quick Apply' : 'Save Opening'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = JobMatcherModule;
}
