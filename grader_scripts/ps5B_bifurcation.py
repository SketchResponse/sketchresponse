import sketchresponse
from grader_lib import GradeableFunction, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-5.25, 5.25],
    'yrange': [-3.25, 3.25],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'stb', 'label': 'Stable crit pts', 'color':'blue'},
        {'name': 'freeform', 'id': 'uns', 'label': 'Unstable crit pts', 'color':'orange'},
        {'name': 'freeform', 'id': 'semi', 'label': 'Semistable crit pts', 'color':'black'},
        {'name': 'line-segment', 'id': 'carw', 'label': 'Ungraded arrow', 'color': 'Gray', 'size': 15, 'directionConstraint': 'vertical', 'lengthContraint': 1, 'arrowHead': {'length': 10, 'base': 20}},
        {'name': 'point', 'id': 'pt', 'label': 'Ungraded point', 'color': 'Gray', 'size': 15}
    ]
})

@sketchresponse.grader
def grader(stb,semi,uns,carw,pt):

    stb = GradeableFunction.GradeableFunction(stb)
    semi = GradeableFunction.GradeableFunction(semi)
    uns = GradeableFunction.GradeableFunction(uns)
    carw = LineSegment.LineSegments(carw)
    pt = GradeableFunction.GradeableFunction(pt)

    if not stb.has_constant_value_y_between(0,-5,0):
        return False, '<font color="blue"> The stability and shape of your bifurcation diagram incorrect for a<0. </font><br />'

    if not uns.has_constant_value_y_between(0,0,5):
        return False, '<font color="blue"> The unstable critical points in your bifurcation diagram are not drawn correctly. </font><br />'
    
    if semi.does_exist_between(-5,5):
        return False, '<font color="blue"> Are you sure about where you have drawn semi stable values? (Hint there should be none.) </font><br />'

    pos_stable_ok = stb.has_value_y_at_x(0,0) and stb.has_value_y_at_x(1,1) and stb.has_value_y_at_x(2,4)
    neg_stable_ok = stb.has_value_y_at_x(-1,1) and stb.has_value_y_at_x(-2,4)
    
    if not pos_stable_ok:
        return False, '<font color="blue"> The stable critical points with positive values do not have the correct values. Check the shape. </font><br />'

    if not neg_stable_ok:
        return False, '<font color="blue"> The stable critical points with negative values do not have the correct values. Check the shape. </font><br />'

    return True, '<font color="blue"> Good job!</font>'


