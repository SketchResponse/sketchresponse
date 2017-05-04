import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 500,
    'height': 420,
    'xrange': [-1, 1],
    'yrange': [-3.25, 3.25],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xmajor':1.5},
        {'name': 'point', 'id': 'stb', 'label': 'Stable', 'color': 'Blue', 'size': 15},
        {'name': 'point', 'id': 'semi', 'label': 'Semistable', 'color': 'Black', 'size': 15},
        {'name': 'point', 'id': 'uns', 'label': 'Unstable', 'color':'Orange','size': 15},
        {'name': 'line-segment', 'id': 'carw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'vertical', 'lengthConstraint': 1, 'arrowHead': {'length': 10, 'base': 20}}
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

    if semi.has_point_at(x=0):
        return False, '<font color="blue"> There should be no semistable critical points. </font><br />'

    arrows = carw.get_segments_at(x=0)

    for arrow in arrows: # in range(len(arrows)): 
        if arrow.start.y < -2  and arrow.end.y < -2:
            bottomuparrow = arrow
        if arrow.start.y > -2  and arrow.end.y > -2 and arrow.start.y < 0  and arrow.end.y < 0:
            downarrow = arrow
        if arrow.start.y > 0  and arrow.end.y > 0:
            topuparrow = arrow

    
    # downarrow = carw.get_segments_at(y=-1,distTolerance=50)
    # bottomuparrow = carw.get_segments_at(y=-3,distTolerance=50)
    # topuparrow = carw.get_segments_at(y=2,distTolerance=50)

    if downarrow:
        if downarrow.start.y - downarrow.end.y < 0:
            return False, '<font color="blue"> The direction of the arrow between your two critical points is not correct. </font><br />'  
    else:
        return False, '<font color="blue"> You have no arrow between your critical points. </font><br />'


    if bottomuparrow:
        if bottomuparrow.start.y - bottomuparrow.end.y > 0:
            return False, '<font color="blue"> The direction of the arrow above your top most is not correct. </font><br />'  
    else:
        return False, '<font color="blue"> You have no arrow above your top most critical point. </font><br />'

    if topuparrow:
        if topuparrow.start.y - topuparrow.end.y > 0:
            return False, '<font color="blue"> The direction of the arrow below your bottom most is is not correct. </font><br />'  
    else:
        return False, '<font color="blue">  You have no arrow below your bottom most critical point.  </font><br />'

    return True, '<font color="blue"> Good job!</font>'

