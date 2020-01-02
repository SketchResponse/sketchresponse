from .. import sketchresponse
from ..grader_lib import GradeableFunction
from math import pi

problemconfig = sketchresponse.config({
    'width': 420,
    'height': 420,
    'xrange': [-pi, pi],
    'yrange': [-pi, pi],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'polar',
    'debug': False,
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'point', 'id': 'p', 'label': 'Point', 'color': 'red', 'size': 15},
    ]
})

@sketchresponse.grader
def grader(f, p):
    gf = GradeableFunction.GradeableFunction(f)
    gp = GradeableFunction.GradeableFunction(p)

    if not gf.is_straight():
        return False, 'Not straight'
    
    if not gp.has_point_at(x=pi / 4):
        return False, 'Missing point at PI/4'

    return True, 'Good Job'
