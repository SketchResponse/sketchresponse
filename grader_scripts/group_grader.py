from .. import sketchresponse
from ..grader_lib import GradeableFunction

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-2.5, 2.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'cartesian',
    'debug': False,
    'plugins': [
        {'name': 'axes'},
        {'name': 'group', 'id': 'grp', 'label': 'Lines', 'plugins': [
        {'name': 'spline', 'id': 'pg', 'label': 'Spline', 'color': 'lightblue', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}},
        {'name': 'freeform', 'id': 'f', 'label': 'Freeform', 'color': 'blue', 'dashStyle': 'dashdotted', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
        ]}
    ]
})

@sketchresponse.grader
def grader(grp, f):  # Only have to declare the plugins you want to grade.

    lines = GradeableFunction.GradeableFunction(grp)
    function = GradeableFunction.GradeableFunction(f)

    # Can now grade data either from individual plugins or handle multiple
    # plugins with comparable data through the group

    return True, "Good job!"
