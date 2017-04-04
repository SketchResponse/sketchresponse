import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-10, 10],
    'yrange': [-25, 25],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xmajor':20, 'xminor':20},
        {'name': 'freeform', 'id': 'top', 'label': 'v(0) = 20', 'color':'darkgray'},
        {'name': 'freeform', 'id': 'middle', 'label': 'v(0) = 0', 'color':'DimGray'},
        {'name': 'freeform', 'id': 'bottom', 'label': 'v(0) = -20', 'color':'darkgray'},
        {'name': 'horizontal-line', 'id': 'st', 'label': 'Constant & stable', 'color': 'blue'},
        {'name': 'horizontal-line', 'id': 'uns', 'label': 'Constant unstable', 'color': 'orange'}
    ]
})

@sketchresponse.grader
def grader(top,bottom,middle,st,uns):

    top = GradeableFunction.GradeableFunction(top)
    bottom = GradeableFunction.GradeableFunction(bottom)
    middle = GradeableFunction.GradeableFunction(middle)
    st = Asymptote.HorizontalAsymptotes(st)
    uns = Asymptote.HorizontalAsymptotes(uns)


    if st.get_number_of_asyms() != 1 and uns.get_number_of_asyms() != 1:
        return False, '<font color="blue"> You should have found 2 constant solutions. Make sure they are drawn with correct stability.</font><br />'
        
    if not (st.has_asym_at_value(-10) and uns.has_asym_at_value(10) ):
        return False, '<font color="blue"> Check the locations of your constant solutions.</font><br />'
        

    top_ok = top.is_increasing_between(-10, 10) and top.is_greater_than_y_between(10,-10, 10) and top.has_value_y_at_x(20,0)
    bottom_ok = bottom.is_increasing_between(-10, 10) and bottom.is_less_than_y_between(-10,-10, 10) and bottom.has_value_y_at_x(-20,0)
    middle_ok = middle.is_decreasing_between(-10, 10) and middle.is_greater_than_y_between(-10,-10, 10) and middle.is_less_than_y_between(10,-10, 10) and middle.has_value_y_at_x(0,0)

    if not top_ok:
        return False, '<font color="blue"> Check the behavior of the top solution.</font><br />'

    if not bottom_ok:
        return False, '<font color="blue"> Check the behavior of the bottom solution.</font><br />'

    if not middle_ok:
        return False, '<font color="blue"> Check the behavior of the middle solution.</font><br />'
     

    return True, 'Good job!'
