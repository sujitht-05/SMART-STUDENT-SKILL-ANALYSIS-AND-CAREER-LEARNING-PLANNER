/**
 * Smart Student Skill Analysis - Skill Analysis Module (skill-analysis.js)
 * Dedicated calculations for skill gap analysis, category profiling, and visual radar polygon geometry.
 */

const SkillAnalysisModule = {
  /**
   * Performs deep skill analysis on student proficiencies against target role benchmarks.
   * @param {Object} userProficiencies - Key-value map { skillId: score }
   * @param {Array} targetSkills - List of skill benchmark objects from CAREER_DATA
   * @returns {Object} Comprehensive analysis result
   */
  analyze(userProficiencies = {}, targetSkills = []) {
    if (!targetSkills || !targetSkills.length) {
      return {
        overallScore: 0,
        readinessBadge: "Foundational",
        gaps: [],
        strengths: [],
        criticalGaps: [],
        categoryScores: { core: 0, tools: 0, soft: 0 }
      };
    }

    let totalWeight = 0;
    let weightedScore = 0;
    const gaps = [];
    const strengths = [];
    const criticalGaps = [];

    const categoryTotals = { core: { score: 0, weight: 0 }, tools: { score: 0, weight: 0 }, soft: { score: 0, weight: 0 } };

    targetSkills.forEach(skill => {
      const userLevel = userProficiencies[skill.id] !== undefined ? userProficiencies[skill.id] : 0;
      const targetLevel = skill.requiredLevel || 80;
      const gapValue = Math.max(0, targetLevel - userLevel);

      let weight = 1.0;
      if (skill.importance === "Critical") weight = 1.5;
      else if (skill.importance === "High") weight = 1.2;

      totalWeight += targetLevel * weight;
      weightedScore += Math.min(userLevel, targetLevel) * weight;

      // Track per category
      const cat = skill.category || 'core';
      if (!categoryTotals[cat]) categoryTotals[cat] = { score: 0, weight: 0 };
      categoryTotals[cat].score += Math.min(userLevel, targetLevel) * weight;
      categoryTotals[cat].weight += targetLevel * weight;

      let urgency = "medium";
      if (gapValue <= 0) {
        urgency = "mastered";
        strengths.push(skill);
      } else if (gapValue >= 35 && skill.importance === "Critical") {
        urgency = "critical";
        criticalGaps.push(skill);
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

    const overallScore = Math.round((weightedScore / totalWeight) * 100);

    // Readiness Badge
    let readinessBadge = "Foundational";
    let readinessColor = "var(--warning)";
    if (overallScore >= 80) {
      readinessBadge = "Job Ready";
      readinessColor = "var(--success)";
    } else if (overallScore >= 55) {
      readinessBadge = "Intermediate";
      readinessColor = "var(--primary)";
    }

    // Sort gaps by highest gap value
    gaps.sort((a, b) => b.gapValue - a.gapValue);

    // Calculate category percentages
    const categoryScores = {};
    Object.keys(categoryTotals).forEach(cat => {
      categoryScores[cat] = categoryTotals[cat].weight > 0 
        ? Math.round((categoryTotals[cat].score / categoryTotals[cat].weight) * 100)
        : 0;
    });

    return {
      overallScore,
      readinessBadge,
      readinessColor,
      gaps,
      strengths,
      criticalGaps,
      categoryScores,
      totalSkills: targetSkills.length
    };
  },

  /**
   * Calculates (x,y) vertex coordinates for rendering Canvas Radar polygons.
   * @param {Array} skills - Skill definitions array
   * @param {Object} userProficiencies - User scores
   * @param {number} radius - Canvas radar maximum radius
   * @param {number} centerX - Canvas center X
   * @param {number} centerY - Canvas center Y
   * @returns {Array} List of { x, y, skill, value } points
   */
  calculateRadarPolygon(skills = [], userProficiencies = {}, radius = 100, centerX = 150, centerY = 150) {
    const total = skills.length;
    if (!total) return [];

    const angleStep = (Math.PI * 2) / total;
    return skills.map((skill, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const userVal = userProficiencies[skill.id] !== undefined ? userProficiencies[skill.id] : 0;
      const r = radius * (userVal / 100);
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle),
        skill,
        value: userVal
      };
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillAnalysisModule;
}
