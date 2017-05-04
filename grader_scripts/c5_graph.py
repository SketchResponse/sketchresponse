import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.2, 5.2],
    'yrange': [-2.25, 2.25],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'line-segment', 'id': 'line', 'label': 'Horizontal Line', 'color': 'blue', 'size': 15, 'directionConstraint': 'horizontal'},
        {'name': 'line-segment', 'id': 'arw', 'label': 'Vertical Arrow', 'color': 'blue', 'size': 15, 'lengthConstraint': 100, 'directionConstraint': 'vertical', 'arrowHead': {'length': 10, 'base': 20}}
    ]
})

@sketchresponse.grader
def grader(line,arw):

    line = GradeableFunction.GradeableFunction(line)
    arw = LineSegment.LineSegments(arw)

    if arw.get_number_of_segments() != 6:
        return False, "<font color='blue'>You should have 6 delta functions drawn. There is some error with the number you have drawn.</font>"
    
    arrows = arw.get_segments_at(y=0)
    #arrowlist = []

    for arrow in arrows:
        for k in range(6):
            if arw.check_segment_startpoint(arrow,[k,0]):
                if k%2==0:
                    if arrow.end.y < 0:
                        return False, "<font color='blue'>Please draw your delta functions so that delta functions with positive integrals point upwards.</font>"
                else:
                    if arrow.end.y > 0:
                        return False, "<font color='blue'>Please draw your delta functions so that delta functions with negative integrals point downwards.</font>"   
        if arrow.start.y > .1 or arrow.start.y < -.1:
            return False, "<font color='blue'>Your delta functions should start from the x-axis. There seems to be some error with your delta functions at x=%s.</font>" % int(round(arrow.start.x))
           

    if not line.has_constant_value_y_between(0,-.2,5.2):
        return False, "<font color='blue'>Check the value of your derivative between integer values. There seems to be some error.</font>"

    return True, "<font color='blue'>Good job!</font>"

