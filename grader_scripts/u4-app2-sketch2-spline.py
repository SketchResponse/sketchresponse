import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-4.2, 4.2],
    'yrange': [-3.2, 3.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'labels': None},
        {'name': 'spline', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'magenta','size': 15}
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
        if cp.get_number_of_points() == 3:
            return False, 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
        else:
            return False, 'Are you sure about the number of extrema?'
   
    if ip.get_number_of_points() != 0:
        return False, 'Are you sure about the number of inflection points?'

    if va.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    #print cp

    # if not cp.has_point_at(x=0):
    #     return False, 'Check the x values of your critical point'

    if not va.has_asym_at_value(0):
        return False, 'Check the locations of your vertical asymptote.'

    if not ha.has_asym_at_value(0):
        return False, 'Check the locations of your horizontal asymptotes.'

    #maxpt = cp.get_point_at(x=0)

    r, cpt = cp.closest_point_to_x(x=1)
    if not cpt.y > 0:
        return False, 'Is the value of the function at the critical point positive or negative?'

    if not f.has_value_y_at_x(cpt.y, cpt.x):
        return False, 'Make sure your critical points lie on your function!'

    increasing_ok = f.is_increasing_between(cpt.x, 4)
    decreasing_ok = f.is_decreasing_between(-4, 0) and f.is_decreasing_between(0, cpt.x)
    curvature_ok = f.has_positive_curvature_between(0,1) and f.has_negative_curvature_between(-4, 0) 

    if not (increasing_ok and decreasing_ok):
        return False, 'Where should the graph be increasing and decreasing?'

    ranges_ok = f.is_greater_than_y_between(0,0,4) and f.is_less_than_y_between(0,-4,0)
    if not ranges_ok:
        return False, "Where should the function lie in relation to the asymptotes?"

    
    if curvature_ok:
        return True, 'Great! Even the curvature looks good!'

    return True, 'Good Job'
    
    # check f has min at x=2
    # check f increasing on (-4, -2), (2,6)
    # check f decreasing on (-2, 2)
    # check f concave up on (0,4)
    # check f concave down on (-4,0), (4,6)
    
    #check f exists at cp and ip values