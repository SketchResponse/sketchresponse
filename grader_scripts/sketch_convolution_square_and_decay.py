import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 400,
    'xrange': [-1.8, 8],
    'yrange': [-0.25,2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel':{'value':'t','dx':10,'dy':15}, 'fontSize':{'xlabels':14, 'ylabels':14, 'zeroLabel':14}},
        {'name': 'freeform', 'id': 'f', 'label': 'Convolution', 'color':'blue'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
    ]
})

def ordinal(j):
    num = j+1
    if num == 1:
        return "1st"
    elif num == 2:
        return "2nd"
    elif num == 3:
        return "3rd"
    else:
        return "{num}th".format(num=num)

def bind(f, *args, **kwargs):
    """Returns an argument-less function that evaluates f at the given inputs."""
    def _f():
        return f(*args, **kwargs)
    return _f 

@sketchresponse.grader
def grader(f, ha):
    f = GradeableFunction.GradeableFunction(f)
    ha = Asymptote.HorizontalAsymptotes(ha)
    
    print(vars(f.yaxis))
    
    def check_existence():
        if not f.does_exist_between(-1,7):
            msg = "Please draw f(t) on the entire interval [-1, 7]."
            # raise Exception(msg)
            return False, msg
    
    def check_zero_before_0():
        if not f.has_constant_value_y_between(0,-1,0):
            msg = "Your sketch has incorrect value on the interval (-1,0)."
            return False, msg
    
    def check_positive_past_0():
        if not f.is_greater_than_y_between(0,0,8):
            msg = "Your sketch has incorrect value for t>0."
            return False, msg
    
    def check_zero_at_zero():
        if not f.is_zero_at_x_equals_zero():
            msg = "Your sketch has incorrect value at t=0."
            return False, msg
    
    def check_increasing_on_0_to_1():
        if not f.is_increasing_between(0,1):
            msg = "Your sketch has incorrect behavior on the interval (0,1)."
            return False, msg
    
    def check_conc_down_on_0_to_1():
        if not f.has_negative_curvature_between(0,1):
            msg = "Your sketch has incorrect concavity on the interval (0,1)."
            return False, msg
    
    def check_not_too_small():
        threshold = 0.25*max(f.yaxis.domain)
        crossings = f.get_horizontal_line_crossings(threshold)
        if len(crossings)==0:
            msg = "The vertical scale of your sketch is small, making it hard to understand. Please use up at least 25% of the vertical space."
            # raise Exception(msg)
            return False, msg
    
    def check_has_max_at_1():
        if not f.has_max_at(1):
            msg = "Your sketch does not have a maximum at the correct location."
            return False, msg
    
    def check_decreasing_past_1():
        if not f.is_decreasing_between(1,8):
            msg = "Your sketch has incorrect behavior for t>1."
            return False, msg
    
    def check_conc_up_past_1():
        if not f.has_positive_curvature_between(1,8):
            msg = "Your sketch has incorrect concavity for t>1."
            return False, msg
    
    def check_horizontal_asymptote():
        ha_num = ha.get_number_of_asyms() 
        if ha_num < 1:
            return False, "Please use the horizontal asymptote tool to indicate the end behavior of your sketch."
        elif ha_num > 1:
            return False, "You drew {ha_num} horizontal asymptotes, which is too many.".format(ha_num=ha_num)
        else:
            if not ha.has_asym_at_value(0):
                return False, "The asymptote you indicated has incorrect value."

    def check_close_to_ha():
        if len(f.get_horizontal_line_crossings(1.5)) > 0:
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution should approach its horizontal asymptote."
        return ok, msg
    
    checklist = [
        check_existence,
        check_zero_before_0,
        check_positive_past_0,
        check_zero_at_zero,
        check_increasing_on_0_to_1,
        check_conc_down_on_0_to_1,
        check_not_too_small,
        check_has_max_at_1,
        check_decreasing_past_1,
        check_conc_up_past_1,
        check_horizontal_asymptote,
    ]
    
    for check in checklist:
        result = check()
        if result == None or result[0] == True:
            continue
        else: 
            return result
    
    return True, "Good job!"