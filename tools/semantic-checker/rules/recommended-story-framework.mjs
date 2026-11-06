export const recommendedFrameworks = Object.freeze([
  'sb7',
  'freytag',
  'pixar',
  'hero_journey',
  'three_act',
]);

export default function checkRecommendedFramework(_model, subject) {
  const framework = subject?.data.narrative?.framework;
  if (typeof framework !== 'string') {
    return { ok: true };
  }
  return {
    ok: recommendedFrameworks.includes(framework),
    context: { value: framework },
  };
}
