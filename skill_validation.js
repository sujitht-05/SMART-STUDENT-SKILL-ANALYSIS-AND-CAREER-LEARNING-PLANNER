/**
 * Smart Student Skill Analysis - Skill Validation Module (skill_validation.js)
 * Validates self-reported student skill scores against verification benchmarks, confidence multipliers, and proof requirements.
 */

const SkillValidationModule = {
  tiers: {
    expert: { min: 90, max: 100, name: "Expert", multiplier: 1.0, proof: "Live Hosted URL & Verified Industry Cert" },
    advanced: { min: 75, max: 89, name: "Advanced", multiplier: 0.95, proof: "Capstone GitHub Project & >85% Unit Test Coverage" },
    intermediate: { min: 40, max: 74, name: "Intermediate", multiplier: 0.90, proof: "Hands-on Practical Challenge / Mini-Project" },
    beginner: { min: 0, max: 39, name: "Beginner", multiplier: 0.80, proof: "Basic Concept Multiple-Choice Quiz (70% pass)" }
  },

  /**
   * Validates a self-reported skill score.
   * @param {string} skillId - Skill identifier
   * @param {number} reportedScore - User score (0-100)
   * @returns {Object} Validation result
   */
  validate(skillId, reportedScore = 0) {
    const score = Math.max(0, Math.min(100, reportedScore));
    let tierKey = "beginner";
    if (score >= 90) tierKey = "expert";
    else if (score >= 75) tierKey = "advanced";
    else if (score >= 40) tierKey = "intermediate";

    const tier = this.tiers[tierKey];
    const adjustedScore = Math.round(score * tier.multiplier);

    return {
      skillId,
      reportedScore: score,
      adjustedScore,
      tierName: tier.name,
      confidenceMultiplier: tier.multiplier,
      proofRequired: tier.proof,
      isVerified: score >= 40 // intermediate and above require project/cert proof
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SkillValidationModule;
}
