from .. import sketchinput
from ..grader_lib import GradeableFunction
from ..grader_lib import Asymptote

problemconfig = sketchinput.config({
    'width': 750,  # set the pixel width of the front-end interface
    'height': 420,  # set the pixel height of the front-end interface
    'xrange': [-2.35, 2.35],  # set the x-axis displayed range
    'yrange': [-1.15, 1.15],  # set the y-axis displayed range
    'xscale': 'linear',  # only linear is currently implemented
    'yscale': 'linear',
    'plugins': [
        # all instances will use at minimum these two plugins
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)',
         'color':'blue'},
    ]
})


@sketchinput.grader
def grader(f):  # arguments is a list of the 'id' values for each plugin

    return True, 'Good Job'
