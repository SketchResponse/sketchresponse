import sketchresponse
from grader_lib import GradeableFunction, PolyLine, LineSegment

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.7, 5.2],
    'yrange': [-1.2, 2.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel': {'value':'x', 'dx': 5, 'dy': 5}, 'yaxisLabel': {'value':'y', 'dx': 5, 'dy': 13}, 'colors':{'xaxisLabel': 'black', 'yaxisLabel': 'black'}, 'fontSize':{'xaxisLabel': 16, 'yaxisLabel': 16}, 'xmajor': 7, 'ymajor': 3, 'xminor':.2, 'yminor':.2}, 
        {'name': 'freeform', 'id': 'f', 'label': 'function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 's', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle':'dashed'},
        {'name': 'horizontal-line', 'id': 'st', 'label': 'Horizontal asymptote', 'color': 'gray'},
        {'name': 'point', 'id': 'z1', 'label': 'Critical point', 'size':15, 'color':'magenta'}, 
        {'name': 'point', 'id': 'z2', 'label': 'Inflection point', 'size':15, 'color':'blue'},  
        {'name': 'point', 'id': 'z3', 'label': 'Undefined point', 'size':15, 'color':'magenta', 'hollow':True}  
    ]
})

@sketchresponse.grader
def grader(f):
    
    
    return True, "Good job!"