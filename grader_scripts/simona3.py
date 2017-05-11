import sketchresponse
from grader_lib import GradeableFunction, LineSegment, PolyLine, Point, Polygon

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-0.5, 4],
    'yrange': [-0.5, 2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'b1', 'label': 'Bar1', 'closed': False, 'color': 'blue', 'readonly': True},
        {'name': 'polyline', 'id': 'b2', 'label': 'Bar2', 'closed': False, 'color': 'orange', 'readonly': True},
        {'name': 'polyline', 'id': 'b3', 'label': 'Bar3', 'closed': False, 'color': 'purple', 'readonly': True},
        {'name': 'stamp', 'id': 'lw', 'label': 'Left Wall', 'scale': 2.0, 'src': '/static/simona_stamps/left_wall.png', 'readonly': True},
        {'name': 'stamp', 'id': 'rw', 'label': 'Right Wall', 'scale': 2.0, 'src': '/static/simona_stamps/right_wall.png', 'readonly': True},
        {'name': 'polyline', 'id': 'blk', 'label': 'Block', 'closed': True, 'color': 'black', 'fillColor': 'gray', 'readonly': True},
        {'name': 'stamp', 'id': 'sl', 'label': 'Slider', 'scale': 1.25, 'src': '/static/simona_stamps/slider.png', 'readonly': True},
        {'name': 'line-segment', 'id': 'force', 'label': 'Force', 'color': 'red', 'dashStyle': 'solid', 'lengthContraint': 50, 'arrowHead': {'length': 10, 'base': 7}, 'readonly': True},
        {'name': 'stamp', 'id': 'plate', 'label': 'Plate', 'scale': 1.0, 'src': '/static/simona_stamps/plate.png', 'readonly': True},
        {'name': 'polyline', 'id': 'iso', 'label': 'Isolation bubble', 'closed': True, 'color': 'gray', 'fillColor': 'lightblue'},
    ],
    'initialstate': {
  "b1": [
    [
      {
        "y": 153,
        "x": 255
      },
      {
        "y": 153,
        "x": 532
      }
    ],
    []
  ],
  "b2": [
    [
      {
        "y": 218,
        "x": 255
      },
      {
        "y": 217,
        "x": 532
      }
    ],
    []
  ],
  "lw": [
    {
      "y": 168,
      "x": 248
    }
  ],
  "blk": [
    [
      {
        "y": 235,
        "x": 533
      },
      {
        "y": 235,
        "x": 634
      },
      {
        "y": 134,
        "x": 634
      },
      {
        "y": 134,
        "x": 532
      }
    ],
    []
  ],
  "sl": [
    {
      "y": 244,
      "x": 584
    }
  ],
  "force": [
    {
      "x": 581,
      "y": 184
    },
    {
      "x": 697,
      "y": 183
    }
  ]
}
})

@sketchresponse.grader
def grader(b1, b2, b3, lw, rw, blk, sl, force, plate, iso):

    bar1 = PolyLine.PolyLines(b1)
    bar2 = PolyLine.PolyLines(b2)
    bar3 = PolyLine.PolyLines(b3)
    block = Polygon.Polygons(blk)
    iso_bub = Polygon.Polygons(iso)

    block_poly = block.polygons[0]

    if not iso_bub.getPolygonCount() == 1:
        return False, "There should be one isolation bubble."

    iso_poly = iso_bub.polygons[0]

    bar1_line = bar1.getPolyLineAsSegments(0).segments[0]
    bar2_line = bar2.getPolyLineAsSegments(0).segments[0]

    if len(iso_bub.getIntersectionsWithPolygonBoundary(bar1_line,
                                                       iso_poly)) != 1:
        return False, "Iso bubble should cut the bars"

    if len(iso_bub.getIntersectionsWithPolygonBoundary(bar2_line,
                                                       iso_poly)) != 1:
        return False, "Iso bubble should cut the bars"

    if iso_bub.containsPolygon(block_poly) == None:
        return False, "Iso bubble should contain the block"

    if not iso_bub.pointOnBoundary([3, 0.6]):
        return False, "Iso bubble should cut the slider"

    return True, "Good job!"
