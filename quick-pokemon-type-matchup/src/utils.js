import {
  NOT_VERY_EFFECTIVE_MULTIPLIER,
  NO_EFFECT_MULTIPLIER,
  SUPER_EFFECTIVE_MULTIPLIER,
} from './constants';

export function calculateDamageMultiplier(moveType, targetTypes) {
  let multiplier = 1;
  for (const type of targetTypes) {
    if (type.superEffective.includes(moveType.name)) {
      multiplier *= SUPER_EFFECTIVE_MULTIPLIER;
    } else if (type.notVeryEffective.includes(moveType.name)) {
      multiplier *= NOT_VERY_EFFECTIVE_MULTIPLIER;
    } else if (type.noEffect.includes(moveType.name)) {
      multiplier *= NO_EFFECT_MULTIPLIER;
    }
  }
  return multiplier;
}
