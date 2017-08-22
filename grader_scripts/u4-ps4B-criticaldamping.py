import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-2, 3],
    'yrange': [-1, 1],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'orange', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Critical point', 'color': 'black', 'size': 15},
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
        if cp.get_number_of_points() == 3:
            return False, 'Are you sure about the number of extrema? (note that you should not label the endpoints of your function)'
        else:
            return False, 'Are you sure about the number of extrema?'
   

    if ip.get_number_of_points() != 1:
        return False, 'Are you sure about the number of inflection points?'

    if va.get_number_of_asyms() != 0:
        return False, "Are you sure about the number of vertical asymptotes?"

    if ha.get_number_of_asyms() != 1:
        return False, "Are you sure about the number of horizontal asymptotes?"

    if not f.does_not_exist_between(-2, 0):
        return False, 'Does it make sense for your function to be defined for negative time t?'

    if not cp.has_point_at(x=1):
        return False, 'Check the x values of your critical point'

    if not ip.has_point_at(x=2):
        return False, 'Check the x values of your inflection point'    

    if not ha.has_asym_at_value(0):
        #ha1 = ha.closest_asym_to_value(0)
        return False, 'Check the locations of your horizontal asymptotes. ' 

    maxpt = cp.get_point_at(x=1)

    inflc = ip.get_point_at(x=2)

    if not f.has_value_y_at_x(maxpt.y, maxpt.x):
        return False, 'Make sure your critical points lie on your function!'

    if not f.has_value_y_at_x(inflc.y, inflc.x):
        return False, 'Make sure your inflection points lie on your function!'

    if not (f.is_increasing_between(-3, 1) and f.is_decreasing_between(1, 3)):
        return False, 'Where should the graph be increasing and decreasing?'

    if not f.is_greater_than_y_between(0,1-3,3):
        return False, 'Where is this function defined? What makes sense physically for the problem?'

    if not f.has_value_y_at_x(0, 0):
        return False, "What is the value of the function when x=0?"

    curvature_up_ok = f.has_positive_curvature_between(-1, 2)
    curvature_down_ok= f.has_negative_curvature_between(2,3)

    if not (curvature_up_ok and curvature_down_ok):
        return True, 'Wow! You did a great job of drawing the curvature of this function. Nice work.'

    return True, 'Good Job'
    