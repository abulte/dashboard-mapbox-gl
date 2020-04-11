const fillPaint = {
  'fill-color': '#2a4ba9',
  'fill-outline-color': '#627BC1',
  'fill-opacity': ['case',
    ['boolean', ['feature-state', 'hover'], false],
    0.2,
    0
  ]
}

const circlePaintAides = {
  'circle-opacity': 0.6,
  'circle-color': '#8393A7',
  'circle-radius': [
    'interpolate', ['linear'],
    ['*', ['sqrt', ['number', ['get', 'montantMillions']]], 10],
    0, 10,
    100, 70
  ]
}

export const layers = {
  regions: {
    id: 'regions-fill',
    type: 'fill',
    source: 'regions',
    paint: fillPaint
  },
  regionsLines: {
    id: 'regions-lines',
    type: 'line',
    source: 'regions',
    paint: {
      'line-color': '#627BC1',
      'line-width': 1
    }
  },
  regionsAides: {
    id: 'regions-aides',
    type: 'circle',
    source: 'regions-aides',
    paint: circlePaintAides
  },
  regionsAidesMontants: {
    id: 'regions-aides-montants',
    type: 'symbol',
    source: 'regions-aides',
    layout: {
      'text-field': '{montantMillions} M€',
      'text-size': 14
    }
  },
  departements: {
    id: 'departements-fill',
    type: 'fill',
    source: 'departements',
    paint: fillPaint
  },
  departementsLines: {
    id: 'departements-lines',
    type: 'line',
    source: 'departements',
    layout: {},
    paint: {
      'line-color': '#627BC1',
      'line-width': 1
    }
  },
  departementsAides: {
    id: 'departements-aides',
    type: 'circle',
    source: 'departements-aides',
    layout: {
      visibility: 'none'
    },
    paint: circlePaintAides
  },
  departementsAidesMontants: {
    id: 'departements-aides-montants',
    type: 'symbol',
    source: 'departements-aides',
    layout: {
      'text-field': '{montantMillions} M€',
      'text-size': 14,
      visibility: 'none'
    }
  }
}
