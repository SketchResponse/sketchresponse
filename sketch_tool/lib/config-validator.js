import validator from 'is-my-json-valid';
import deepCopy from 'sketch2/util/deep-copy';
import deepExtend from 'deep-extend';

// Schemas
let tag = {
  type: 'object',
  properties: {
    value:   {type: 'string'},
    latex:   {type: 'boolean'},
    xoffset: {type: 'integer'},
    yoffset: {type: 'integer'},
    align: {
      type: 'string',
      enum: ['start', 'middle', 'end']
    }
  },
  additionalProperties: false
};

let arrowTag = deepCopy(tag);
arrowTag.properties.position = {
  type: 'string',
  enum: ['start', 'middle', 'end']
};

let dashStyle = {
  type: 'string',
  enum: ['dashed', 'longdashed', 'dotted', 'dashdotted', 'solid']
}

let coords = {
  type: 'array',
  minItems: 2,
  maxItems: 2,
  items: [
    {type: 'number'},
    {type: 'number'}
  ]
};

let main = {
  type: 'object',
  properties: {
    debug:  {type: 'boolean'},
    width:  {type: 'integer'},
    height: {type: 'integer'},
    xrange: coords,
    yrange: coords,
    xscale: {
      type: 'string',
      enum: ['linear']
    },
    yscale: {
      type: 'string',
      enum: ['linear']
    },
    coordinates: {
      type: 'string',
      enum: ['cartesian', 'polar']
    },
    plugins: {type: 'array'}
  },
  required: ['width', 'height', 'xrange', 'yrange', 'xscale', 'yscale', 'coordinates', 'plugins'],
  additionalProperties: false
};

let axes = {
  type: 'object',
  properties: {
    name:       {type: 'string'},
    xmajor:     {type: 'number'},
    ymajor:     {type: 'number'},
    xminor:     {type: 'number'},
    yminor:     {type: 'number'},
    xlabels:    {type: 'number'},
    ylabels:    {type: 'number'},
    major:      {type: 'number'},
    minor:      {type: 'number'},
    labels:     {type: 'number'},
    rrange:     {type: 'number'},
    rmajor:     {type: 'number'},
    thetamajor: {type: 'number'},
    colors: {
      type: 'object',
      properties: {
        // Cartesian coordinates
        xmajor:     {type: 'string'},
        ymajor:     {type: 'string'},
        xminor:     {type: 'string'},
        yminor:     {type: 'string'},
        xaxis:      {type: 'string'},
        yaxis:      {type: 'string'},
        xlabels:     {type: 'string'},
        ylabels:     {type: 'string'},
        zeroLabel:  {type: 'string'},
        // Polar coordinates
        circle:     {type: 'string'},
        ray:        {type: 'string'},
        // Both
        xaxisLabel: {type: 'string'},
        yaxisLabel: {type: 'string'}
      },
      additionalProperties: false
    },
    fontSize: {
      type: 'object',
      properties: {
        // Cartesian coordinates
        xlabels:     {type: 'integer'},
        ylabels:     {type: 'integer'},
        zeroLabel:  {type: 'integer'},
        // Both
        xaxisLabel: {type: 'integer'},
        yaxisLabel: {type: 'integer'}
      }
    },
    strokeWidth: {
      type: 'object',
      properties: {
        // Cartesian coordinates
        xmajor: {type: 'integer'},
        ymajor: {type: 'integer'},
        xminor: {type: 'integer'},
        yminor: {type: 'integer'},
        xaxis:  {type: 'integer'},
        yaxis:  {type: 'integer'},
        // Polar coordinates
        circle: {type: 'integer'},
        ray:    {type: 'integer'}
      }
    },
    xaxisLabel: {
      type: 'object',
      properties: {
        value: {type: 'string'},
        dx:    {type: 'integer'},
        dy:    {type: 'integer'}
      }
    },
    yaxisLabel: {
      type: 'object',
      properties: {
        value: {type: 'string'},
        dx:    {type: 'integer'},
        dy:    {type: 'integer'}
      }
    }
  },
  additionalProperties: false
};

let baseRequired = ['name', 'id'];

let basePlugin = {
  type: 'object',
  properties: {
    name:     {type: 'string'},
    id:       {type: 'string'},
    label:    {type: 'string'},
    color:    {type: 'string'},
    readonly: {type: 'boolean'},
    tag:      tag
  },
  required: baseRequired,
  additionalProperties: false
};

let freeform = deepCopy(basePlugin);

let horizontalLine = deepCopy(basePlugin);
deepExtend(horizontalLine, {
  properties: {
    dashStyle: dashStyle
  },
  required: baseRequired,
  additionalProperties: false
});

let image = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      enum: ['image']
    },
    scale: {type: 'string'},
    align: {
      type: 'string',
      enum: ['top', 'left', 'bottom', 'right', '']
    },
    offset: coords,
    src: {type: 'string'}
  },
  required: ['name', 'src'],
  additionalProperties: false
};

let lineSegment = deepCopy(basePlugin);
deepExtend(lineSegment, {
  properties: {
    dashStyle: dashStyle,
    directionConstraint: {
      type: 'string',
      enum: ['horizontal', 'vertical']
    },
    lengthConstraint: {type: 'integer'},
    arrowHead: {
      type: 'object',
      properties: {
        length: {type: 'integer'},
        base: {type: 'integer'}
      },
      additionalProperties: false
    },
    tag: arrowTag
  },
  required: baseRequired,
  additionalProperties: false,
});

let point = deepCopy(basePlugin);
deepExtend(point, {
  properties: {
    size:   {type: 'integer'},
    hollow: {type: 'boolean'}
  },
  required: baseRequired,
  additionalProperties: false,
});

let polyline = deepCopy(basePlugin);
deepExtend(polyline, {
  properties: {
    fillColor: {type: 'string'},
    dashStyle: dashStyle,
    closed:    {type: 'boolean'},
    opacity:   {type: 'number'},
  },
  required: baseRequired,
  additionalProperties: false,
});

let spline = deepCopy(basePlugin);

let stamp = deepCopy(basePlugin);
deepExtend(stamp, {
  properties: {
    src:       {type: 'string'},
    iconSrc:   {type: 'string'},
    scale:     {type: 'number'},
    imgwidth:  {type: 'integer'},
    imgheight: {type: 'integer'}
  },
  required: baseRequired,
  additionalProperties: false,
});

let verticalLine = deepCopy(basePlugin);
deepExtend(verticalLine, {
  properties: {
    dashStyle: dashStyle
  },
  required: baseRequired,
  additionalProperties: false,
});

let schemas = {
  'main': main,
  'axes': axes,
  'freeform': freeform,
  'horizontal-line': horizontalLine,
  'image': image,
  'line-segment': lineSegment,
  'point': point,
  'polyline': polyline,
  'spline': spline,
  'stamp': stamp,
  'vertical-line': verticalLine
}

function validateParams(params, name) {
  let validateSchema = validator(schemas[name], {greedy: true, verbose: true}),
      valid = validateSchema(params),
      idStr = params.id ? ' id ' + `'${params.id}'` : '';
  console.log(`%c${name}${idStr}`, 'color: blue; font-weight: bold;');
  if (!valid) {
    let errors = validateSchema.errors;
    for (let error of errors) {
      if (error.message === 'has additional properties') {
        console.warn(`${error.value.replace('data', '')} is not a valid key`);
      }
      else {
        console.warn(`${error.field.replace('data', '')} ${error.message}`);
      }
    }
  }
  else {
    console.log('is valid');
  }
  return valid;
}

export function validate(params, name) {
  return validateParams(params, name);
}
