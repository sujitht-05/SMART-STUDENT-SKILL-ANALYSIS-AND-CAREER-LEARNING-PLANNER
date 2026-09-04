/**
 * Smart Student Skill Analysis - Adaptive Learning Engine (adaptive_learning.js)
 * Implements dynamic learning pace adaptation, prerequisite dependency resolution,
 * milestone schedule recalculation, and Explainable AI (XAI) rationale synthesis.
 */

const AdaptiveLearningEngine = {
  /**
   * Calculates adaptive study pace metrics based on student availability and current readiness.
   * @param {number} weeklyHours - Hours committed per week (e.g., 10, 15, 20, 30)
   * @param {number} currentMatchScore - Current career readiness percentage (0-100)
   * @param {number} totalGapsCount - Total number of unmastered skills
   * @returns {Object} { velocityIndex, targetMonths, recommendedHours, timeSavedWeeks }
   */
  calculateAdaptivePace(weeklyHours = 15, currentMatchScore = 50, totalGapsCount = 5) {
    const remainingScore = Math.max(5, 100 - currentMatchScore);
    const basePaceFactor = 15 / (weeklyHours || 15);

    // Estimate months to achieve >80% job readiness
    const targetMonths = Math.max(1.5, Math.round((remainingScore / 8) * basePaceFactor * 10) / 10);
    const velocityIndex = Math.round((weeklyHours / 15) * 100);
    
    // Time saved calculation relative to baseline 10 hrs/week
    const baselineMonths = (remainingScore / 8) * (15 / 10);
    const timeSavedWeeks = Math.max(0, Math.round((baselineMonths - targetMonths) * 4.33));

    let pacingLabel = "Optimal Pace";
    if (weeklyHours >= 25) pacingLabel = "Accelerated Sprint";
    else if (weeklyHours <= 10) pacingLabel = "Steady Slow Pace";

    return {
      weeklyHours,
      currentMatchScore,
      targetMonths,
      velocityIndex,
      timeSavedWeeks,
      pacingLabel,
      recommendedHoursPerPhase: Math.round(weeklyHours * 4)
    };
  },

  /**
   * Evaluates prerequisite readiness before tackling an advanced skill.
   * @param {Object} skill - Target skill object
   * @param {Object} userProficiencies - Key-value map of user skill levels
   * @returns {Object} { isPrereqMet, missingPrereqs }
   */
  evaluatePrerequisites(skill, userProficiencies = {}) {
    if (!skill || !skill.prerequisites || !skill.prerequisites.length) {
      return { isPrereqMet: true, missingPrereqs: [] };
    }

    const missingPrereqs = skill.prerequisites.filter(reqId => {
      const level = userProficiencies[reqId] !== undefined ? userProficiencies[reqId] : 0;
      return level < 60; // 60% threshold for prerequisite proficiency
    });

    return {
      isPrereqMet: missingPrereqs.length === 0,
      missingPrereqs
    };
  },

  /**
   * Synthesizes explainable recommendations by combining validation rules and XAI templates.
   * @param {Array} gaps - List of identified skill gaps
   * @param {string} targetRoleTitle - Name of target career track
   * @param {number} weeklyHours - Weekly study commitment
   * @returns {Array} List of recommendation cards with explanations and validation badges
   */
  generateRecommendations(gaps = [], targetRoleTitle = "Target Role", weeklyHours = 15) {
    const recommendations = [];

    if (!gaps || !gaps.length) {
      return [{
        title: "All Benchmarks Met!",
        type: "success",
        text: `You have met or exceeded all target skill levels for <strong>${targetRoleTitle}</strong>. Focus on mock interviews and active job applications.`
      }];
    }

    // 1. Top Critical Gap Recommendation
    const topGap = gaps[0];
    const topValidation = typeof SkillValidationModule !== 'undefined' 
      ? SkillValidationModule.validate(topGap.id, topGap.userLevel)
      : { tierName: "Beginner", proofRequired: "Concept Quiz" };

    const topExplanation = typeof RecommendationExplanationModule !== 'undefined'
      ? RecommendationExplanationModule.explainSkillPriority(topGap, targetRoleTitle)
      : { text: `Focusing on ${topGap.name} is recommended because of your -${topGap.gapValue}% gap.` };

    recommendations.push({
      title: `Priority Focus: ${topGap.name}`,
      type: "priority",
      icon: "fa-fire",
      skillId: topGap.id,
      gapValue: topGap.gapValue,
      explanation: topExplanation.text,
      validationTier: topValidation.tierName,
      proofRequired: topValidation.proofRequired
    });

    // 2. Pace & Schedule Recommendation
    const paceInfo = this.calculateAdaptivePace(weeklyHours, 50, gaps.length);
    recommendations.push({
      title: `Learning Schedule: ${paceInfo.pacingLabel}`,
      type: "schedule",
      icon: "fa-clock",
      text: `At <strong>${weeklyHours} hrs/week</strong>, you are projected to reach job readiness in <strong>${paceInfo.targetMonths} months</strong>. ${paceInfo.timeSavedWeeks > 0 ? `You save approx <strong>${paceInfo.timeSavedWeeks} weeks</strong> compared to minimum study rates.` : ''}`
    });

    return recommendations;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AdaptiveLearningEngine;
}
