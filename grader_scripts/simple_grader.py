import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.35, 2.35],
    'yrange': [-1.15, 1.15],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'cartesian',
    'debug': False,
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
    ]
})

@sketchresponse.grader
def grader(f):
    f = GradeableFunction.GradeableFunction(f)
 
    if not f.is_straight_between(-1, 1):
        return False, 'Not straight'

    return True, 'Good Job'
    
   
