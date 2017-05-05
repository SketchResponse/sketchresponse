import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.8, 1.8],
    'yrange': [-.8, 5.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'h1', 'label': 'h=1', 'color': 'blue', 'size': 15},
        {'name': 'polyline', 'id': 'h2', 'label': 'h=2', 'color': 'orange', 'size': 15},
        {'name': 'polyline', 'id': 'h4', 'label': 'h=3', 'color': 'black', 'size': 15},
    ]
})

@sketchresponse.grader
def grader(h1,h2,h4):

    #h1 = GradeableFunction.GradeableFunction(h1)
    #h2 = GradeableFunction.GradeableFunction(h2)
    #h4 = GradeableFunction.GradeableFunction(h4)
    
    #polyline checks: 
    #use: has_constant_value_y_between
    #line.has_slope_m_between(0,-1.2,2) and line.has_slope_m_between(0,2,3) and line.has_slope_m_between(0,3,5)
    #line.has_value_y_at_x(0,.5) and line.has_value_y_at_x(0,1.5) and line.has_value_y_at_x(2,2.5) and line.has_value_y_at_x(1,3.5)

    return True, "<font color='blue'>Good job!</font>"

