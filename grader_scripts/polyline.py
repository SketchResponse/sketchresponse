import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.5, 2],
    'yrange': [-1.5, .5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'line-segment', 'id': 'lineseg', 'label': 'Line', 'color': 'Blue', 'size': 15}
    ]
})

@sketchresponse.grader
def grader(lineseg):

    lineseg = LineSegment.LineSegments(lineseg)

    if lineseg.get_number_of_segments() != 3:
        return False, "<font color='blue'>Your sketch should have 3 line segments.</font>"

    line1 = lineseg.get_segments_at(x=.25)[0]
    line2 = lineseg.get_segments_at(x =.75)[0]
    line3 = lineseg.get_segments_at(x=1.25)[0]

    if lineseg.check_segment_endpoints(line1,[[0,-1],[.5,-.5]]):
        if not lineseg.has_slope_m_at_x(1,.25,tolerance=25):
            return False, "<font color='blue'>Check the slope of the left most line segment.</font>"
    else:
        return False, "<font color='blue'>Check the endpoints of the left most line segment.</font>"

    if lineseg.check_segment_endpoints(line2,[[1,-.5],[.5,-.5]]):
        if not lineseg.has_slope_m_at_x(0,.75,tolerance=25):
            return False, "<font color='blue'>Check the slope of the middle line segment.</font>"
    else:
        return False, "<font color='blue'>Check the endpoints of the middle line segment.</font>"
    
    if lineseg.check_segment_endpoints(line3,[[1,-.5],[1.5,-.875]]):
        if not lineseg.has_slope_m_at_x(-.75,1.25,tolerance=25):
            return False, "<font color='blue'>Check the slope of the right most line segment.</font>"
    else:
        return False, "<font color='blue'>Check the endpoints of the right most line segment.</font>"

    return True, "Good job!"
