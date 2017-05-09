import sketchresponse
from grader_lib import GradeableFunction


problemconfig = sketchresponse.config({
    'width': 750,
    'height': 420,
    'xrange': [-8.2, 3.2],
    'yrange': [-2.2, 2.2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'}, 
        {'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'/static/stamp_x.svg', 'iconSrc':'/static/stamp_x-icon.svg'}, 
        #{'name': 'stamp', 'id': 'p', 'label': 'Poles', 'scale':.2, 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x.svg', 'iconsSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@stamp_x-icon.svg'}  
        {'name': 'point', 'id': 'z', 'label': 'Zeros', 'size':15, 'color':'blue', 'hollow':True}  
    ]
})

@sketchresponse.grader
def grader(p,z):
    p = GradeableFunction.GradeableFunction(p)
    z = GradeableFunction.GradeableFunction(z)

    if p.get_number_of_points() != 4:
        return False, '<font color="blue">You do not have the correct number of poles.<br/></font>'

    if z.get_number_of_points() != 1:
        return False, '<font color="blue">You do not have the correct number of zeros.<br/></font>'

    if not z.has_point_at(x=-2,y=0):
        return False, '<font color="blue">Check the location of your zero. <br/></font>'

    if not p.has_point_at(x=-1,y=0) or not p.has_point_at(x=-1,y=-1) or not p.has_point_at(x=-1,y=1) or not p.has_point_at(x=-7,y=0):
        return False, '<font color="blue">Check the locations of your poles. Something is not quite right. <br/></font>'  

    return True, 'Good Job'