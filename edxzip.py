import zipfile
import os
import re


def addfile(source, ziph):
    target = os.path.join('sketchresponse/', source)
    print('Adding ' + target)
    ziph.write(source, target)


def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            if re.fullmatch(r'.+\.py|LICENSE', file):
                addfile(os.path.join(root, file), ziph)


if __name__ == '__main__':
    zipf = zipfile.ZipFile('python_lib.zip', 'w', zipfile.ZIP_DEFLATED)
    addfile('__init__.py', zipf)
    addfile('sketchresponse.py', zipf)
    addfile('LICENSE', zipf)
    zipdir('grader_lib/', zipf)
    zipf.close()
