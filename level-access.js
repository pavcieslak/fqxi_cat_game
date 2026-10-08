const COMPLETED_LEVELS_KEY = "maxwell-cat-completed-levels";
const ORIGINAL_LEVELS_KEY = "maxwell-cat-dev-original-levels";
const HAS_ORIGINAL_LEVELS_KEY = "maxwell-cat-dev-has-original-levels";
const unlockAllLevels = document.currentScript?.dataset.unlockAllLevels === "true";

if (unlockAllLevels) {
  if (localStorage.getItem(HAS_ORIGINAL_LEVELS_KEY) !== "true") {
    const originalLevels = localStorage.getItem(COMPLETED_LEVELS_KEY);
    if (originalLevels === null) {
      localStorage.removeItem(ORIGINAL_LEVELS_KEY);
    } else {
      localStorage.setItem(ORIGINAL_LEVELS_KEY, originalLevels);
    }
    localStorage.setItem(HAS_ORIGINAL_LEVELS_KEY, "true");
  }

  localStorage.setItem(COMPLETED_LEVELS_KEY, JSON.stringify([1, 2, 3]));
} else if (localStorage.getItem(HAS_ORIGINAL_LEVELS_KEY) === "true") {
  const originalLevels = localStorage.getItem(ORIGINAL_LEVELS_KEY);
  if (originalLevels === null) {
    localStorage.removeItem(COMPLETED_LEVELS_KEY);
  } else {
    localStorage.setItem(COMPLETED_LEVELS_KEY, originalLevels);
  }
  localStorage.removeItem(ORIGINAL_LEVELS_KEY);
  localStorage.removeItem(HAS_ORIGINAL_LEVELS_KEY);
}
