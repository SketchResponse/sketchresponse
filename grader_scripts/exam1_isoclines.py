import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-3.3, 3.3],
    'yrange': [-2.2, 2.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'freeform', 'id': 'zero', 'label': 'm=0 isocline', 'color':'darkorange'},
        {'name': 'freeform', 'id': 'one', 'label': 'm=1 isocline', 'color':'orange'},
        {'name': 'freeform', 'id': 'y', 'label': 'y(t) for y(0)=0', 'color':'blue'},
        {'name': 'point', 'id': 'maxim', 'label': 'Max of y', 'color': 'black','size': 15},
        {'name': 'point', 'id': 'minim', 'label': 'Min of y', 'color': 'gray','size': 15}
    ]
})

@sketchresponse.grader
def grader(zero,one,y,maxim,minim):

    zero = GradeableFunction.GradeableFunction(zero)
    one = GradeableFunction.GradeableFunction(one)
    y = GradeableFunction.GradeableFunction(y)
    maxim = GradeableFunction.GradeableFunction(maxim)
    minim = GradeableFunction.GradeableFunction(minim)
       

    one_ok = one.has_value_y_at_x(1,0) and one.has_value_y_at_x(2,0) and one.has_value_y_at_x(-1,0) and one.has_value_y_at_x(-2,0) and one.has_value_y_at_x(0,0) and one.has_value_y_at_x(0,1) and one.has_value_y_at_x(0,-1) and one.has_value_y_at_x(0,2) and one.has_value_y_at_x(0,-2)
    zero_ok = zero.is_decreasing_between(-3, -.1) and zero.is_decreasing_between(.1, 3) and zero.is_less_than_y_between(0,-3, -.1) and zero.is_greater_than_y_between(0,.1, 3) and zero.has_value_y_at_x(1,1) and zero.has_value_y_at_x(-1,-1)

    if not zero_ok:
        return False, '<font color="blue"> Check your 0-isocline. Did you use the correct tool? If yes, there is an error in your 0-isocline.</font><br />'

    if not one_ok:
        return False, '<font color="blue"> Check your 1-isocline. Did you use the correct tool? If yes, there is an error in your 1-isocline.</font><br />'

    if maxim.get_number_of_points() != 1:
        return False, '<font color="blue"> The number of maxima you have drawn is incorrect. Check to make sure you did not draw a minimum with the maximum tool.</font>'
    if minim.get_number_of_points() != 1:
        return False, '<font color="blue"> The number of minima you have drawn is incorrect. Check to make sure you did not draw a maximum with the minimum tool.</font>'

    maximpt = maxim.closest_point_to_x(x=1)
    minimpt = minim.closest_point_to_x(x=-1)    

    if maximpt[1].y > 1 or minimpt[1].y <-1 or maximpt[1].x < 1 or minimpt[1].x > -1:
        return False, '<font color="blue"> Check the minimum and maximum value of your function. </font><br />'    
    
    maxminOK = zero.has_value_y_at_x(minimpt[1].y,minimpt[1].x) and zero.has_value_y_at_x(maximpt[1].y,maximpt[1].x)

    if not maxminOK:
        return False, '<font color="blue"> The maximum and minimum values you have labeled cannot be the maximum or minimum of your solution curve. Try thinking about where the maxima and minima must occur.</font><br />'

    y_ok = y.is_decreasing_between(-3, minimpt[1].x) and y.is_decreasing_between(maximpt[1].x, 3) and y.is_increasing_between(minimpt[1].x, maximpt[1].x) and y.is_greater_than_y_between(-1,-3, 3) and y.is_less_than_y_between(1,-3, 3) and y.has_value_y_at_x(0,0)
    y_values = y.has_value_y_at_x(maximpt[1].y,maximpt[1].x) and y.has_value_y_at_x(minimpt[1].y,minimpt[1].x) 
    
    if not y_ok:
        return False, '<font color="blue"> Check the behavior of the solution that satisfies y(0)=0.</font><br />'
     
    if not y_values:
        return False, '<font color="blue"> Your function must pass through its maximum and minimum points.</font><br />'
 
    if zero.does_not_exist_between(-3.3,-2.8) or y.does_not_exist_between(-3.3,-2.8) or zero.does_not_exist_between(2.8,3.3) or y.does_not_exist_between(2.8,3.3):
        return False, '<font color="red">Error: Make sure your function y and isoclines must be drawn over the entire interval -3 < x < 3.</font>'

    if not (zero.does_exist_between(-3,-1) or zero.does_exist_between(1,3) or y.does_exist_between(-3,3)):
        return False, '<font color="red">Error: Make sure your function y and isoclines must be drawn over the entire interval -3 < x < 3.</font>'
    try:
        longtermzero = zero.get_value_at(3)
        pasttermzero = zero.get_value_at(-3)
        longtermy = y.get_value_at(3)
        pasttermy = y.get_value_at(-3)
        if longtermzero > longtermy or pasttermzero < pasttermy:
            return False, '<font color="blue"> Can your function cross the 0-isocline more than one time? Is your function drawn correctly? It seems to have some error.</font><br />'

    except Exception as err:
        return False, '<font color="red">Error: Make sure your function y and isoclines must be drawn over the entire interval -3 < x < 3.</font>'

    
    
    return True, 'Good job!'
