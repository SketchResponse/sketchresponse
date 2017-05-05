import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.8, 4.8],
    'yrange': [-.8, 3.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'polyline', 'id': 'poly', 'label': 'Function', 'color': 'blue', 'size': 15}
    ]
})

@sketchresponse.grader
def grader(poly):

    #h1 = GradeableFunction.GradeableFunction(h1)
    #h2 = GradeableFunction.GradeableFunction(h2)
    #h4 = GradeableFunction.GradeableFunction(h4)
    
    #polyline checks: 
    #use: has_constant_value_y_between
    #line.has_slope_m_between(0,-1.2,2) and line.has_slope_m_between(0,2,3) and line.has_slope_m_between(0,3,5)
    #line.has_value_y_at_x(0,.5) and line.has_value_y_at_x(0,1.5) and line.has_value_y_at_x(2,2.5) and line.has_value_y_at_x(1,3.5)

    return True, "<font color='blue'>Good job!</font>"

