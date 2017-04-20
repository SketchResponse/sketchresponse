import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 150,
    'xrange': [1, 3.5],
    'yrange': [-1, 1],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'ymajor': 4, 'ymajor': 4, 'xmajor': 4, 'xminor': 4},
        {'name': 'point', 'id': 'stb', 'label': 'Stable', 'color': 'Blue', 'size': 15},
        {'name': 'point', 'id': 'semi', 'label': 'Semistable', 'color': 'Black', 'size': 15},
        {'name': 'point', 'id': 'uns', 'label': 'Unstable', 'color':'Orange','size': 15},
        {'name': 'line-segment', 'id': 'carw', 'label': 'Arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'horizontal', 'lengthContraint': 1, 'arrowHead': {'length': 10, 'base': 20}, 'constrained': True}
    ]
})

@sketchresponse.grader
def grader(stb,semi,uns,carw):

    stb = GradeableFunction.GradeableFunction(stb)
    semi = GradeableFunction.GradeableFunction(semi)
    uns = GradeableFunction.GradeableFunction(uns)
    carw = LineSegment.LineSegments(carw)

    if stb.get_number_of_points() != 0:
        return False, '<font color="blue"> The number of stable critical points you have drawn is incorrect.</font>'
    if uns.get_number_of_points() != 0:
        return False, '<font color="blue"> The number of unstable critical points you have drawn is incorrect.</font>'
    if semi.get_number_of_points() != 1:
        return False, '<font color="blue"> The number of semistable critical points you have drawn is incorrect.</font>'

    pt = semi.closest_point_to_x(x=0)

    #print "%s, %s" %(stb1, uns1[1])

    if carw.get_number_of_segments() != 2:
        return False, '<font color="blue"> You should have 2 arrows drawn. </font><br />'
    arrows = carw.get_segments_at(y=0)
    for arrow in arrows: 
        if arrow.start.x < pt[1].x and arrow.end.x < pt[1].x:
            leftarrow = arrow
        if pt[1].x < arrow.start.x and pt[1].x < arrow.start.x:
            rightarrow = arrow


    if leftarrow:
        if leftarrow.start.x - leftarrow.end.x < 0:
            return False, '<font color="blue"> The direction of the arrow on the far left not correct. </font><br />'  
    else:
        return False, '<font color="blue"> You have no arrow on the far left of your critical points. </font><br />'

    if rightarrow:
        if rightarrow.start.x - rightarrow.end.x < 0:
            return False, '<font color="blue"> The direction of the arrow on the far right is not correct. </font><br />'  
    else:
        return False, '<font color="blue">  You have no arrow on the far right of your critical points.  </font><br />'

    return True, '<font color="blue"> Good job!</font>'


