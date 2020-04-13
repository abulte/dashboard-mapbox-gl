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
    ['*', ['sqrt', ['number', ['get', 'montantMillions']]], 8],
    0, 10,
    100, 70
  ]
}

// switch between facts on region / departement level
const ZOOM_THRESHOLD = 6

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
    paint: circlePaintAides,
    maxzoom: ZOOM_THRESHOLD
  },
  regionsAidesMontants: {
    id: 'regions-aides-montants',
    type: 'symbol',
    source: 'regions-aides',
    layout: {
      'text-field': '{montantMillions} M€',
      'text-size': 14
    },
    maxzoom: ZOOM_THRESHOLD
  },
  departements: {
    id: 'departements-fill',
    type: 'fill',
    source: 'departements',
    paint: fillPaint,
    minzoom: ZOOM_THRESHOLD
  },
  departementsLines: {
    id: 'departements-lines',
    type: 'line',
    source: 'departements',
    layout: {},
    paint: {
      'line-color': '#627BC1',
      'line-width': 1
    },
    minzoom: ZOOM_THRESHOLD
  },
  departementsAides: {
    id: 'departements-aides',
    type: 'circle',
    source: 'departements-aides',
    paint: circlePaintAides,
    minzoom: ZOOM_THRESHOLD
  },
  departementsAidesMontants: {
    id: 'departements-aides-montants',
    type: 'symbol',
    source: 'departements-aides',
    layout: {
      'text-field': '{montantMillions} M€',
      'text-size': 14
    },
    minzoom: ZOOM_THRESHOLD
  }
}
