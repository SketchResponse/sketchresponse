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
        {'name': 'line-segment', 'id': 'carw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'vertical', 'lengthContraint': 1, 'arrowHead': {'length': 10, 'base': 20}, 'constrained': True}
    ]
})

@sketchresponse.grader
def grader(stb,semi,uns,carw):

    stb = GradeableFunction.GradeableFunction(stb)
    semi = GradeableFunction.GradeableFunction(semi)
    uns = GradeableFunction.GradeableFunction(uns)
    carw = LineSegment.LineSegments(carw)

    if not stb.has_point_at(x=0, y= -1):
        return False, '<font color="blue"> The location of your stable critical point is incorrect. </font><br />'

    if not uns.has_point_at(x=0, y=2):
        return False, '<font color="blue"> The location of your unstable critical point is incorrect. </font><br />'

    if not semi.has_point_at(x=0, y=1):
        return False, '<font color="blue"> The location of your semistable critical point is incorrect. </font><br />'


    arrows = carw.get_segments_at(x=0)
    # for arrow in carw:
    #     if -3.5 < arrow.start.y < -1 and -3.5 < arrow.end.y < -1 :
    #         bottomuparrow = arrow
    #     if -1 < arrow.start.y < 1 and -1 < arrow.end.y < 1:
    #         bottomwdownarrow = arrow
    #     if 1 < arrow.start.y < 2 and 1 < arrow.end.y < 2:
    #         topdownarrow = arrow
    #     if 2 < arrow.start.y < 4 and 2 < arrow.end.y < 4:
    #         topuparrow = arrow

    for arrow in arrows: # in range(len(arrows)): 
        if arrow.start.y < -1  and arrow.end.y < -1:
            bottomuparrow = arrow
        if arrow.start.y > -1  and arrow.end.y > -1 and arrow.start.y < 1  and arrow.end.y < 1:
            bottomdownarrow = arrow
        if arrow.start.y > 1  and arrow.end.y > 1 and arrow.start.y < 2  and arrow.end.y < 2:
            topdownarrow = arrow
        if arrow.start.y > 2  and arrow.end.y > 2:
            topuparrow = arrow

    # topdownarrow = carw.get_segments_at(y=1.5,distTolerance=50)
    # bottomdownarrow = carw.get_segments_at(y=0,distTolerance=50)
    # bottomuparrow = carw.get_segments_at(y=-2,distTolerance=50)
    # topuparrow = carw.get_segments_at(y=3,distTolerance=50)

    if topdownarrow:
        if topdownarrow.start.y - topdownarrow.end.y < 0:
            return False, '<font color="blue"> The direction of the arrow between two of your critical points is not correct. </font><br />'  
    else:
        return False, '<font color="blue"> You have no arrow between two of your critical points. </font><br />'

    if bottomdownarrow:
        if bottomdownarrow.start.y - bottomdownarrow.end.y < 0:
            return False, '<font color="blue"> The direction of the arrow between two of your critical points is not correct. </font><br />'  
    else:
        return False, '<font color="blue"> You have no arrow between two of your critical points. </font><br />'


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


