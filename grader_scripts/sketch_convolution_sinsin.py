import sketchresponse
from grader_lib import GradeableFunction, Asymptote

problemconfig = sketchresponse.config({
    'width': 750,
    'height': 400,
    'xrange': [-1.8, 8],
    'yrange': [-1,1],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes', 'xaxisLabel':{'value':'t','dx':10,'dy':15}, 'fontSize':{'xlabels':0, 'ylabels':0, 'zeroLabel':14}},
        {'name': 'freeform', 'id': 'f', 'label': 'Convolution', 'color':'blue'},
        {'name': 'point', 'id': 'zeros', 'label': 'Zero', 'color': 'blue', 'size': 15, 'tag': {'value': 'zero', 'xoffset': 0, 'yoffset': -15, 'align': 'middle'}}
    ]
})

def ordinal(j):
    num = j+1
    if num == 1:
        return "1st"
    elif num == 2:
        return "2nd"
    elif num == 3:
        return "3rd"
    else:
        return "{num}th".format(num=num)

def bind(f, *args, **kwargs):
    """Returns an argument-less function that evaluates f at the given inputs."""
    def _f():
        return f(*args, **kwargs)
    return _f 

@sketchresponse.grader
def grader(f, zeros):
    f = GradeableFunction.GradeableFunction(f)
    zeros = GradeableFunction.GradeableFunction(zeros)
    
    past_origin = 0 + zeros.tolerance['point_distance']/zeros.xscale
    zeros_past_origin = [z for z in zeros.points if z.x>past_origin]
    zeros_past_origin = sorted(zeros_past_origin, key= lambda z: z.x)
    
    # Oscillation intervals
    if len(zeros_past_origin) > 0:
        intervals = [(0, zeros_past_origin[0].x), ] + [
            (a.x, b.x) for a, b in zip(zeros_past_origin, zeros_past_origin[1:]) 
        ]
    else:
        intervals = []

    def check_f_zero_before_origin():
        if not f.does_exist_between(-1, 0):
            msg = "Please draw the response function for more of the region t<0"
            return False, msg
            # raise Exception(msg)
        if not f.has_constant_value_y_between(0,-1,0):
            return False, "The response function has incorrect value for t<0."
        
    def check_zeros_y_values():
        tolerance = zeros.tolerance['point_distance'] / zeros.yscale
        for zero in zeros.points:
            if abs(zero.y)>tolerance:
                ok, msg = False, "You indicated a zero at t={x} with nonzero y-value y={y}"
                return False, msg.format(x=zero.x, y=zero.y)
    
    def check_num_zeros():
        # We ask for "two full oscillations" so there should be at least 4 zeros past origin
        num_zeros = len(zeros_past_origin)
        if 0 < num_zeros < 4:
            ok, msg = False, '''Expected response to have at least four zeros for t>0 (i.e., at least "two full oscillations"). You only indicated {num_zeros} zeros. '''
            return ok, msg.format(num_zeros=num_zeros)
        elif num_zeros == 0:
            msg = '''Please mark the times t>0 when the response function has value zero using the Zero" tool.'''
            return False, msg
            # raise Exception(msg)

    def check_sign():
        for j, (a, b) in enumerate(intervals):
            if j % 2 == 0:
                ok = f.is_less_than_y_between(0, a, b, tolerance=30)
            elif j % 2 == 1:
                ok = f.is_greater_than_y_between(0, a, b, tolerance=30)
            
            if not ok:
                jth = ordinal(j)
                return False, "The {jth} peak of your response function seems to have the wrong sign.".format(jth=jth)

    def check_concavity():
        for j, (a, b) in enumerate(intervals):
            if j==0:
                continue
            elif j % 2 == 0:
                ok = f.has_positive_curvature_between(a, b)
            elif j % 2 == 1:
                ok = f.has_negative_curvature_between(a, b)
            
            if not ok:
                jth = ordinal(j)
                return False, "The {jth} peak of your response function seems to have the wrong concavity.".format(jth=jth)

    def check_zeros_spacing():
        # Let's check that the learner's spacing does not vary too wildly. Min spacing should be at most 33% of max spacing.
        # (For the actual convolution, max spacing is first zero spacing, [0, 4.5]), then spacing decreases asymptotically to pi
        spacings = [b - a for a, b in intervals]
        min_spacing = min(spacings)
        max_spacing = max(spacings)
        if max_spacing/min_spacing > 3:
            return False, " The response function you drew seems to have some very short duration oscillations and some very long duration oscillations. Although the response function is not perfectly periodic, the length of oscillations does not vary too greatly."

    def check_amplitude_increasing():
        amplitudes = []
        for j, (a, b) in enumerate(intervals):
            if j % 2 == 0:
                amplitudes.append( f.get_min_value_between(a, b) )
            elif j % 2 == 1:
                amplitudes.append( f.get_max_value_between(a, b) )
        
        amplitudes = [abs(a) for a in amplitudes]
        significantly_positive = 0.5*f.tolerance['point_distance']/f.yscale
        
        # Check that amplitude differences are truly positive
        for j in range(1, len(amplitudes)):
            diff = amplitudes[j] - amplitudes[j-1]
            # Check that amplitude differences are truly positive
            if not diff > 0:
                return False, "The amplitude of your response function oscillations does not have the correct behavior."
            # Check that ampltiude differences are not just positive, but significantly positive
            if not diff > significantly_positive:
                a = ordinal(j-1)
                b = ordinal(j)
                return False, "The {a} and {b} peaks of your response function seem to have about the same value. In your sketch, please indicate more clearly which value should be greater.".format(a=a, b=b)
    
    checklist = [
        check_f_zero_before_origin,
        check_zeros_y_values,
        check_num_zeros,
        check_sign,
        check_concavity,
        check_zeros_spacing,
        check_amplitude_increasing,
    ]
    
    for check in checklist:
        result = check()
        if result == None or result[0] == True:
            continue
        else: 
            return result
    
    return True, "We think your sketch looks good, but we encourage you to compare with the solution."