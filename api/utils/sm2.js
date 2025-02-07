function sm2Algorithm(card, rating) {
  let { easiness, interval, repetitions } = card;

  // Map 4-button rating to SM-2 quality scale
  const qualityMap = { 1: 0, 2: 2, 3: 3, 4: 5 };
  let quality = qualityMap[rating] ?? 3; // Default to 3 if something goes wrong

  // If recall is poor (quality < 3), reset repetitions and interval
  if (quality < 3) {
    repetitions = 0;
    interval = 1; // Immediate review
  } else {
    if (repetitions === 0) {
      interval = 1; // First review after 1 day
    } else if (repetitions === 1) {
      interval = 6; // Second review after 6 days
    } else {
      interval = Math.round(interval * easiness); // SM-2 interval calculation
    }
    repetitions += 1;
  }

  // Adjust easiness factor (EF) based on recall quality
  easiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // Ensure EF is at least 1.3
  if (easiness < 1.3) easiness = 1.3;

  // Calculate the next review date based on the interval
  const reviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

  return {
    easiness,
    interval,
    repetitions,
    reviewDate,
  };
}
