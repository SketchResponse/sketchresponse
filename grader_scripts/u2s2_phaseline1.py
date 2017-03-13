import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 150,
    'xrange': [-3.5, 3.5],
    'yrange': [-1, 1],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'ylabels': []},
        {'name': 'point', 'id': 'stb', 'label': 'Stable', 'color': 'Blue', 'size': 15},
        {'name': 'point', 'id': 'semi', 'label': 'Semistable', 'color': 'Black', 'size': 15},
        {'name': 'point', 'id': 'uns', 'label': 'Unstable', 'color':'Orange','size': 15},
        {'name': 'line-segment', 'id': 'carw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'horizontal', 'lengthContraint': 5, 'arrowHead': {'length': 5, 'base': 10}, 'constrained': True}
    ]
})

@sketchresponse.grader
def grader(stb,semi,uns,carw):

    stb = GradeableFunction.GradeableFunction(stb)
    semi = GradeableFunction.GradeableFunction(semi)
    uns = GradeableFunction.GradeableFunction(uns)
    carw = LineSegment.LineSegments(carw)

    if not stb.has_point_at(x=0, y= -2):
        return False, '<font color="blue"> The location of your stable critical point is incorrect. </font><br />'

    if not uns.has_point_at(x=0, y=0):
       return False, '<font color="blue"> The location of your unstable critical point is incorrect. </font><br />'

    
    downarrow = carw.get_segments_at(x=-1)
    bottomuparrow = carw.get_segments_at(x=-3)
    topuparrow = carw.get_segments_at(x=2)

    if downarrow.check_segment_endpoint.x - downarrow.check_segment_startpoint.x > 0:
       return False, '<font color="blue"> The direction of the arrow between your two critical points is not correct. </font><br />'  

    if bottomuparrow.check_segment_endpoint.x - bottomuparrow.check_segment_startpoint.x < 0:
       return False, '<font color="blue"> The direction of the arrow on the far left not correct. </font><br />'  

    if topuparrow.check_segment_endpoint.x - topuparrow.check_segment_startpoint.x < 0:
       return False, '<font color="blue"> The direction of the arrow on the far right is not correct. </font><br />'  


    return True, '<font color="blue"> Good job!</font>'


