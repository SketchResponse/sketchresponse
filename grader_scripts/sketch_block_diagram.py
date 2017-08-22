#from __future__ import division # only for local dev, edX does automatically
import sketchresponse
from grader_lib import GradeableFunction, LineSegment

config_dict = {
    'width': 750,
    'height': 150,
    'xrange': [1, 2],
    'yrange': [1, 2],
    'xscale': 'linear',
    'yscale': 'linear',
    'plugins': [
        {'name': 'axes'},
        {'name':'stamp', 'id':'system1', 'label':'System 1', 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@sys.svg', 'iconSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@sys_icon.svg', 'tag':{'value':'System 1', 'align':'middle','yoffset':5,}},
        {'name':'stamp', 'id':'system2', 'label':'System 2', 'src':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@sys.svg', 'iconSrc':'https://courses.edx.org/asset-v1:MITx+18.03Lx+2T2017+type@asset+block@sys_icon.svg', 'tag':{'value':'System 2', 'align':'middle','yoffset':5,}},
        {'name':'line-segment', 'id':'signal', 'label':'Signal', 'directionConstraint': 'horizontal', 'arrowHead':{'length':10, 'base':5}, 'tag':{'value':'Signal', 'yoffset':-10 , 'position':'middle'} },
    ]
}

problemconfig = sketchresponse.config(config_dict)

def bind(f, *args, **kwargs):
    """Returns an argument-less function that evaluates f at the given inputs."""
    def _f():
        return f(*args, **kwargs)
    return _f 

def px_distx_to_coords(px_distx):
    px_to_coords_factor = (config_dict['xrange'][1]-config_dict['xrange'][0])/config_dict['width']
    return px_distx*px_to_coords_factor

def strip_whitespace(astring):
    return ''.join(astring.split())

@sketchresponse.grader
def grader(system1, system2 ,signal):
    system1 = GradeableFunction.GradeableFunction(system1)
    system2 = GradeableFunction.GradeableFunction(system2)
    signal = LineSegment.LineSegments(signal)
    
    data = {
        'dir': None, # will be 'left' or 'right'
        'sys1':None, # will be system 1 point
        'sys2':None, # will be system 2 point
        'sorted_signals':None # will be sorted list of signal segments
    }
  
    def check_num(obj_list, name, expect=1):
        num = len(obj_list)
        if expect == num:
            ok, msg = True, ""
        elif num < 1 <= expect:
            ok, msg = False, "Don't forget to draw {name}."
        elif 1 <= num < expect:
            ok, msg = False, "Too few {name}s are drawn."
        elif expect < num:
            ok, msg = False, "Too many {name}s are drawn."
        
        return ok, msg.format(name=name)
    
    def store_systems():
        data['sys1'] = system1.points[0]
        data['sys2'] = system2.points[0]
        return True, ""
    
    def check_and_store_signals_dir():
        ok = False
        pairs = [ [segment.getStartPoint(), segment.getEndPoint()] for segment in signal.segments ]
        right = [ start[0] < end[0] for start, end in pairs ]
        left = [ start[0] > end[0] for start, end in pairs ]
        if all(right):
            data['dir'] = 'right'
            ok, msg = True, ""
        elif all(left):
            data['dir'] = 'left'
            ok, msg = True, ""
        else:
            ok, msg = False, "Some of your signal arrows are pointing the wrong direction."
        return ok, msg
        
    def store_sorted_signals():
        left = data['dir'] == 'left'
        data['sorted_signals'] = sorted(signal.segments, key = lambda segment: segment.getStartPoint()[0], reverse=left)        
        return True, ""
    
    def check_signal_system_order():
        signal_start_x = [ segment.getStartPoint()[0] for segment in data['sorted_signals'] ]
        signal_end_x = [ segment.getEndPoint()[0] for segment in data['sorted_signals'] ]        
        sys1_x, sys2_x = data['sys1'].x, data['sys2'].x
        
        # For the checks below, I want to assume a right-ward signal. So if left-ward, flip all the signs.
        if data['dir']=='left':
            signal_start_x = [-x for x in signal_start_x]
            signal_end_x = [-x for x in signal_end_x]
            sys1_x, sys2_x = -sys1_x, -sys2_x
 
        # stamp width
        dx = px_distx_to_coords(100)
        if not sys1_x < sys2_x:
            return False, "Although it is true that the order in which LTI systems are cascaded does not change the output, but please draw System 1 before System 2 as described in the problem."
        if not signal_start_x[0] < sys1_x:
            return False, "Input signal should begin before System 1"
        if not signal_end_x[0] < sys2_x+dx/2:
            return False, "Input signal should enter System 1"
        if not signal_start_x[1] > sys1_x-dx/2:
            return False, "Intermediate signal should start after System 1"
        if not signal_end_x[1] < sys2_x+dx/2:
            return False, "Intermediate signal should end before System 2"
        if not signal_start_x[2] > sys2_x-dx/2:
            return False, "Output signal should exit from System 2"
        
        return True, "" 
    
    def check_signal_tags():
        input_tag = strip_whitespace( data['sorted_signals'][0].get_tag() )
        output_tag = strip_whitespace( data['sorted_signals'][2].get_tag() )
        
        input_expect = "F(s)"
        output_expect = "X(s)"
        
        if input_tag == 'F(s)' and output_tag == 'X(s)':
            return True,  ""
        elif input_tag == "f(t)" and output_tag == 'x(t)':
            return True, ""
        elif (input_tag == "F(s)" and output_tag == 'x(t)') or (input_tag == "f(t)" and output_tag == 'X(s)'):
            return False, "Please be consistent in your labeling conventions: either use time for both input and output, or frequency for both input and output."
        elif (input_tag == 'X(s)') and (output_tag=='F(s)') or (input_tag == 'x(t)' and output_tag == 'f(t)'):
            return False, "Did you accidentally swap in the input and output labels?"
        elif input_tag == "Signal" or output_tag == "Signal":
            ok, msg = False, """ Don't forget to label both the input and output with the appropriate function. <strong>To add a label, use the select-tool and double-click the default label "Signal".</strong> <br/> <em>Hint: should the label be \(f(t), F(s), x(t), or X(s)\)?</em>"""
        elif input_tag not in ['f(t)', 'F(s)']:
            ok, msg = False, """Your input label {input_tag} doesn't look quite right. <strong>To add a label, use the select-tool and double-click the default label "Signal".</strong> <br/> <em>Hint: should the label be \(f(t), F(s), x(t), or X(s)\)?</em>"""
        elif output_tag not in ['x(t)', 'X(s)']:
            ok, msg = False, """Your output label {output_tag} doesn't look quite right. <strong>To add a label, use the select-tool and double-click the default label "Signal".</strong> <br/> <em>Hint: should the label be \(f(t), F(s), x(t), or X(s)\)?</em>"""
         
        return ok, msg.format(input_tag=input_tag, output_tag=output_tag)
        
    checklist = [
        bind(check_num, system1.points, name="System 1 block"),
        bind(check_num, system2.points, name="System 2 block"),
        store_systems,
        bind(check_num, signal.segments, name="Signal", expect=3),
        check_and_store_signals_dir,
        store_sorted_signals,
        check_signal_system_order,
        check_signal_tags
    ]
    
    for check in checklist:
        ok, msg = check()
        if not ok:
            return ok, msg

    return True, "We think your diagram looks good and encourage you to double-check against the solution."
   
