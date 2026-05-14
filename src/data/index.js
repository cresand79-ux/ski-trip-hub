export const trips = Object.entries(import.meta.glob('./*.json', { eager: true }))
  .map(([path, module]) => {
    const slug = path.replace(/^\.\//, '').replace(/\.json$/, '');
    const data = (module && module.default) ? module.default : module;
    const trip = data.trip || {};
    return {
      slug,
      status: (trip.status || 'active').toLowerCase(),
      ...trip,
      participants: data.participants || [],
    };
  })
  .sort((a, b) => {
    if (a.status === b.status) {
      return (a.year || 0) - (b.year || 0);
    }
    return a.status === 'active' ? -1 : 1;
  });
