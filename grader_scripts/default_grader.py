import sketchresponse
from grader_lib import GradeableFunction

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.35, 2.35],
    'yrange': [-1.15, 1.15],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'point', 'id': 'pt', 'label': 'Point', 'color': 'mediumseagreen','size': 15}
    ]
})

@sketchresponse.grader
def grader(pt):
    pt = GradeableFunction.GradeableFunction(pt)

    if pt.get_number_of_points() < 2:
        return False, 'You have not created at least two points'

    return True, 'Good Job'
