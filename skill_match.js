/**
 * Smart Student Skill Analysis - Skill Match & Gap Analysis Engine
 * Modular logic for skill scoring, readiness levels, job eligibility, and roadmap distribution.
 */

const SkillMatchEngine = {
  /**
   * Calculates overall career readiness match score and categorizes skill gaps.
   * @param {Object} userProficiencies - Key-value map of skill IDs to student's 0-100 score.
   * @param {Array} targetSkills - Array of skill benchmark objects from CAREER_DATA.
   * @returns {Object} { matchPercent, readinessLevel, gaps, masteredCount, totalSkills }
   */
  calculateMatchScore(userProficiencies = {}, targetSkills = []) {
    if (!targetSkills || targetSkills.length === 0) {
      return { matchPercent: 0, readinessLevel: "Unknown", gaps: [], masteredCount: 0, totalSkills: 0 };
    }

    let totalWeight = 0;
    let weightedScore = 0;
    let masteredCount = 0;
    const gaps = [];

    targetSkills.forEach(skill => {
      const userLevel = userProficiencies[skill.id] !== undefined ? userProficiencies[skill.id] : 0;
      const targetLevel = skill.requiredLevel || 80;
      const gapValue = Math.max(0, targetLevel - userLevel);

      // Weight multiplier based on skill importance
      let weightMultiplier = 1.0;
      if (skill.importance === "Critical") weightMultiplier = 1.5;
      else if (skill.importance === "High") weightMultiplier = 1.2;

      totalWeight += targetLevel * weightMultiplier;
      weightedScore += Math.min(userLevel, targetLevel) * weightMultiplier;

      // Determine gap urgency
      let urgency = "medium";
      if (gapValue <= 0) {
        urgency = "mastered";
        masteredCount++;
      } else if (gapValue >= 35 && skill.importance === "Critical") {
        urgency = "critical";
      } else if (gapValue >= 25 || skill.importance === "High") {
        urgency = "high";
      }

      gaps.push({
        ...skill,
        userLevel,
        targetLevel,
        gapValue,
        urgency
      });
    });

    const matchPercent = Math.round((weightedScore / totalWeight) * 100);

    // Determine readiness level
    let readinessLevel = "Foundational";
    if (matchPercent >= 80) readinessLevel = "Job Ready";
    else if (matchPercent >= 55) readinessLevel = "Intermediate";

    // Sort gaps by gap value descending
    gaps.sort((a, b) => b.gapValue - a.gapValue);

    return {
      matchPercent,
      readinessLevel,
      gaps,
      masteredCount,
      totalSkills: targetSkills.length
    };
  },

  /**
   * Evaluates if a student matches a specific job posting threshold.
   * @param {number} studentMatchPercent - Student's match percentage.
   * @param {number} jobMatchThreshold - Required match threshold from job_data.json.
   * @returns {Object} { isEligible, delta, statusBadge }
   */
  evaluateJobEligibility(studentMatchPercent, jobMatchThreshold = 60) {
    const isEligible = studentMatchPercent >= jobMatchThreshold;
    const delta = studentMatchPercent - jobMatchThreshold;

    return {
      isEligible,
      delta,
      statusBadge: isEligible 
        ? { text: "⚡ Ready to Apply", color: "var(--success)" }
        : { text: `Needs +${Math.abs(delta)}% Match`, color: "var(--warning)" }
    };
  },

  /**
   * Groups gaps into 4 chronological learning phases.
   * @param {Array} gaps - List of skill gaps.
   * @param {number} weeklyHours - Student's weekly study commitment.
   * @returns {Array} List of phase objects with time estimates and assigned skills.
   */
  generatePhasedRoadmap(gaps = [], weeklyHours = 15) {
    const missingGaps = gaps.filter(g => g.gapValue > 0);
    const hourFactor = Math.max(0.5, 15 / (weeklyHours || 15));

    const phase1Skills = missingGaps.filter(g => g.category === 'core' && (g.urgency === 'critical' || g.urgency === 'high'));
    const phase2Skills = missingGaps.filter(g => g.category === 'tools' && g.gapValue > 15);
    const phase3Skills = missingGaps.filter(g => g.category === 'core' && (g.urgency === 'medium' || g.gapValue <= 25));
    const phase4Skills = missingGaps.filter(g => g.category === 'soft' || g.gapValue <= 15);

    const estP1Hours = Math.round(30 * hourFactor);
    const estP2Hours = Math.round(35 * hourFactor);

    return [
      {
        id: "phase1",
        title: "Phase 1: Foundational Mastery",
        time: `Months 1-2 (~${estP1Hours} Study Hours)`,
        description: "Focus on core algorithms, primary programming languages, and statistical foundations.",
        skills: phase1Skills.length ? phase1Skills : missingGaps.slice(0, 2)
      },
      {
        id: "phase2",
        title: "Phase 2: Developer Tools & Frameworks",
        time: `Months 3-4 (~${estP2Hours} Study Hours)`,
        description: "Master modern frameworks, version control, API integrations, and developer tooling.",
        skills: phase2Skills.length ? phase2Skills : missingGaps.slice(2, 4)
      },
      {
        id: "phase3",
        title: "Phase 3: Advanced Portfolio Projects & Certs",
        time: "Months 5-6",
        description: "Construct end-to-end projects, gain practical experience, and study for industry certifications.",
        skills: phase3Skills.length ? phase3Skills : missingGaps.slice(4, 6)
      },
      {
        id: "phase4",
        title: "Phase 4: Capstone & Career Placement",
        time: "Month 7+",
        description: "Prepare STAR interview responses, polish resume, and practice coding challenges.",
        skills: phase4Skills.length ? phase4Skills : missingGaps.slice(6)
      }
    ];
  }
};

// Export for module environments if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillMatchEngine;
}
