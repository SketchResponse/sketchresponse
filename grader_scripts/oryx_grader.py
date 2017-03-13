import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-5, 80],
    'yrange': [-10, 210],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xmajor':100},
        {'name': 'horizontal-line', 'id': 'const', 'label': 'constant solution c', 'color': 'green'},
        {'name': 'freeform', 'id': 'big', 'label': 'solution y(0) > c', 'color':'blue'},
        {'name': 'freeform', 'id': 'small', 'label': 'solution y(0) < c', 'color':'orange'}
    ]
})

@sketchresponse.grader
def grader(big,small,const):

    f = GradeableFunction.GradeableFunction(big)
    g = GradeableFunction.GradeableFunction(small)
    c = Asymptote.HorizontalAsymptotes(const)

    msg=''
   

    if c.get_number_of_asyms() != 1:
        msg += '<font color="blue"> You should have only one constant solution.</font><br />'
        
    if not c.has_asym_at_value(100):
        msg += '<font color="blue"> Check the value of your constant function.</font><br />'

    if not f.is_greater_than_y_between(100,-5,80):
        msg += '<font color="blue"> Your solution that starts above the constant solution seems to be in the wrong region.</font><br />'

    if not g.is_less_than_y_between(100,-5,80):
        msg += '<font color="orange"> Your solution that starts below the constant solution seems to be in the wrong region.</font><br />'

    increasing_ok = f.is_increasing_between(-5, 80)
    decreasing_ok = g.is_decreasing_between(-5, 80) 
    curvature_up_ok = f.has_positive_curvature_between(-5, 80)
    curvature_down_ok= g.has_negative_curvature_between(-5, 80)
 
    if not increasing_ok:
        msg += '<font color="blue"> Is the derivative of the blue solution positive or negative?</font><br />'

    if not decreasing_ok:
        msg += '<font color="orange"> Is the derivative of the orange solution positive or negative?</font><br />'

    if not (curvature_up_ok and curvature_down_ok):
        msg += '<font color="black"> Check where your solutions are convave up and concave down.</font><br />'

    if msg == '':
        return True,'Good Job'
    else:
        return False, msg
