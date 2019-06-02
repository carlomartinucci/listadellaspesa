// https://github.com/yury-dymov/redux-object

// Immutable helpers

function isImmutable(object) {
  return !!(
    object &&
    typeof object.hasOwnProperty === "function" &&
    (object.hasOwnProperty("__ownerID") || // eslint-disable-line
      (object._map && object._map.hasOwnProperty("__ownerID")))
  ); // eslint-disable-line
}

function getProperty(object, property, toJS = false) {
  if (!Array.isArray(property)) {
    property = [property];
  }
  if (isImmutable(object)) {
    const res = object.getIn(property.map(p => `${p}`)); // Immutable maps cast keys to strings
    return toJS && res ? res.toJS() : res;
  }
  return property.reduce((previous, current) => previous[current], object);
}

function getKeys(object) {
  return isImmutable(object) ? object.keySeq().toArray() : Object.keys(object);
}

// build helpers

function uniqueId(objectName, id) {
  if (!id) {
    return null;
  }

  return `${objectName}${id}`;
}

function buildRelationship(reducer, target, relationship, options, cache) {
  const { ignoreLinks } = options;
  const rel = target.relationships[relationship];

  if (typeof rel.data !== "undefined") {
    if (Array.isArray(rel.data)) {
      return rel.data.map(
        child => build(reducer, child.type, child.id, options, cache) || child
      );
    }

    if (rel.data === null) {
      return null;
    }

    return (
      build(reducer, rel.data.type, rel.data.id, options, cache) || rel.data
    );
  }

  if (!ignoreLinks && rel.links) {
    throw new Error(
      "Remote lazy loading is not supported (see: https://github.com/yury-dymov/json-api-normalizer/issues/2). To disable this error, include option 'ignoreLinks: true' in the build function like so: build(reducer, type, id, { ignoreLinks: true })"
    );
  }

  return undefined;
}

export default function build(
  reducer,
  objectName,
  id = null,
  providedOpts = {},
  cache = {}
) {
  const defOpts = { eager: false, ignoreLinks: false, includeType: false };
  const options = Object.assign({}, defOpts, providedOpts);
  const { eager, includeType } = options;

  if (!getProperty(reducer, objectName)) {
    return null;
  }

  if (id === null || Array.isArray(id)) {
    const idList = id || getKeys(getProperty(reducer, objectName));

    return idList.map(e => build(reducer, objectName, e, options, cache));
  }

  const ids = id.toString();
  const uuid = uniqueId(objectName, ids);
  const cachedObject = cache[uuid];

  if (cachedObject) {
    return cachedObject;
  }

  const ret = {};
  const target = getProperty(reducer, [objectName, ids], true);

  if (!target) {
    return null;
  }

  if (target.id) {
    ret.id = target.id;
  }

  if (target.attributes) {
    Object.keys(target.attributes).forEach(key => {
      ret[key] = target.attributes[key];
    });
  }

  if (target.meta) {
    ret.meta = target.meta;
  }

  if (target.links) {
    ret.links = target.links;
  }

  if (includeType && !ret.type) {
    ret.type = objectName;
  }

  cache[uuid] = ret;

  if (target.relationships) {
    Object.keys(target.relationships).forEach(relationship => {
      if (eager) {
        ret[relationship] = buildRelationship(
          reducer,
          target,
          relationship,
          options,
          cache
        );
      } else {
        Object.defineProperty(ret, relationship, {
          enumerable: true,
          get: () => {
            const field = `__${relationship}`;

            if (ret[field]) {
              return ret[field];
            }

            const value = buildRelationship(
              reducer,
              target,
              relationship,
              options,
              cache
            );
            Object.defineProperty(ret, field, { enumerable: false, value });

            return ret[field];
          }
        });
      }
    });
  }

  if (typeof ret.id === "undefined") {
    ret.id = ids;
  }

  return ret;
}
