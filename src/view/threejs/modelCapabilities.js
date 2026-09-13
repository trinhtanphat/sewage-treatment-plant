export const originalSentinelNames = [
  '建筑物坐标',
  '南北生物池水面',
  '东西生物池-东水面1',
  '3DXY_geometry_002001',
  '3DXY_geometry_002002',
  '松树坐标',
  '东加药管2-2',
];

const semanticFeatures = [
  'water',
  'fence',
  'plants',
  'poolMaterial',
  'craft',
  'inspection',
];

export function findModelObject(model, name) {
  if (!model || typeof model.getObjectByName !== 'function') return null;
  return model.getObjectByName(name) ?? null;
}

export function detectModelCapabilities(model) {
  const semantic = originalSentinelNames.every((name) => findModelObject(model, name));
  return {
    kind: semantic ? 'original' : 'generic',
    semantic,
    features: { render: true, ...Object.fromEntries(semanticFeatures.map((name) => [name, semantic])) },
  };
}

export function supportsModelFeature(capabilities, feature) {
  if (!capabilities) return false;
  return capabilities.features?.[feature] === true;
}