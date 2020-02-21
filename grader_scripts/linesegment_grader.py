from sketchresponse import sketchresponse
from sketchresponse.grader_lib import GradeableFunction
from sketchresponse.grader_lib import LineSegment

problemconfig = sketchresponse.config({
    'width': 420,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-4, 4],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'cartesian',
    'plugins': [
        {'name': 'axes'},
        {'name': 'line-segment', 'id': 'ls1', 'label': 'Line Segment 1', 'color':'blue'},
        {'name': 'line-segment', 'id': 'ls2', 'label': 'Line Segment 2', 'color':'green'},
    ]
})

@sketchresponse.grader
def grader(ls1, ls2):

    gls = GradeableFunction.GradeableFunction(ls1)
    
    if not gls.is_straight():
        return False, "not straight"


    ls = LineSegment.LineSegments(ls2)

    if not ls.get_number_of_segments() == 1:
       return False, "ls2 doesn't have 1 segment"

    segment = ls.segments[0]

    if not ls.check_segment_startpoint(segment, (-2,-2)) or not ls.check_segment_endpoint(segment, (2,2)):
        return False, "start and/or end point is wrong"

    if not ls.has_slope_m_at_x(1, 0, ignoreDirection=False):
        return False, "slopes are wrong"

    return True, "Works"

