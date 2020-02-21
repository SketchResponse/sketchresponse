from sketchresponse import sketchresponse
from sketchresponse.grader_lib import GradeableFunction
from sketchresponse.grader_lib import LineSegment
from sketchresponse.grader_lib import PolyLine
from sketchresponse.grader_lib import Polygon

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-2.5, 2.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'cartesian',
    'debug': False,
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'pl', 'label': 'Beam', 'closed': False, 'color': 'lightblue', 'readonly': True},
        {'name': 'polyline', 'id': 'pg', 'label': 'Isolation bubble', 'closed': True, 'color': 'gray', 'fillColor': 'lightblue'},
        {'name': 'point', 'id': 'pt', 'label': 'Point', 'color': 'red', 'size': 5, 'hollow': False, 'readonly': True, 'tag': {'value': 'tag', 'xoffset': 5, 'yoffset': -5, 'align': 'start'}},
        {'name': 'line-segment', 'id': 'ls', 'label': 'Force', 'color': 'green', 'dashStyle': 'solid', 'lengthConstraint': 50, 'arrowHead': {'length': 10, 'base': 7}, 'readonly': True},
        {'name': 'line-segment', 'id': 'c', 'label': 'Segment', 'color': 'black', 'dashStyle': 'dashdotted', 'lengthConstraint': 20, 'readonly': True, 'tag': {'value': 'tag', 'xoffset': 5, 'yoffset': 5, 'align': 'start', 'position': 'middle'}},
        {'name': 'stamp', 'id': 'cwm', 'label': 'CWM', 'scale': 0.5, 'src': '/static/examples/cw_moment.png', 'readonly': True},
        {'name': 'stamp', 'id': 'ccwm', 'label': 'CCWM', 'scale': 0.5, 'src': '/static/examples/ccw_moment.png', 'readonly': True}
    ],
    'initialstate': {
  "pl": [
    [
      {
        "y": 41,
        "x": 93
      },
      {
        "y": 293,
        "x": 94
      },
      {
        "y": 293,
        "x": 563
      }
    ],
    []
  ],
  "pt": [
    {
      "y": 41,
      "x": 93,
      "tag": "A"
    },
    {
      "y": 293,
      "x": 563,
      "tag": "B"
    }
  ],
  "ls": [
    {
      "y": 344,
      "x": 468
    },
    {
      "y": 296,
      "x": 468
    }
  ],
  "c": [
    {
      "y": 256,
      "x": 187,
      "tag": "C"
    },
    {
      "y": 345,
      "x": 187
    }
  ],
  "cwm": [
    {
      "y": 126,
      "x": 93
    }
  ],
  "ccwm": [
    {
      "y": 293,
      "x": 280
    }
  ]
}
})

@sketchresponse.grader
def grader(pl, pg, pt, ls, c, cwm, ccwm):

    pl = PolyLine.PolyLines(pl)
    pg = Polygon.Polygons(pg)
    cls = LineSegment.LineSegments(c)
    points = GradeableFunction.GradeableFunction(pt)

    beam = pl.get_polyline_as_linesegments()

    if not pg.get_polygon_count() == 1:
        return False, "Did you forget the isolation bubble?"

    poly = pg.polygons[0]

    beam1 = beam.segments[0]
    beam2 = beam.segments[1]

    pointA = None
    pointB = None
    if points.get_number_of_points() > 0:
        for point in points.points:
            if point.tag_equals('A'):
                pointA = point
            if point.tag_equals('B'):
                pointB = point

    if len(pg.get_intersections_with_polygon_boundary(poly, beam1)) > 0:
        return False, "Isolation bubble should not cut vertical beam."

    if not len(pg.get_intersections_with_polygon_boundary(poly, beam2)) == 1:
        return False, "Isolation bubble should only cut the horizontal beam once."

    if pg.point_is_on_boundary([-2, -1]) == None:
        return False, "Check where the isolation bubble cuts the horizontal beam."

    if pg.point_is_on_boundary(pointA) == None and pg.point_is_on_boundary(pointB) == None:
        return False, "Check the isolation bubble containment."

    return True, "Good job!"
