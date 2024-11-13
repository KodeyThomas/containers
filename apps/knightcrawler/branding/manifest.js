import { MochOptions } from '../moch/moch.js';
import { showDebridCatalog } from '../moch/options.js';
import { Type } from './types.js';

const CatalogMochs = Object.values(MochOptions).filter(moch => moch.catalog);

export function manifest(config = {}) {
  return {
    id: `knightcrawler.kodebase.sh`,
    version: '2.0.26',
    name: getName(config),
    backgroundCredit: 'https://unsplash.com/photos/red-cinema-chair-evlkOfkQ5rE',
    description: getDescription(config),
    descriptionHTML: getDescriptionHTML(config),
    catalogs: getCatalogs(config),
    resources: getResources(config),
    types: [Type.MOVIE, Type.SERIES, Type.ANIME, Type.OTHER],
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg',
    background: 'https://unsplash.com/photos/evlkOfkQ5rE/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8Y2luZW1hfGVufDB8fHx8MTcxMzc5NDg2OHww&force=true&w=1920',
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    }
  };
}

export function dummyManifest() {
  const manifestDefault = manifest();
  manifestDefault.catalogs = [{ id: 'dummy', type: Type.OTHER }];
  manifestDefault.resources = ['stream', 'meta'];
  return manifestDefault;
}

function getName(config) {
  const rootName = 'KnightCrawler';
  const mochSuffix = Object.values(MochOptions)
      .filter(moch => config[moch.key])
      .map(moch => moch.shortName)
      .join('/');
  return [rootName, mochSuffix, 'kodebase'].filter(v => v).join(' | ');
}

function getDescription(config) {
  return `KnightCrawler: torrent streams provided by popular trackers and DMM hashes`;
}

function getDescriptionHTML(config) {
  return `beep boop, knightcrawler`
}

function getCatalogs(config) {
  return CatalogMochs
      .filter(moch => showDebridCatalog(config) && config[moch.key])
      .map(moch => ({
        id: `knightcrawler-${moch.key}`,
        name: `${moch.name}`,
        type: 'other',
        extra: [{ name: 'skip' }],
      }));
}

function getResources(config) {
  const streamResource = {
    name: 'stream',
    types: [Type.MOVIE, Type.SERIES],
    idPrefixes: ['tt', 'kitsu']
  };
  const metaResource = {
    name: 'meta',
    types: [Type.OTHER],
    idPrefixes: CatalogMochs.filter(moch => config[moch.key]).map(moch => moch.key)
  };
  if (showDebridCatalog(config) && CatalogMochs.filter(moch => config[moch.key]).length) {
    return [streamResource, metaResource];
  }
  return [streamResource];
}