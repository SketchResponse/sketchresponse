import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-1.5, 3.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'group', 'id': 'f', 'label': 'Function f(x)', 'plugins': [
            {'name': 'spline', 'id': 'spline', 'label': 'Spline', 'color': 'blue'},
            {'name': 'freeform', 'id': 'free', 'label': 'Freeform', 'color': 'blue'}
        ]},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'gray','size': 15}
    ]
})

@sketchresponse.grader
def grader(f,cp,ip,va,ha):
    
    f = GradeableFunction.GradeableFunction(f)
    cp = GradeableFunction.GradeableFunction(cp)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    ip = GradeableFunction.GradeableFunction(ip)

    if cp.get_number_of_points() != 1:
        # if cp.get_number_of_points() == 3:
            # ret['msg'] = 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
            # return ret
        #    return False, 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
        # else:
        return False, 'Are you sure about the number of extrema?'
            # return ret

    if ip.get_number_of_points() != 1:
        return False, 'Are you sure about the number of inflection points?'
        #return False, 'Are you sure about the number of extrema?'

    if va.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not cp.has_point_at(x=-2):
        return False,'Check the x values of your critical point.'


    if not ip.has_point_at(x=-3):
        return False,'Check the x values of your inflection point.'
        #return False, 'Check the x values of your extrema'

    if not va.has_asym_at_value(0):
        return False, 'Check the location of your vertical asymptote.' 

    if not ha.has_asym_at_value(1):
        return False, 'Check the location of your horizontal asymptote.' 

    maxpt = cp.get_point_at(x=-2)

    if not f.has_value_y_at_x(maxpt.y, maxpt.x):
        return False, 'Make sure your critical point lies on your function! Try drawing the point after you draw the function.'

    infpt = ip.get_point_at(x=-3)

    if not f.has_value_y_at_x(infpt.y, infpt.x):
        return False, 'Make sure your inflection point lies on your function! Try drawing the point after you draw the function.'
    

    increasing_ok = f.is_increasing_between(maxpt.x, 0)
    decreasing_ok = f.is_decreasing_between(-5, maxpt.x) and f.is_decreasing_between(0, 5)
    curvature_up_ok = f.has_positive_curvature_between(infpt.x, 0) and f.has_positive_curvature_between(0, 5)
    curvature_down_ok= f.has_negative_curvature_between(-5,infpt.x)
 

    if not (increasing_ok and decreasing_ok):
        return False, 'Where should the graph be increasing and decreasing?'

    if not (f.is_greater_than_y_between(maxpt.y,-5,.5) and f.is_greater_than_y_between(maxpt.y,0,5)):
        return False, "Is your critical point an absolute or local extremum? Does your graph agree?  What is the relationship to the horizontal asymptote?"

    if not (f.is_greater_than_y_between(1,0,5) and f.is_less_than_y_between(1,-5,maxpt.x)):
        return False, "What is the relationship of your function to the horizontal asymptote?"
        return ret

    if not (curvature_up_ok and curvature_down_ok):
        False, 'Where is the function convave up and concave down?'

    return True, 'Good Job'
    
   