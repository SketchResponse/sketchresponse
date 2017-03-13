import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.35, 2.35],
    'yrange': [-1.15, 1.15],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'point', 'id': 'pt', 'label': 'Point', 'color':'blue', 'size':15},
        {'name': 'point', 'id': 'non', 'label': 'Hollow point', 'color':'blue', 'size':15, 'hollow':True},
        {'name': 'point', 'id': 'pole', 'label': 'Pole', 'color':'blue', 'size':15, 'cross': True}
    ]
})

@sketchresponse.grader
def grader(f,pt,non,pole):
    f = GradeableFunction.GradeableFunction(f)
    pt = GradeableFunction.GradeableFunction(pt)
    non = GradeableFunction.GradeableFunction(non)
    pole = GradeableFunction.GradeableFunction(pole)
 
    if not pole.has_point_at(x=-1, y=1):
        return False, 'No pole'
    if not pt.has_point_at(x=0,y=0):
        return False, 'No point'
    if not non.has_point_at(x=0,y=1):
        return False, 'No hollow point'


    return True, 'Good Job'
    
   
