import sketchresponse
from grader_lib import GradeableFunction

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-4.5, 4.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'ymajor': 5},
        {'name': 'freeform', 'id': 'f', 'label': 'f(t)', 'color':'blue'},
        {'name': 'point', 'id': 'zero', 'label': 'Zeros', 'color':'Orange','size': 15, 'hollow':True}
    ]
})

@sketchresponse.grader
def grader(f,zero):

    f = GradeableFunction.GradeableFunction(f)
    zero = GradeableFunction.GradeableFunction(zero)

    if zero.get_number_of_points() != 3:
        return False, '<font color="blue">You have not labeled the correct number of zeros.</font><br />'

    if not f.has_value_y_at_x(0, -1) or not f.has_value_y_at_x(0, 1) or not f.has_value_y_at_x(0, 2) :
        return False, '<font color="blue"> Make sure your function passes through the zeros! </font><br />'

    if f.is_less_than_y_between(0,-3.25,-1) and f.is_less_than_y_between(0,2,3.25):
        return False, '<font color="blue"> Check the regions your function f is negative. Should it be? </font><br />'

    if f.is_greater_than_y_between(0,-1,2):
        return False, '<font color="blue"> Check the regions your function f is positive. Should it be? </font><br />' 

    return True,'Good Job'
