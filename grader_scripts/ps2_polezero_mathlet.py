import sketchresponse
from grader_lib import GradeableFunction


problemconfig = sketchresponse.config({
    'width': 420,
    'height': 420,
    'xrange': [-4.2, 4.2],
    'yrange': [-4.2, 4.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x.svg', 'iconSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x-icon.svg'},  
        {'name': 'point', 'id': 'z', 'label': 'Zeros', 'size':15, 'color':'blue', 'hollow':True}  
    ]
})

@sketchresponse.grader
def grader(p,z):
    p = GradeableFunction.GradeableFunction(p)
    z = GradeableFunction.GradeableFunction(z)

    if p.get_number_of_points() != 4:
        return False, '<font color="blue">You do not have 4 poles.<br/></font>'

    if z.get_number_of_points() != 4:
        return False, '<font color="blue">You do not have 4 zeros.<br/></font>'

    if not z.has_point_at(x=0,y=2) or not z.has_point_at(x=0,y=-2) or not z.has_point_at(x=0,y=3) or not z.has_point_at(x=0,y=-3):
        return False, '<font color="blue">Check the location of your zeros. Can you use the mathlet to find a better location?<br/></font>'
    # try:
    #     p1 =  p.get_closest_point_to(x=0,y=2)
    #     p2 =  p.get_closest_point_to(x=0,y=-2)
    #     p3 =  p.get_closest_point_to(x=0,y=3)
    #     p4 =  p.get_closest_point_to(x=0,y=-3)
    


    return True, 'Good Job'