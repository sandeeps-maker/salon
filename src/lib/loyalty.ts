export function calculateLoyaltyPointsEarned(spendAmount: number, pointsPer100: number = 5): number {
  if (spendAmount <= 0) return 0;
  return Math.floor((spendAmount / 100) * pointsPer100);
}

export function calculatePointsValue(points: number, pointValueInRupees: number = 0.5): number {
  return points * pointValueInRupees;
}
