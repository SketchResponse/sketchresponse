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
    ls = LineSegment.LineSegments(ls2)

    if gls.is_straight():
        return True, "works"
    
    if ls.has_slope_m_at_x(2, -2, ignoreDirection=True):
        if ls.has_slope_m_at_x(2, 2, ignoreDirection=True):
            return True, "Works"

    return False, "no works"

