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
        {"name": "freeform", "id": "f1", "label": "Derivative f'(x)", "color":"blue"},
        {'name': 'freeform', 'id': 'f2', 'label': '2nd Deriv f"(x)', 'color':'orange'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Critical point', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'gray','size': 15}
    ]
})

@sketchresponse.grader
def grader(f1,f2,cp,ip,va,ha):
    f1 = GradeableFunction.GradeableFunction(f1)
    f2 = GradeableFunction.GradeableFunction(f2)
    cp = GradeableFunction.GradeableFunction(cp)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    ip = GradeableFunction.GradeableFunction(ip)

    if cp.get_number_of_points() != 1:
        if cp.get_number_of_points() == 3:
            return False, 'Are you sure about the number of extrema? (not that you should not label the endpoints of your function)'
        else:
            return False, 'Are you sure about the number of extrema?'
   

    if ip.get_number_of_points() != 1:
        return False, 'Are you sure about the number of inflection points?'

    if va.get_number_of_asyms() != 2:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not ip.has_point_at(x=0):
        return False, 'Check the x values of your inflection point'
    if not cp.has_point_at(x=0):
        return False, 'Check the x values of your critical point'

    if not va.has_asym_at_value(-1) or not va.has_asym_at_value(1):
        v1 = va.closest_asym_to_value(-1)
        v2 = va.closest_asym_to_value(1)
        return False, 'Check the locations of your vertical asymptotes.'

    if not ha.has_asym_at_value(0):
        return False, 'Check the locations of your horizontal asymptotes. ' 

    inflecpt = ip.get_point_at(x=0)

    if not f1.has_value_y_at_x(inflecpt.y, inflecpt.x):
        if f2.has_value_y_at_x(inflecpt.y, inflecpt.x):
            return False, 'Make sure your inflection point lies on the correct function!'
        return False, 'Make sure your function goes through the inflection point.'

    maxpt = cp.get_point_at(x=0)

    if not f2.has_value_y_at_x(maxpt.y, maxpt.x):
        if f1.has_value_y_at_x(maxpt.y, maxpt.x):
            return False, 'Make sure your critical point lies on the correct function!'
        return False, 'Your function should go through the critical point.'

    increasing_ok1 = f1.is_increasing_between(-4, -1) and f1.is_increasing_between(1, 4) 
    decreasing_ok1 = f1.is_decreasing_between(0, 1)  and f1.is_decreasing_between(-1, 0)
    increasing_ok2 = f2.is_increasing_between(-4, -1) and f2.is_increasing_between(-1, 0)
    decreasing_ok2 = f2.is_decreasing_between(0, 1) and f2.is_decreasing_between(1, 4)
    up2 = f2.has_positive_curvature_between(-4, -1) and f2.has_positive_curvature_between(1, 4)
    up1 = f1.has_positive_curvature_between(-4, -1) and f1.has_positive_curvature_between(-1, 0)
    down2= f2.has_negative_curvature_between(-1,1)
    down1= f1.has_negative_curvature_between(0,1) and f1.has_negative_curvature_between(1,4)
 
    if not (increasing_ok1 and decreasing_ok1):
        return False, 'Where should the graph of the derivative be increasing and decreasing?'

    if not (increasing_ok2 and decreasing_ok2):
        return False, 'Where should the graph of the second derivative be increasing and decreasing?'

    ranges_ok1 = f1.is_greater_than_y_between(0,-3,-1) and f1.is_greater_than_y_between(0,-1,-.5) and f1.is_less_than_y_between(0,.5,1) and f1.is_less_than_y_between(0,1,3)
    ranges_ok2 = f2.is_greater_than_y_between(0,-3,-1) and f2.is_less_than_y_between(0,-1,1) and f2.is_greater_than_y_between(0,1,3)
    
    if not ranges_ok1:
        return False, 'Check the relationship between your derivative and the asymptotes.'
    if not ranges_ok2:
        return False, 'Check the relationship between your second derivative and the asymptotes.'
    
    if (up1 and up2 and down1 and down2):
        return True, 'Wow! You did a great job of drawing the curvature of this function. Nice work.'

    return True, 'Good Job'
    
    # check f has min at x=2
    # check f increasing on (-4, -2), (2,6)
    # check f decreasing on (-2, 2)
    # check f concave up on (0,4)
    # check f concave down on (-4,0), (4,6)
    
    #check f exists at cp and ip values