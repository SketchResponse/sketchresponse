import sketchresponse
from grader_lib import GradeableFunction


problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4, 4],
    'yrange': [-3, 3],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'point', 'id': 'e', 'label': 'Poles', 'color':'orange', 'size': 15} 
    ]
})

@sketchresponse.grader
def grader(e):
    e = GradeableFunction.GradeableFunction(e)
    msg = ''

    if e.get_number_of_points() != 1:
        msg += '<font color="blue">You do not have the correct number of poles.<br/></font>'

    if not e.has_point_at(x=2, y=0):
        msg += '<font color="blue">Check the location of your pole.<br/></font>'

    if msg != '':
        return False, msg

    return True, 'Good Job'
    