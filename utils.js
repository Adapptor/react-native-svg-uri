export const camelCase = value => value.replace(/-([a-z])/g, g => g[1].toUpperCase());

export const camelCaseNodeName = ({nodeName, nodeValue}) => ({nodeName: camelCase(nodeName), nodeValue});

export const removePixelsFromNodeValue = ({nodeName, nodeValue}) => ({nodeName, nodeValue: nodeValue.replace('px', '')});

const parseTransform = (txt) => {
    var transform = {};
    var matchTransforms = txt.match(/(\w+)\(([^,)]+),?([^)]+)?\)/gi);
    if (matchTransforms.length != 1) {
      console.log("unsupported: require one and only one operation in svg transform attribute: " + txt);
      return null;
    }
    for (var transform in matchTransforms) {
        var vals = matchTransforms[transform].match(/[\w\.\-]+/g);
        var transformName = vals.shift();
        switch (transformName) {
          case "translate":
            return { translateX: Number(vals[0]), translateY: Number(vals[1] || vals[0]) };
          case "scale":
            return { scaleX: Number(vals[0]), scaleY: Number(vals[1] || vals[0]) };
          case "rotate":
            return { rotate: vals[0] };
          default:
            console.log("unsupported transform type: " + transformName);
            return null;
        }
    }
    return null;
}

export const parseTransforms = ({nodeName, nodeValue}) => {
  if (nodeName === 'transform') {
    return {nodeName, nodeValue: parseTransform(nodeValue)};
  } else {
    return {nodeName, nodeValue};
  }
};

export const transformStyle = ({nodeName, nodeValue, fillProp}) => {
  if (nodeName === 'style') {
    return nodeValue.split(';')
      .reduce((acc, attribute) => {
        const [property, value] = attribute.split(':');
        if (property == "")
            return acc;
        else
            return {...acc, [camelCase(property)]: fillProp && property === 'fill' ? fillProp : value};
      }, {});
  }
  return null;
};

export const getEnabledAttributes = enabledAttributes => ({nodeName}) => enabledAttributes.includes(camelCase(nodeName));
