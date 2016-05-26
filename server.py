import sys, importlib
from flask import Flask, render_template, request, json
from proto2prod import convert_ans_dict

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/check', methods=['POST'])
def check():
    submitted_data = request.get_json()
    submitted_data = convert_ans_dict(submitted_data)  # Fake the production API

    # Dispatch to grader in the required format
    # Assume no 'expect' value for now
    grader_response = gradefn(None, json.dumps(submitted_data))

    # Allow boolean grader return values instead of dicts
    if type(grader_response) == bool:
        grader_response = {'ok': grader_response, 'msg': ''}

    return json.dumps(grader_response)


@app.route('/<grader_module_name>')
def new_local_frontend(grader_module_name):
    grader_module = importlib.import_module('grader_scripts.' + grader_module_name)
    reload(grader_module)

    return render_template('index_sketch_tool.html', hash=grader_module.problemconfig)


@app.route('/<grader_module_name>/check', methods=['POST'])
def check_local(grader_module_name):
    grader_module = importlib.import_module('grader_scripts.' + grader_module_name)
    reload(grader_module)

    submitted_data = request.get_json()

    # Dispatch to grader in the required format
    # Assume no 'expect' value for now
    grader_response = grader_module.grader(None, json.dumps(submitted_data))

    # Allow boolean grader return values instead of dicts
    if type(grader_response) == bool:
        grader_response = {'ok': grader_response, 'msg': ''}

    return json.dumps(grader_response)


@app.route('/aws/<grader_module_name>')
def new_frontend(grader_module_name):
    grader_module = importlib.import_module('grader_scripts.' + grader_module_name)
    reload(grader_module)

    return render_template('index_aws.html', hash=grader_module.problemconfig)


@app.route('/aws/<grader_module_name>/check', methods=['POST'])
def check_aws(grader_module_name):
    grader_module = importlib.import_module('grader_scripts.' + grader_module_name)
    reload(grader_module)

    submitted_data = request.get_json()

    # Dispatch to grader in the required format
    # Assume no 'expect' value for now
    grader_response = grader_module.grader(None, json.dumps(submitted_data))

    # Allow boolean grader return values instead of dicts
    if type(grader_response) == bool:
        grader_response = {'ok': grader_response, 'msg': ''}

    return json.dumps(grader_response)


if __name__ == '__main__':
    app.run(debug=True)
