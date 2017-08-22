import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2.5, 3.5],
    'yrange': [-7.5, 10.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Critical point', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'magenta','size': 15}
    ]
})

@sketchresponse.grader
def grader(f, va, ip, ha, cp):
    f = GradeableFunction.GradeableFunction(f)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    cp = GradeableFunction.GradeableFunction(cp)
    ip = GradeableFunction.GradeableFunction(ip)

    if va.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 0:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not va.has_asym_at_value(1):
        return False, "Please check the location of your vertical asymptote."

    if cp.get_number_of_points() != 2:
        return False, 'Are you sure about the number of critical points?'

    if ip.get_number_of_points() != 0:
        return False, 'Are you sure about the number of inflection points?'

    if not cp.has_point_at(x=0) or not cp.has_point_at(x=2):
        return False, 'Check the x values of your critical points.'

    maxpt = cp.get_point_at(x=0)
    minpt = cp.get_point_at(x=2)

    if not minpt.y > 0:
        return False, "Make sure your critical point(s) has(have) the correct y-coordinate(s)!"

    if (not f.has_value_y_at_x(minpt.y, minpt.x) or not f.has_value_y_at_x(maxpt.y,maxpt.x)):
        return False, 'Make sure your critical points lie on the function!'

    if (not f.is_increasing_between(-2.5, 0) or not f.is_increasing_between(2, 3.5)):
        return False, 'Where is the function increasing?'

    if (not f.is_decreasing_between(0, 1) or not f.is_decreasing_between(1, 2)):
        return False, 'Where is the function decreasing?'


  
    function_values=f.is_greater_than_y_between(minpt.y, 1,3.5) and f.is_less_than_y_between(maxpt.y,-2.5,1)

    if not function_values:
        return False, "Where should the function be located with respect to the asymptotes?"

    curvature_ok = f.has_positive_curvature_between(1,3.5) and f.has_negative_curvature_between(-2.5,1)

    if not curvature_ok:
        return False, 'Almost. Give some thought to the curvature of the function in the regions between the asymptotes.'

    return True, 'Good job!'
