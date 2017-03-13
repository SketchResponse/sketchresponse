import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 500,
    'height': 420,
    'xrange': [-1, 1],
    'yrange': [-3.5, 3.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xmajor':1.5},
        {'name': 'point', 'id': 'stb', 'label': 'Stable', 'color': 'Blue', 'size': 15},
        {'name': 'point', 'id': 'semi', 'label': 'Semistable', 'color': 'Black', 'size': 15},
        {'name': 'point', 'id': 'uns', 'label': 'Unstable', 'color':'Orange','size': 15},
        {'name': 'line-segment', 'id': 'carw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'vertical', 'lengthContraint': 5, 'arrowHead': {'length': 5, 'base': 10}, 'constrained': True}
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

    
    downarrow = carw.get_segments_at(y=-1)
    bottomuparrow = carw.get_segments_at(y=-3)
    topuparrow = carw.get_segments_at(y=2)

    if downarrow[0].start.x - downarrow[0].end.x >0:
       return False, '<font color="blue"> The direction of the arrow between your two critical points is not correct. </font><br />'  

    # if bottomuparrow.point1.x - bottomuparrow.point2.x < 0:
    #    return False, '<font color="blue"> The direction of the arrow on the far left not correct. </font><br />'  

    # if topuparrow.point1.x - topuparrow.point2.x < 0:
    #    return False, '<font color="blue"> The direction of the arrow on the far right is not correct. </font><br />'  


    return True, '<font color="blue"> Good job!</font>'


