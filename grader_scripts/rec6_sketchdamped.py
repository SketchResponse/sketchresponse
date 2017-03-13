import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-.5, 12.5],
    'yrange': [-1.5, 1.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'env', 'label': 'Envelope', 'color':'orange'},
        {'name': 'freeform', 'id': 'f', 'label': 'x(t)', 'color':'blue'},
        {'name': 'point', 'id': 'zero', 'label': 'Zeroes', 'color':'gray','size': 15}
    ]
})

@sketchresponse.grader
def grader(env,f,zero):
    env = GradeableFunction.GradeableFunction(env)
    f = GradeableFunction.GradeableFunction(f)
    zero = GradeableFunction.GradeableFunction(zero)

    if not zero.has_point_at(x=2.4) or not zero.has_point_at(x=5.5) or not zero.has_point_at(x=8.6) or not zero.has_point_at(x=11.8):
        return False, '<font color="blue">Check the locations of your zero crossings.</font>'

    if not env.has_value_y_at_x(1.4,0) or not env.has_value_y_at_x(-1.4,0):
        return False, '<font color="blue">The envelope crosses the vertical axis at the wrong value.</font>'

    if not env.has_value_y_at_x(.7,2.8) or not env.has_value_y_at_x(-.7,2.8):
        return False, '<font color="blue">The half amplitude of your amplitude occurs at the wrong time.</font>'       

    if not f.has_value_y_at_x(0,2.4) or not f.has_value_y_at_x(0,5.5) or not f.has_value_y_at_x(0,8.6) or not f.has_value_y_at_x(0,11.8):
        return False, '<font color="blue">You function does not have the correct zeros.</font>'   

    if not (f.is_greater_than_y_between(-1.5,0,6) and f.is_less_than_y_between(1.5,0,6) and f.is_greater_than_y_between(-7,2.8,6) and f.is_less_than_y_between(.7,2.8,6)):
        return False, '<font color="blue">Make sure your damped sinusoid is bounded by the envelope.</font>'

    increasing_ok = f.is_increasing_between(4,7) and f.is_increasing_between(0,.5)
    decreasing_ok = f.is_decreasing_between(1.5,4) and f.is_decreasing_between(7,10)
 
    if not increasing_ok:
        return False, '<font color="blue">Where should your damped sinusoid be increasing? Check the initial value and direction.</font>'

    if not decreasing_ok:
        return False, '<font color="blue">Where should your damped sinusoid be decreasing?</font>'

    return True, '<font color="blue">Good Job</font>'
    
    