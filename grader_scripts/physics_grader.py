import sketchresponse
from grader_lib import GradeableFunction, LineSegment, PolyLine, Polygon

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-2.5, 2.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'pl', 'label': 'Beam', 'closed': False, 'color': 'lightblue', 'readonly': True},
        {'name': 'polyline', 'id': 'pg', 'label': 'Isolation bubble', 'closed': True, 'color': 'gray', 'fillColor': 'lightblue'},
        {'name': 'point', 'id': 'pt', 'label': 'Point', 'color': 'red', 'size': 5, 'hollow': False, 'readonly': True},
        {'name': 'line-segment', 'id': 'ls', 'label': 'Force', 'color': 'green', 'dashStyle': 'solid', 'lengthContraint': 50, 'arrowHead': {'length': 10, 'base': 7}, 'readonly': True},
        {'name': 'line-segment', 'id': 'c', 'label': 'Segment', 'color': 'black', 'dashStyle': 'dashdotted', 'lengthContraint': 20, 'readonly': True},
        {'name': 'stamp', 'id': 'cwm', 'label': 'CWM', 'scale': 0.5, 'src': '/static/simona_stamps/cw_moment.png', 'readonly': True},
        {'name': 'stamp', 'id': 'ccwm', 'label': 'CCWM', 'scale': 0.5, 'src': '/static/simona_stamps/ccw_moment.png', 'readonly': True}
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
      "x": 93
    },
    {
      "y": 293,
      "x": 563
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
      "x": 187,
      "y": 256
    },
    {
      "x": 187,
      "y": 345
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

    beam = pl.get_polyline_as_segments(0)

    if not pg.get_polygon_count() == 1:
        return False, "Did you forget the isolation bubble?"

    poly = pg.polygons[0]

    beam1 = beam.segments[0]
    beam2 = beam.segments[1]

    if len(pg.get_intersections_with_polygon_boundary(beam1, poly)) > 0:
        return False, "Isolation boundary should not cut vertical beam."

    if not len(pg.get_intersections_with_polygon_boundary(beam2, poly)) == 1:
        return False, "Isolation boundary should only cut the horizontal beam once."

    if pg.point_is_on_boundary([-2, -1]) == None:
        return False, "Check where the isolation boundary cuts the horizontal beam."

    if pg.point_is_on_boundary([-3, 2]) == None and pg.point_is_on_boundary([2, -1]) == None:
        return False, "Check the isolation boundary containment."

    return True, "Good job!"
