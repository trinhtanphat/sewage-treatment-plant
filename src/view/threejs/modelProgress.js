function getModelLoadPercent(loaded, total) {
  if (!Number.isFinite(loaded) || !Number.isFinite(total)) return null;
  if (loaded < 0 || total <= 0 || loaded > total) return null;
  return Math.min(99.9, (loaded / total) * 100);
}

export { getModelLoadPercent };
