import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-1.2, 5.2],
    'yrange': [-2.5, 2.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'line', 'label': 'Line Tool', 'color': 'blue', 'size': 15},
        {'name': 'line-segment', 'id': 'arw', 'label': 'Vertical Arrow', 'color': 'blue', 'size': 15, 'lengthConstraint': 100, 'directionConstraint': 'vertical', 'arrowHead': {'length': 10, 'base': 20}}
    ]
})

@sketchresponse.grader
def grader(line,arw):

    #line = GradeableFunction.GradeableFunction(line)
    arw = LineSegment.LineSegments(arw)

    if arw.get_number_of_segments() != 2:
        return False, "<font color='blue'>You should have 2 delta functions drawn. There is some error with the number you have drawn.</font>"
    
    arrows = arw.get_segments_at(y=0)

    for arrow in arrows:
        if arw.check_segment_startpoint(arrow,[0,0]):
            if arrow.end.y < 0:
                return False, "<font color='blue'>Please draw your delta functions so that delta functions with positive integrals point upwards.</font>"
        elif arw.check_segment_startpoint(arrow,[1,0]):        
            if arrow.end.y > 0:
                return False, "<font color='blue'>Please draw your delta functions so that delta functions with negative integrals point downwards.</font>"   
        else:
            return False, "<font color='blue'>Your delta functions should start from the x-axis. There seems to be some error with the location of your delta functions at x=%s.</font>" % int(round(arrow.start.x))
    
    #polyline checks: 
    #use: has_constant_value_y_between
    #line.has_slope_m_between(0,-1.2,2) and line.has_slope_m_between(0,2,3) and line.has_slope_m_between(0,3,5)
    #line.has_value_y_at_x(0,.5) and line.has_value_y_at_x(0,1.5) and line.has_value_y_at_x(2,2.5) and line.has_value_y_at_x(1,3.5)

    return True, "<font color='blue'>Good job!</font>"

