from sketchresponse import sketchresponse
from sketchresponse.grader_lib import GradeableFunction
from sketchresponse.grader_lib import Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.5, 3.5],
    'yrange': [-4.5, 4.5],
    'xscale': 'linear',
    'yscale': 'linear',
    'coordinates': 'cartesian',
    'debug': False,
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'},
        {'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'},
        {'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'},
        {'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15},
        {'name': 'point', 'id': 'ip', 'label': 'Inflection point', 'color':'orange','size': 15}
    ]
})

@sketchresponse.grader
def grader(f,cp,ip,va,ha):

    f = GradeableFunction.GradeableFunction(f)
    cp = GradeableFunction.GradeableFunction(cp)
    va = Asymptote.VerticalAsymptotes(va)
    ha = Asymptote.HorizontalAsymptotes(ha)
    ip = GradeableFunction.GradeableFunction(ip)

    msg=''

    if cp.get_number_of_points() != 1:
        if cp.get_number_of_points() == 3:
            msg += '<font color="blue">Are you sure about the number of extrema? (note that you should not label the endpoints of your function)</font><br />'
        else:
            msg += '<font color="blue">Are you sure about the number of extrema?</font><br />'
            

    if ip.get_number_of_points() != 0:
        msg += '<font color="blue">Are you sure about the number of extrema?</font><br />'

    if va.get_number_of_asyms() != 2:
        msg += '<font color="blue"> Are you sure about the number of vertical asymptotes?</font><br />'
        

    if ha.get_number_of_asyms() != 1:
        msg += '<font color="blue"> Are you sure about the number of horizontal asymptotes?</font><br />'
        
    if msg != '':
        return False, msg
    else:
        if not cp.has_point_at(x=0):
            msg += '<font color="blue"> Check the x value of your critical point</font><br />'
        if not va.has_asym_at_value(-1) or not va.has_asym_at_value(1):
            v1 = va.closest_asym_to_value(-1)
            v2 = va.closest_asym_to_value(1)
            msg += '<font color="blue"> Check the locations of your vertical asymptotes.  </font><br />'

        if not ha.has_asym_at_value(2):
            ha1 = ha.closest_asym_to_value(2)
            msg += '<font color="blue"> Check the locations of your horizontal asymptotes. </font><br />'

        maxpt = cp.get_point_at(x=0)

        if not f.has_value_y_at_x(maxpt.y, maxpt.x):
            msg += '<font color="blue"> Make sure your critical points lie on your function!</font><br />'

        increasing_ok = f.is_increasing_between(-4, -1) and f.is_increasing_between(-1, 0)
        decreasing_ok = f.is_decreasing_between(0, 1) and f.is_decreasing_between(1, 4)
        curvature_up_ok = f.has_positive_curvature_between(-4, -1) and f.has_positive_curvature_between(1, 4)
        curvature_down_ok= f.has_negative_curvature_between(-1,1)
     

        if not (increasing_ok and decreasing_ok):
            msg += '<font color="blue"> Where should the graph be increasing and decreasing?</font><br />'

        if not f.is_greater_than_y_between(2,-4,-1):
            msg += '<font color="blue"> Your function seems to be in the wrong region on the interval (-4,-1)</font><br />'

        if not f.is_greater_than_y_between(2,1,4):
            msg += '<font color="blue"> Your function seems to be in the wrong region on the interval (1,4)</font><br />'

        if not f.is_less_than_y_between(0,-1,1):
            msg += '<font color="blue"> Your function seems to be in the wrong region on the interval (-1,1)</font><br />'

        
        if not (curvature_up_ok and curvature_down_ok):
            msg += '<font color="blue"> Where is the function convave up and concave down?</font><br />'

    if msg == '':
        return True,'Good Job'
    else:
        return False, msg
