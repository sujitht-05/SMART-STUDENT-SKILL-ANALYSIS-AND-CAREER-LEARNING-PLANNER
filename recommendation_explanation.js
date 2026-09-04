/**
 * Smart Student Skill Analysis - Recommendation Explanation Module (recommendation_explanation.js)
 * Generates Explainable AI (XAI) rationale statements for skill recommendations, learning roadmaps, and pace adjustments.
 */

const RecommendationExplanationModule = {
  /**
   * Generates rationale for prioritizing a specific skill gap.
   * @param {Object} skillGap - Gap object containing skill name, gapValue, and urgency
   * @param {string} targetRoleTitle - Name of target role
   * @returns {Object} { title, text, impact }
   */
  explainSkillPriority(skillGap, targetRoleTitle = "Target Role") {
    if (!skillGap) return null;
    const impact = Math.round((skillGap.gapValue || 30) * 0.35);

    return {
      title: `Priority: ${skillGap.name}`,
      text: `Focusing on ${skillGap.name} is prioritized because it has a -${skillGap.gapValue}% gap against ${targetRoleTitle} standards.`,
      impact: `Increases readiness score by +${impact}%`
    };
  },

  /**
   * Generates rationale for weekly study pace timeline.
   * @param {number} weeklyHours - Hours committed per week
   * @param {number} readinessScore - Current match score %
   * @returns {Object} { title, text, estimatedMonths }
   */
  explainPaceSchedule(weeklyHours = 15, readinessScore = 50) {
    const remainingScore = Math.max(10, 100 - readinessScore);
    const estimatedMonths = Math.max(2, Math.round((remainingScore / 10) * (15 / weeklyHours)));
    const timeSavedWeeks = Math.round(weeklyHours * 0.35);

    return {
      title: "Schedule Rationale",
      text: `At ${weeklyHours} hrs/week, achieving target readiness will take ~${estimatedMonths} months. Adding 5 hrs/week saves ~${timeSavedWeeks} weeks.`,
      estimatedMonths
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RecommendationExplanationModule;
}
