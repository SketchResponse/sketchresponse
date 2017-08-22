import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-4.5, 4.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'spline', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'magenta', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'magenta', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'orange','size': 15}
    ]
})

@sketchresponse.grader
def grader(f,cp,ip,va,ha):
    ret = {'ok' : False}
    
    f = GradeableFunction.GradeableFunction(f)
    cp = GradeableFunction.GradeableFunction(cp)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    ip = GradeableFunction.GradeableFunction(ip)

    if cp.get_number_of_points() != 1:
        if cp.get_number_of_points() == 3:
            ret['msg'] = 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
            return ret
        #    return False, 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
        else:
            ret['msg'] = 'Are you sure about the number of extrema?'
            return ret

    if ip.get_number_of_points() != 0:
        ret['msg'] = 'Are you sure about the number of inflection points?'
        return ret
        #return False, 'Are you sure about the number of extrema?'

    if va.get_number_of_asyms() != 2:
        ret['msg'] = "Are you sure about the number of vertical asymptotes?"
        return ret

    if ha.get_number_of_asyms() != 1:
        ret['msg'] = "Are you sure about the number of horizontal asymptotes?"
        return ret


    if not cp.has_point_at(x=0):
        ret['msg'] = 'Check the x values of your critical point'
        return ret
        #return False, 'Check the x values of your extrema'

    if not va.has_asym_at_value(-1) or not va.has_asym_at_value(1):
        v1 = va.closest_asym_to_value(-1)
        v2 = va.closest_asym_to_value(1)
        ret['msg'] = 'Check the locations of your vertical asymptotes.  ' 
        return ret

    if not ha.has_asym_at_value(2):
        ha1 = ha.closest_asym_to_value(2)
        ret['msg'] = 'Check the locations of your horizontal asymptotes. ' 
        return ret

    maxpt = cp.get_point_at(x=0)

    if not f.has_value_y_at_x(maxpt.y, maxpt.x):
        ret['msg'] = 'Make sure your critical points lie on your function!'
        return ret

    increasing_ok = f.is_increasing_between(-4, -1) and f.is_increasing_between(-1, 0)
    decreasing_ok = f.is_decreasing_between(0, 1) and f.is_decreasing_between(1, 4)
    curvature_up_ok = f.has_positive_curvature_between(-4, -1) and f.has_positive_curvature_between(1, 4)
    curvature_down_ok= f.has_negative_curvature_between(-1,1)
 

    if not (increasing_ok and decreasing_ok):
        ret['msg'] = 'Where should the graph be increasing and decreasing?'
        return ret

    if not f.is_greater_than_y_between(2,-4,-1):
        ret['msg'] = "Your function seems to be in the wrong region on the interval (-4,-1)"
        return ret

    if not f.is_greater_than_y_between(2,1,4):
        ret['msg'] = "Your function seems to be in the wrong region on the interval (1,4)"
        return ret

    if not f.is_less_than_y_between(0,-1,1):
        ret['msg'] = "Your function seems to be in the wrong region on the interval (-1,1)"
        return ret

    
    if not (curvature_up_ok and curvature_down_ok):
        ret['msg'] = 'Where is the function convave up and concave down?'
        return ret

    ret['msg'] = 'Good Job'
    ret['ok'] = True
    return ret
    
    # check f has min at x=2
    # check f increasing on (-4, -2), (2,6)
    # check f decreasing on (-2, 2)
    # check f concave up on (0,4)
    # check f concave down on (-4,0), (4,6)
    
    #check f exists at cp and ip values