import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 320,
    'xrange': [-1.8, 4.8],
    'yrange': [-0.5, 1.4],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel':{'value':'t','dx':10,'dy':15}},
        {'name': 'freeform', 'id': 'f', 'label': 'Convolution', 'color':'blue'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'},
    ]
})

def bind(f, *args, **kwargs):
    """Returns an argument-less function that evaluates f at the given inputs."""
    def _f():
        return f(*args, **kwargs)
    return _f 

@sketchresponse.grader
def grader(f,ha):
    f = GradeableFunction.GradeableFunction(f)
    ha = Asymptote.HorizontalAsymptotes(ha)

    def check_exists():
        if f.does_exist_between(-1,4):
            ok, msg = True, ""
        else:
            ok, msg = False, "Please draw \\(f * g\\) at least for \\(x \\in [-1,4] \\)"
        return ok, msg
    
    def check_zero_before_origin():
        if f.has_constant_value_y_between(0,-1,0):
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution has incorrect value for \\(x < 0 \\)" 
        return ok, msg
        
    def check_increasing():
        print("increasing", f.is_increasing_between(0,4, numPoints=20))
        if f.is_increasing_between(0,4):
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution has a derivative with incorrect sign for some values of \\( x \\in (0,4) \\)"
        return ok, msg

    def check_concavity():
        if f.has_negative_curvature_between(0,4):
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution has incorrect concavity for \\( x \\in (0,4) \\)"
        return ok, msg

    def check_below_ha():
        if f.is_less_than_y_between(1,0,4):
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution has values that are too large."
        return ok, msg
        
    def check_ha():
        ha_num = ha.get_number_of_asyms() 
        if ha_num < 1:
            return False, "Please use the horizontal asymptote tool to indicate the end behavior of your convolution."
        elif ha_num > 1:
            return False, "You drew {ha_num} horizontal asymptotes, which is too many.".format(ha_num=ha_num)
        else:
            if ha.has_asym_at_value(1):
                return True, ""
            else:
                return False, "The asymptote you indicated has incorrect value."

    def check_close_to_ha():
        if len(f.get_horizontal_line_crossings(0.5)) > 0:
            ok, msg = True, ""
        else:
            ok, msg = False, "Your convolution should approach its horizontal asymptote."
        return ok, msg
            
    checklist = [
        check_exists,
        check_zero_before_origin,
        check_increasing,
        check_concavity,
        check_below_ha,
        check_ha,
        check_close_to_ha
    ]
    
    for check in checklist: 
        ok, msg = check()
        if not ok:
            return ok, msg
    
    return True, "We think your sketch looks good, but we encourage you to compare with the solution."