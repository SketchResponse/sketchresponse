from .. import sketchresponse
from ..grader_lib import GradeableFunction
from ..grader_lib import LineSegment
from ..grader_lib import PolyLine
from ..grader_lib import Point

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-2.5, 2.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'pl', 'label': 'Beam', 'closed': False, 'color': 'lightblue'},
        {'name': 'point', 'id': 'pt', 'label': 'Point', 'color': 'red', 'size': 5, 'hollow': False, 'readonly': True},
        {'name': 'stamp', 'id': 'h', 'label': 'Hinge', 'src': '/static/simona_stamps/hinge.png'},
        {'name': 'stamp', 'id': 'r', 'label': 'Roller', 'src': '/static/simona_stamps/roller.png'},
        {'name': 'line-segment', 'id': 'ls', 'label': 'Force', 'color': 'green', 'dashStyle': 'solid', 'lengthContraint': 50, 'arrowHead': {'length': 10, 'base': 7}},
        {'name': 'stamp', 'id': 'cwm', 'label': 'CWM', 'scale': 0.5, 'src': '/static/simona_stamps/cw_moment.png'},
        {'name': 'stamp', 'id': 'ccwm', 'label': 'CCWM', 'scale': 0.5, 'src': '/static/simona_stamps/ccw_moment.png'}
    ],
    'initialstate': {
  "pt": [
    {
      "x": 93,
      "y": 41
    },
    {
      "x": 563,
      "y": 293
    }
  ]
}
})

@sketchresponse.grader
def grader(pl, pt, h, r, ls, cwm, ccwm):

    pl = PolyLine.PolyLines(pl)
    pt = GradeableFunction.GradeableFunction(pt)
    h = GradeableFunction.GradeableFunction(h)
    r = GradeableFunction.GradeableFunction(r)
    ls = LineSegment.LineSegments(ls)
    cwm = GradeableFunction.GradeableFunction(cwm)
    ccwm = GradeableFunction.GradeableFunction(ccwm)

    if pl.get_polyline_count() > 0:
        beam = pl.get_polyline_as_segments(0)
        if beam.get_number_of_segments() != 2:
            return False, "Did you forget the beam?"

        for segment in beam.segments:
            if beam.check_segment_startpoint(segment, [-3, 2]):
                if not beam.check_segment_endpoint(segment, [-3, -1]):
                    return False, "Check beam segment connected to A"

            if beam.check_segment_startpoint(segment, [-3, -1]):
                if not beam.check_segment_endpoint(segment, [2, -1]):
                    return False, "Check beam segment connected to B"

    if not cwm.has_point_at(x=-3, y=1):
        return False, "Check cwm position"

    if not ccwm.has_point_at(x=-1, y=-1):
        return False, "Check ccwm position"

    # TODO force position and direction checks


    return True, "Good job!"
